#!/usr/bin/env python3
"""
Audio Compaction and Optimization Pipeline for Sheikh Muhammed Ferej Website.
Standardizes, deduplicates, and compacts audio series into voice-optimized 64kbps MP3
with progressive streaming frame headers and embedded ID3 tags.
"""

import os
import sys
import json
import re
import subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed

SOURCE_BASE = "/run/media/fuayd/disk/druss"
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEST_AUDIO_BASE = os.path.join(PROJECT_ROOT, "public", "audio")
DEST_IMAGES_BASE = os.path.join(PROJECT_ROOT, "public", "images", "hadith-slides")
MANIFEST_PATH = os.path.join(PROJECT_ROOT, "data", "audio-manifest.json")

ARTIST_NAME = "Sheikh Muhammed Ferej Megeno (فضيلة الشيخ محمد فرج رحمه الله)"

def get_audio_info(filepath):
    try:
        cmd = [
            "ffprobe", "-v", "error",
            "-show_entries", "format=duration,size,bit_rate",
            "-of", "json", filepath
        ]
        res = subprocess.run(cmd, capture_output=True, text=True, check=True)
        fmt = json.loads(res.stdout).get("format", {})
        return {
            "duration": float(fmt.get("duration", 0)),
            "size": int(fmt.get("size", 0)),
            "bitrate": int(fmt.get("bit_rate", 0))
        }
    except Exception as e:
        print(f"Error probing {filepath}: {e}", file=sys.stderr)
        return {"duration": 0, "size": 0, "bitrate": 0}

def transcode_to_mp3(src, dest, title, album, track_num):
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    temp_dest = dest + ".tmp.mp3"
    
    cmd = [
        "ffmpeg", "-y",
        "-i", src,
        "-c:a", "libmp3lame",
        "-b:a", "64k",
        "-ac", "1",
        "-ar", "44100",
        "-q:a", "2",
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
    return info

# ─────────────────────────────────────────────────────────────────────────────
# BATCH 1: SERIES PARSING AND DEDUPLICATION
# ─────────────────────────────────────────────────────────────────────────────

def prepare_al_arbain():
    folder = os.path.join(SOURCE_BASE, "الأربعون النووية")
    album_name = "الأربعون النووية (አርበዒን ነወውያ)"
    series_slug = "al-arbain-an-nawawiyyah"
    out_dir = os.path.join(DEST_AUDIO_BASE, series_slug)
    os.makedirs(out_dir, exist_ok=True)
    os.makedirs(DEST_IMAGES_BASE, exist_ok=True)

    # 1. Copy slide images (0.jpg, 1.jpg, ... 42.jpg)
    for f in os.listdir(folder):
        if f.lower().endswith(".jpg"):
            src = os.path.join(folder, f)
            dest = os.path.join(DEST_IMAGES_BASE, f)
            if not os.path.exists(dest):
                subprocess.run(["cp", src, dest], check=True)

    # 2. Select audio files (42 Hadiths)
    # Mapping table with verified complete sources
    hadith_map = {}
    
    # Pre-select known optimal files
    all_files = os.listdir(folder)
    audio_files = [f for f in all_files if not f.lower().endswith(".jpg")]
    
    # We inspect duration of candidates for each hadith number
    for f in audio_files:
        fp = os.path.join(folder, f)
        # Extract hadith number
        m = re.search(r'(\d+)', f)
        if not m:
            continue
        num_str = m.group(1)
        num = int(num_str)
        info = get_audio_info(fp)
        
        # Specific sub-cases
        if "14 & 15" in f or "14 و   15" in f:
            hadith_map[14] = (fp, "ሀዲስ 14 እና 15", info["duration"])
            continue
        if "16  و  17" in f or ("16" in f and "17" in f):
            hadith_map[16] = (fp, "ሀዲስ 16 እና 17", info["duration"])
            continue
        if "28   1" in f or "28 1" in f:
            hadith_map[28.1] = (fp, "ሀዲስ 28 (ክፍል 1)", info["duration"])
            continue
        if "28    2" in f or "28 2" in f:
            hadith_map[28.2] = (fp, "ሀዲስ 28 (ክፍል 2)", info["duration"])
            continue
        if "18-1" in f or "18-2" in f or "2-1" in f or "2-2" in f:
            continue  # Subparts of unified files
            
        # Normal selection: if not seen, or if this candidate has longer/equal duration (prefer m4a or mp3 over wma)
        existing = hadith_map.get(num)
        if existing is None:
            hadith_map[num] = (fp, f"ሀዲስ {num:02d}", info["duration"])
        else:
            # Prefer longer duration (e.g. 1.mp3 has intro, 1019s vs 584s)
            if info["duration"] > existing[2] + 5:
                hadith_map[num] = (fp, f"ሀዲስ {num:02d}", info["duration"])
            elif abs(info["duration"] - existing[2]) <= 5 and not f.endswith(".wma") and existing[0].endswith(".wma"):
                hadith_map[num] = (fp, f"ሀዲስ {num:02d}", info["duration"])

    items = []
    track = 1
    for k in sorted(hadith_map.keys()):
        fp, label, dur = hadith_map[k]
        if isinstance(k, float):
            num_slug = str(k).replace(".", "-")
        else:
            num_slug = f"{k:02d}"
        dest_filename = f"al-arbain-hadith-{num_slug}.mp3"
        dest_path = os.path.join(out_dir, dest_filename)
        title = f"አርበዒን ነወውያ — {label} (الأربعون النووية)"
        items.append({
            "src": fp,
            "dest": dest_path,
            "title": title,
            "album": album_name,
            "series": series_slug,
            "track": track,
            "slug": f"al-arbain-hadith-{num_slug}",
            "cover": f"/images/hadith-slides/{int(k) if isinstance(k, int) else int(float(k))}.jpg"
        })
        track += 1
    return items

def prepare_aqeedah_al_wasitiyyah():
    folder = os.path.join(SOURCE_BASE, "عقيدة الواسطية")
    album_name = "العقيدة الواسطية (አቂደቱል ዋሲጢያ)"
    series_slug = "aqeedah-al-wasitiyyah"
    out_dir = os.path.join(DEST_AUDIO_BASE, series_slug)
    os.makedirs(out_dir, exist_ok=True)

    files = sorted(os.listdir(folder))
    lesson_map = {}
    
    for f in files:
        fp = os.path.join(folder, f)
        m = re.search(r'ቁ\s*(\d+)', f)
        if not m:
            continue
        num = int(m.group(1))
        info = get_audio_info(fp)
        
        # In lesson 08 there are two files; if duplicate, take the longer or split
        if num == 8 and 8 in lesson_map:
            lesson_map[8.2] = (fp, f"አቂደቱል ዋሲጢያ ደርስ 08 (ክፍል 2)", info["duration"])
        elif num == 8:
            lesson_map[8.1] = (fp, f"አቂደቱል ዋሲጢያ ደርስ 08 (ክፍል 1)", info["duration"])
        else:
            lesson_map[num] = (fp, f"አቂደቱል ዋሲጢያ ደርስ {num:02d}", info["duration"])

    items = []
    track = 1
    for k in sorted(lesson_map.keys()):
        fp, label, dur = lesson_map[k]
        if isinstance(k, float):
            num_slug = str(k).replace(".", "-")
        else:
            num_slug = f"{k:02d}"
        dest_filename = f"aqeedah-al-wasitiyyah-lesson-{num_slug}.mp3"
        dest_path = os.path.join(out_dir, dest_filename)
        title = f"{label} (شرح العقيدة الواسطية)"
        items.append({
            "src": fp,
            "dest": dest_path,
            "title": title,
            "album": album_name,
            "series": series_slug,
            "track": track,
            "slug": f"aqeedah-al-wasitiyyah-lesson-{num_slug}",
            "cover": "/images/sheikh-portrait.jpg"
        })
        track += 1
    return items

def prepare_khudh_aqeedatak():
    folder = os.path.join(SOURCE_BASE, "كتاب خذ عقيدتك")
    album_name = "خذ عقيدتك من الكتاب والسنة (ኹዝ ዓቂደተክ)"
    series_slug = "khudh-aqeedatak"
    out_dir = os.path.join(DEST_AUDIO_BASE, series_slug)
    os.makedirs(out_dir, exist_ok=True)

    files = sorted(os.listdir(folder))
    lesson_map = {}

    for f in files:
        fp = os.path.join(folder, f)
        # Match numbered main lessons: ኹዝ አቂደተከ ኪታብ ክፍል X...
        m = re.search(r'ክፍል\s*(\d+)', f)
        if m:
            num = int(m.group(1))
            info = get_audio_info(fp)
            # Prefer full m4a files
            if num not in lesson_map or (fp.endswith(".m4a") and not lesson_map[num][0].endswith(".m4a")):
                desc_match = re.search(r'ክፍል\s*\d+\s*(.*)\.m4a', f)
                topic = desc_match.group(1).strip() if desc_match else ""
                label = f"ክፍል {num:02d}" + (f": {topic}" if topic else "")
                lesson_map[num] = (fp, label, info["duration"])
        elif "من الكتاب" in f:
            # Lesson 8 supplement
            info = get_audio_info(fp)
            lesson_map[8] = (fp, "ክፍል 08: የተውሂድ ማስረጃዎች", info["duration"])

    items = []
    track = 1
    for k in sorted(lesson_map.keys()):
        fp, label, dur = lesson_map[k]
        num_slug = f"{k:02d}"
        dest_filename = f"khudh-aqeedatak-lesson-{num_slug}.mp3"
        dest_path = os.path.join(out_dir, dest_filename)
        title = f"ኪታቡ ኹዝ ዓቂደተክ — {label} (خذ عقيدتك)"
        items.append({
            "src": fp,
            "dest": dest_path,
            "title": title,
            "album": album_name,
            "series": series_slug,
            "track": track,
            "slug": f"khudh-aqeedatak-lesson-{num_slug}",
            "cover": "/images/sheikh-hero.jpg"
        })
        track += 1
    return items

# ─────────────────────────────────────────────────────────────────────────────
# MAIN EXECUTION
# ─────────────────────────────────────────────────────────────────────────────

def process_item(item):
    src = item["src"]
    dest = item["dest"]
    title = item["title"]
    album = item["album"]
    track = item["track"]
    
    # Check if already transcoded with identical size
    if os.path.exists(dest):
        info = get_audio_info(dest)
        if info["duration"] > 0 and info["size"] > 10000:
            return {
                **item,
                "duration_seconds": round(info["duration"]),
                "file_size": info["size"],
                "audio_url": "/audio/" + item["series"] + "/" + os.path.basename(dest),
                "status": "cached"
            }
            
    info = transcode_to_mp3(src, dest, title, album, track)
    return {
        **item,
        "duration_seconds": round(info["duration"]),
        "file_size": info["size"],
        "audio_url": "/audio/" + item["series"] + "/" + os.path.basename(dest),
        "status": "transcoded"
    }

def main():
    print("=" * 70)
    print("Sheikh Muhammed Ferej - Audio Compaction Pipeline (Batch 1)")
    print("=" * 70)

    all_items = []
    print("1. Preparing Al-Arba'in An-Nawawiyyah...")
    all_items.extend(prepare_al_arbain())
    print("2. Preparing Al-Aqeedah Al-Wasitiyyah...")
    all_items.extend(prepare_aqeedah_al_wasitiyyah())
    print("3. Preparing Khudh Aqeedatak...")
    all_items.extend(prepare_khudh_aqeedatak())

    print(f"\nTotal items to process in Batch 1: {len(all_items)}")
    
    processed = []
    workers = min(6, os.cpu_count() or 4)
    print(f"Starting parallel transcoding with {workers} workers at 64kbps mono MP3...\n")
    
    with ThreadPoolExecutor(max_workers=workers) as executor:
        future_map = {executor.submit(process_item, it): it for it in all_items}
        for future in as_completed(future_map):
            item = future_map[future]
            try:
                res = future.result()
                processed.append(res)
                orig_mb = os.path.getsize(item["src"]) / (1024 * 1024)
                new_mb = res["file_size"] / (1024 * 1024)
                savings = (1 - (new_mb / orig_mb)) * 100 if orig_mb > 0 else 0
                print(f"[{res['status'].upper()}] {res['slug']:<38} {orig_mb:>6.1f}MB -> {new_mb:>5.1f}MB ({savings:>4.1f}% saved)")
            except Exception as e:
                print(f"[ERROR] Failed {item['slug']}: {e}", file=sys.stderr)

    # Sort processed items by series and track
    processed.sort(key=lambda x: (x["series"], x["track"]))
    
    # Save manifest
    os.makedirs(os.path.dirname(MANIFEST_PATH), exist_ok=True)
    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(processed, f, ensure_ascii=False, indent=2)

    total_orig = sum(os.path.getsize(it["src"]) for it in all_items) / (1024 * 1024)
    total_new = sum(it["file_size"] for it in processed) / (1024 * 1024)
    print("\n" + "=" * 70)
    print("BATCH 1 SUMMARY:")
    print(f"  Processed files:    {len(processed)}")
    print(f"  Original size:      {total_orig:.2f} MB")
    print(f"  Compacted size:     {total_new:.2f} MB")
    print(f"  Total space saved:  {total_orig - total_new:.2f} MB ({(1 - total_new/total_orig)*100:.1f}% reduction)")
    print(f"  Manifest written:   {MANIFEST_PATH}")
    print("=" * 70)

if __name__ == "__main__":
    main()
