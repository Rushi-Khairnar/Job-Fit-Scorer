import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  RotateCcw, 
  Printer, 
  CheckCircle2, 
  Briefcase, 
  Building2,
  FileDown,
  Loader2
} from 'lucide-react';
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  AlignmentType, 
  convertInchesToTwip 
} from 'docx';
import { jsPDF } from 'jspdf';

interface CoverLetterGeneratorProps {
  initialRole?: string;
  userSkills?: string[];
}

export const CoverLetterGenerator: React.FC<CoverLetterGeneratorProps> = ({
  initialRole = 'Data Scientist',
  userSkills = ['Python', 'SQL', 'Machine Learning', 'Data Analysis']
}) => {
  const [candidateName, setCandidateName] = useState('Alex Johnson');
  const [candidateEmail, setCandidateEmail] = useState('alex.johnson@example.com');
  const [candidatePhone, setCandidatePhone] = useState('+91 98765 43210');
  const [targetCompany, setTargetCompany] = useState('Acme Technologies');
  const [targetRole, setTargetRole] = useState(initialRole);
  const [tone, setTone] = useState<'confident' | 'innovative' | 'formal'>('confident');
  const [copied, setCopied] = useState(false);
  const [isGeneratingWord, setIsGeneratingWord] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Generate dynamic text based on fields
  const generateLetterText = () => {
    const topSkillsList = userSkills.length > 0 ? userSkills.slice(0, 4).join(', ') : 'Python, SQL, System Architecture';

    if (tone === 'innovative') {
      return `Dear Hiring Team at ${targetCompany},

I have been closely following ${targetCompany}'s engineering momentum and product scaling milestones. With hands-on technical proficiency across ${topSkillsList}, I specialize in translating cutting-edge architecture into measurable business growth.

Throughout my technical journey, I have focused on solving critical bottlenecks. Whether designing resilient event-driven data pipelines or building responsive, user-facing systems, I balance high delivery velocity with zero-downtime reliability. Your team's commitment to bold technological iteration aligns directly with the environments where I deliver my strongest work.

I am enthusiastic about the opportunity to contribute directly to ${targetCompany}'s roadmap as your next ${targetRole}. I would welcome the chance to discuss how my technical background and problem-solving framework can accelerate your product goals.

Sincerely,
${candidateName}`;
    }

    if (tone === 'formal') {
      return `Dear Hiring Manager,

I am writing to express my formal interest in the ${targetRole} position at ${targetCompany}. With a comprehensive background in ${topSkillsList} and a proven track record of architecting scalable solutions, I am confident in my capacity to add immediate value to your organization.

In my previous roles, I have consistently taken ownership of complex engineering initiatives, translating ambiguous business requirements into high-performance, maintainable software architectures. My technical rigor in automated testing, scalable system design, and cross-functional stakeholder collaboration has consistently driven quantifiable operational efficiencies.

I welcome the opportunity to discuss my qualifications in greater detail and explore how my experience aligns with the strategic objectives of ${targetCompany}.

Respectfully yours,
${candidateName}`;
    }

    // Default: Confident & Direct
    return `Dear ${targetCompany} Hiring Team,

I am reaching out to submit my application for the ${targetRole} opening. Having spent the past few years architecting scalable workflows using ${topSkillsList}, I build high-impact technical systems that directly move top-line business metrics.

What excites me about ${targetCompany} is your team's standard of execution and clear product market fit. At my previous team, I spearheaded core optimization initiatives that slashed latency by over 35% while expanding system capacity across multi-region deployments. I enjoy taking full end-to-end ownership of complex engineering problems from ideation through production monitoring.

I look forward to discussing how my background in ${topSkillsList} can help ${targetCompany} scale its engineering milestones this year.

Best regards,
${candidateName}`;
  };

  const [letterContent, setLetterContent] = useState(generateLetterText());

  const handleRegenerate = () => {
    setLetterContent(generateLetterText());
    showToast('Regenerated cover letter with updated tone!');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letterContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast('Copied letter to clipboard!');
  };

  // Direct Word (.docx) download
  const handleDownloadWord = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsGeneratingWord(true);
      const paragraphs = letterContent.split('\n\n').map(para => {
        return new Paragraph({
          spacing: { after: 200, line: 276 },
          children: [
            new TextRun({
              text: para,
              size: 22, // 11pt
              font: "Calibri",
              color: "1F2937"
            })
          ]
        });
      });

      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: convertInchesToTwip(0.8),
                  right: convertInchesToTwip(0.8),
                  bottom: convertInchesToTwip(0.8),
                  left: convertInchesToTwip(0.8),
                },
              },
            },
            children: [
              new Paragraph({
                spacing: { after: 60 },
                children: [
                  new TextRun({
                    text: candidateName.toUpperCase(),
                    bold: true,
                    size: 28,
                    font: "Calibri",
                    color: "111827"
                  })
                ]
              }),
              new Paragraph({
                spacing: { after: 280 },
                children: [
                  new TextRun({
                    text: `${candidateEmail}   |   ${candidatePhone}`,
                    size: 18,
                    font: "Calibri",
                    color: "4B5563"
                  })
                ]
              }),
              ...paragraphs
            ]
          }
        ]
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const fileName = `${candidateName.replace(/\s+/g, '_')}_Cover_Letter_${targetCompany.replace(/\s+/g, '_')}.docx`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`Downloaded ${fileName} (Word)!`);
    } catch (err) {
      console.error('Word export failed:', err);
      showToast('Error downloading Word file.');
    } finally {
      setIsGeneratingWord(false);
    }
  };

  // Direct PDF download
  const handleDownloadPdf = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsGeneratingPdf(true);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.text(candidateName.toUpperCase(), 54, 60);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`${candidateEmail}   |   ${candidatePhone}`, 54, 76);

      pdf.setDrawColor(203, 213, 225);
      pdf.setLineWidth(1);
      pdf.line(54, 88, 540, 88);

      pdf.setFontSize(11);
      pdf.setTextColor(30, 41, 59);

      const splitText = pdf.splitTextToSize(letterContent, 486);
      pdf.text(splitText, 54, 115);

      const fileName = `${candidateName.replace(/\s+/g, '_')}_Cover_Letter_${targetCompany.replace(/\s+/g, '_')}.pdf`;
      pdf.save(fileName);
      showToast(`Downloaded ${fileName} (PDF)!`);
    } catch (err) {
      console.error('PDF export failed:', err);
      showToast('Error downloading PDF file.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-2.5 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-700 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 text-xs font-semibold mb-2.5 border border-cyan-200 dark:border-cyan-800">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tailored Outreach <span className="opacity-70 font-normal">[Word & PDF Downloads]</span></span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
              Cover Letter Writer
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1 max-w-2xl">
              Generate personalized cover letters tailored to your target company and skills. Download directly in Microsoft Word (.docx) or PDF (.pdf).
            </p>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 transition-colors flex items-center cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadWord}
              disabled={isGeneratingWord}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white shadow-xs transition-colors flex items-center cursor-pointer"
              title="Download as Microsoft Word (.docx)"
            >
              {isGeneratingWord ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : (
                <FileDown className="w-3.5 h-3.5 mr-1.5" />
              )}
              <span>Word (.docx)</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white shadow-xs transition-colors flex items-center cursor-pointer"
              title="Download as PDF (.pdf)"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 mr-1.5" />
              )}
              <span>PDF (.pdf)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor & Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Parameters */}
        <div className="lg:col-span-5 bg-white dark:bg-neutral-800 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-xs space-y-4">
          <h3 className="font-bold text-neutral-900 dark:text-white text-sm flex items-center">
            <Building2 className="w-4 h-4 mr-2 text-cyan-600" /> Letter Parameters
          </h3>

          <div>
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
              Your Full Name
            </label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
                Your Email
              </label>
              <input
                type="email"
                value={candidateEmail}
                onChange={(e) => setCandidateEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={candidatePhone}
                onChange={(e) => setCandidatePhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
              Target Company Name
            </label>
            <input
              type="text"
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
              Target Job Title
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
              Communication Tone
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['confident', 'innovative', 'formal'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold capitalize transition-all ${
                    tone === t
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs'
                      : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleRegenerate}
            className="w-full py-2.5 bg-neutral-900 dark:bg-cyan-600 hover:bg-neutral-800 dark:hover:bg-cyan-700 text-white rounded-xl text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-2" />
            <span>Regenerate Letter Content</span>
          </button>
        </div>

        {/* Live Preview Sheet */}
        <div className="lg:col-span-7 bg-white dark:bg-neutral-800 rounded-3xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-700 pb-3">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Document Preview
            </span>
            <span className="text-xs text-neutral-500">
              {letterContent.trim().split(/\s+/).length} words
            </span>
          </div>

          <textarea
            rows={15}
            value={letterContent}
            onChange={(e) => setLetterContent(e.target.value)}
            className="w-full p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed outline-none focus:ring-2 focus:ring-cyan-500 font-sans"
          />

          <div className="pt-2 flex items-center justify-between text-xs text-neutral-500">
            <span>You can freely edit the text directly in the box above before exporting.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
