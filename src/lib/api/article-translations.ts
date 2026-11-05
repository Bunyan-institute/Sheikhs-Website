import type { PublicArticle } from "./types";

// Per-locale title/summary overlays keyed by article slug (articles themselves are stored in SQLite).
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

export function localizeArticle(art: PublicArticle, locale?: string): PublicArticle {
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

