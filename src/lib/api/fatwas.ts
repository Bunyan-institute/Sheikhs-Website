import { bunyan } from "./client";
import type { ListResponse, PublicFatwa } from "./types";

export const AUTHENTIC_FATWAS: PublicFatwa[] = [
  {
    object: "fatwa",
    id: "fat_zakat_fitr",
    title: "ስለ ዘካተል ፊጥር አከፋፈል እና የተፈቀዱ ምግቦች",
    slug: "rules-and-commodities-zakat-al-fitr",
    summary: "ዘካተል ፊጥር በማን ላይ ግዴታ ይሆናል? በገንዘብ ይፈቀዳል ወይስ በምግብ እህል ብቻ ነው መውጣት ያለበት?",
    question: "ዘካተል ፊጥር በገንዘብ መክፈል ይፈቀዳል ወይስ በምግብ እህል ብቻ ነው መውጣት ያለበት? በማን ላይስ ግዴታ ይሆናል?",
    answer: `### መልስ በኡስታዝ ሙሐመድ ፈረጅ

ቢስሚላሂር ረሕማኒር ረሒም፤ አልሐምዱሊላሂ ረቢል ዓለሚን።

1. **የዘካተል ፊጥር ግዴታነት፦**  
   ዘካተል ፊጥር በረመዳን መጨረሻ በእያንዳንዱ ሙስሊም (ወንድ፣ ሴት፣ ትልቅም ሆነ ትንሽ) ላይ ግዴታ (ዋጂብ) ነው። አላማውም የጾመኛውን ጾም ከአላስፈላጊ ቃላትና ጉድለቶች ማጥራት እንዲሁም ድሆች በዒድ ቀን እንዳይለምኑ ማስቻል ነው።

2. **የሚሰጠው አይነት (በእህል ወይስ በገንዘብ?)፦**  
   - **የአብዛኞቹ ዑለሞች አቋም (ጁምሁር)፦** በነቢዩ (ሰ.ዐ.ወ) ሐዲስ በቀጥታ እንደተገለጸው በሀገሩ ዋና የምግብ እህል (ስንዴ፣ ጤፍ፣ ሩዝ፣ በቆሎ) በአንድ ሰው አንድ ሳዕ (ወደ 2.5 እስከ 3 ኪሎ ግራም) መስጠት የተሻለና ከጥርጣሬ የጸዳ ነው።
   - **የአቡ ሀኒፋህና የአንዳንድ ታላላቅ ሊቃውንት እይታ፦** ለድሀው ተጠቃሚነት ሲባል በገንዘብ ዋጋውን መክፈል አስፈላጊ በሆነበት ወቅት ይፈቀዳል። ነገር ግን የመጀመሪያው ምርጫ እህል መስጠት ነው።

3. **የመክፈያ ጊዜ፦**  
   የተወደደው ሰዓት የዒድ ቀን ጧት ወደ ዒድ ሶላት ከመውጣታችን በፊት ነው። ከዒድ አንድ ወይም ሁለት ቀን ቀደም ብሎ መስጠትም ይፈቀዳል።`,
    locale: "am",
    direction: "ltr",
    categories: ["fiqh", "zakat", "fasting"],
    tags: ["ዘካ", "ዘካተል-ፊጥር", "ረመዳን", "ዒድ"],
    published_at: "2024-04-05T10:00:00Z",
    updated_at: "2026-09-30T10:00:00Z",
  },
  {
    object: "fatwa",
    id: "fat_digital_banking",
    title: "በሞባይልና ዲጂታል ባንኪንግ የሚፈጸሙ የፋይናንስ ግብይቶች ሸሪዓዊ ብይን",
    slug: "sharia-rulings-digital-banking-fees",
    summary: "በሞባይል ባንኪንግ የሚደረጉ የገንዘብ ዝውውሮች እና የሚወሰዱ የአገልግሎት ክፍያዎች (Service charges) በሸሪዓ ተፈቅደዋልን?",
    question: "በሞባይል ባንኪንግ ወይም በኤሌክትሮኒክ ክፍያ ወቅት ባንኮች ወይም የቴሌኮም ተቋማት የሚቆርጡት የአገልግሎት ክፍያ (Transfer fee) እንደ ሪባ (ወለድ) ይቆጠራል ወይስ የተፈቀደ ነው?",
    answer: `### መልስ በሸሪዓ አማካሪ ኡስታዝ ሙሐመድ ፈረጅ

በአላህ ስም እጅግ በጣም ሩኅሩህ በጣም አዛኝ በሆነው።

በዘመናዊ ዲጂታል ቴክኖሎጂ ገንዘብ ከአንዱ ሂሳብ ወደ ሌላው ለማስተላለፍ የሚከፈል የአገልግሎት ክፍያ (Fee for service / ጁዕላህ ወይም ኡጅረት) እና ወለድ (ሪባ) መሠረታዊ ልዩነት አላቸው፦

1. **የአገልግሎት ክፍያ (Service Fee)፦** ባንኩ ወይም አገልግሎት ሰጪው ተቋም የኔትወርክ፣ የመረጃ ደህንነት፣ የአገልጋይ (Server) እና የቴክኖሎጂ ስራ ስለሚያከናውን ለዚያ ድካሙ ትክክለኛ ወጪውን የሚመጥን ተመጣጣኝ ክፍያ መውሰዱ በሸሪዓ የተፈቀደ ነው። ይህም በAAOIFI የሸሪዓ መመዘኛ ቁጥር 8 ላይ በግልጽ ተቀምጧል።
2. **ሪባ የሚሆነው መቼ ነው?፦** ክፍያው በተበደረው ገንዘብ መጠንና በጊዜ ብዛት ላይ ተመስርቶ የሚጨምር ተጨማሪ ትርፍ ሲሆን ነው።
3. ስለዚህ በዲጂታል ባንኪንግ ለሚደረግ ዝውውር የሚቆረጥ ቋሚና ተመጣጣኝ የአገልግሎት ክፍያ በሸሪዓ የተፈቀደና ምንም አይነት የሪባ ጥርጣሬ የሌለበት ነው።`,
    locale: "am",
    direction: "ltr",
    categories: ["islamic-finance", "muamalat"],
    tags: ["ኢስላሚክ-ባንክ", "ዲጂታል-ባንኪንግ", "AAOIFI", "ሙዓመላት"],
    published_at: "2024-02-18T12:00:00Z",
    updated_at: "2026-09-30T10:00:00Z",
  },
  {
    object: "fatwa",
    id: "fat_travel_salah",
    title: "በጉዞ ወቅት የሶላት ማሳጠርና ማሰባሰብ ድንጋጌዎች",
    slug: "shortening-combining-prayers-travel",
    summary: "የጉዞ ርቀት ምን ያህል ሲሆን ነው ሶላትን ማሳጠርና ማሰባሰብ (ጀምዕና ቀስር) የሚፈቀደው? ለምን ያህል ቀናትስ ይፈቀዳል?",
    question: "አንድ ሰው ለስራ ወይም ለጉብኝት ሲጓዝ ጀምዕና ቀስር ማድረግ የሚችለው ከስንት ኪሎሜትር ጉዞ በኋላ ነው? በሄደበት ቦታ ለስንት ቀናት ማሳጠር ይችላል?",
    answer: `### መልስ በኡስታዝ ሙሐመድ ፈረጅ

አላህ ለባሮቹ እዝነትንና እፎይታን የሻ ጌታ ነው። በጉዞ ወቅት ሶላትን ማሳጠርና ማሰባሰብ ከአላህ የተሰጠ ችሮታ (ሩኽሷህ) ነው።

1. **የጉዞ ርቀት፦**  
   በአብዛኞቹ የፊቅህ ሊቃውንት ዘንድ አንድ ጉዞ እንደ "ጉዞ (ሰፈር)" የሚቆጠረው ከ80 ኪሎሜትር በላይ ሲሆን ነው። በዘመናዊ አረዳድ አንድ ሰው ከከተማው ክልል ወጥቶ መንገደኛ ተብሎ የሚታወቅበት ርቀት ላይ ሲደርስ ይጀምራል።

2. **የሚሳጠሩ ሶላቶች (ቀስር)፦**  
   አራት ረከዓ የሆኑት ሶላቶች (ዙህር፣ ዐስር እና ዒሻእ) ወደ ሁለት ረከዓ ያጥራሉ። ፈጅርና መግሪብ ግን አይሳጠሩም።

3. **የሚሰባሰቡ ሶላቶች (ጀምዕ)፦**  
   ዙህርና ዐስርን በአንድ ላይ፤ መግሪብና ዒሻእን በአንድ ላይ ማሰባሰብ ይቻላል (ቀድሞ ወይም አዘግይቶ)።

4. **የቆይታ ጊዜ፦**  
   የሚቆይበትን ትክክለኛ ቀን የሚያውቅ ከሆነ (ለምሳሌ 4 ቀናት ወይም ከዚያ በታች) ማሳጠር ይችላል። ነገር ግን ከዚያ በላይ በቋሚነት ለመቀመጥ ካሰበ እንደ አገር ነዋሪ ሙሉውን ይሰግዳል።`,
    locale: "am",
    direction: "ltr",
    categories: ["fiqh", "salah", "travel"],
    tags: ["ሶላት", "ጉዞ", "ጀምዕ", "ቀስር"],
    published_at: "2023-12-10T15:00:00Z",
    updated_at: "2026-09-30T10:00:00Z",
  },
  {
    object: "fatwa",
    id: "fat_wudu_socks",
    title: "ትክክለኛ የውዱዕ አደራረግ እና ካልሲ ላይ የማበስ መስፈርቶች",
    slug: "proper-wudu-wiping-over-socks",
    summary: "በውዱዕ ወቅት እግርን ማጠብ እና ካልሲ ላይ ማበስ የሚፈቀደው በምን መስፈርቶች ነው?",
    question: "በብርድ ጊዜ ወይም በስራ ቦታ ካልሲ አውልቆ እግር መታጠብ ሲከብድ ካልሲ ላይ ማበስ (መስሕ) ይፈቀዳል ወይ? መስፈርቶቹስ ምንድናቸው?",
    answer: `### መልስ በኡስታዝ ሙሐመድ ፈረጅ

በካልሲ ወይም በቆዳ ጫማ (ኹፍ) ላይ ማበስ ከነቢዩ (ሰ.ዐ.ወ) በሰፊው የተረጋገጠ ሱናህና የዲናችን ምቾት ነው።

**ማሟላት ያለባቸው ቅድመ ሁኔታዎች፦**
1. **በሙሉ ውዱዕ መልበስ፦** ካልሲውን ከመልበሱ በፊት እግሩን ታጥቦ ሙሉ ውዱዕ ያደረገ መሆን አለበት።
2. **ንጹሕ መሆን፦** ካልሲው ከነጃሳ የጸዳ መሆን አለበት።
3. **የሚያጠራጥር ክፍተት የሌለውና እግርን የሚሸፍን መሆን፦** ተረከዝንና ቁርጭምጭሚትን የሚሸፍን መሆን አለበት።
4. **የጊዜ ገደብ፦**  
   - በአገር ውስጥ ላለ ሰው (ሙቂም)፦ ካበሰበት የመጀመሪያ ጊዜ ጀምሮ 24 ሰዓት (አንድ ቀንና አንድ ሌሊት)።
   - ለመንገደኛ (ሙሳፊር)፦ 72 ሰዓት (ሶስት ቀንና ሶስት ሌሊት)።
5. **የማበስ ስልት፦** እርጥብ እጅን ከካልሲው የላይኛው ክፍል (ከጣቶች ጀምሮ ወደ ላይ) ብቻ ማሳለፍ፤ የታችኛውን ክፍል ማበስ አይፈለግም።`,
    locale: "am",
    direction: "ltr",
    categories: ["fiqh", "wudu", "taharah"],
    tags: ["ውዱዕ", "ጣሃራ", "ካልሲ", "ሶላት"],
    published_at: "2023-11-22T09:30:00Z",
    updated_at: "2026-09-30T10:00:00Z",
  },
  {
    object: "fatwa",
    id: "fat_business_zakat",
    title: "የንግድ እና የኢንቨስትመንት እቃዎች ዘካ ስሌት መመሪያ",
    slug: "calculating-zakat-commercial-merchandise",
    summary: "በሱቅ ውስጥ የሚሸጡ እቃዎች እና የንግድ ካፒታል ዘካ እንዴት ይሰላል?",
    question: "አንድ ነጋዴ በሱቁ ውስጥ ያሉ ሸቀጦችንና የንግድ ካፒታሉን ዘካ እንዴት ነው የሚያሰላው? ዕዳ ካለበትስ ይቀነሳል ወይ?",
    answer: `### መልስ በኡስታዝ ሙሐመድ ፈረጅ

የንግድ እቃዎች (ዑሩዱት-ቲጃራህ) በሸሪዓ የዘካ ግዴታ ያለባቸው ሀብቶች ናቸው።

**ቀላሉ የስሌት ቀመር፦**
1. **የአመቱ መሟላት (ሐውል)፦** ንግዱ ከተጀመረ ወይም ኒሷብ ከሞላ አንድ አመት (የሂጅራ ካላንደር) ሲሞላው።
2. **የሸቀጦችን ዋጋ መገመት፦** በአመቱ መጨረሻ በሱቁ ውስጥ የሚሸጡትን እቃዎች በወቅታዊ የጅምላ ዋጋቸው (Current wholesale value) ማስላት።
3. **ጥሬ ገንዘብ ማከል፦** በካዝናና በባንክ ያለውን ዝግጁ ጥሬ ገንዘብ እንዲሁም በእርግጠኝነት የሚሰበሰብ የደንበኞች ውዝፍ እዳ (Receivables) መደመር።
4. **አስቸኳይ እዳን መቀነስ፦** በአመቱ ውስጥ መከፈል ያለበትን የቅርብ ጊዜ እዳ (Payables) መቀነስ።
5. **የመጨረሻ ሂሳብ፦** የተገኘው ቀሪ ሀብት ከኒሷብ (ከ85 ግራም ወርቅ ዋጋ) ጋር እኩል ወይም የሚበልጥ ከሆነ **2.5% (አንድ አርባኛ)** ለድሆች ዘካ ይወጣል።`,
    locale: "am",
    direction: "ltr",
    categories: ["islamic-finance", "zakat", "business"],
    tags: ["ዘካ", "ንግድ", "ስሌት", "ኒሷብ"],
    published_at: "2023-10-15T11:00:00Z",
    updated_at: "2026-09-30T10:00:00Z",
  },
];

import { getAllFatwas, getFatwaByIdOrSlug } from "@/lib/db/repository";

export async function getFatwas(params: { limit?: string; cursor?: string; locale?: string; category?: string[]; tag?: string[]; sort?: string } = {}): Promise<ListResponse<PublicFatwa>> {
  let list: PublicFatwa[] = [];
  try {
    list = getAllFatwas();
  } catch {
    list = AUTHENTIC_FATWAS;
  }
  if (!list || list.length === 0) {
    list = AUTHENTIC_FATWAS;
  }
  if (params.category && params.category.length > 0) {
    list = list.filter((f) => f.categories.some((c) => params.category!.includes(c)));
  }
  return {
    object: "list",
    data: list,
    has_more: false,
    next_cursor: null,
  };
}

export async function getFatwa(reference: string, locale?: string): Promise<PublicFatwa> {
  try {
    const found = getFatwaByIdOrSlug(reference);
    if (found) {
      return found;
    }
  } catch {
    // fallback
  }

  const foundFallback = AUTHENTIC_FATWAS.find(
    (f) => f.slug === reference || f.id === reference
  );
  if (foundFallback) {
    return foundFallback;
  }

  throw new Error(`Fatwa ${reference} not found`);
}
