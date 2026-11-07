'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { submitQuestion } from '@/lib/api/questions';
import { CheckCircle, Send, AlertCircle, HelpCircle } from 'lucide-react';

export function AskForm({ locale }: { locale: string }) {
  const t = useTranslations('ask');
  const [question, setQuestion] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ id: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (question.length < 10) {
      setError('Question must be at least 10 characters long.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const res = await submitQuestion({
        body: question,
        askerName: isAnonymous ? undefined : name,
        askerEmail: isAnonymous ? undefined : email,
        locale,
      });

      if (res && res.id) {
        setSuccess({ id: res.id });
      } else {
        throw new Error('Failed to submit');
      }
    } catch {
      setError('An error occurred while submitting your question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto bg-white border border-[#1B6A50]/30 rounded-2xl p-6 sm:p-12 text-center shadow-xs">
        <CheckCircle className="w-14 h-14 sm:w-16 sm:h-16 text-[#1B6A50] mx-auto mb-4" />
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#0F241C] mb-3">Inquiry Successfully Received</h2>
        <p className="text-xs sm:text-sm text-[#0F241C]/70 mb-4">
          Your question has been logged with reference number: <strong className="text-[#1B6A50]">#{success.id}</strong>.
        </p>
        <p className="text-xs text-[#0F241C]/60 max-w-md mx-auto leading-relaxed">
          Inquiries are reviewed systematically in accordance with authentic Sharia methodology. All details are kept confidential.
        </p>
        <button 
          onClick={() => { setSuccess(null); setQuestion(''); }}
          className="mt-6 sm:mt-8 px-6 py-2.5 bg-[#BF9A45] hover:bg-[#E6D3A3] text-[#072118] rounded-full text-xs font-bold transition-colors shadow-sm min-h-[40px]"
        >
          Submit Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* Guidance Sidebar */}
      <aside className="lg:col-span-4 bg-white border border-[#0F241C]/10 rounded-2xl p-5 sm:p-7 space-y-6 shadow-xs">
        <h3 className="font-display text-base sm:text-lg font-bold text-[#0F241C] border-b border-[#0F241C]/10 pb-3">
          Submission Etiquette (آداب الاستفتاء)
        </h3>
        
        <div className="space-y-4 text-xs text-[#0F241C]/75 leading-relaxed">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#EDF4F0] border border-[#BF9A45]/30 text-[#1B6A50] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
            <p><strong className="text-[#0F241C]">Clarity &amp; Facts:</strong> Describe the scenario objectively with essential circumstances without unnecessary length.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#EDF4F0] border border-[#BF9A45]/30 text-[#1B6A50] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
            <p><strong className="text-[#0F241C]">Authentic Grounding:</strong> Answers are referenced directly from the Quran, authentic Sunnah, and classical consensus.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#EDF4F0] border border-[#BF9A45]/30 text-[#1B6A50] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
            <p><strong className="text-[#0F241C]">Confidentiality:</strong> Inquiries can be submitted anonymously. Identities are strictly protected.</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#EDF4F0] border border-[#BF9A45]/30 text-xs text-[#0F241C]/75 space-y-1.5">
          <span className="font-bold text-[#1B6A50] block">Ethical Banking &amp; Sharia Audit</span>
          <p className="text-[11px] leading-relaxed">For formal Sharia compliance reviews or banking advisory matters, contact the Sheikh&apos;s secretariat directly via the contact page.</p>
        </div>
      </aside>

      {/* Question Form */}
      <div className="lg:col-span-8">
        <form onSubmit={handleSubmit} className="bg-white border border-[#0F241C]/10 rounded-2xl p-5 sm:p-8 shadow-xs">
          <div className="mb-5">
            <label htmlFor="question" className="block text-xs font-bold text-[#0F241C] uppercase tracking-wider mb-2">
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
              className="w-full border border-[#0F241C]/15 rounded-xl px-4 py-3 focus:outline-none focus:border-[#1B6A50] bg-[#EDF4F0]/40 text-[#0F241C] text-sm"
              placeholder={t('questionPlaceholder')}
            />
            <div className="flex justify-between mt-1 text-[11px] text-[#0F241C]/50">
               <span>Minimum 10 characters</span>
               <span>{question.length} / 4000</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-[#0F241C] uppercase tracking-wider mb-2">
                {t('nameLabel')}
              </label>
              <input
                type="text"
                id="name"
                disabled={isAnonymous}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-[#0F241C]/15 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#1B6A50] bg-[#EDF4F0]/40 text-[#0F241C] text-sm disabled:opacity-50"
                placeholder={t('namePlaceholder')}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-[#0F241C] uppercase tracking-wider mb-2">
                {t('emailLabel')}
              </label>
              <input
                type="email"
                id="email"
                disabled={isAnonymous}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#0F241C]/15 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#1B6A50] bg-[#EDF4F0]/40 text-[#0F241C] text-sm disabled:opacity-50"
                placeholder={t('emailPlaceholder')}
              />
            </div>
          </div>

          <div className="mb-6 flex items-center gap-2">
            <input
              type="checkbox"
              id="isAnonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded text-[#1B6A50] focus:ring-[#1B6A50]"
            />
            <label htmlFor="isAnonymous" className="text-xs text-[#0F241C]/80 cursor-pointer">
              Submit question anonymously
            </label>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#0F241C]/10">
            <div className="flex items-center gap-2 text-xs text-[#0F241C]/60">
              <HelpCircle className="w-4 h-4 text-[#BF9A45] shrink-0" />
              <span>Inquiries of general benefit may be published without personal names.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-[#BF9A45] hover:bg-[#E6D3A3] text-[#072118] font-bold py-3 px-8 rounded-full text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-sm min-h-[44px]"
            >
              {isSubmitting ? (
                <span>Sending inquiry...</span>
              ) : (
                <>
                  <span>Submit Question</span>
                  <Send className="w-3.5 h-3.5 text-[#072118]" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
