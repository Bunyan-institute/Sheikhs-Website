'use client';
import { useState, use } from 'react';
import { useTranslations } from 'next-intl';
import { submitQuestion } from '@/lib/api/questions';
import { Loader2, CheckCircle, HelpCircle, ShieldCheck, BookOpen, Send } from 'lucide-react';

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
    <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-10 md:py-16">
      {/* Classical Scholarly Header */}
      <header className="mb-10 pb-6 border-b border-[#E6E0D8]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-arabic text-sm text-[#1A4D2E] font-bold" dir="rtl">
                {t('arabicBadge')}
              </span>
              <span className="text-[#B8860B]">۞</span>
              <span className="text-xs uppercase tracking-widest text-[#8C6D23] font-semibold">
                {t('subtitle')}
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#2D3436]">
              {t('title')}
            </h1>
          </div>
          <p className="text-sm text-[#555E61] max-w-xl font-body">
            {t('description')}
          </p>
        </div>
      </header>

      {success ? (
        <div className="max-w-2xl mx-auto bg-white border border-[#1A4D2E]/30 rounded-[4px] p-6 sm:p-10 text-center">
           <CheckCircle className="w-14 h-14 text-[#1A4D2E] mx-auto mb-4" />
           <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-3">Inquiry Successfully Received</h2>
           <p className="text-sm text-[#555E61] mb-4">
             Your question has been logged with reference number: <strong className="text-[#1A4D2E]">#{success.id}</strong>.
           </p>
           <p className="text-xs text-[#7A8285] max-w-md mx-auto leading-relaxed">
             Inquiries are reviewed systematically in accordance with authentic Sharia methodology. All details are kept confidential.
           </p>
           <button 
             onClick={() => { setSuccess(null); setQuestion(''); }}
             className="mt-6 px-6 py-2.5 border border-[#E6E0D8] bg-[#FAF8F5] rounded-[3px] text-[#2D3436] text-xs font-semibold hover:bg-white transition-colors"
           >
             Submit Another Inquiry
           </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Scholarly Guidance Sidebar */}
          <aside className="lg:col-span-4 bg-white border border-[#E6E0D8] rounded-[4px] p-6 space-y-6">
            <h3 className="font-heading text-base font-bold text-[#2D3436] border-b border-[#E6E0D8] pb-3">
              Submission Etiquette (آداب الاستفتاء)
            </h3>
            
            <div className="space-y-4 text-xs text-[#555E61] leading-relaxed">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-[2px] bg-[#FAF8F5] border border-[#E6E0D8] text-[#1A4D2E] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                <p><strong className="text-[#2D3436]">Clarity &amp; Facts:</strong> Describe the scenario objectively with essential circumstances without unnecessary length.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-[2px] bg-[#FAF8F5] border border-[#E6E0D8] text-[#1A4D2E] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                <p><strong className="text-[#2D3436]">Authentic Grounding:</strong> Answers are referenced directly from the Quran, authentic Sunnah, and classical consensus.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-[2px] bg-[#FAF8F5] border border-[#E6E0D8] text-[#1A4D2E] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                <p><strong className="text-[#2D3436]">Confidentiality:</strong> Inquiries can be submitted anonymously. Identities are strictly protected.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-[3px] bg-[#FAF8F5] border border-[#E6E0D8] text-xs text-[#555E61] space-y-1.5">
              <span className="font-bold text-[#1A4D2E] block">Ethical Banking &amp; Sharia Audit</span>
              <p className="text-[11px] leading-relaxed">For formal Sharia compliance reviews or banking advisory matters, contact the Sheikh&apos;s secretariat directly via the contact page.</p>
            </div>
          </aside>

          {/* Question Form */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="bg-white border border-[#E6E0D8] rounded-[4px] p-6 sm:p-8">
              <div className="mb-5">
                <label htmlFor="question" className="block text-xs font-bold text-[#2D3436] uppercase tracking-wider mb-2">
                  {t('questionLabel')} <span className="text-[#8C6D23]">*</span>
                </label>
                <textarea
                  id="question"
                  required
                  minLength={10}
                  maxLength={4000}
                  rows={6}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full border border-[#E6E0D8] rounded-[3px] px-4 py-3 focus:outline-none focus:border-[#1A4D2E] bg-[#FAF8F5] text-[#2D3436] text-sm"
                  placeholder={t('questionPlaceholder')}
                />
                <div className="flex justify-between mt-1 text-[11px] text-[#7A8285]">
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
                    className="w-4 h-4 text-[#1A4D2E] border-[#E6E0D8] rounded"
                  />
                  <span className="ms-2 text-xs font-semibold text-[#2D3436]">Submit anonymously (No name or email will be recorded)</span>
                </label>
              </div>

              {!isAnonymous && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-xs font-bold text-[#2D3436] mb-1.5">{t('nameLabel')}</label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-[#E6E0D8] rounded-[3px] px-3.5 py-2.5 focus:outline-none focus:border-[#1A4D2E] bg-[#FAF8F5] text-[#2D3436] text-sm"
                      placeholder={t('namePlaceholder')}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-[#2D3436] mb-1.5">{t('emailLabel')}</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-[#E6E0D8] rounded-[3px] px-3.5 py-2.5 focus:outline-none focus:border-[#1A4D2E] bg-[#FAF8F5] text-[#2D3436] text-sm"
                      placeholder={t('emailPlaceholder')}
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-[3px] text-xs">
                  {error}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || question.length < 10}
                  className="w-full sm:w-auto bg-[#1A4D2E] hover:bg-[#143d24] disabled:opacity-50 text-white font-semibold py-2.5 px-7 rounded-[4px] text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t('submitting')}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-[#B8860B]" />
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
  );
}
