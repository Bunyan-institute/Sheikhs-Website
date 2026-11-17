#!/usr/bin/env python3
"""
Compaction & Optimization Pipeline for 'مائة حديث' (Parts 1, 2, and 3 - 300 Hadiths).
- If source is already MP3 at <= 64kbps, performs stream-copy with ID3v2 tags.
- Otherwise (M4A 256kbps, WMA, AMR), transcodes to voice-optimized 64kbps mono MP3.
"""

import os
import sys
import json
import re
import subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_DRUSS = "/run/media/fuayd/disk/druss"
PROJECT_ROOT = "/home/fuayd/Bunyan/sheikh-ferej"
DEST_AUDIO_BASE = os.path.join(PROJECT_ROOT, "public", "audio")
ARTIST_NAME = "Sheikh Muhammed Ferej Megeno (فضيلة الشيخ محمد فرج رحمه الله)"

VOLUMES = [
    {
        "folder_name": "مائة حديث الأول",
        "slug": "miat-hadith-volume-1",
        "title": "مائة حديث — الجزء الأول (100 ሀዲስ — ክፍል 1)",
        "desc": "ከ100 ሀዲስ የተመረጡ ሐዲሶች ማብራሪያና ትምህርት — ክፍል አንድ በሸይኽ ሙሐመድ ፈረጅ መገኖ።",
        "manifest": os.path.join(PROJECT_ROOT, "data", "miat-hadith-volume-1-manifest.json"),
    },
    {
        "folder_name": "مائة حديث الثاني",
        "slug": "miat-hadith-volume-2",
        "title": "مائة حديث — الجزء الثاني (100 ሀዲስ — ክፍል 2)",
        "desc": "ከ100 ሀዲስ የተመረጡ ሐዲሶች ማብራሪያና ትምህርት — ክፍል ሁለት በሸይኽ ሙሐመድ ፈረጅ መገኖ።",
        "manifest": os.path.join(PROJECT_ROOT, "data", "miat-hadith-volume-2-manifest.json"),
    },
    {
        "folder_name": "مائة حديث الثالث",
        "slug": "miat-hadith-volume-3",
        "title": "مائة حديث — الجزء الثالث (100 ሀዲስ — ክፍል 3)",
        "desc": "ከ100 ሀዲስ የተመረጡ ሐዲሶች ማብራሪያና ትምህርት — ክፍል ሦስት በሸይኽ ሙሐመድ ፈረጅ መገኖ።",
        "manifest": os.path.join(PROJECT_ROOT, "data", "miat-hadith-volume-3-manifest.json"),
    },
]

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

def optimize_file(src, dest, title, album, track_num):
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    temp_dest = dest + ".tmp.mp3"
    
    src_info = get_audio_info(src)
    ext = os.path.splitext(src)[1].lower()
    
    # If already MP3 and bitrate <= 68kbps, stream copy
    if ext == ".mp3" and 0 < src_info["bitrate"] <= 68000:
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
        # Transcode to 48kbps mono MP3 (crystal clear voice clarity, compact file size)
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
    return info

def parse_hadith_num(f):
    m = re.search(r"ቁ(?:ጥር|\.)?[_\s]*(\d+)", f)
    if m:
        return int(m.group(1))
    m = re.search(r"ከ?100\s*(?:ሀዲስ|-)?\s*(\d+)", f)
    if m:
        return int(m.group(1))
    m = re.search(r"(\d+)", f)
    if m:
        return int(m.group(1))
    return None

def extract_topic(f):
    clean = os.path.splitext(f)[0]
    # Remove numbers and prefix
    clean = re.sub(r"^(ከ?\s*100\s*ሀዲስ\s*ክፍል\s*\d+\s*(?:ቁጥር|ቁ)?[_\s]*\d+)", "", clean).strip()
    clean = clean.replace("_", " ").strip("-—: ").strip()
    return clean

def collect_volume_items(vol_cfg):
    src_dir = os.path.join(BASE_DRUSS, vol_cfg["folder_name"])
    dest_dir = os.path.join(DEST_AUDIO_BASE, vol_cfg["slug"])
    files = sorted(os.listdir(src_dir))
    
    hadith_groups = {}
    for f in files:
        if f.startswith("."): continue
        fp = os.path.join(src_dir, f)
        if os.path.isdir(fp): continue
        num = parse_hadith_num(f)
        if num is not None and 1 <= num <= 100:
            info = get_audio_info(fp)
            topic = extract_topic(f)
            hadith_groups.setdefault(num, []).append((fp, f, info, topic))
            
    # For each hadith number, pick the best file (longest duration / highest quality)
    items = []
    for num in sorted(hadith_groups.keys()):
        candidates = hadith_groups[num]
        # Sort by duration descending
        candidates.sort(key=lambda x: (x[2]["duration"], x[2]["size"]), reverse=True)
        best_fp, best_f, best_info, topic = candidates[0]
        
        num_str = f"{num:02d}"
        dest_filename = f"{vol_cfg['slug']}-hadith-{num_str}.mp3"
        dest_path = os.path.join(dest_dir, dest_filename)
        
        display_label = f"ሀዲስ {num:02d}" + (f": {topic}" if topic else "")
        title = f"{vol_cfg['title']} — {display_label}"
        
        items.append({
            "src": best_fp,
            "dest": dest_path,
            "title": title,
            "display_label": display_label,
            "topic": topic,
            "album": vol_cfg["title"],
            "series": vol_cfg["slug"],
            "track": num,
            "slug": f"{vol_cfg['slug']}-hadith-{num_str}",
            "audio_url": f"/audio/{vol_cfg['slug']}/{dest_filename}"
        })
    return items

def process_item(item):
    src = item["src"]
    dest = item["dest"]
    title = item["title"]
    album = item["album"]
    track = item["track"]
    
    if os.path.exists(dest):
        info = get_audio_info(dest)
        if info["duration"] > 0 and info["size"] > 10000:
            return {
                **item,
                "duration_seconds": round(info["duration"]),
                "file_size": info["size"],
                "status": "cached"
            }
            
    info = optimize_file(src, dest, title, album, track)
    return {
        **item,
        "duration_seconds": round(info["duration"]),
        "file_size": info["size"],
        "status": "optimized"
    }

def process_volume(vol_cfg):
    print("=" * 60)
    print(f"Processing {vol_cfg['title']}...")
    items = collect_volume_items(vol_cfg)
    print(f"  Found {len(items)} hadiths to transcode. Starting...")
    
    workers = min(8, os.cpu_count() or 4)
    processed = []
    with ThreadPoolExecutor(max_workers=workers) as executor:
        future_map = {executor.submit(process_item, it): it for it in items}
        for future in as_completed(future_map):
            res = future.result()
            processed.append(res)
            orig_mb = os.path.getsize(res["src"]) / (1024 * 1024)
            new_mb = res["file_size"] / (1024 * 1024)
            print(f"  [{res['status'].upper()}] {res['slug']:<32} {orig_mb:>5.1f}MB -> {new_mb:>5.1f}MB")
            
    processed.sort(key=lambda x: x["track"])
    with open(vol_cfg["manifest"], "w", encoding="utf-8") as f:
        json.dump(processed, f, ensure_ascii=False, indent=2)
        
    orig_total = sum(os.path.getsize(it["src"]) for it in items) / (1024 * 1024)
    new_total = sum(it["file_size"] for it in processed) / (1024 * 1024)
    print(f"Finished {vol_cfg['title']}: {len(processed)} hadiths | {orig_total:.1f} MB -> {new_total:.1f} MB")
    return processed

if __name__ == "__main__":
    import sys
    target = sys.argv[1] if len(sys.argv) > 1 else None
    for vol in VOLUMES:
        if target and target not in vol["slug"]:
            continue
        process_volume(vol)
