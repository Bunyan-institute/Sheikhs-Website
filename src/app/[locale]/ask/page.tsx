'use client';
import { useState, use } from 'react';
import { useTranslations } from 'next-intl';
import { submitQuestion } from '@/lib/api/questions';
import { Loader2, CheckCircle, Send } from 'lucide-react';

export default function AskPage(props: { params: Promise<{ locale: string }> }) {
  const params = use(props.params);
  const t = useTranslations('ask');
  const [question, setQuestion] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<{id: string} | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (question.length < 10) {
       setError('Question must be at least 10 characters long.');
       return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const res = await submitQuestion({
        body: question,
        askerName: isAnonymous ? undefined : name,
        askerEmail: isAnonymous ? undefined : email,
        locale: params.locale
      });
      setSuccess({ id: res.id || 'FATWA-' + Math.random().toString(36).substring(2, 8).toUpperCase() });
    } catch {
      setError('An error occurred while submitting your question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Page Hero Header */}
      <section className="relative bg-[#0F3446] text-[#EDF2EE] py-16 overflow-hidden">
        <div className="absolute inset-0 lattice opacity-40 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-page mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-arabic text-sm text-[#E6D3A3] font-bold" dir="rtl">
                  {t('arabicBadge')}
                </span>
                <span className="star-sep" />
                <span className="text-xs uppercase tracking-widest text-[#E6D3A3]/80 font-semibold">
                  {t('subtitle')}
                </span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl text-[#EDF2EE]">
                {t('title')}
              </h1>
            </div>
            <p className="text-sm text-[#EDF2EE]/75 max-w-xl font-sans leading-relaxed">
              {t('description')}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-page mx-auto px-4 sm:px-6 py-12 lg:py-16">
        {success ? (
          <div className="max-w-2xl mx-auto bg-white border border-[#1D6A5A]/30 rounded-2xl p-8 sm:p-12 text-center shadow-xs">
             <CheckCircle className="w-16 h-16 text-[#1D6A5A] mx-auto mb-4" />
             <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#14262E] mb-3">Inquiry Successfully Received</h2>
             <p className="text-sm text-[#14262E]/70 mb-4">
               Your question has been logged with reference number: <strong className="text-[#1D6A5A]">#{success.id}</strong>.
             </p>
             <p className="text-xs text-[#14262E]/60 max-w-md mx-auto leading-relaxed">
               Inquiries are reviewed systematically in accordance with authentic Sharia methodology. All details are kept confidential.
             </p>
             <button 
               onClick={() => { setSuccess(null); setQuestion(''); }}
               className="mt-8 px-6 py-2.5 bg-[#BF9A45] hover:bg-[#E6D3A3] text-[#0A2532] rounded-full text-xs font-semibold transition-colors shadow-sm"
             >
               Submit Another Inquiry
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Guidance Sidebar */}
            <aside className="lg:col-span-4 bg-white border border-[#14262E]/10 rounded-2xl p-6 sm:p-7 space-y-6 shadow-xs">
              <h3 className="font-display text-lg font-bold text-[#14262E] border-b border-[#14262E]/10 pb-3">
                Submission Etiquette (آداب الاستفتاء)
              </h3>
              
              <div className="space-y-4 text-xs text-[#14262E]/75 leading-relaxed">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#EDF2EE] border border-[#BF9A45]/30 text-[#1D6A5A] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <p><strong className="text-[#14262E]">Clarity &amp; Facts:</strong> Describe the scenario objectively with essential circumstances without unnecessary length.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#EDF2EE] border border-[#BF9A45]/30 text-[#1D6A5A] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <p><strong className="text-[#14262E]">Authentic Grounding:</strong> Answers are referenced directly from the Quran, authentic Sunnah, and classical consensus.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#EDF2EE] border border-[#BF9A45]/30 text-[#1D6A5A] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <p><strong className="text-[#14262E]">Confidentiality:</strong> Inquiries can be submitted anonymously. Identities are strictly protected.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#EDF2EE] border border-[#BF9A45]/30 text-xs text-[#14262E]/75 space-y-1.5">
                <span className="font-bold text-[#1D6A5A] block">Ethical Banking &amp; Sharia Audit</span>
                <p className="text-[11px] leading-relaxed">For formal Sharia compliance reviews or banking advisory matters, contact the Sheikh&apos;s secretariat directly via the contact page.</p>
              </div>
            </aside>

            {/* Question Form */}
            <div className="lg:col-span-8">
              <form onSubmit={handleSubmit} className="bg-white border border-[#14262E]/10 rounded-2xl p-6 sm:p-8 shadow-xs">
                <div className="mb-5">
                  <label htmlFor="question" className="block text-xs font-bold text-[#14262E] uppercase tracking-wider mb-2">
                    {t('questionLabel')} <span className="text-[#BF9A45]">*</span>
                  </label>
                  <textarea
                    id="question"
                    required
                    minLength={10}
                    maxLength={4000}
                    rows={6}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full border border-[#14262E]/15 rounded-xl px-4 py-3 focus:outline-none focus:border-[#1D6A5A] bg-[#EDF2EE]/50 text-[#14262E] text-sm"
                    placeholder={t('questionPlaceholder')}
                  />
                  <div className="flex justify-between mt-1 text-[11px] text-[#14262E]/50">
                     <span>Minimum 10 characters</span>
                     <span>{question.length} / 4000</span>
                  </div>
                </div>

                <div className="mb-5">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 text-[#1D6A5A] border-[#14262E]/20 rounded"
                    />
                    <span className="ms-2.5 text-xs font-medium text-[#14262E]">Submit anonymously (No name or email will be recorded)</span>
                  </label>
                </div>

                {!isAnonymous && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold text-[#14262E] mb-1.5">{t('nameLabel')}</label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-[#14262E]/15 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#1D6A5A] bg-[#EDF2EE]/50 text-[#14262E] text-sm"
                        placeholder={t('namePlaceholder')}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold text-[#14262E] mb-1.5">{t('emailLabel')}</label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-[#14262E]/15 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#1D6A5A] bg-[#EDF2EE]/50 text-[#14262E] text-sm"
                        placeholder={t('emailPlaceholder')}
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
                    {error}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || question.length < 10}
                    className="w-full sm:w-auto bg-[#BF9A45] hover:bg-[#E6D3A3] text-[#0A2532] font-semibold py-3 px-8 rounded-full text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t('submitting')}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-[#0A2532]" />
                        <span>{t('submit')}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}