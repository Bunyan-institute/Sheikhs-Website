/** Text of the push notifications, in the language each device was subscribed with. No personal details on the lock screen. */
export type PushKind = "inquiry" | "registration" | "enrollment" | "certificate" | "test";

type Locale = "en" | "ar" | "am" | "om";
const TEXTS: Record<PushKind, Record<Locale, { title: string; body: string }>> = {
  inquiry: {
    en: { title: "New question", body: "Open the app to read and answer it." },
    ar: { title: "سؤال جديد", body: "افتح التطبيق لقراءته والإجابة عنه." },
    am: { title: "አዲስ ጥያቄ", body: "ለማንበብና ለመመለስ መተግበሪያውን ይክፈቱ።" },
    om: { title: "Gaaffii haaraa", body: "Dubbisuu fi deebisuuf appii bani." },
  },
  registration: {
    en: { title: "New event registration", body: "" },
    ar: { title: "تسجيل جديد في فعالية", body: "" },
    am: { title: "አዲስ የፕሮግራም ምዝገባ", body: "" },
    om: { title: "Galmeen taatee haaraa", body: "" },
  },
  enrollment: {
    en: { title: "New course enrollment", body: "" },
    ar: { title: "تسجيل جديد في دورة", body: "" },
    am: { title: "አዲስ የኮርስ ምዝገባ", body: "" },
    om: { title: "Galmeen koorsii haaraa", body: "" },
  },
  certificate: {
    en: { title: "A student passed the exam", body: "" },
    ar: { title: "طالب اجتاز الاختبار", body: "" },
    am: { title: "አንድ ተማሪ ፈተና አልፏል", body: "" },
    om: { title: "Barattoonni tokko qormaata darbe", body: "" },
  },
  test: {
    en: { title: "Notifications are working", body: "You will be told here about new questions and sign-ups." },
    ar: { title: "الإشعارات تعمل", body: "ستصلك هنا تنبيهات عن الأسئلة الجديدة والتسجيلات." },
    am: { title: "ማሳወቂያዎች እየሰሩ ነው", body: "ስለ አዳዲስ ጥያቄዎችና ምዝገባዎች እዚህ ይነገርዎታል።" },
    om: { title: "Beeksisni ni hojjeta", body: "Gaaffilee fi galmeewwan haaraa ilaalchisee as ni beeksifamta." },
  },
};

export function pushMessage(kind: PushKind, locale: string | null | undefined, detail?: string) {
  const l: Locale = locale === "en" || locale === "ar" || locale === "am" || locale === "om" ? locale : "am";
  const base = TEXTS[kind][l];
  return { title: base.title, body: (detail?.trim() ? detail.trim().slice(0, 120) : base.body) };
}
