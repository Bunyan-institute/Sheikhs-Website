#!/usr/bin/env python3
"""
Process, compact, and organize all root audio files from /run/media/fuayd/disk/druss/:
1. Nawaqid al-Islam (13 lessons) -> public/audio/nawaqid-al-islam/
2. Tashil al-Aqeedah (15 lessons) -> public/audio/tashil-al-aqeedah/
3. Ramadan Lessons (11 lessons) -> public/audio/ramadan-lessons/
4. Akhlaq al-Muslim (4 lessons) -> public/audio/akhlaq-al-muslim/
5. Standalone Lectures (17 lectures) -> public/audio/lectures/
"""

import os
import re
import json
import subprocess

BASE_DRUSS = "/run/media/fuayd/disk/druss"
ARTIST_NAME = "Sheikh Muhammed Ferej Megeno (فضيلة الشيخ محمد فرج رحمه الله)"

SERIES_CONFIGS = {
    "nawaqid-al-islam": {
        "title": "نواقض الإسلام (ኢስላምን የሚያፈርሱ ነገሮች)",
        "dest_dir": "public/audio/nawaqid-al-islam",
        "prefix": "nawaqid-al-islam-lesson",
        "manifest": "data/nawaqid-al-islam-manifest.json",
        "album": "نواقض الإسلام (ኢስላምን የሚያፈርሱ ነገሮች)"
    },
    "tashil-al-aqeedah": {
        "title": "تسهيل العقيدة الإسلامية (ተስሂሉ አል-አቂዳ)",
        "dest_dir": "public/audio/tashil-al-aqeedah",
        "prefix": "tashil-al-aqeedah-lesson",
        "manifest": "data/tashil-al-aqeedah-manifest.json",
        "album": "تسهيل العقيدة الإسلامية (ተስሂሉ አል-አቂዳ)"
    },
    "ramadan-lessons": {
        "title": "ስለ ረመዳን እና ተዛማጅ ትምህርቶች (دروس رمضان)",
        "dest_dir": "public/audio/ramadan-lessons",
        "prefix": "ramadan-lesson",
        "manifest": "data/ramadan-lessons-manifest.json",
        "album": "ስለ ረመዳን እና ተዛማጅ ትምህርቶች (دروس رمضان)"
    },
    "akhlaq-al-muslim": {
        "title": "خلق المسلم (የሙስሊም ስነ-ምግባር)",
        "dest_dir": "public/audio/akhlaq-al-muslim",
        "prefix": "akhlaq-al-muslim-lesson",
        "manifest": "data/akhlaq-al-muslim-manifest.json",
        "album": "خلق المسلم (የሙስሊም ስነ-ምግባር)"
    },
    "standalone-lectures": {
        "title": "ሙሀደራዎችና ኹጥባዎች (محاضرات وخطب)",
        "dest_dir": "public/audio/lectures",
        "prefix": "lecture",
        "manifest": "data/standalone-lectures-manifest.json",
        "album": "ሙሀደራዎችና ኹጥባዎች (محاضرات وخطب)"
    }
}

for cfg in SERIES_CONFIGS.values():
    os.makedirs(cfg["dest_dir"], exist_ok=True)
os.makedirs("data", exist_ok=True)

def get_audio_info(filepath):
    cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration,bit_rate,size:stream=codec_name,channels,sample_rate",
        "-of", "json", filepath
    ]
    try:
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
        data = json.loads(res.stdout)
        fmt = data.get("format", {})
        stream = data.get("streams", [{}])[0]
        return {
            "duration": float(fmt.get("duration", 0)),
            "bitrate": int(fmt.get("bit_rate", 0)) if fmt.get("bit_rate") else 0,
            "size": int(fmt.get("size", 0)) if fmt.get("size") else os.path.getsize(filepath),
            "codec": stream.get("codec_name", ""),
            "channels": int(stream.get("channels", 1)),
            "sample_rate": int(stream.get("sample_rate", 44100))
        }
    except Exception as e:
        print(f"Error probing {filepath}: {e}")
        return {"duration": 0, "bitrate": 0, "size": os.path.getsize(filepath), "codec": "", "channels": 1, "sample_rate": 44100}

def clean_title(f):
    name = os.path.splitext(f)[0]
    name = re.sub(r"^\d+\s*", "", name)
    name = re.sub(r"^ቁ[\.\·\s]*\d+\s*", "", name)
    name = name.replace("_", " ").strip("-—: ")
    return name

def optimize_file(src, dest, title, album, track_num, src_info):
    if os.path.exists(dest):
        info = get_audio_info(dest)
        return info, "cached"
        
    temp_dest = dest + ".tmp.mp3"
    is_mp3 = src.lower().endswith(".mp3")
    low_bitrate = src_info["bitrate"] > 0 and src_info["bitrate"] <= 68000
    
    if is_mp3 and low_bitrate:
        cmd = [
            "ffmpeg", "-y",
            "-i", src,
            "-c:a", "copy",
            "-id3v2_version", "3",
            "-metadata", f"title={title}",
            "-metadata", f"artist={ARTIST_NAME}",
            "-metadata", f"album={album}",
            "-metadata", f"track={track_num}",
            temp_dest
        ]
    else:
        cmd = [
            "ffmpeg", "-y",
            "-i", src,
            "-c:a", "libmp3lame",
            "-b:a", "48k",
            "-ac", "1",
            "-ar", "44100",
            "-id3v2_version", "3",
            "-metadata", f"title={title}",
            "-metadata", f"artist={ARTIST_NAME}",
            "-metadata", f"album={album}",
            "-metadata", f"track={track_num}",
            temp_dest
        ]
        
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    os.replace(temp_dest, dest)
    info = get_audio_info(dest)
    return info, "optimized"

def build_items_for_category(cat, flist):
    cfg = SERIES_CONFIGS[cat]
    final_items = []
    
    if cat == "nawaqid-al-islam":
        # Parse lesson number
        seen = {}
        for f in flist:
            fp = os.path.join(BASE_DRUSS, f)
            info = get_audio_info(fp)
            base = os.path.splitext(f)[0]
            m = re.search(r"(?:الإسلام|ነገራት)[\s\-_]*(\d+)", base) or re.search(r"(\d+)", base)
            num = int(m.group(1)) if m else 1
            seen.setdefault(num, []).append((fp, f, info))
            
        for num in sorted(seen.keys()):
            cands = seen[num]
            cands.sort(key=lambda x: x[2]["duration"], reverse=True)
            best_fp, best_fn, best_info = cands[0]
            title = f"ኢስላምን የሚያፈርሱ ነገሮች — ደርስ {num:02d}"
            slug = f"{cfg['prefix']}-{num:02d}"
            dest_fn = f"{slug}.mp3"
            dest_path = os.path.join(cfg["dest_dir"], dest_fn)
            final_items.append({
                "num": num,
                "title": title,
                "src": best_fp,
                "dest": dest_path,
                "dest_fn": dest_fn,
                "slug": slug,
                "info": best_info,
                "url": f"/{cfg['dest_dir'].replace('public/', '')}/{dest_fn}"
            })

    elif cat == "tashil-al-aqeedah":
        # Curated ordered sequence for Tashil al-Aqeedah
        # Map filenames with their titles
        seq = [
            ("ተስሂሉ አል አቂደቱ አል ኢስላሚያ 1 መግቢያ.m4a", "ተስሂሉ አል-አቂዳ — ደርስ 01: መግቢያ (ሙሉ)"),
            ("2 ተስሂሉ አልአቂዳ አልኢስላሚያህ መግቢያ.m4a", "ተስሂሉ አል-አቂዳ — ደርስ 02: የመግቢያው ማጠቃለያ"),
            ("2 ተስሂሉ አልአቂዳ አልኢስላሚያህ ትርጉም.m4a", "ተስሂሉ አል-አቂዳ — ደርስ 03: የአቂዳ ትርጉም (ክፍል 1)"),
            ("3 ተስሂሉ አልአቂዳ አልኢስላሚያህ ትርጉም.m4a", "ተስሂሉ አል-አቂዳ — ደርስ 04: የአቂዳ ትርጉም (ክፍል 2)"),
            ("4 ኪታብ (ተስሂሉ አልአቂቱ አልኢስላሚያ) ሰለፊይ ማነው.m4a", "ተስሂሉ አል-አቂዳ — ደርስ 05: ሰለፊይ ማነው?"),
            ("تسهيل العقيدة .m4a", "ተስሂሉ አል-አቂዳ — ደርስ 06: ተስሂሉል አቂዳህ"),
            ("ቁ·5 ኪታብ (ተስሂሉ አልአቂቱ አልኢስላሚያ)ከሌሎች የሚለየን.m4a", "ተስሂሉ አል-አቂዳ — ደርስ 07: ከሌሎች የሚለየን መለያ"),
            ("ቁ·6 ኪታብ (ተስሂሉ አልአቂቱ አልኢስላሚያ) ሚዛናዊነት.m4a", "ተስሂሉ አል-አቂዳ — ደርስ 08: ሚዛናዊነት (ክፍል 1)"),
            ("ቁ·7 ኪታብ (ተስሂሉ አልአቂቱ አልኢስላሚያ) ሚዛናዊነት.m4a", "ተስሂሉ አል-አቂዳ — ደርስ 09: ሚዛናዊነት (ክፍል 2)"),
            ("ቁ·8 ኪታብ (ተስሂሉ አልአቂቱ አልኢስላሚያ) ሚዛናዊነት.m4a", "ተስሂሉ አል-አቂዳ — ደርስ 10: ሚዛናዊነት (ክፍል 3)"),
            ("ቁ·8 ኪታብ (ተስሂሉ አልአቂደቱ አልኢስላሚያ) የተውሂድ ትርጉም.m4a", "ተስሂሉ አል-አቂዳ — ደርስ 11: የተውሂድ ትርጉም"),
            ("ቁ·9 ኪታብ (ተስሂሉ አልአቂደቱ አልኢስላሚያ)ተውሂደረ.m4a", "ተስሂሉ አል-አቂዳ — ደርስ 12: የተውሂድ ዝርዝር"),
            ("تهذيب تسهيل العقيدة.m4a", "ተስሂሉ አል-አቂዳ — ደርስ 13: ተህዚቡ ተስሂሊል አቂዳህ"),
            ("تسهيل العقيدة.m4a", "ተስሂሉ አል-አቂዳ — ደርስ 14: ተስሂሉል አቂዳህ ማብራሪያ"),
            ("تسهيل العقيدة الاسلامية.mp3", "ተስሂሉ አል-አቂዳ — ደርስ 15: ተስሂሉል አቂዳህ ማጠቃለያ"),
        ]
        for num, (fn, title) in enumerate(seq, start=1):
            fp = os.path.join(BASE_DRUSS, fn)
            info = get_audio_info(fp)
            slug = f"{cfg['prefix']}-{num:02d}"
            dest_fn = f"{slug}.mp3"
            dest_path = os.path.join(cfg["dest_dir"], dest_fn)
            final_items.append({
                "num": num,
                "title": title,
                "src": fp,
                "dest": dest_path,
                "dest_fn": dest_fn,
                "slug": slug,
                "info": info,
                "url": f"/{cfg['dest_dir'].replace('public/', '')}/{dest_fn}"
            })

    elif cat == "ramadan-lessons":
        seq = [
            ("ረመዳንን እንዴት እንቀበል 001.wma", "የረመዳን ትምህርት — ደርስ 01: ረመዳንን እንዴት እንቀበል (ክፍል 1)"),
            ("ረመዳንን እንዴት እንቀበል_002.wma", "የረመዳን ትምህርት — ደርስ 02: ረመዳንን እንዴት እንቀበል (ክፍል 2)"),
            ("ረመዳንን እንዴት እንቀበል— 003.wma", "የረመዳን ትምህርት — ደርስ 03: ረመዳንን እንዴት እንቀበል (ክፍል 3)"),
            ("ረመዳንን እንዴት እንቀበል— 004.wma", "የረመዳን ትምህርት — ደርስ 04: ረመዳንን እንዴት እንቀበል (ክፍል 4)"),
            ("ረመዳንን እንዴት እንቀበል— 005.wma", "የረመዳን ትምህርት — ደርስ 05: ረመዳንን እንዴት እንቀበል (ክፍል 5)"),
            ("ረመዷንን እንዴት እንቀበል .mp3", "የረመዳን ትምህርት — ደርስ 06: ረመዷንን እንዴት እንቀበል (ሙሀደራ)"),
            ("ስለ ተራዊህና ተሀጁድ.m4a", "የረመዳን ትምህርት — ደርስ 07: ስለ ተራዊህና ተሀጁድ ሰላት"),
            ("ተቅዋ ሳናገኝ ረመዷን እየሄደ ነው.m4a", "የረመዳን ትምህርት — ደርስ 08: ተቅዋ ሳናገኝ ረመዷን እየሄደ ነው"),
            ("አሽረል አዋኺርን እንዴት እናሳልፍ.m4a", "የረመዳን ትምህርት — ደርስ 09: የመጨረሻዎቹን 10 ቀናት እንዴት እናሳልፍ"),
            ("ليلة القدر  ለይለቱል ቀድር.m4a", "የረመዳን ትምህርት — ደርስ 10: ስለ ለይለቱል ቀድር"),
            ("ዘካቱል ፊጥርና አፈጻጸሙ.m4a", "የረመዳን ትምህርት — ደርስ 11: ዘካቱል ፊጥርና አፈጻጸሙ"),
        ]
        for num, (fn, title) in enumerate(seq, start=1):
            fp = os.path.join(BASE_DRUSS, fn)
            info = get_audio_info(fp)
            slug = f"{cfg['prefix']}-{num:02d}"
            dest_fn = f"{slug}.mp3"
            dest_path = os.path.join(cfg["dest_dir"], dest_fn)
            final_items.append({
                "num": num,
                "title": title,
                "src": fp,
                "dest": dest_path,
                "dest_fn": dest_fn,
                "slug": slug,
                "info": info,
                "url": f"/{cfg['dest_dir'].replace('public/', '')}/{dest_fn}"
            })

    elif cat == "akhlaq-al-muslim":
        seq = [
            ("خلق المسلم مع الله.m4a", "የሙስሊም ስነ-ምግባር — ደርስ 01: ከአላህ ሱብሓነሁ ወተዓላ ጋር"),
            ("خلق المسلم مع الرسول.m4a", "የሙስሊም ስነ-ምግባር — ደርስ 02: ከመልእክተኛው (ሶ.ዐ.ወ) ጋር"),
            ("خلق المسلم مع القرآن.m4a", "የሙስሊም ስነ-ምግባር — ደርስ 03: ከቅዱስ ቁርኣን ጋር"),
            ("خلق المسلم مع….m4a", "የሙስሊም ስነ-ምግባር — ደርስ 04: ከሰው ልጆች ጋር"),
        ]
        for num, (fn, title) in enumerate(seq, start=1):
            fp = os.path.join(BASE_DRUSS, fn)
            info = get_audio_info(fp)
            slug = f"{cfg['prefix']}-{num:02d}"
            dest_fn = f"{slug}.mp3"
            dest_path = os.path.join(cfg["dest_dir"], dest_fn)
            final_items.append({
                "num": num,
                "title": title,
                "src": fp,
                "dest": dest_path,
                "dest_fn": dest_fn,
                "slug": slug,
                "info": info,
                "url": f"/{cfg['dest_dir'].replace('public/', '')}/{dest_fn}"
            })

    elif cat == "standalone-lectures":
        seq = [
            ("Ye qiama milkitochina meftihewu.m4a", "የቂያማ ምልክቶችና መፍትሄው"),
            ("أركان الإسلام والإيمان.m4a", "የኢስላምና የኢማን መሰረቶች (أركان الإسلام والإيمان)"),
            ("كيف نزور القبور  ቀብርን እንዴት እንዘይር.m4a", "ቀብርን እንዴት እንዘይር? (كيف نزور القبور)"),
            ("ماذا قدمت لدينك  ለዲንህ ምን አበርክተሃል.m4a", "ለዲንህ ምን አበርክተሃል? (ماذا قدمت لدينك)"),
            ("ولو.mp3", "ወሰደ ወይ (ولو)"),
            ("يوم التروية.mp3", "የተርዊያህ ቀን (يوم التروية)"),
            ("ራስን ፍለጋ محاسبة النفس.m4a", "ራስን ፍለጋና መገምገም (محاسبة النفس)"),
            ("ነሲሃ ከስደት ለሚመለሱ እህቶች.m4a", "ነሲሃ ከስደት ለሚመለሱ እህቶች"),
            ("ኑ አረጋዊያንን እንንከባከብ.m4a", "ኑ አረጋዊያንን እንንከባከብ"),
            ("አርሲ ዩኒቨርሲቲ የጤና ዶክተሮች ምርቃት ላይ የቀረበ  ኢስላም ለጤና የሰጠው ቦ.m4a", "ኢስላም ለጤና የሰጠው ቦታ — አርሲ ዩኒቨርሲቲ"),
            ("አዝካር.m4a", "የጠዋትና የማታ አዝካሮች"),
            ("ዋቤ ወንዝ.m4a", "የዋቤ ወንዝ ዳዕዋ"),
            ("የሰው ልጅ በሰውነቱ የተከበረ ነው ።.m4a", "የሰው ልጅ በሰውነቱ የተከበረ ነው"),
            ("የዙልሂጃ አስርቱ ቀናቶች.m4a", "የዙልሂጃ አስርቱ ቀናቶች ደረጃና ስራዎች"),
            ("ጅማ ዩኒቨርሲቲ.m4a", "የጅማ ዩኒቨርሲቲ ተማሪዎች ሙሀደራ"),
            ("ግዜና ኢስላም.mp3", "ጊዜና እስልምና"),
            ("ጭፍን ተከታይነትና መዘዙ التقليد الأعمى.m4a", "ጭፍን ተከታይነትና መዘዙ (التقليد الأعمى)"),
        ]
        for num, (fn, title) in enumerate(seq, start=1):
            fp = os.path.join(BASE_DRUSS, fn)
            info = get_audio_info(fp)
            slug = f"{cfg['prefix']}-{num:02d}"
            dest_fn = f"{slug}.mp3"
            dest_path = os.path.join(cfg["dest_dir"], dest_fn)
            final_items.append({
                "num": num,
                "title": title,
                "src": fp,
                "dest": dest_path,
                "dest_fn": dest_fn,
                "slug": slug,
                "info": info,
                "url": f"/{cfg['dest_dir'].replace('public/', '')}/{dest_fn}"
            })

    return final_items

def process_all():
    audio_exts = {".mp3", ".m4a", ".wma", ".aac", ".wav"}
    files = sorted([f for f in os.listdir(BASE_DRUSS) if os.path.isfile(os.path.join(BASE_DRUSS, f)) and os.path.splitext(f)[1].lower() in audio_exts])
    
    by_category = {}
    for f in files:
        if "خذ عقيدتك" in f:
            continue
        if "نواقض" in f or "ኢስላምን የሚያፈርሱ" in f:
            by_category.setdefault("nawaqid-al-islam", []).append(f)
        elif re.search(r"ተስሂ|تسهيل|تهذيب", f):
            by_category.setdefault("tashil-al-aqeedah", []).append(f)
        elif re.search(r"ረመዳን|ረመዷን|ተራዊህ|ለይለቱል ቀድር|ليلة القدر|ዘካቱል ፊጥር|አሽረል አዋኺር|ተቅዋ ሳናገኝ", f):
            by_category.setdefault("ramadan-lessons", []).append(f)
        elif re.search(r"خلق المسلم|ኹሉቁል ሙስሊም", f):
            by_category.setdefault("akhlaq-al-muslim", []).append(f)
        else:
            by_category.setdefault("standalone-lectures", []).append(f)
            
    for cat in ["nawaqid-al-islam", "tashil-al-aqeedah", "ramadan-lessons", "akhlaq-al-muslim", "standalone-lectures"]:
        flist = by_category.get(cat, [])
        cfg = SERIES_CONFIGS[cat]
        print("=" * 60)
        print(f"Processing {cfg['title']} ({len(flist)} files)...")
        
        final_items = build_items_for_category(cat, flist)
        manifest = []
        for it in final_items:
            dest_info, status = optimize_file(it["src"], it["dest"], it["title"], cfg["album"], it["num"], it["info"])
            orig_mb = os.path.getsize(it["src"]) / (1024 * 1024)
            new_mb = dest_info["size"] / (1024 * 1024)
            print(f"  [{status.upper()}] {it['slug']:<32} {orig_mb:>5.1f}MB -> {new_mb:>5.1f}MB | {it['title']}")
            manifest.append({
                "lesson_num": it["num"],
                "title": it["title"],
                "slug": it["slug"],
                "filename": it["dest_fn"],
                "url": it["url"],
                "duration": round(dest_info["duration"]),
                "file_size": dest_info["size"],
                "bitrate": dest_info["bitrate"],
                "src": it["src"]
            })
            
        manifest.sort(key=lambda x: x["lesson_num"])
        with open(cfg["manifest"], "w", encoding="utf-8") as f:
            json.dump(manifest, f, ensure_ascii=False, indent=2)
        print(f"Saved {cfg['manifest']} ({len(manifest)} items).")

if __name__ == "__main__":
    process_all()
