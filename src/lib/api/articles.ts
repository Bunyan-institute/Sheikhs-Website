import { bunyan } from "./client";
import type { ListResponse, PublicArticle } from "./types";

export const AUTHENTIC_ARTICLES: PublicArticle[] = [
  {
    object: "article",
    id: "art_charity_half_date",
    title: "\u00ab\u12e8\u1270\u121d\u122d \u1235\u1295\u1323\u1242 \u1260\u1218\u1208\u1308\u1235\u121d \u1262\u1206\u1295 \u12a5\u1233\u1275\u1295 \u1270\u12a8\u120b\u12a8\u1209\u00bb \u2014 \u12e8\u1236\u12f0\u1243\u1205 \u12a5\u1293 \u12e8\u1218\u120d\u12ab\u121d \u1295\u130d\u130d\u122d \u1275\u1229\u134b\u1275",
    slug: "shield-from-fire-charity-good-words",
    summary: "\u12e8\u12a0\u120b\u1205 \u1218\u120d\u12ad\u1270\u129b (\u1230\u1208\u120b\u1201 \u12d0\u1208\u12ed\u1202 \u12c8\u1230\u1208\u121d) \u12a5\u1295\u12f2\u1205 \u1265\u1208\u12cb\u120d\u1366 \u00ab\u12e8\u1270\u121d\u122d \u1235\u1295\u1323\u1242 \u1260\u1218\u1208\u1308\u1235\u121d \u1262\u1206\u1295 \u12a5\u1233\u1275\u1295 (\u1300\u1200\u1290\u121d\u1295) \u1270\u12a8\u120b\u12a8\u1209\u1364 \u12ed\u1205\u1295\u1295 \u12eb\u120b\u1308\u1298 \u1230\u12cd \u130d\u1295 \u1260\u1218\u120d\u12ab\u121d \u1295\u130d\u130d\u122d \u122b\u1231\u1295 \u12ed\u1320\u1265\u1245\u1362\u00bb (\u1261\u12bb\u122a\u1293 \u1219\u1235\u120a\u121d)",
    body: "<div class=\"space-y-6\">\n  <div class=\"bg-[#FAF8F5] border border-[#E0D8CE] p-6 rounded-md\">\n    <div class=\"text-xs uppercase font-bold text-[#1B5E20] tracking-wider mb-2\">\u0627\u0644\u0646\u0635 \u0627\u0644\u0639\u0631\u0628\u064a \u0627\u0644\u0623\u0635\u0644\u064a \u2022 Arabic Text</div>\n    <p class=\"font-heading text-xl md:text-2xl text-right leading-loose text-[#2D3436] font-semibold\" dir=\"rtl\">\n      \u0639\u064e\u0646\u0652 \u0639\u064e\u062f\u0650\u064a\u0651\u0650 \u0628\u0652\u0646\u0650 \u062d\u064e\u0627\u062a\u0650\u0645\u064d \u0631\u064e\u0636\u0650\u064a\u064e \u0627\u0644\u0644\u0651\u064e\u0647\u064f \u0639\u064e\u0646\u0652\u0647\u064f \u0642\u064e\u0627\u0644\u064e : \u0642\u064e\u0627\u0644\u064e \u0631\u064e\u0633\u064f\u0648\u0644\u064f \u0627\u0644\u0644\u0651\u064e\u0647\u0650 \ufdfa : \n      <br/>\n      \u00ab<strong>\u0627\u062a\u0651\u064e\u0642\u064f\u0648\u0627 \u0627\u0644\u0646\u0651\u064e\u0627\u0631\u064e \u0648\u064e\u0644\u064e\u0648\u0652 \u0628\u0650\u0634\u0650\u0642\u0651\u0650 \u062a\u064e\u0645\u0652\u0631\u064e\u0629\u064d \u0641\u064e\u0645\u064e\u0646\u0652 \u0644\u064e\u0645\u0652 \u064a\u064e\u062c\u0650\u062f\u0652 \u0641\u064e\u0628\u0650\u0643\u064e\u0644\u0650\u0645\u064e\u0629\u064d \u0637\u064e\u064a\u0651\u0650\u0628\u064e\u0629\u064d</strong>\u00bb\n    </p>\n    <div class=\"text-right text-xs text-[#636E72] mt-2 font-medium\" dir=\"rtl\">\n      [\u0645\u062a\u0641\u0642\u064c \u0639\u0644\u064a\u0647 \u2014 \u0631\u0648\u0627\u0647 \u0627\u0644\u0628\u062e\u0627\u0631\u064a (1417) \u0648\u0645\u0633\u0644\u0645 (1016)]\n    </div>\n  </div>\n\n  <div class=\"bg-white border-l-4 border-[#1B5E20] pl-4 py-2\">\n    <h3 class=\"text-lg font-bold text-[#2D3436] mb-1 font-heading\">\u12e8\u1275\u122d\u1309\u121d \u121b\u1265\u122b\u122a\u12eb (Amharic)</h3>\n    <p class=\"text-[#2D3436] text-base leading-relaxed\">\n      \u12e8\u12a0\u120b\u1205 \u1218\u120d\u12ad\u1270\u129b (\u1230\u1208\u120b\u1201 \u12d0\u1208\u12ed\u1202 \u12c8\u1230\u1208\u121d) \u12a5\u1295\u12f2\u1205 \u1265\u1208\u12cb\u120d\u1366 \n      <em>\u00ab\u12e8\u1270\u121d\u122d \u1235\u1295\u1323\u1242 \u1260\u1218\u1208\u1308\u1235\u121d \u1262\u1206\u1295 \u12a5\u1233\u1275\u1295 (\u1300\u1200\u1290\u121d\u1295) \u1270\u12a8\u120b\u12a8\u1209\u1364 \u12ed\u1205\u1295\u1295 \u12eb\u120b\u1308\u1298 \u1230\u12cd \u130d\u1295 \u1260\u1218\u120d\u12ab\u121d \u1295\u130d\u130d\u122d (\u122b\u1231\u1295 \u12a8\u12a5\u1233\u1275 \u12ed\u1320\u1265\u1245)\u1362\u00bb</em>\n      <span class=\"text-xs text-[#636E72] block mt-1\">(\u1261\u12bb\u122a\u1293 \u1219\u1235\u120a\u121d \u12e8\u1270\u1235\u121b\u1219\u1260\u1275)</span>\n    </p>\n  </div>\n\n  <div class=\"bg-white border-l-4 border-[#B8860B] pl-4 py-2\">\n    <h3 class=\"text-lg font-bold text-[#2D3436] mb-1 font-heading\">English Translation & Commentary</h3>\n    <p class=\"text-[#2D3436] text-base leading-relaxed\">\n      Narrated by Adi bin Hatim (may Allah be pleased with him): The Messenger of Allah (\ufdfa) said:\n      <em>\"Guard yourselves against the Fire, even if with half a date-fruit; and whoever cannot afford even that, then with a good and kind word.\"</em>\n      <span class=\"text-xs text-[#636E72] block mt-1\">(Agreed upon \u2014 Sahih al-Bukhari & Sahih Muslim)</span>\n    </p>\n  </div>\n\n  <div class=\"bg-white border-l-4 border-[#636E72] pl-4 py-2\">\n    <h3 class=\"text-lg font-bold text-[#2D3436] mb-1 font-heading\">Hiikkaa Afaan Oromoo (Oromo)</h3>\n    <p class=\"text-[#2D3436] text-base leading-relaxed\">\n      Ergamaan Rabbii (nagaa fi rahmanni irratti haa jiraatu) akkana jedhan:\n      <em>\"Cabbii timiraatiinuu taatu ibiddarraa eeggadhaa; namni san dhabe immoo dubbii gaariidhaan (lubbuu isaa haa baraarsu).\"</em>\n      <span class=\"text-xs text-[#636E72] block mt-1\">(Bukhaarii fi Muslim irratti waliigalan)</span>\n    </p>\n  </div>\n\n  <div class=\"pt-4 border-t border-[#E0D8CE] space-y-4\">\n    <h3 class=\"font-heading font-bold text-xl text-[#2D3436]\">\u12a8\u12da\u1205 \u1273\u120b\u1245 \u1210\u12f2\u1235 \u12e8\u121d\u1295\u1240\u1235\u121b\u1278\u12cd \u1241\u120d\u134d \u1275\u121d\u1205\u122d\u1276\u127d</h3>\n    <ul class=\"list-disc list-inside space-y-2 text-[#636E72]\">\n      <li><strong class=\"text-[#2D3436]\">\u121d\u1295\u121d \u12a0\u12ed\u1290\u1275 \u1218\u120d\u12ab\u121d \u1235\u122b \u12a0\u1290\u1235\u1270\u129b \u1270\u1265\u120e \u12a0\u12ed\u1293\u1245\u121d\u1366</strong> \u12e8\u1270\u121d\u122d \u1235\u1295\u1323\u1242 \u12a5\u1295\u12b3\u1295 \u1260\u12a0\u120b\u1205 \u12d8\u1295\u12f5 \u1260\u1245\u1295 \u120d\u1265 \u1232\u1230\u1325 \u12a8\u12a0\u12f0\u130b \u12e8\u121d\u1275\u1273\u12f0\u130d \u12cb\u130b \u12a0\u120b\u1275\u1362</li>\n      <li><strong class=\"text-[#2D3436]\">\u1236\u12f0\u1243\u1205 \u12a5\u1233\u1275\u1295 \u1273\u1320\u134b\u1208\u127d\u1366</strong> \u120d\u130d\u1235\u1293 \u12cd\u1203 \u12a5\u1233\u1275\u1295 \u12a5\u1295\u12f0\u121a\u12eb\u1320\u134b \u12c8\u1295\u1300\u120d\u1295 \u12eb\u1265\u1233\u120d\u1362</li>\n      <li><strong class=\"text-[#2D3436]\">\u12e8\u1218\u120d\u12ab\u121d \u1295\u130d\u130d\u122d \u121d\u1295\u12f3\u1366</strong> \u12e8\u121a\u1230\u1320\u12cd \u12eb\u1323 \u1230\u12cd \u134a\u1271\u1295 \u12a0\u1260\u122d\u1276\u1363 \u12a0\u133d\u1293\u1295\u1276\u1293 \u1260\u1218\u120d\u12ab\u121d \u1243\u120d \u1270\u1293\u130d\u122e \u121b\u1208\u1349 \u120d\u12ad \u12a5\u1295\u12f0 \u1308\u1295\u12d8\u1265 \u120d\u1308\u1233 \u12ed\u1246\u1320\u122b\u120d\u1362</li>\n    </ul>\n  </div>\n</div>",
    reading_minutes: 3,
    locale: "am",
    direction: "ltr",
    cover: {
      object: "media",
      id: "med_art_half_date",
      kind: "image",
      url: "/images/photo_2_2026-09-30_23-42-17.jpg",
      mime_type: "image/jpeg",
      width: 1280,
      height: 960,
      duration_seconds: null,
    },
    categories: ["hadith", "charity", "ethics"],
    tags: ["\u1236\u12f0\u1243\u1205", "\u1210\u12f2\u1235", "\u1261\u12bb\u122a", "\u1218\u120d\u12ab\u121d-\u1295\u130d\u130d\u122d"],
    published_at: "2026-06-26T15:02:00Z",
    updated_at: "2026-06-26T15:02:00Z",
  },
  {
    object: "article",
    id: "art_salawat_on_friday",
    title: "\u12e8\u1301\u121d\u12d3 \u1240\u1295\u1293 \u120c\u120a\u1275 \u1260\u1290\u1262\u12e9 \u120b\u12ed \u1230\u1208\u12cb\u1275 \u12e8\u121b\u12cd\u1228\u12f5 \u1275\u1229\u134b\u1275 \u12a5\u1293 \u1260\u120b\u1329 \u12e8\u1230\u1208\u12cb\u1275 \u12a0\u1263\u1263\u120d",
    slug: "virtues-of-salawat-on-friday-ibrahimiyyah",
    summary: "\u1260\u12d3\u122d\u1265 \u1240\u1295\u1293 \u1260\u12d3\u122d\u1265 \u120c\u120a\u1275 \u1260\u1290\u1262\u12e9 \ufdfa \u120b\u12ed \u1230\u1208\u12cb\u1275\u1295 \u12e8\u121b\u1265\u12db\u1275 \u1273\u120b\u1245 \u12f0\u1228\u1303\u1364 \u12e8\u1230\u1208\u12cb\u1275 \u12a1\u1218\u1274 \u1260\u12e8\u1233\u121d\u1295\u1271 \u12d3\u122d\u1265 \u1208\u12a5\u1294 \u12ed\u1240\u122d\u1265\u120d\u129b\u120d\u1364 \u12a5\u1295\u12f2\u1201\u121d \u1290\u1262\u12e9 \u12eb\u1235\u1270\u121b\u122f\u1275 \u1260\u120b\u132d \u12e8\u1230\u1208\u12cb\u1270\u120d \u12a2\u1265\u122b\u1202\u121a\u12eb\u1205 \u12a0\u1263\u1263\u120d \u121b\u1265\u122b\u122a\u12eb\u1362",
    body: "<div class=\"space-y-6\">\n  <div class=\"bg-[#FAF8F5] border border-[#E0D8CE] p-6 rounded-md space-y-4\">\n    <div class=\"text-xs uppercase font-bold text-[#1B5E20] tracking-wider\">\ud83c\udf1f \u0641\u0636\u0644 \u0627\u0644\u0635\u0644\u0627\u0629 \u0639\u0644\u0649 \u0627\u0644\u0646\u0628\u064a \ufdfa \u064a\u0648\u0645 \u0627\u0644\u062c\u0645\u0639\u0629 \u0648\u0644\u064a\u0644\u062a\u0647 \u2022 Arabic Text</div>\n    \n    <p class=\"font-heading text-lg md:text-xl text-right leading-loose text-[#2D3436]\" dir=\"rtl\">\n      \u0642\u0627\u0644 \u0627\u0644\u0646\u0628\u064a \ufdfa : \u00ab<strong>\u0623\u064e\u0643\u0652\u062b\u0650\u0631\u064f\u0648\u0627 \u0627\u0644\u0635\u0651\u064e\u0644\u064e\u0627\u0629\u064e \u0639\u064e\u0644\u064e\u064a\u0651\u064e \u064a\u064e\u0648\u0652\u0645\u064e \u0627\u0644\u0652\u062c\u064f\u0645\u064f\u0639\u064e\u0629\u0650 \u0648\u064e\u0644\u064e\u064a\u0652\u0644\u064e\u0629\u064e \u0627\u0644\u0652\u062c\u064f\u0645\u064f\u0639\u064e\u0629\u0650\u060c \u0641\u064e\u0645\u064e\u0646\u0652 \u0635\u064e\u0644\u0651\u064e\u0649 \u0639\u064e\u0644\u064e\u064a\u0651\u064e \u0635\u064e\u0644\u064e\u0627\u0629\u064b \u0635\u064e\u0644\u0651\u064e\u0649 \u0627\u0644\u0644\u0647\u064f \u0639\u064e\u0644\u064e\u064a\u0652\u0647\u0650 \u0628\u0650\u0647\u064e\u0627 \u0639\u064e\u0634\u0652\u0631\u064b\u0627</strong>\u00bb [\u0623\u062e\u0631\u062c\u0647: \u0627\u0644\u0628\u064a\u0647\u0642\u064a]\n    </p>\n\n    <p class=\"font-heading text-lg md:text-xl text-right leading-loose text-[#2D3436]\" dir=\"rtl\">\n      \u0648\u0642\u0627\u0644 \ufdfa : \u00ab<strong>\u0623\u0643\u062b\u0650\u0631\u0648\u0627 \u0639\u0644\u064a\u0651\u064e \u0645\u0646\u064e \u0627\u0644\u0635\u0651\u064e\u0644\u0627\u0629\u0650 \u064a\u0648\u0645\u0650 \u0627\u0644\u062c\u0645\u0639\u0629\u0650\u061b \u0641\u0625\u0646\u0651\u064e \u0635\u0644\u0627\u0629\u064e \u0623\u0645\u0651\u064e\u062a\u064a \u062a\u064f\u0639\u0631\u064e\u0636\u064f \u0639\u0644\u064a\u0651\u064e \u0641\u064a \u0643\u0644\u0651\u0650 \u064a\u0648\u0645\u0650 \u062c\u0645\u0639\u0629\u064d</strong>\u00bb [\u0623\u062e\u0631\u062c\u0647: \u0627\u0644\u0628\u064a\u0647\u0642\u064a]\n    </p>\n  </div>\n\n  <div class=\"bg-white border-l-4 border-[#1B5E20] pl-4 py-2 space-y-3\">\n    <h3 class=\"text-lg font-bold text-[#2D3436] font-heading\">\u12e8\u1301\u121d\u12d3 \u1240\u1295\u1293 \u120c\u120a\u1275 \u1260\u1290\u1262\u12e9 \u120b\u12ed \u1230\u1208\u12cb\u1275 \u12e8\u121b\u12cd\u1228\u12f5 \u1275\u1229\u134b\u1275 (Amharic)</h3>\n    <p class=\"text-[#2D3436] text-base leading-relaxed\">\n      \u1290\u1262\u12e9 \ufdfa \u12a5\u1295\u12f2\u1205 \u1265\u1208\u12cb\u120d\u1366 <em>\"\u1260\u12d3\u122d\u1265 \u1240\u1295\u1293 \u1260\u12d3\u122d\u1265 \u120c\u120a\u1275 \u1260\u12a5\u1294 \u120b\u12ed \u1230\u1208\u12cb\u1275\u1295 \u12a0\u1265\u12d9\u1364 \u1260\u12a5\u1294 \u120b\u12ed \u12a0\u1295\u12f5 \u130a\u12dc \u1230\u1208\u12cb\u1275 \u12eb\u12c8\u1228\u12f0 \u12a0\u120b\u1205 \u1260\u12a5\u122d\u1231 \u120b\u12ed \u12a0\u1235\u122d \u130a\u12dc \u12a5\u12dd\u1290\u1271\u1295 \u12eb\u12c8\u122d\u12f3\u120d\u1362\"</em> [\u12a0\u120d-\u1260\u12ed\u1200\u1242]\n    </p>\n    <p class=\"text-[#2D3436] text-base leading-relaxed\">\n      \u12a5\u1295\u12f2\u1201\u121d \u1290\u1262\u12e9 \ufdfa \u12a5\u1295\u12f2\u1205 \u1265\u1208\u12cb\u120d\u1366 <em>\"\u1260\u12d3\u122d\u1265 \u1240\u1295 \u1260\u12a5\u1294 \u120b\u12ed \u1230\u1208\u12cb\u1275\u1295 \u12a0\u1265\u12d9\u1364 \u12e8\u12a1\u1218\u1274 \u1230\u1208\u12cb\u1275 \u1260\u12e8\u1233\u121d\u1295\u1271 \u12d3\u122d\u1265 \u1208\u12a5\u1294 \u12ed\u1240\u122d\u1265\u120d\u129b\u120d\u1293\u1362\"</em> [\u12a0\u120d-\u1260\u12ed\u1200\u1242]\n    </p>\n  </div>\n\n  <div class=\"bg-[#1B5E20]/5 border border-[#1B5E20]/20 p-6 rounded-md\">\n    <h3 class=\"text-lg font-bold text-[#1B5E20] mb-3 font-heading\">\ud83d\udcdc \u0627\u0644\u0635\u064a\u063a\u0629 \u0627\u0644\u0645\u0641\u0636\u0644\u0629 / \u1260\u120b\u1329 \u12e8\u1230\u1208\u12cb\u1275 \u12a0\u1263\u1263\u120d (\u0627\u0644\u0635\u0644\u0627\u0629 \u0627\u0644\u0625\u0628\u0631\u0627\u0647\u064a\u0645\u064a\u0629)</h3>\n    <p class=\"text-sm text-[#636E72] mb-3\">\u0648\u0647\u064a \u0627\u0644\u0635\u064a\u063a\u0629 \u0627\u0644\u062a\u064a \u0639\u0644\u0651\u0645\u0647\u0627 \u0627\u0644\u0646\u0628\u064a \ufdfa \u0644\u0623\u0635\u062d\u0627\u0628\u0647 (\u0627\u0644\u0628\u062e\u0627\u0631\u064a \u0648\u0645\u0633\u0644\u0645) / \u12ed\u1205\u127d \u1290\u1262\u12e9 \ufdfa \u1208\u1236\u1203\u1266\u127b\u1278\u12cd \u12eb\u1235\u1270\u121b\u122f\u1275 \u1260\u120b\u132d \u1230\u1208\u12cb\u1275 \u1293\u1275\u1366</p>\n    \n    <div class=\"bg-white p-4 rounded border border-[#E0D8CE] mb-4 text-right\" dir=\"rtl\">\n      <p class=\"font-heading text-lg text-[#2D3436] leading-loose font-bold\">\n        \"\u0627\u0644\u0644\u0651\u064e\u0647\u064f\u0645\u0651\u064e \u0635\u064e\u0644\u0651\u0650 \u0639\u0644\u0649 \u0645\u064f\u062d\u064e\u0645\u0651\u064e\u062f\u064d \u0648\u064e\u0639\u064e\u0644\u064e\u0649 \u0622\u0644\u0650 \u0645\u064f\u062d\u064e\u0645\u0651\u064e\u062f\u064d\u060c \u0643\u064e\u0645\u064e\u0627 \u0635\u064e\u0644\u0651\u064e\u064a\u0652\u062a\u064e \u0639\u064e\u0644\u064e\u0649 \u0625\u0650\u0628\u0652\u0631\u064e\u0627\u0647\u0650\u064a\u0645\u064e \u0648\u064e\u0639\u064e\u0644\u064e\u0649 \u0622\u0644\u0650 \u0625\u0650\u0628\u0652\u0631\u064e\u0627\u0647\u0650\u064a\u0645\u064e\u060c \u0625\u0650\u0646\u0651\u064e\u0643\u064e \u062d\u064e\u0645\u0650\u064a\u062f\u064c \u0645\u064e\u062c\u0650\u064a\u062f\u064c\u060c \u0627\u0644\u0644\u0651\u064e\u0647\u064f\u0645\u0651\u064e \u0628\u064e\u0627\u0631\u0650\u0643\u0652 \u0639\u064e\u0644\u064e\u0649 \u0645\u064f\u062d\u064e\u0645\u0651\u064e\u062f\u064d \u0648\u064e\u0639\u064e\u0644\u064e\u0649 \u0622\u0644\u0650 \u0645\u064f\u062d\u064e\u0645\u0651\u064e\u062f\u064d\u060c \u0643\u064e\u0645\u064e\u0627 \u0628\u064e\u0627\u0631\u064e\u0643\u0652\u062a\u064e \u0639\u064e\u0644\u064e\u0649 \u0625\u0650\u0628\u0652\u0631\u064e\u0627\u0647\u0650\u064a\u0645\u064e \u0648\u064e\u0639\u064e\u0644\u064e\u0649 \u0622\u0644\u0650 \u0625\u0650\u0628\u0652\u0631\u064e\u0627\u0647\u0650\u064a\u0645\u064e\u060c \u0625\u0650\u0646\u0651\u064e\u0643\u064e \u062d\u064e\u0645\u0650\u064a\u062f\u064c \u0645\u064e\u062c\u0650\u064a\u062f\u064c\"\n      </p>\n    </div>\n\n    <div class=\"space-y-3 text-sm text-[#2D3436]\">\n      <p>\n        <strong>\u1260\u12a0\u121b\u122d\u129b\u1366</strong> <em>\"\u12a0\u120b\u1205 \u1206\u12ed! \u1260\u12a2\u1265\u122b\u1202\u121d\u1293 \u1260\u12a2\u1265\u122b\u1202\u121d \u1264\u1270\u1230\u1266\u127d \u120b\u12ed \u12a5\u12dd\u1290\u1275\u1205\u1295 \u12a5\u1295\u12f3\u12c8\u1228\u12f5\u12ad \u1201\u1209 \u1260\u1219\u1210\u1218\u12f5\u1293 \u1260\u1219\u1210\u1218\u12f5 \u1264\u1270\u1230\u1266\u127d \u120b\u12ed \u12a5\u12dd\u1290\u1275\u1205\u1295 \u12a0\u12cd\u122d\u12f5\u1364 \u12a0\u1295\u1270 \u121d\u1235\u1309\u1295\u1293 \u12e8\u120b\u1245\u12ad \u1290\u1205\u1293\u1362 \u12a0\u120b\u1205 \u1206\u12ed! \u1260\u12a2\u1265\u122b\u1202\u121d\u1293 \u1260\u12a2\u1265\u122b\u1202\u121d \u1264\u1270\u1230\u1266\u127d \u120b\u12ed \u1260\u1228\u12a8\u1275\u1205\u1295 \u12a5\u1295\u12f0\u1263\u1228\u12ad\u12ad \u1201\u1209 \u1260\u1219\u1210\u1218\u12f5\u1293 \u1260\u1219\u1210\u1218\u12f5 \u1264\u1270\u1230\u1266\u127d \u120b\u12ed \u1260\u1228\u12a8\u1275\u1205\u1295 \u12a0\u12cd\u122d\u12f5\u1364 \u12a0\u1295\u1270 \u121d\u1235\u1309\u1295\u1293 \u12e8\u120b\u1245\u12ad \u1290\u1205\u1293\u1362\"</em>\n      </p>\n      <p>\n        <strong>In English:</strong> <em>\"O Allah, bestow Your favor upon Muhammad and upon the family of Muhammad, as You bestowed favor upon Ibrahim and upon the family of Ibrahim; indeed, You are Praiseworthy and Glorious. O Allah, bless Muhammad and the family of Muhammad, as You blessed Ibrahim and the family of Ibrahim; indeed, You are Praiseworthy and Glorious.\"</em>\n      </p>\n      <p>\n        <strong>Afaan Oromoo:</strong> <em>\"Yaa Rabbi! Akkuma Ibraahiimii fi maatii Ibraahiim irratti rahmata buufte, Muhammad fi maatii Muhammad irrattis rahmata buusi; ati faarfamaa fi guddaadha. Yaa Rabbi! Akkuma Ibraahiimii fi maatii Ibraahiim eebbiste, Muhammad fi maatii Muhammadis eebbisi; ati faarfamaa fi guddaadha.\"</em>\n      </p>\n    </div>\n  </div>\n</div>",
    reading_minutes: 4,
    locale: "am",
    direction: "ltr",
    cover: {
      object: "media",
      id: "med_art_salawat",
      kind: "image",
      url: "/images/photo_14_2026-09-30_23-42-17.jpg",
      mime_type: "image/jpeg",
      width: 1280,
      height: 960,
      duration_seconds: null,
    },
    categories: ["jumah", "salawat", "sunnah"],
    tags: ["\u1301\u121d\u12d3", "\u1230\u1208\u12cb\u1275", "\u12a2\u1265\u122b\u1202\u121a\u12eb\u1205", "\u12f1\u12d3\u12a5"],
    published_at: "2026-06-26T15:04:00Z",
    updated_at: "2026-06-26T15:04:00Z",
  },
  {
    object: "article",
    id: "art_pleasing_allah_above_people",
    title: "#\u1208\u1230\u12cd_\u1265\u1208\u1205_\u12a0\u12bc\u122b\u1205\u1295_\u12a0\u1273\u1260\u120b\u123d \u2014 \u12e8\u12a0\u120b\u1205\u1295 \u12cd\u12f4\u1273 \u12a8\u1230\u12ce\u127d \u12ed\u1201\u1295\u1273 \u121b\u1235\u1240\u12f0\u121d",
    slug: "do-not-ruin-hereafter-for-people",
    summary: "\u12a8\u12d3\u12a2\u123b (\u1228\u12f2\u12e8\u120b\u1201 \u12d0\u1295\u1203) \u12e8\u1270\u120b\u1208\u1348\u12cd \u1273\u120b\u1245 \u12e8\u1290\u1262\u12e9 \ufdfa \u1218\u1218\u122a\u12eb\u1366 \u1230\u12ce\u127d \u1262\u1246\u1321\u121d \u12a5\u1295\u12b3 \u12e8\u12a0\u120b\u1205\u1295 \u12cd\u12f4\u1273 \u12eb\u1235\u1240\u12f0\u1218 \u1230\u12cd \u12a0\u120b\u1205 \u12ed\u12c8\u12f0\u12cb\u120d\u1363 \u1230\u12ce\u127d\u1295\u121d \u12a5\u1295\u12f2\u12c8\u12f1\u1275 \u12eb\u12f0\u122d\u130b\u120d\u1364 \u12a0\u120b\u1205\u1295 \u1260\u121b\u1235\u1246\u1323\u1275 \u12e8\u1230\u12ce\u127d\u1295 \u12cd\u12f4\u1273 \u12e8\u1348\u1208\u1308 \u130d\u1295 \u12a0\u120b\u1205\u121d \u12ed\u1246\u1323\u1260\u1273\u120d \u1230\u12ce\u127d\u121d \u12a5\u1295\u12f2\u1320\u1209\u1275 \u12eb\u12f0\u122d\u130b\u120d\u1362",
    body: "<div class=\"space-y-6\">\n  <div class=\"bg-[#FAF8F5] border border-[#E0D8CE] p-6 rounded-md\">\n    <div class=\"text-xs uppercase font-bold text-[#1B5E20] tracking-wider mb-2\">#\u0644\u0627_\u062a\u0641\u0633\u062f_\u0622\u062e\u0631\u062a\u0643_\u0644\u0645\u0631\u0636\u0627\u0629_\u0627\u0644\u0646\u0627\u0633 \u2022 Arabic Text</div>\n    <p class=\"font-heading text-lg md:text-xl text-right leading-loose text-[#2D3436]\" dir=\"rtl\">\n      \u0639\u064e\u0646\u0652 \u0639\u064e\u0627\u0626\u0650\u0634\u064e\u0629\u064e \u0631\u064e\u0636\u0650\u064a\u064e \u0627\u0644\u0644\u0651\u064e\u0647\u064f \u0639\u064e\u0646\u0652\u0647\u064e\u0627 \u0623\u064e\u0646\u0651\u064e \u0627\u0644\u0646\u0651\u064e\u0628\u0650\u064a\u0651\u064e \ufdfa \u0642\u064e\u0627\u0644\u064e : \n      <br/>\n      \u00ab<strong>\u0645\u064e\u0646\u0650 \u0627\u0644\u0652\u062a\u064e\u0645\u064e\u0633\u064e \u0631\u0650\u0636\u064e\u0649 \u0627\u0644\u0644\u0651\u064e\u0647\u0650 \u0628\u0650\u0633\u064e\u062e\u064e\u0637\u0650 \u0627\u0644\u0646\u0651\u064e\u0627\u0633\u0650\u060c \u0631\u064e\u0636\u0650\u064a\u064e \u0627\u0644\u0644\u0651\u064e\u0647\u064f \u0639\u064e\u0646\u0652\u0647\u064f \u0648\u064e\u0623\u064e\u0631\u0652\u0636\u064e\u0649 \u0639\u064e\u0646\u0652\u0647\u064f \u0627\u0644\u0646\u0651\u064e\u0627\u0633\u064e\u060c \u0648\u064e\u0645\u064e\u0646\u0650 \u0627\u0644\u0652\u062a\u064e\u0645\u064e\u0633\u064e \u0631\u0650\u0636\u064e\u0627 \u0627\u0644\u0646\u0651\u064e\u0627\u0633\u0650 \u0628\u0650\u0633\u064e\u062e\u064e\u0637\u0650 \u0627\u0644\u0644\u0651\u064e\u0647\u0650\u060c \u0633\u064e\u062e\u064e\u0637\u064e \u0627\u0644\u0644\u0651\u064e\u0647\u064f \u0639\u064e\u0644\u064e\u064a\u0652\u0647\u0650 \u0648\u064e\u0623\u064e\u0633\u0652\u062e\u064e\u0637\u064e \u0639\u064e\u0644\u064e\u064a\u0652\u0647\u0650 \u0627\u0644\u0646\u0651\u064e\u0627\u0633\u064e</strong>\u00bb\n    </p>\n    <div class=\"text-right text-xs text-[#636E72] mt-2 font-medium\" dir=\"rtl\">\n      [\u0631\u0648\u0627\u0647 \u0627\u0628\u0646 \u062d\u0628\u0627\u0646 \u0641\u064a \u0635\u062d\u064a\u062d\u0647 \u0648\u0627\u0644\u062a\u0631\u0645\u0630\u064a]\n    </div>\n  </div>\n\n  <div class=\"bg-white border-l-4 border-[#1B5E20] pl-4 py-2\">\n    <h3 class=\"text-lg font-bold text-[#2D3436] mb-1 font-heading\">#\u1208\u1230\u12cd_\u1265\u1208\u1205_\u12a0\u12bc\u122b\u1205\u1295_\u12a0\u1273\u1260\u120b\u123d (Amharic)</h3>\n    <p class=\"text-[#2D3436] text-base leading-relaxed\">\n      \u12a8\u12d3\u12a2\u123b (\u1228\u12f2\u12e8\u120b\u1201 \u12d0\u1295\u1203) \u12a5\u1295\u12f0\u1270\u120b\u1208\u1348\u12cd \u12e8\u12a0\u120b\u1205 \u1218\u120d\u12ad\u1270\u129b \ufdfa \u12a5\u1295\u12f2\u1205 \u1265\u1208\u12cb\u120d\u1366\n      <br/>\n      <em>\u00ab\u1230\u12ce\u127d \u1262\u1246\u1321\u121d \u12a5\u1295\u12b3 \u12e8\u12a0\u120b\u1205\u1295 \u12cd\u12f4\u1273 \u12eb\u1235\u1240\u12f0\u1218 \u1230\u12cd\u1363 \u12a0\u120b\u1205 \u12ed\u12c8\u12f0\u12cb\u120d\u1364 \u1230\u12ce\u127d\u1295\u121d \u12a5\u122d\u1231\u1295 \u12a5\u1295\u12f2\u12c8\u12f1 \u12eb\u12f0\u122d\u130b\u1278\u12cb\u120d\u1362 \u1260\u12a0\u1295\u133b\u1229 \u12a0\u120b\u1205\u1295 \u1260\u121b\u1235\u1246\u1323\u1275 \u12e8\u1230\u12ce\u127d\u1295 \u12cd\u12f4\u1273 \u12e8\u1348\u1208\u1308 \u1230\u12cd \u130d\u1295\u1363 \u12a0\u120b\u1205 \u1260\u12a5\u122d\u1231 \u120b\u12ed \u12ed\u1246\u1323\u120d\u1364 \u1230\u12ce\u127d\u121d \u1260\u12a5\u122d\u1231 \u120b\u12ed \u12a5\u1295\u12f2\u1246\u1321\u1293 \u12a5\u1295\u12f2\u1320\u1209\u1275 \u12eb\u12f0\u122d\u130b\u1278\u12cb\u120d\u1362\u00bb</em>\n      <span class=\"text-xs text-[#636E72] block mt-1\">(\u12a2\u1265\u1291 \u1212\u1263\u1295 \u1260\u1236\u1212\u1210\u1278\u12cd \u12d8\u130d\u1260\u12cd\u1273\u120d)</span>\n    </p>\n  </div>\n\n  <div class=\"bg-white border-l-4 border-[#B8860B] pl-4 py-2\">\n    <h3 class=\"text-lg font-bold text-[#2D3436] mb-1 font-heading\">English Translation & Ethical Principle</h3>\n    <p class=\"text-[#2D3436] text-base leading-relaxed\">\n      Narrated by Aisha (may Allah be pleased with her): The Prophet (\ufdfa) said:\n      <br/>\n      <em>\"Whoever seeks the pleasure of Allah at the risk of people's displeasure, Allah will be pleased with him and will make the people pleased with him. And whoever seeks the pleasure of people at the cost of Allah's displeasure, Allah will be displeased with him and will make the people displeased with him.\"</em>\n      <span class=\"text-xs text-[#636E72] block mt-1\">(Reported by Ibn Hibban and at-Tirmidhi)</span>\n    </p>\n  </div>\n\n  <div class=\"bg-white border-l-4 border-[#636E72] pl-4 py-2\">\n    <h3 class=\"text-lg font-bold text-[#2D3436] mb-1 font-heading\">Hiikkaa Afaan Oromoo (Oromo)</h3>\n    <p class=\"text-[#2D3436] text-base leading-relaxed\">\n      Aa'ishaa (ra) irraa akka dhufeetti, Ergamaan Rabbii (saw) akkana jedhan:\n      <br/>\n      <em>\"Namni dallansuu namootaatiin jaalala Rabbii barbaade, Rabbiin isa jaalata; namootas akka isa jaalatan godha. Namni ammoo dallansuu Rabbiitiin jaalala namaa barbaade, Rabbiin isarratti dallana; namootas akka isarratti dallanan godha.\"</em>\n      <span class=\"text-xs text-[#636E72] block mt-1\">(Ibnu Hibbaan Sahiiha isaanii keessatti gabaasan)</span>\n    </p>\n  </div>\n\n  <div class=\"pt-4 border-t border-[#E0D8CE] space-y-4\">\n    <h3 class=\"font-heading font-bold text-xl text-[#2D3436]\">\u1218\u1295\u1348\u1233\u12ca \u121b\u1235\u1273\u12c8\u123b\u1293 \u1270\u130d\u1223\u133d</h3>\n    <p class=\"text-[#636E72] leading-relaxed\">\n      \u1260\u1205\u12ed\u12c8\u1273\u127d\u1295 \u12cd\u1235\u1325 \u1275\u120d\u1241 \u1348\u1270\u1293 \u12e8\u1230\u12ce\u127d\u1295 \u12ed\u1201\u1295\u1273 \u1208\u121b\u130d\u1298\u1275 \u1235\u1295\u120d \u12e8\u1348\u1323\u122a\u1295 \u1205\u130d\u1293 \u1218\u122d\u1205 \u1218\u1323\u1235 \u1290\u12cd\u1362 \n      \u1230\u12ce\u127d \u12db\u122c \u12a0\u121e\u130d\u1230\u12cd \u1290\u1308 \u120a\u12eb\u12c8\u130d\u12d9\u1205 \u12ed\u127d\u120b\u1209\u1364 \u12e8\u12a0\u120b\u1205 \u12cd\u12f4\u1273 \u130d\u1295 \u124b\u121a\u1293 \u12e8\u121b\u12eb\u120d\u134d \u12ad\u1265\u122d \u1290\u12cd\u1362 \n      \u12e8\u12a0\u120b\u1205\u1295 \u12cd\u12f4\u1273 \u12a8\u120d\u1265 \u12e8\u1240\u12f0\u1218 \u1230\u12cd\u1363 \u12a0\u120b\u1205 \u12e8\u1230\u12ce\u127d\u1295\u121d \u120d\u1265 \u1260\u12a5\u1301 \u1235\u1208\u1206\u1290 \u12eb\u12d8\u1290\u1265\u120d\u1208\u1273\u120d\u1362 \n      \u1235\u1208\u12da\u1205 \u1208\u1230\u12cd \u12ed\u1209\u129d\u1273 \u1270\u1265\u120e \u12f2\u1295\u1293 \u12a0\u12bc\u122b\u1295 \u1218\u1235\u12cb\u12d5\u1275 \u12a8\u121b\u12f5\u1228\u130d \u12a5\u1295\u1320\u1295\u1240\u1245!\n    </p>\n  </div>\n</div>",
    reading_minutes: 4,
    locale: "am",
    direction: "ltr",
    cover: {
      object: "media",
      id: "med_art_pleasing_allah",
      kind: "image",
      url: "/images/photo_3_2026-09-30_23-42-17.jpg",
      mime_type: "image/jpeg",
      width: 1280,
      height: 960,
      duration_seconds: null,
    },
    categories: ["tarbiyah", "akhlaq", "iman"],
    tags: ["\u12a0\u12bc\u122b", "\u1270\u130d\u1223\u133d", "\u12a2\u12bd\u120b\u1235", "\u12a2\u1265\u1291-\u1212\u1263\u1295"],
    published_at: "2026-06-26T15:06:00Z",
    updated_at: "2026-06-26T15:06:00Z",
  },
  {
    object: "article",
    id: "art_selamawi_qelb",
    title: "ሰላማዊ ቀልብ — የልብ ንጽሕና እና መንፈሳዊ እርጋታ በኢስላም (The Sound Heart)",
    slug: "selamawi-qelb-spiritual-purity",
    summary: "በአላህ ዘንድ ዋጋ ያለው ንጹሕ ልብ (ቀልቡን ሰሊም) እንዴት ይገነባል? የልብ በሽታዎች፣ ቂም፣ ምቀኝነት እና ከንቱ ምኞቶችን የማከሚያ ቁርኣናዊ መፍትሔዎች።",
    body: `### መግቢያ — የሰላማዊ ቀልብ ምንነት

አላህ (ሱብሃነሁ ወተዓላ) በቅዱስ ቁርኣን በሱረቱ አል-ሹዐራእ እንዲህ ይላል፦

> **يَوْمَ لَا يَنفَعُ مَالٌ وَلَا بَنُونَ ۝ إِلَّا مَنْ أَتَى اللَّهَ بِقَلْبٍ سَلِيمٍ**  
> *"ገንዘብም ልጆችም የማይጠቅሙበት ቀን፤ ወደ አላህ በሰላማዊ (ንጹሕ) ልብ የመጣ ሰው ብቻ ሲቀር።"* (አል-ሹዐራእ 88-89)

በዚህ አንቀጽ ላይ "ቀልቡን ሰሊም" ተብሎ የተገለጸው ልብ ከሽርክ፣ ከተንኮል፣ ከምቀኝነት፣ ከክፋትና ከማስመሰል የጸዳ እውነተኛ የኢማን ማረፊያ ነው።

---

### 1. የልብ በሽታዎች ምልክቶችና አደጋቸው

ልብ በሰውነታችን ውስጥ የሁሉም ስሜቶችና ድርጊቶች ንጉሥ ነው። ነቢዩ (ሰለላሁ ዐለይሂ ወሰለም) በአስተማሩት ሐዲስ፦  
*"በሰውነት ውስጥ አንዲት ቁራጭ ስጋ አለች፤ እርሷ ከተስተካከለች መላው አካል ይስተካከላል፣ እርሷ ከተበላሸች ግን መላው አካል ይበላሻል፤ እርሷም ልብ ናት።"* (ቡኻሪና ሙስሊም)

ዋና ዋናዎቹ የልብ ህመሞች የሚከተሉት ናቸው፦
- **ምቀኝነት (ሐሰድ)፦** የአላህን ችሮታ በሌሎች ላይ ማየት አለመፈለግና መጥፋቱን መመኘት።
- **ኩራትና እብሪት (ኪብር)፦** እውነትን መቃወምና ሰዎችን በንቀት መመልከት።
- **ይዩልኝ ይስሙልኝ (ሪያእ)፦** የአምልኮ ስራዎችን ለአላህ ብሎ ከማድረግ ይልቅ የሰዎችን ምስጋና መፈለግ።
- **ቂምና ጥላቻ፦** ወንድምንና እህትን በክፋት መያዝና ይቅርታን አለማድረግ።

---

### 2. ቀልብን የማከሚያና የማንጻት መንገዶች

ሰላማዊ ልብ በድንገት የሚገኝ ሳይሆን ቀጣይነት ባለው መንፈሳዊ ትግል (ሙጃሃዳህ) የሚገነባ ነው።

1. **ተውሂድን ማጥራት፦** ሁሉንም ጉዳይ ለአላህ ብቻ አሳልፎ መስጠት። ከአላህ ውጭ ምንም አይነት ፍራቻም ሆነ ከንቱ ተስፋ በልብ ውስጥ አለማኖር።
2. **አላህን አዘውትሮ ማውሳት (ዚክር)፦**  
   *«አላህን በማውሳት ልቦች ይረጋጋሉ!»* (አር-ረዕድ 28)። ቁርኣንን በተደብቡር (በማስተንተን) ማንበብና የጠዋት/ማታ አዝካሮችን ማዘውተር።
3. **ይቅር ባይነትን መላበስ፦** በሰዎች ላይ ያለብንን ቅሬታ ለአላህ ብለን ይቅር ማለት፤ አላህ የኛን ወንጀል ይቅር እንዲለን።
4. **ለሙስሊም ወንድሞች በጎ መመኘት (ነሲሓህ)፦** ለራስህ የምትወደውን በጎ ነገር ለሌሎችም መውደድ።

---

### ማጠቃለያ

በዚህ ምድራዊ ቆይታችን ትልቁ ስኬት ገንዘብ መቆለል ወይም ታዋቂነት ማትረፍ ሳይሆን፣ ከአላህ ጋር በሰላማዊና ንጹሕ ልብ መገናኘት ነው። አላህ ልባችንን በኢማንና በተውሂድ ያረጋጋልን!`,
    reading_minutes: 6,
    locale: "am",
    direction: "ltr",
    cover: {
      object: "media",
      id: "med_art_1",
      kind: "image",
      url: "/images/photo_1_2026-09-30_23-42-17.jpg",
      mime_type: "image/jpeg",
      width: 1280,
      height: 960,
      duration_seconds: null,
    },
    categories: ["spirituality", "tarbiyah", "heart"],
    tags: ["ቀልብ", "ኢማን", "ተዝኪያህ", "ዱዓእ"],
    published_at: "2024-05-10T10:00:00Z",
    updated_at: "2026-09-30T10:00:00Z",
  },
  {
    object: "article",
    id: "art_mercy_fath_ahqaf",
    title: "ምህረትና እዝነት በቁርኣን አስተምህሮ — የሱረቱል ፈትህ እና ሱረቱል አሕቃፍ ማብራሪያ",
    slug: "mercy-and-victory-surah-fath-ahqaf",
    summary: "በሱረቱል ፈትህ ላይ የተገለጸው ግልጽ ድልና የአላህ ጽናት፣ በችግር ጊዜ የሚሰጥ ተስፋ እና በአሕቃፍ የተካተቱ ተግሣጾች ትንታኔ።",
    body: `### መግቢያ

ቁርኣን ለሰው ልጆች ሁሉ የህይወት ብርሃንና የመመሪያ መጽሐፍ ነው። ሱረቱል ፈትህ እና ሱረቱል አሕቃፍ በውስጣቸው በርካታ ጥልቅ የሆኑ የእምነት፣ የተስፋ እና የተግሣጽ ትምህርቶችን ይዘዋል።

---

### የሱረቱል ፈትህ ቁልፍ መልእክት

አላህ ለነቢዩ (ሰለላሁ ዐለይሂ ወሰለም) እና ለታማኝ ሰሃቦቻቸው የሰጠውን ታላቅ የተስፋ ቃል ሲያስታውስ፦

> **إِنَّا فَتَحْنَا لَكَ فَتْحًا مُّبِينًا**  
> *"እኛ ለአንተ ግልጽ የሆነን ድል ከፈትንልህ።"* (አል-ፈትህ 1)

ይህ አንቀጽ የወረደው በሁደይቢያህ ስምምነት ወቅት ነበር። በውጫዊ መልክ ለሙስሊሞች ከባድና አስቸጋሪ የመሰለው ሁኔታ፣ በአላህ ጥበብ ታላቅ የዲን መስፋፋትና የልቦች መከፈት ምክንያት ሆነ። 

እዚህ ላይ የምንማረው ትምህርት፦
- **የአላህ ፈተና ጀርባ ያለውን ጥበብ ማመን፦** አንዳንድ ጊዜ የምንጠላው ነገር ለኛ የተሻለ መልካምነት ይዞ ሊመጣ ይችላል።
- **የአላህ ጽናት (ሰኪናህ)፦** አላህ በምእመናን ልቦች ላይ መረጋጋትን ያወርዳል፤ በችግር ወቅት ጽናት የሚገኘው ከዚሁ ሰኪናህ ነው።

---

### የሱረቱል አሕቃፍ ተግሣጾች

ሱረቱል አሕቃፍ ደግሞ የሰው ልጅ ለወላጆቹ ሊኖረው የሚገባውን መልካም ውለታ እና ያለፈውን የዓድ ህዝቦች ታሪክ በማውሳት ትልቅ ማሳሰቢያ ይሰጣል፦

> **وَوَصَّيْنَا الْإِنسَانَ بِوَالِدَيْهِ إِحْسَانًا ۖ حَمَلَتْهُ أُمُّهُ كُرْهًا وَوَضَعَتْهُ كُرْهًا**  
> *"ሰውንም በወላጆቹ መልካም እንዲውል አዘዝነው፤ እናቱ በድካም አረገዘችው፣ በችግርም ወለደችው..."* (አል-አሕቃፍ 15)

የወላጆች ሐቅ በአላህ ዘንድ እጅግ የገዘፈ ነው። ለወላጆች በደግነት መቅረብ፣ መታዘዝ፣ በህይወትም ሆነ ከሞቱ በኋላ መልካም ዱዓእ ማድረግ የወጣቱ ትውልድ ቀዳሚ ግዴታ ነው።`,
    reading_minutes: 7,
    locale: "am",
    direction: "ltr",
    cover: {
      object: "media",
      id: "med_art_2",
      kind: "image",
      url: "/images/photo_4_2026-09-30_23-42-17.jpg",
      mime_type: "image/jpeg",
      width: 1280,
      height: 960,
      duration_seconds: null,
    },
    categories: ["tafsir", "quran"],
    tags: ["ተፍሲር", "ሱረቱል-ፈትህ", "አሕቃፍ", "ቁርኣን"],
    published_at: "2024-04-18T14:30:00Z",
    updated_at: "2026-09-30T10:00:00Z",
  },
  {
    object: "article",
    id: "art_dua_conditions",
    title: "ዱዓእ ተቀባይነት የሚያገኝባቸው ቁልፍ ሁኔታዎችና ስነ-ስርዓቶች",
    slug: "keys-to-accepted-dua-adab",
    summary: "ዱዓእ የኢባዳህ አስኳል ነው። ተቀባይነት የሚያገኝባቸው የተወደዱ ወቅቶች፣ ውስጣዊ ትህትና፣ ሀላል ገቢና የአላህን ውሳኔ በትዕግስት መጠበቅ።",
    body: `### ዱዓእ — የሙእሚን ዋነኛ መሳሪያ

ነቢዩ (ሰለላሁ ዐለይሂ ወሰለም) እንዲህ ብለዋል፦  
**«الدُّعَاءُ هُوَ الْعِبَادَةُ»**  
*"ዱዓእ እርሱ ራሱ አምልኮት ነው።"* (ቲርሚዚ)

አላህ ዘንድ በሮችን የሚያንኳኳ፣ ችግሮችን የሚያስወግድ፣ ምህረትን የሚያጎናጽፍ ትልቅ ጸጋ ዱዓእ ነው። ነገር ግን ዱዓችን ተቀባይነት እንዲያገኝ ልናሟላቸው የሚገቡ ቁልፍ ስነ-ስርዓቶች (አዳብ) አሉ።

---

### ተቀባይነት የሚያስገኙ ሁኔታዎች

1. **ኢኽላስ (ንጹሕ እምነት)፦** አላህን ብቻ በመለመንና ከእርሱ ውጭ ለማንም ጥሪ ሳያደርጉ መለመን።
2. **ሀላል ሲሳይ፦** የሚበላው፣ የሚጠጣውና የሚለብሰው ከሀላል ገቢ መሆን አለበት። ነቢዩ (ሰለላሁ ዐለይሂ ወሰለም) በሐዲሳቸው እንዳስተማሩት ረጅም መንገድ ተጉዞ እጆቹን ወደ ሰማይ ዘርግቶ "ያ ረብ! ያ ረብ!" እያለ የሚለምነውን ሰው ምግቡ ሀራም፣ መጠጡ ሀራም ሆኖ ሳለ ዱዓው እንዴት ይሰማል ሲሉ አስጠንቅቀዋል።
3. **ከወንጀልና ዝምድናን ከመቁረጥ መራቅ፦** ክፉ ነገርን ወይም በደልን አለመመኘት።
4. **እርግጠኝነትና አለመቸኮል፦** "ለመንኩ አልተመለሰልኝም" ብሎ ተስፋ ከመቁረጥ መቆጠብ፤ አላህ በተገቢው ጊዜና ወቅት መልስ እንደሚሰጥ ማመን።

---

### ዱዓእ የሚሰማባቸው ምርጥ ወቅቶች

- **የሌሊቱ የመጨረሻ አንድ ሶስተኛ ክፍል (ሱጁድ ላይ ሆኖ)**
- **በአዛን እና በኢቃማ መካከል ያለው ጊዜ**
- **በጁምዓ ቀን የመጨረሻዋ ሰዓት (ከአስር በኋላ እስከ መግሪብ)**
- **ዝናብ በሚዘንብበት ወቅት እና በጾም ወቅት**`,
    reading_minutes: 5,
    locale: "am",
    direction: "ltr",
    cover: {
      object: "media",
      id: "med_art_3",
      kind: "image",
      url: "/images/photo_5_2026-09-30_23-42-17.jpg",
      mime_type: "image/jpeg",
      width: 1280,
      height: 960,
      duration_seconds: null,
    },
    categories: ["worship", "dua"],
    tags: ["ዱዓእ", "ኢባዳህ", "ስነ-ስርዓት", "ሲሳይ"],
    published_at: "2024-03-25T08:00:00Z",
    updated_at: "2026-09-30T10:00:00Z",
  },
  {
    object: "article",
    id: "art_tarbiyat_al_awlad",
    title: "የልጆች አስተዳደግ በኢስላማዊ መመሪያ — መሠረታዊ የቤተሰብ መርሆዎች",
    slug: "islamic-parenting-tarbiyat-al-awlad",
    summary: "ልጆችን በተውሂድ፣ በመልካም ስነ-ምግባር እና በአርአያነት ማሳደግ። የወላጆች ሃላፊነት፣ ሩህሩህ አቀራረብና ከዘመናዊ አፍራሽ ተጽእኖዎች የመጠበቅ ስልቶች።",
    body: `### ልጆች የአላህ አደራ ናቸው

ልጆች በቤተሰብ ውስጥ የአላህ ታላቅ ስጦታና ከባዱ አደራ ናቸው። አላህ እንዲህ ብሏል፦

> **يَا أَيُّهَا الَّذِينَ آمَنُوا قُوا أَنفُسَكُمْ وَأَهْلِيكُمْ نَارًا**  
> *"እናንተ ያመናችሁ ሆይ! ነፍሶቻችሁንና ቤተሰቦቻችሁን ከእሳት ጠብቁ..."* (አት-ተሕሪም 6)

---

### 1. ተውሂድ እና እምነትን ቀድሞ ማስተማር

የሉቅማንን ጥበብ በተመለከተ ቁርኣን ሲገልጽ ልጁን መጀመሪያ ያስተማረው ተውሂድን ነበር፦  
*«ልጄ ሆይ! በአላህ ላይ አታጋራ፤ ማጋራት ታላቅ በደል ነውና።»*  
ህጻናት ገና ንግግር ሲጀምሩ ስለ አላህ ታላቅነት፣ ስለ ፈጣሪነቱ፣ ስለ ነቢዩ (ሰ.ዐ.ወ) ውዴታ ማስገንዘብ ይገባል።

### 2. አርአያ በመሆን ማስተማር (ቁድዋህ)

ህጻናት ከምንነግራቸው ይልቅ የምንሰራውን ይማራሉ። አባት ሶላቱን በሰዓቱ ሲሰግድ፣ እናት ቁርኣን ስታነብ፣ እውነትን ሲናገሩ ያየ ልጅ በተፈጥሮው ይህን መልካም ባህሪ ይቀስማል።

### 3. ማዳመጥ እና በፍቅር መቅረብ

ነቢዩ (ሰለላሁ ዐለይሂ ወሰለም) ህጻናትን ያቅፉ፣ ይስማሙ፣ ሰላምታ ይሰጡ ነበር። በጭካኔና በቁጣ ብቻ የተያዘ ልጅ በውስጡ ፍርሃትንና ውሸትን ያዳብራል። ምክር በፍቅርና በምሳሌ ሲሆን ልብ ውስጥ ይሰርጻል።`,
    reading_minutes: 6,
    locale: "am",
    direction: "ltr",
    cover: {
      object: "media",
      id: "med_art_4",
      kind: "image",
      url: "/images/photo_8_2026-09-30_23-42-17.jpg",
      mime_type: "image/jpeg",
      width: 1280,
      height: 960,
      duration_seconds: null,
    },
    categories: ["family", "parenting", "tarbiyah"],
    tags: ["ልጆች", "ቤተሰብ", "አስተዳደግ", "ተርቢያህ"],
    published_at: "2024-02-14T09:00:00Z",
    updated_at: "2026-09-30T10:00:00Z",
  },
  {
    object: "article",
    id: "art_islamic_unity",
    title: "ኢስላማዊ አንድነት እና የሰለፎች የትብብር መመሪያ",
    slug: "islamic-unity-manhaj-salaf",
    summary: "አንድነት የሚመሠረተው በቁርኣንና ሐዲስ ትክክለኛ ግንዛቤ ላይ ነው። ጥቃቅን ልዩነቶችን በጥበብ ማስተናገድና ለኡማው የጋራ ህልውና መትጋት።",
    body: `### የኡማው አንድነት ጥሪ

አላህ በቁርኣን እንዲህ ያዘናል፦

> **وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا وَلَا تَفَرَّقُوا**  
> *"የአላህንም ገመድ (ቁርኣንን) ሁላችሁም ተጨባበጡ፤ አትለያዩም።"* (ኣሊ-ዒምራን 103)

ኢስላም አንድነትን የዲን ማገር አድርጎታል። ሙስሊሞች በተለያዩ ሀገራት፣ ዘሮችና ቋንቋዎች ቢኖሩም በላኢላሀ ኢለላህ ጥላ ስር አንድ አካል ናቸው።

---

### የሰለፎች መመሪያ በልዩነት ወቅት

ታላላቆቹ የሰለፍ ሊቃውንት በአመለካከትና በፈትዋ ልዩነቶች ሲያጋጥሟቸው የተከተሉት መርህ ለዛሬው ትውልድ ምርጥ አብነት ነው፦

1. **መሠረታዊ የእምነት ጉዳዮች (ኡሱል) ላይ መጽናት** — ተውሂድ፣ ሱናህና የሰሃቦችን ፈለግ አጥብቆ መያዝ።
2. **በፍርዒይ (ቅርንጫፋዊ) የፊቅህ ጉዳዮች መተሳሰብ** — በኢጅቲሃድ ጉዳዮች ወንድምን አለማውገዝና ክብርን አለመንካት።
3. **ከስሜታዊነት መራቅ** — ለዲን መቆርቆር በጥበብ (ሂክማህ) እና በመልካም ተግሣጽ መመራት አለበት።

አንድነታችን ጥንካሬያችን ነው፤ መለያየታችን ግን ውድቀታችንን ያፋጥናል።`,
    reading_minutes: 5,
    locale: "am",
    direction: "ltr",
    cover: {
      object: "media",
      id: "med_art_5",
      kind: "image",
      url: "/images/photo_9_2026-09-30_23-42-17.jpg",
      mime_type: "image/jpeg",
      width: 1280,
      height: 960,
      duration_seconds: null,
    },
    categories: ["unity", "dawah", "society"],
    tags: ["አንድነት", "ሰለፎች", "ኡማህ", "ዳዕዋ"],
    published_at: "2024-01-20T11:00:00Z",
    updated_at: "2026-09-30T10:00:00Z",
  },
  {
    object: "article",
    id: "art_islamic_finance",
    title: "የሸሪዓዊ የፋይናንስ መርሆዎች እና ከወለድ የጸዳ የባንክ አገልግሎት በኢትዮጵያ",
    slug: "principles-islamic-finance-ethiopia",
    summary: "ከወለድ ነፃ የባንክ አገልግሎት (Interest-free Banking) ምንነት፣ የአማናህ መስኮቶች አሰራር እና የAAOIFI የሸሪዓ ደረጃዎች ተግባራዊ ፋይዳ።",
    body: `### መግቢያ — እስላማዊ ፋይናንስ ምንድነው?

እስላማዊ ፋይናንስ በፍትሕ፣ በእኩልነትና በእውነተኛ ኢኮኖሚያዊ ምርታማነት ላይ የተመሠረተ የፋይናንስ ስርዓት ነው። በሸሪዓዊ መርሆዎች መሠረት ገንዘብ ራሱ ሸቀጥ ሳይሆን የልውውጥና የዋጋ መለኪያ መሳሪያ ብቻ ነው።

---

### ዋና ዋና የሸሪዓ መርሆዎች

1. **የሪባ (ወለድ) ክልከላ፦**  
   አላህ እንዲህ ብሏል፦ *«አላህ ንግድን ፈቅዷል፤ ወለድን ግን እርም አድርጓል።»* (አል-በቀራህ 275)። ያለምንም ጥረትና ስጋት በገንዘብ ብድር ላይ የሚጨመር ትርፍ በሸሪዓ የተወገዘ ነው።
2. **የገረር (እርግጠኛ ያልሆነ ማጭበርበር) ክልከላ፦** ግልጽነት የጎደላቸው፣ ውል ያልተቋጨባቸው ወይም በቁማር መልክ የተገነቡ ግብይቶች አይፈቀዱም።
3. **ሀላል በሆኑ ዘርፎች ላይ ብቻ መዋዕለ-ነዋይ ማፍሰስ፦** ለህብረተሰብ ጤናና ስነ-ምግባር ጎጂ በሆኑ (እንደ አልኮል፣ ቁማር ወዘተ) ላይ መሰማራት አይቻልም።

---

### በኢትዮጵያ የሸሪዓ የባንክ አገልግሎቶች አሰራር

በኢትዮጵያ የባንክ ኢንዱስትሪ ውስጥ የሚሰሩ ከወለድ ነፃ አገልግሎቶች (ለምሳሌ በወጋገን ባንክ አማናህ መስኮት) የሚከተሉትን ዋና ዋና ሸሪዓዊ ውሎች ይጠቀማሉ፦

- **ሙራበሃ (Murabaha)፦** ባንኩ ደንበኛው የሚፈልገውን እቃ ገዝቶ በተስማሙበት የትርፍ ህዳግ በብድር መሸጥ።
- **ሙዳረባ (Mudaraba)፦** አንደኛው ወገን ካፒታል ሲያቀርብ ሌላኛው ወገን እውቀቱንና ስራውን አስተዋጽኦ በማድረግ ትርፍን መጋራት።
- **ኢጃራህ (Ijarah)፦** ኪራይ ወይም ለተወሰነ ጊዜ የንብረት አጠቃቀም መብትን ማስተላለፍ።

እነዚህ አገልግሎቶች በታዋቂው ዓለም አቀፍ የAAOIFI የሸሪዓ መመዘኛዎች መሰረት ጥብቅ ቁጥጥር እየተደረገባቸው ይተገበራሉ።`,
    reading_minutes: 8,
    locale: "am",
    direction: "ltr",
    cover: {
      object: "media",
      id: "med_art_6",
      kind: "image",
      url: "/images/photo_13_2026-09-30_23-42-17.jpg",
      mime_type: "image/jpeg",
      width: 1280,
      height: 960,
      duration_seconds: null,
    },
    categories: ["islamic-finance", "sharia-governance"],
    tags: ["ኢስላሚክ-ባንክ", "ፋይናንስ", "AAOIFI", "ወጋገን-አማናህ"],
    published_at: "2023-11-05T12:00:00Z",
    updated_at: "2026-09-30T10:00:00Z",
  },
];

const ARTICLE_TRANSLATIONS: Record<string, Record<string, { title: string; summary: string }>> = {
  "shield-from-fire-charity-good-words": {
    ar: {
      title: "«اتَّقُوا النَّارَ وَلَوْ بِشِقِّ تَمْرَةٍ» — فضل الصدقة والكلمة الطيبة",
      summary: "عَنْ عدِيِّ بن حَاتمٍ رضي اللَّه عنه قال : قال رسول اللَّه ﷺ : « اتَّقُوا النَّارَ وَلَوْ بِشِقِّ تَمْرَةٍ فَمَنْ لَمْ يجدْ فَبِكَلِمَةٍ طَيِّبَةٍ » [متفقٌ عليه]",
    },
    en: {
      title: "\"Shield Yourselves from the Fire Even with Half a Date\" — Virtues of Charity & Good Words",
      summary: "The Messenger of Allah (ﷺ) said: 'Guard yourselves against the Fire, even if with half a date-fruit; and whoever cannot afford even that, then with a good and kind word.' (Agreed upon: Bukhari & Muslim)",
    },
    om: {
      title: "\"Cabbii Timiraatiinuu Taatu Ibiddarraa Eeggadhaa\" — Fudhatama Sadaqaa fi Dubbii Gaarii",
      summary: "Ergamaan Rabbii (saw) akkana jedhan: 'Cabbii timiraatiinuu taatu ibiddarraa eeggadhaa; namni san dhabe immoo dubbii gaariidhaan (lubbuu isaa haa baraarsu).' (Bukhaarii fi Muslim)",
    },
    am: {
      title: "«የተምር ስንጣቂ በመለገስም ቢሆን እሳትን ተከላከሉ» — የሶደቃህ እና የመልካም ንግግር ትሩፋት",
      summary: "የአላህ መልክተኛ (ሰለላሁ ዐለይሂ ወሰለም) እንዲህ ብለዋል፦ ​«የተምር ስንጣቂ በመለገስም ቢሆን እሳትን (ጀሀነምን) ተከላከሉ፤ ይህንን ያላገኘ ሰው ግን በመልካም ንግግር ራሱን ይጠብቅ።» (ቡኻሪና ሙስሊም)",
    },
  },
  "virtues-of-salawat-on-friday-ibrahimiyyah": {
    ar: {
      title: "فضل الصلاة على النبي ﷺ يوم الجمعة وليلته والصيغة الإبراهيمية",
      summary: "قال رسول الله ﷺ: «أَكْثِرُوا الصَّلَاةَ عَلَيَّ يَوْمَ الْجُمُعَةِ وَلَيْلَةَ الْجُمُعَةِ، فَمَنْ صَلَّى عَلَيَّ صَلَاةً صَلَّى اللهُ عَلَيْهِ بِهَا عَشْرًا» والصيغة الإبراهيمية التي علمها لأصحابه.",
    },
    en: {
      title: "Virtues of Sending Blessings upon the Prophet (ﷺ) on Friday & As-Salat Al-Ibrahimiyyah",
      summary: "The Prophet (ﷺ) said: 'Increase your prayers upon me on the day and night of Friday, for whoever sends blessings upon me once, Allah sends ten blessings upon him.' Featuring the preferred Ibrahimiyyah formula.",
    },
    om: {
      title: "Faayidaa Guyyaa fi Halkan Jumu'aa Nabiyyii (saw) Irratti Salawaata Buusuu",
      summary: "Nabiyyiin (saw) akkana jedhan: 'Guyyaa fi halkan Jumu'aa narratti salawaata baay'isaa; namni yeroo tokko narratti salawaata buuse Rabbiin yeroo kudhan isa mararfata.' [Al-Bayhaqii]",
    },
    am: {
      title: "የጁምዓ ቀንና ሌሊት በነቢዩ ላይ ሰለዋት የማውረድ ትሩፋት እና በላጩ የሰለዋት አባባል",
      summary: "በዓርብ ቀንና በዓርብ ሌሊት በነቢዩ ﷺ ላይ ሰለዋትን የማብዛት ታላቅ ደረጃ እና ነቢዩ ያስተማሩት በላጭ የሰለዋተል ኢብራሂሚያህ አባባል ማብራሪያ።",
    },
  },
  "do-not-ruin-hereafter-for-people": {
    ar: {
      title: "#لا_تفسد_آخرتك_لمرضاة_الناس — إيثار رضا الله تعالى على سخط الناس",
      summary: "عن عائشة رضي الله عنها أن النبي ﷺ قال: «مَنِ الْتَمَسَ رِضَى اللَّهِ بِسَخَطِ النَّاسِ، رَضِيَ اللَّهُ عَنْهُ وَأَرْضَى عَنْهُ النَّاسَ...» [رواه ابن حبان والترمذي]",
    },
    en: {
      title: "Do Not Ruin Your Hereafter for People — Prioritizing Allah's Pleasure Above Human Approval",
      summary: "The Prophet (ﷺ) said: 'Whoever seeks the pleasure of Allah at the risk of people's displeasure, Allah will be pleased with him and make people pleased with him.' (Reported by Ibn Hibban)",
    },
    om: {
      title: "Namootaaf Jettee Aakhiraa Kee Hin Balleessin — Jaalala Rabbii Dura Dursuu",
      summary: "Ergamaan Rabbii (saw) akkana jedhan: 'Namni dallansuu namootaatiin jaalala Rabbii barbaade, Rabbiin isa jaalata; namootas akka isa jaalatan godha.' (Ibnu Hibbaan)",
    },
    am: {
      title: "#ለሰው_ብለህ_አኼራህን_አታበላሽ — የአላህን ውዴታ ከሰዎች ይሁንታ ማስቀደም",
      summary: "ከዓኢሻ (ረዲየላሁ ዐንሃ) የተላለፈው ታላቅ የነቢዩ ﷺ መመሪያ፦ ሰዎች ቢቆጡም እንኳ የአላህን ውዴታ ያስቀደመ ሰው፣ አላህ ይወደዋል፤ ሰዎችንም እርሱን እንዲወዱ ያደርጋቸዋል።",
    },
  },
};

function localizeArticle(art: PublicArticle, locale?: string): PublicArticle {
  if (!locale) return art;
  const translation = ARTICLE_TRANSLATIONS[art.slug]?.[locale];
  if (!translation) return art;
  return {
    ...art,
    title: translation.title,
    summary: translation.summary,
    locale,
    direction: locale === "ar" ? "rtl" : "ltr",
  };
}

import { getAllArticles, getArticleByIdOrSlug } from "@/lib/db/repository";

export async function getArticles(params: { limit?: string; cursor?: string; locale?: string; category?: string[]; tag?: string[]; sort?: string } = {}): Promise<ListResponse<PublicArticle>> {
  let list: PublicArticle[] = [];
  try {
    list = getAllArticles();
  } catch {
    list = AUTHENTIC_ARTICLES;
  }
  if (!list || list.length === 0) {
    list = AUTHENTIC_ARTICLES;
  }
  if (params.category && params.category.length > 0) {
    list = list.filter((a) => a.categories.some((c) => params.category!.includes(c)));
  }
  const localizedData = list.map((a) => localizeArticle(a, params.locale));
  return {
    object: "list",
    data: localizedData,
    has_more: false,
    next_cursor: null,
  };
}

export async function getArticle(reference: string, locale?: string): Promise<PublicArticle> {
  try {
    const found = getArticleByIdOrSlug(reference);
    if (found) {
      return localizeArticle(found, locale);
    }
  } catch {
    // fallback
  }

  const foundFallback = AUTHENTIC_ARTICLES.find(
    (a) => a.slug === reference || a.id === reference
  );
  if (foundFallback) {
    return localizeArticle(foundFallback, locale);
  }

  throw new Error(`Article ${reference} not found`);
}
