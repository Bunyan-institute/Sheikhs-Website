// Regenerates the admin PWA icons from public/images/sheikh-app-icon.png
//   node scripts/generate-icons.mjs
import sharp from "sharp";
import path from "node:path";

const src = path.resolve("public/images/sheikh-app-icon.png");
const out = (name) => path.resolve("public/icons", name);
const BRAND = "#0D3E2F";

for (const size of [192, 512]) {
  await sharp(src).resize(size, size).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(out(`icon-${size}.png`));
}
await sharp(src).resize(180, 180).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(out("apple-touch-icon.png"));

// Maskable icons keep the artwork inside the central safe zone (80%) on a solid brand background.
for (const size of [192, 512]) {
  const inner = Math.round(size * 0.8);
  const art = await sharp(src).resize(inner, inner).png({ compressionLevel: 9, palette: true, quality: 90 }).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: BRAND } })
    .composite([{ input: art, gravity: "center" }])
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toFile(out(`maskable-${size}.png`));
}
// Notification badge: Android draws only the alpha channel, so it is a plain white mihrab arch on transparency.
const arch = Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72"><path fill="#fff" d="M14 62V30C14 12 58 12 58 30V62Z"/><path fill="#000" d="M26 62V34C26 24 46 24 46 34V62Z"/></svg>'
);
await sharp(arch).png().toFile(out("badge-72.png"));
console.log("icons written to public/icons");
