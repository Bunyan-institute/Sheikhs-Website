'use client';
import { useState, use } from 'react';
import { submitQuestion } from '@/lib/api/questions';
import { Loader2, CheckCircle } from 'lucide-react';

export default function AskPage(props: { params: Promise<{ locale: string }> }) {
  const params = use(props.params);
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
      setSuccess({ id: res.id || 'REF-' + Math.random().toString(36).substring(2, 9).toUpperCase() });
    } catch (err) {
      setError('An error occurred while submitting your question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-12 md:py-20">
      <header className="mb-12 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs uppercase font-bold text-[#1B5E20] tracking-wider mb-2">
          <span>۞ Fatwa & Advisory Desk</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-heading text-[#2D3436] font-bold tracking-tight mb-4">
          Ask the Sheikh
        </h1>
        <p className="text-lg md:text-xl text-[#636E72] font-body">
          Submit your questions regarding Islamic jurisprudence, creed, ethical finance, or spiritual guidance.
        </p>
      </header>

      {success ? (
        <div className="max-w-2xl mx-auto bg-[#FAF8F5] border border-[#1B5E20]/30 rounded-lg p-6 sm:p-8 md:p-12 text-center shadow-xs">
           <CheckCircle className="w-16 h-16 text-[#1B5E20] mx-auto mb-6" />
           <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-4">Question Received</h2>
           <p className="text-base sm:text-lg text-[#636E72] mb-6">
             Your question has been received. Reference: <strong className="text-[#2D3436]">#{success.id}</strong>.
           </p>
           <p className="text-[#636E72] font-body text-sm sm:text-base">
             The Sheikh&apos;s office reviews inquiries in due course. Thank you for reaching out.
           </p>
           <button 
             onClick={() => { setSuccess(null); setQuestion(''); }}
             className="mt-8 px-6 py-2.5 border border-[#E0D8CE] bg-white rounded-md text-[#2D3436] font-medium hover:bg-[#FAF8F5] transition-colors w-full sm:w-auto"
           >
             Submit Another Question
           </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Scholarly Guidance Sidebar */}
          <aside className="lg:col-span-4 bg-[#FAF8F5] border border-[#E0D8CE] rounded-lg p-6 sm:p-8 space-y-6">
            <h3 className="font-heading text-lg font-bold text-[#2D3436] border-b border-[#E0D8CE] pb-3">
              Adab & Submission Guidelines
            </h3>
            
            <div className="space-y-4 text-sm text-[#636E72] leading-relaxed">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#1B5E20]/10 text-[#1B5E20] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                <p><strong className="text-[#2D3436]">Clarity & Specifics:</strong> State your question clearly, mentioning relevant background details without unnecessary length.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#1B5E20]/10 text-[#1B5E20] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                <p><strong className="text-[#2D3436]">Sharia Authenticity:</strong> All answers are grounded in the Quran, authentic Sunnah, and classical consensus.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#1B5E20]/10 text-[#1B5E20] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                <p><strong className="text-[#2D3436]">Confidentiality:</strong> Inquiries may be submitted anonymously. Personal identifiers are never disclosed.</p>
              </div>
            </div>

            <div className="p-4 rounded-md bg-white border border-[#E0D8CE] text-xs text-[#636E72] space-y-2">
              <span className="font-bold text-[#1B5E20] block">Specialized Guidance</span>
              <p>For urgent Sharia audit or ethical banking consultations with Wegagen Bank, you may also reach the scholarly office directly via the contact page.</p>
            </div>
          </aside>

          {/* Question Form */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="bg-white border border-[#E0D8CE] rounded-lg p-6 sm:p-8 md:p-10 shadow-xs">
          <div className="mb-6">
            <label htmlFor="question" className="block text-sm font-bold text-[#2D3436] mb-2">
              Your Question <span className="text-red-500">*</span>
            </label>
            <textarea
              id="question"
              required
              minLength={10}
              maxLength={4000}
              rows={6}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full border border-[#E0D8CE] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] bg-[#FAF8F5]/50 text-[#2D3436]"
              placeholder="Type your question here (max 4000 characters)..."
            />
            <div className="flex justify-between mt-1 text-xs text-[#636E72]">
               <span>Minimum 10 characters</span>
               <span>{question.length} / 4000</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 text-[#1B5E20] border-[#E0D8CE] rounded focus:ring-[#1B5E20]"
              />
              <span className="ms-2 text-sm font-medium text-[#2D3436]">Submit anonymously</span>
            </label>
          </div>

          {!isAnonymous && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-[#2D3436] mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-[#E0D8CE] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] bg-[#FAF8F5]/50 text-[#2D3436]"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-[#2D3436] mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-[#E0D8CE] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] bg-[#FAF8F5]/50 text-[#2D3436]"
                  placeholder="For follow-up (optional)"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || question.length < 10}
              className="w-full sm:w-auto bg-[#1B5E20] hover:bg-[#154a19] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-md transition-colors flex items-center justify-center shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 me-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Question'
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
