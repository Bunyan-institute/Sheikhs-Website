#!/usr/bin/env python3
"""
Compact and optimize Usul al-Iman audio lessons:
- Converts 256kbps M4A files to 48kbps CBR mono MP3 with ID3v2 tags.
- Stream-copies low-bitrate MP3s with updated ID3v2 tags.
- Eliminates corrupted recordings (e.g. 10s lesson 104) and selects highest quality duplicates.
- Generates data/usul-al-iman-manifest.json.
"""

import os
import re
import json
import subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_DRUSS = "/run/media/fuayd/disk/druss/أصول الإيمان"
DEST_DIR = "public/audio/usul-al-iman"
MANIFEST_PATH = "data/usul-al-iman-manifest.json"
ARTIST_NAME = "Sheikh Muhammed Ferej Megeno (فضيلة الشيخ محمد فرج رحمه الله)"
ALBUM_NAME = "أصول الإيمان (ኡሱሉል ኢማን)"

os.makedirs(DEST_DIR, exist_ok=True)
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

def parse_lesson_num(f):
    m = re.search(r"ቁ(?:ጥር|\.)?[_\s]*(\d+)", f)
    if m:
        return int(m.group(1))
    m = re.search(r"(\d+)", f)
    if m:
        return int(m.group(1))
    return None

def clean_topic(f):
    clean = os.path.splitext(f)[0]
    clean = re.sub(r"^(?:ኪታብ\s*)?\(?ኡሱሉል\s*ኢማን\)?\s*(?:ደርስ\s*)?(?:ቁ(?:ጥር|\.)?)?[_\s]*\d*", "", clean)
    clean = re.sub(r"^[\s\-_—:.]+", "", clean).strip()
    return clean

def collect_items():
    files = sorted(os.listdir(BASE_DRUSS))
    groups = {}
    for f in files:
        if f.startswith("."):
            continue
        fp = os.path.join(BASE_DRUSS, f)
        if os.path.isdir(fp):
            continue
        num = parse_lesson_num(f)
        if num is None:
            continue
        
        info = get_audio_info(fp)
        # Skip corrupt audio (< 30 seconds)
        if info["duration"] < 30:
            print(f"Skipping corrupt audio ({info['duration']:.1f}s): {f}")
            continue
            
        topic = clean_topic(f)
        groups.setdefault(num, []).append((fp, f, info, topic))
        
    items = []
    for num in sorted(groups.keys()):
        cand = groups[num]
        # Pick best file (highest duration)
        cand.sort(key=lambda x: x[2]["duration"], reverse=True)
        best_fp, best_fn, best_info, topic = cand[0]
        
        display_title = f"ኡሱሉል ኢማን — ደርስ {num:02d}"
        if topic:
            display_title += f": {topic}"
            
        slug = f"usul-al-iman-lesson-{num:02d}"
        dest_filename = f"{slug}.mp3"
        dest_path = os.path.join(DEST_DIR, dest_filename)
        
        items.append({
            "lesson_num": num,
            "title": display_title,
            "topic": topic,
            "src": best_fp,
            "src_filename": best_fn,
            "dest": dest_path,
            "dest_filename": dest_filename,
            "slug": slug,
            "src_info": best_info
        })
    return items

def process_item(item):
    src = item["src"]
    dest = item["dest"]
    title = item["title"]
    track = item["lesson_num"]
    src_info = item["src_info"]
    
    if os.path.exists(dest):
        info = get_audio_info(dest)
        return {
            "lesson_num": track,
            "title": title,
            "slug": item["slug"],
            "filename": item["dest_filename"],
            "url": f"/audio/usul-al-iman/{item['dest_filename']}",
            "duration": round(info["duration"]),
            "file_size": info["size"],
            "bitrate": info["bitrate"],
            "src": src,
            "status": "cached"
        }
        
    temp_dest = dest + ".tmp.mp3"
    is_mp3 = src.lower().endswith(".mp3")
    low_bitrate = src_info["bitrate"] > 0 and src_info["bitrate"] <= 68000
    
    if is_mp3 and low_bitrate:
        # Stream copy with ID3v2 metadata
        cmd = [
            "ffmpeg", "-y",
            "-i", src,
            "-c:a", "copy",
            "-id3v2_version", "3",
            "-metadata", f"title={title}",
            "-metadata", f"artist={ARTIST_NAME}",
            "-metadata", f"album={ALBUM_NAME}",
            "-metadata", f"track={track}",
            temp_dest
        ]
    else:
        # Transcode to 48kbps CBR mono MP3 (high speech clarity, compact size)
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
            "-metadata", f"album={ALBUM_NAME}",
            "-metadata", f"track={track}",
            temp_dest
        ]
        
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    os.replace(temp_dest, dest)
    info = get_audio_info(dest)
    
    return {
        "lesson_num": track,
        "title": title,
        "slug": item["slug"],
        "filename": item["dest_filename"],
        "url": f"/audio/usul-al-iman/{item['dest_filename']}",
        "duration": round(info["duration"]),
        "file_size": info["size"],
        "bitrate": info["bitrate"],
        "src": src,
        "status": "optimized"
    }

def main():
    items = collect_items()
    print(f"Collected {len(items)} valid Usul al-Iman lessons.")
    
    import sys
    # Support slicing, e.g. python3 scripts/compact-usul-al-iman.py 1 30
    if len(sys.argv) >= 3:
        start_num = int(sys.argv[1])
        end_num = int(sys.argv[2])
        items = [it for it in items if start_num <= it["lesson_num"] <= end_num]
        print(f"Processing slice: lessons {start_num} to {end_num} ({len(items)} items)")
        
    workers = min(8, os.cpu_count() or 4)
    processed = []
    with ThreadPoolExecutor(max_workers=workers) as executor:
        future_map = {executor.submit(process_item, it): it for it in items}
        for future in as_completed(future_map):
            res = future.result()
            processed.append(res)
            orig_mb = os.path.getsize(res["src"]) / (1024 * 1024)
            new_mb = res["file_size"] / (1024 * 1024)
            print(f"  [{res['status'].upper()}] Lesson {res['lesson_num']:03d}: {orig_mb:>5.1f}MB -> {new_mb:>5.1f}MB")
            
    processed.sort(key=lambda x: x["lesson_num"])
    
    # Load existing manifest if partial
    existing = []
    if os.path.exists(MANIFEST_PATH):
        try:
            with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
                existing = json.load(f)
        except Exception:
            existing = []
            
    manifest_dict = {it["lesson_num"]: it for it in existing}
    for it in processed:
        manifest_dict[it["lesson_num"]] = it
        
    final_list = [manifest_dict[k] for k in sorted(manifest_dict.keys())]
    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(final_list, f, ensure_ascii=False, indent=2)
        
    orig_total = sum(os.path.getsize(it["src"]) for it in items) / (1024 * 1024)
    new_total = sum(it["file_size"] for it in processed) / (1024 * 1024)
    print(f"\nCompleted slice: {len(processed)} lessons | {orig_total:.1f} MB -> {new_total:.1f} MB")

if __name__ == "__main__":
    main()
