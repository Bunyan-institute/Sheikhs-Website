#!/usr/bin/env python3
"""
Compacts and optimizes 'روضة الأنوار في سيرة النبي المختار' (Rawdatul Anwar)
The source MP3s are already voice-optimized at 16-32 kbps.
We stream-copy with ffmpeg to embed clean ID3v2 tags (title, artist, album, track),
standardize progressive headers, and ensure fast CDN streaming and instant downloads.
"""

import os
import sys
import json
import re
import subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed

SOURCE_FOLDER = "/run/media/fuayd/disk/druss/روضة الأنوار"
PROJECT_ROOT = "/home/fuayd/Bunyan/sheikh-ferej"
DEST_AUDIO_DIR = os.path.join(PROJECT_ROOT, "public", "audio", "rawdatul-anwar")
MANIFEST_PATH = os.path.join(PROJECT_ROOT, "data", "rawdatul-anwar-manifest.json")

ARTIST_NAME = "Sheikh Muhammed Ferej Megeno (فضيلة الشيخ محمد فرج رحمه الله)"
ALBUM_NAME = "روضة الأنوار في سيرة النبي المختار (ረውደቱል አንዋር)"
SERIES_SLUG = "rawdatul-anwar"

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

def optimize_mp3(src, dest, title, album, track_num):
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    temp_dest = dest + ".tmp.mp3"
    
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
    
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    os.replace(temp_dest, dest)
    info = get_audio_info(dest)
    return info

def extract_lesson_info(filename):
    m = re.search(r"ቁ\s*(\d+)", filename)
    num_str = m.group(1) if m else "00"
    
    if num_str == "000":
        sort_val = 0.1
        display_label = "መግቢያ 1 (Intro 1)"
    elif num_str == "00":
        sort_val = 0.2
        display_label = "መግቢያ 2 (Intro 2)"
    else:
        sort_val = float(int(num_str))
        display_label = f"ክፍል {int(num_str):02d}"
        
    return sort_val, display_label, num_str

def prepare_items():
    os.makedirs(DEST_AUDIO_DIR, exist_ok=True)
    files = sorted(os.listdir(SOURCE_FOLDER))
    items_raw = []
    
    for f in files:
        if not f.lower().endswith(".mp3"):
            continue
        fp = os.path.join(SOURCE_FOLDER, f)
        sort_val, display_label, num_str = extract_lesson_info(f)
        items_raw.append((sort_val, fp, display_label, num_str))
        
    items_raw.sort(key=lambda x: x[0])
    
    items = []
    for track_num, (sort_val, fp, display_label, num_str) in enumerate(items_raw, start=1):
        dest_filename = f"rawdatul-anwar-lesson-{track_num:02d}.mp3"
        dest_path = os.path.join(DEST_AUDIO_DIR, dest_filename)
        title = f"ረውደቱል አንዋር — {display_label} (روضة الأنوار)"
        slug = f"rawdatul-anwar-lesson-{track_num:02d}"
        items.append({
            "src": fp,
            "dest": dest_path,
            "title": title,
            "display_label": display_label,
            "album": ALBUM_NAME,
            "series": SERIES_SLUG,
            "track": track_num,
            "slug": slug,
            "audio_url": f"/audio/rawdatul-anwar/{dest_filename}"
        })
    return items

def process_item(item):
    src = item["src"]
    dest = item["dest"]
    title = item["title"]
    album = item["album"]
    track = item["track"]
    
    info = optimize_mp3(src, dest, title, album, track)
    return {
        **item,
        "duration_seconds": round(info["duration"]),
        "file_size": info["size"],
        "status": "optimized"
    }

def main():
    items = prepare_items()
    print(f"Loaded {len(items)} lessons for Rawdatul Anwar. Optimizing in parallel...")
    workers = min(8, os.cpu_count() or 4)
    processed = []
    with ThreadPoolExecutor(max_workers=workers) as executor:
        future_map = {executor.submit(process_item, it): it for it in items}
        for future in as_completed(future_map):
            res = future.result()
            processed.append(res)
            sz_mb = res["file_size"] / (1024 * 1024)
            print(f"[{res['status'].upper()}] {res['slug']:<30} {sz_mb:>5.1f}MB ({res['duration_seconds']}s)")

    processed.sort(key=lambda x: x["track"])
    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(processed, f, ensure_ascii=False, indent=2)

    total_mb = sum(it["file_size"] for it in processed) / (1024 * 1024)
    print("\n" + "=" * 60)
    print(f"Rawdatul Anwar Optimization Complete:")
    print(f"  Total lessons:   {len(processed)}")
    print(f"  Total size:      {total_mb:.1f} MB")
    print(f"  Manifest:        {MANIFEST_PATH}")
    print("=" * 60)

if __name__ == "__main__":
    main()
