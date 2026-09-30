import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Plus, 
  Trash2, 
  Sparkles, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Linkedin, 
  CheckCircle2,
  Eye,
  Edit3,
  Loader2,
  FileDown,
  ArrowLeft
} from 'lucide-react';
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  AlignmentType, 
  BorderStyle,
  convertInchesToTwip 
} from 'docx';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface ResumeBuilderProps {
  initialSkills?: string[];
  initialRole?: string;
  onBackToHome?: () => void;
  onBack?: () => void;
  backButtonLabel?: string;
}

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  duration: string;
  bullets: string;
}

interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
  details: string;
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({
  initialSkills = [],
  initialRole = 'Data Scientist',
  onBackToHome,
  onBack,
  backButtonLabel
}) => {
  // Personal Info
  const [fullName, setFullName] = useState('Alex Johnson');
  const [jobTitle, setJobTitle] = useState(initialRole || 'Data Scientist');
  const [email, setEmail] = useState('alex.johnson@example.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [location, setLocation] = useState('Bangalore, India');
  const [portfolio, setPortfolio] = useState('github.com/alexjohnson');
  const [linkedin, setLinkedin] = useState('linkedin.com/in/alexjohnson');

  // Summary
  const [summary, setSummary] = useState(
    `Analytical and results-driven ${initialRole || 'Technical Professional'} with a solid foundation in data science, predictive modeling, and software engineering. Demonstrated ability to translate complex data into actionable business intelligence.`
  );

  // Skills
  const [skills, setSkills] = useState<string[]>(
    initialSkills.length > 0 
      ? initialSkills 
      : ['Python', 'SQL', 'Machine Learning', 'Pandas', 'Data Analysis', 'Tableau', 'Git']
  );
  const [newSkillInput, setNewSkillInput] = useState('');

  // Experience
  const [experiences, setExperiences] = useState<ExperienceItem[]>([
    {
      id: '1',
      role: `Associate ${initialRole || 'Developer'}`,
      company: 'TechCorp Solutions',
      duration: '2023 – Present',
      bullets: '• Developed end-to-end data pipelines processing over 50,000 records daily with 99.4% accuracy.\n• Collaborated with cross-functional product teams to implement automated reporting dashboards.\n• Optimized database query runtimes by 35% through index restructuring.'
    },
    {
      id: '2',
      role: 'Junior Project Intern',
      company: 'Innovate Labs',
      duration: '2022 – 2023',
      bullets: '• Assisted in exploratory data analysis and feature engineering for customer churn prediction.\n• Built reproducible Jupyter notebooks and interactive documentation for team stakeholders.'
    }
  ]);

  // Education
  const [educations, setEducations] = useState<EducationItem[]>([
    {
      id: '1',
      degree: 'B.Tech / B.Sc in Computer Science & Data Science',
      institution: 'National Institute of Technology',
      year: '2019 – 2023',
      details: 'First Class with Distinction (GPA: 8.8/10). Relevant Coursework: Algorithms, Database Management, Machine Learning.'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isGeneratingWord, setIsGeneratingWord] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (onBackToHome) {
      onBackToHome();
    }
  };

  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(prev => [...prev, trimmed]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const handleAddExperience = () => {
    const newExp: ExperienceItem = {
      id: Date.now().toString(),
      role: 'Role / Project Title',
      company: 'Organization Name',
      duration: 'Year – Year',
      bullets: '• Key achievement or responsibility.\n• Impact or metric delivered.'
    };
    setExperiences(prev => [...prev, newExp]);
  };

  const handleRemoveExperience = (id: string) => {
    setExperiences(prev => prev.filter(e => e.id !== id));
  };

  const handleUpdateExperience = (id: string, field: keyof ExperienceItem, value: string) => {
    setExperiences(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const handleAddEducation = () => {
    const newEdu: EducationItem = {
      id: Date.now().toString(),
      degree: 'Degree / Program Title',
      institution: 'University / Institute Name',
      year: 'Graduation Year',
      details: 'Major, Honors, or notable academic achievements.'
    };
    setEducations(prev => [...prev, newEdu]);
  };

  const handleRemoveEducation = (id: string) => {
    setEducations(prev => prev.filter(e => e.id !== id));
  };

  const handleUpdateEducation = (id: string, field: keyof EducationItem, value: string) => {
    setEducations(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const handlePrint = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    window.print();
  };

  const handleDownloadWord = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      setIsGeneratingWord(true);

      const createSectionHeading = (title: string) => {
        return new Paragraph({
          spacing: { before: 240, after: 120 },
          border: {
            bottom: {
              color: "CBD5E1",
              space: 4,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
          children: [
            new TextRun({
              text: title.toUpperCase(),
              bold: true,
              size: 20,
              color: "0F172A",
              font: "Calibri",
            }),
          ],
        });
      };

      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: convertInchesToTwip(0.6),
                  right: convertInchesToTwip(0.6),
                  bottom: convertInchesToTwip(0.6),
                  left: convertInchesToTwip(0.6),
                },
              },
            },
            children: [
              // Header - Full Name
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { after: 40 },
                children: [
                  new TextRun({
                    text: fullName.toUpperCase(),
                    bold: true,
                    size: 32,
                    color: "020617",
                    font: "Calibri",
                  }),
                ],
              }),
              // Target Role
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { after: 80 },
                children: [
                  new TextRun({
                    text: jobTitle,
                    bold: true,
                    size: 24,
                    color: "1D4ED8",
                    font: "Calibri",
                  }),
                ],
              }),
              // Contact details
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { after: 200 },
                border: {
                  bottom: {
                    color: "0F172A",
                    space: 6,
                    style: BorderStyle.SINGLE,
                    size: 12,
                  },
                },
                children: [
                  new TextRun({
                    text: [
                      email ? `✉ ${email}` : '',
                      phone ? `☎ ${phone}` : '',
                      location ? `⚲ ${location}` : '',
                      portfolio ? `🌐 ${portfolio}` : '',
                      linkedin ? `💼 ${linkedin}` : ''
                    ].filter(Boolean).join("   |   "),
                    size: 18,
                    color: "475569",
                    font: "Calibri",
                  }),
                ],
              }),

              // Summary
              ...(summary ? [
                createSectionHeading("Professional Summary"),
                new Paragraph({
                  spacing: { after: 180 },
                  children: [
                    new TextRun({
                      text: summary,
                      size: 20,
                      font: "Calibri",
                      color: "334155",
                    }),
                  ],
                }),
              ] : []),

              // Skills
              ...(skills.length > 0 ? [
                createSectionHeading("Technical Skills & Core Competencies"),
                new Paragraph({
                  spacing: { after: 180 },
                  children: [
                    new TextRun({
                      text: skills.join("   •   "),
                      size: 20,
                      font: "Calibri",
                      color: "1E293B",
                    }),
                  ],
                }),
              ] : []),

              // Experience
              ...(experiences.length > 0 ? [
                createSectionHeading("Professional Experience & Projects"),
                ...experiences.flatMap(exp => [
                  new Paragraph({
                    spacing: { before: 140, after: 30 },
                    children: [
                      new TextRun({
                        text: exp.role,
                        bold: true,
                        size: 22,
                        color: "0F172A",
                        font: "Calibri",
                      }),
                      new TextRun({
                        text: `   (${exp.duration})`,
                        color: "64748B",
                        size: 18,
                        font: "Calibri",
                      }),
                    ],
                  }),
                  new Paragraph({
                    spacing: { after: 60 },
                    children: [
                      new TextRun({
                        text: exp.company,
                        italics: true,
                        size: 20,
                        color: "334155",
                        font: "Calibri",
                      }),
                    ],
                  }),
                  ...exp.bullets
                    .split('\n')
                    .map(b => b.replace(/^[•\-\*]\s*/, '').trim())
                    .filter(Boolean)
                    .map(bulletText => 
                      new Paragraph({
                        bullet: { level: 0 },
                        spacing: { after: 50 },
                        children: [
                          new TextRun({
                            text: bulletText,
                            size: 19,
                            color: "334155",
                            font: "Calibri",
                          }),
                        ],
                      })
                    ),
                ]),
              ] : []),

              // Education
              ...(educations.length > 0 ? [
                createSectionHeading("Education & Credentials"),
                ...educations.flatMap(edu => [
                  new Paragraph({
                    spacing: { before: 140, after: 30 },
                    children: [
                      new TextRun({
                        text: edu.degree,
                        bold: true,
                        size: 22,
                        color: "0F172A",
                        font: "Calibri",
                      }),
                      new TextRun({
                        text: `   (${edu.year})`,
                        color: "64748B",
                        size: 18,
                        font: "Calibri",
                      }),
                    ],
                  }),
                  new Paragraph({
                    spacing: { after: 30 },
                    children: [
                      new TextRun({
                        text: edu.institution,
                        italics: true,
                        size: 20,
                        color: "334155",
                        font: "Calibri",
                      }),
                    ],
                  }),
                  ...(edu.details ? [
                    new Paragraph({
                      spacing: { after: 90 },
                      children: [
                        new TextRun({
                          text: edu.details,
                          size: 18,
                          color: "64748B",
                          font: "Calibri",
                        }),
                      ],
                    })
                  ] : []),
                ]),
              ] : []),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fileName = `${fullName.trim().replace(/\s+/g, '_') || 'My'}_Resume.docx`;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast(`Downloaded ${fileName} (Word document) successfully!`);
    } catch (err) {
      console.error("Failed to generate Word document:", err);
      showToast("Error generating Word file. Please try again.");
    } finally {
      setIsGeneratingWord(false);
    }
  };

  const handleDownloadPdf = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const sheetElement = document.getElementById('resume-print-sheet');
    if (!sheetElement) {
      handlePrint();
      return;
    }

    try {
      setIsGeneratingPdf(true);

      // Clone element off-screen at fixed 800px width for consistent high-res rendering
      const clone = sheetElement.cloneNode(true) as HTMLElement;
      clone.style.position = 'fixed';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.width = '800px';
      clone.style.minHeight = '1100px';
      clone.style.display = 'block';
      clone.style.zIndex = '-9999';
      clone.style.backgroundColor = '#ffffff';
      clone.style.color = '#0f172a';
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      document.body.removeChild(clone);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      const fileName = `${fullName.trim().replace(/\s+/g, '_') || 'My'}_Resume.pdf`;
      pdf.save(fileName);
      showToast(`Downloaded ${fileName} (PDF document) successfully!`);
    } catch (err) {
      console.error("PDF generation error, falling back to print dialog:", err);
      handlePrint();
      showToast("Opened print dialog to save as PDF.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadMarkdown = () => {
    const md = `# ${fullName}
${jobTitle} | ${email} | ${phone} | ${location}
Portfolio: ${portfolio} | LinkedIn: ${linkedin}

## Professional Summary
${summary}

## Core Competencies & Skills
${skills.join(', ')}

## Professional Experience
${experiences.map(e => `### ${e.role} - ${e.company} (${e.duration})\n${e.bullets}`).join('\n\n')}

## Education
${educations.map(ed => `### ${ed.degree} - ${ed.institution} (${ed.year})\n${ed.details}`).join('\n\n')}
`;
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fullName.replace(/\s+/g, '_')}_Resume.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${fullName.replace(/\s+/g, '_')}_Resume.md text file!`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-4 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-3 text-xs font-semibold animate-bounce duration-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner with Action Toolbar */}
      <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 md:p-8 border border-neutral-200 dark:border-neutral-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
        <div>
          {(onBack || onBackToHome) && (
            <button
              type="button"
              onClick={() => (onBack ? onBack() : onBackToHome?.())}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-100 text-xs font-bold transition-all cursor-pointer border border-neutral-200 dark:border-neutral-600 mb-3 group"
              title="Return to previous screen"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>{backButtonLabel || '← Back to Job Matches'}</span>
            </button>
          )}

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-semibold mb-2 border border-emerald-200 dark:border-emerald-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Job-Ready Resume <span className="opacity-70 font-normal">[Word & PDF Downloads]</span></span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">Resume Builder</h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
            Build a clean, modern resume formatted for hiring systems. Download directly as Microsoft Word (.docx) or PDF (.pdf).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center transition-all ${
                activeTab === 'editor' 
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs' 
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 mr-1.5" /> Edit Form
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center transition-all ${
                activeTab === 'preview' 
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs' 
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5 mr-1.5" /> See Preview
            </button>
          </div>

          {/* Download as Word (.docx) */}
          <button
            type="button"
            onClick={(e) => handleDownloadWord(e)}
            disabled={isGeneratingWord}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white shadow-sm shadow-blue-700/20 transition-all flex items-center cursor-pointer"
            title="Download formatted Microsoft Word document (.docx)"
          >
            {isGeneratingWord ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                <span>Making Word...</span>
              </>
            ) : (
              <>
                <FileDown className="w-3.5 h-3.5 mr-1.5" />
                <span>Word (.docx)</span>
              </>
            )}
          </button>

          {/* Download as PDF (.pdf) */}
          <button
            type="button"
            onClick={(e) => handleDownloadPdf(e)}
            disabled={isGeneratingPdf}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white shadow-sm shadow-emerald-600/20 transition-all flex items-center cursor-pointer"
            title="Download print-ready PDF file (.pdf)"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                <span>Making PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 mr-1.5" />
                <span>PDF (.pdf)</span>
              </>
            )}
          </button>

          {/* Print dialog */}
          <button
            type="button"
            onClick={(e) => handlePrint(e)}
            className="p-2 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors flex items-center cursor-pointer"
            title="Open browser print dialog"
          >
            <Printer className="w-4 h-4" />
          </button>

          {(onBack || onBackToHome) && (
            <button
              type="button"
              onClick={handleBack}
              className="text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400 ml-1 px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 transition-colors flex items-center cursor-pointer"
            >
              <span>{backButtonLabel || '← Back to Job Matches'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Editor */}
        <div className={`lg:col-span-6 space-y-6 print:hidden ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
          {/* Personal Details */}
          <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center">
              <FileText className="w-4 h-4 mr-2 text-blue-600" /> Personal & Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Target Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">LinkedIn / Profile</label>
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-blue-600" /> Executive Summary
              </h3>
              <button
                onClick={() => setSummary(`Goal-oriented ${jobTitle} with practical expertise in ${skills.slice(0, 4).join(', ')}. Passionate about building robust systems and delivering measurable technical impact.`)}
                className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold"
              >
                Auto-generate
              </button>
            </div>
            <textarea
              rows={4}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
            />
          </div>

          {/* Skills Tag Manager */}
          <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center">
              <Wrench className="w-4 h-4 mr-2 text-blue-600" /> Technical Skills & Tools ({skills.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map(s => (
                <span
                  key={s}
                  className="inline-flex items-center px-3 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg text-xs font-semibold"
                >
                  {s}
                  <button
                    onClick={() => handleRemoveSkill(s)}
                    className="ml-1.5 text-neutral-400 hover:text-rose-500 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="text"
                placeholder="Add skill (e.g. Docker, PyTorch)..."
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                className="flex-1 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddSkill}
                className="px-4 py-2.5 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 text-xs font-semibold rounded-xl transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Experience List */}
          <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center">
                <Briefcase className="w-4 h-4 mr-2 text-blue-600" /> Work Experience & Projects
              </h3>
              <button
                onClick={handleAddExperience}
                className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Position
              </button>
            </div>

            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Position</span>
                    <button
                      onClick={() => handleRemoveExperience(exp.id)}
                      className="text-neutral-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Role Title"
                      value={exp.role}
                      onChange={(e) => handleUpdateExperience(exp.id, 'role', e.target.value)}
                      className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-semibold"
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => handleUpdateExperience(exp.id, 'company', e.target.value)}
                      className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Date (e.g. 2022-Present)"
                      value={exp.duration}
                      onChange={(e) => handleUpdateExperience(exp.id, 'duration', e.target.value)}
                      className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs"
                    />
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Achievements and bullet points..."
                    value={exp.bullets}
                    onChange={(e) => handleUpdateExperience(exp.id, 'bullets', e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs leading-relaxed"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Education List */}
          <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center">
                <GraduationCap className="w-4 h-4 mr-2 text-blue-600" /> Education & Credentials
              </h3>
              <button
                onClick={handleAddEducation}
                className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Degree
              </button>
            </div>

            <div className="space-y-4">
              {educations.map((edu) => (
                <div key={edu.id} className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Academic Record</span>
                    <button
                      onClick={() => handleRemoveEducation(edu.id)}
                      className="text-neutral-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) => handleUpdateEducation(edu.id, 'degree', e.target.value)}
                      className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-semibold"
                    />
                    <input
                      type="text"
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) => handleUpdateEducation(edu.id, 'institution', e.target.value)}
                      className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Year"
                      value={edu.year}
                      onChange={(e) => handleUpdateEducation(edu.id, 'year', e.target.value)}
                      className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="GPA / Key coursework / Honors"
                    value={edu.details}
                    onChange={(e) => handleUpdateEducation(edu.id, 'details', e.target.value)}
                    className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live ATS-Compliant Sheet Preview */}
        <div className={`lg:col-span-6 sticky top-24 ${activeTab === 'editor' ? 'hidden lg:block' : 'block'}`}>
          <div className="bg-neutral-200 dark:bg-neutral-900/80 p-4 md:p-8 rounded-3xl border border-neutral-300 dark:border-neutral-800 overflow-hidden shadow-inner">
            {/* The Print Sheet Target */}
            <div 
              id="resume-print-sheet" 
              className="bg-white text-neutral-900 p-8 md:p-10 rounded-2xl shadow-xl max-w-[800px] mx-auto min-h-[1050px] font-sans text-neutral-900 select-text"
            >
              {/* Header */}
              <div className="border-b-2 border-neutral-900 pb-5 mb-5">
                <h1 className="text-3xl font-extrabold tracking-tight text-neutral-950 uppercase">{fullName}</h1>
                <p className="text-base font-semibold text-blue-800 mt-0.5 tracking-wide">{jobTitle}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-600 mt-2 font-medium">
                  {email && <span>✉ {email}</span>}
                  {phone && <span>☎ {phone}</span>}
                  {location && <span>⚲ {location}</span>}
                  {portfolio && <span>🌐 {portfolio}</span>}
                  {linkedin && <span>💼 {linkedin}</span>}
                </div>
              </div>

              {/* Summary */}
              {summary && (
                <div className="mb-6">
                  <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-200 pb-1 mb-2">
                    Professional Summary
                  </h2>
                  <p className="text-xs leading-relaxed text-neutral-700 text-justify">
                    {summary}
                  </p>
                </div>
              )}

              {/* Skills */}
              {skills.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-200 pb-1 mb-2">
                    Technical Skills & Competencies
                  </h2>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {skills.map((s, idx) => (
                      <span key={idx} className="text-xs font-medium px-2 py-0.5 bg-neutral-100 border border-neutral-200 rounded text-neutral-800">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {experiences.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-200 pb-1 mb-3">
                    Professional Experience & Projects
                  </h2>
                  <div className="space-y-4">
                    {experiences.map(exp => (
                      <div key={exp.id}>
                        <div className="flex items-baseline justify-between text-xs">
                          <span className="font-bold text-neutral-950 text-sm">{exp.role}</span>
                          <span className="text-neutral-500 font-medium">{exp.duration}</span>
                        </div>
                        <div className="text-xs font-semibold text-neutral-700 italic mb-1.5">{exp.company}</div>
                        <div className="text-xs text-neutral-700 whitespace-pre-line leading-relaxed space-y-1">
                          {exp.bullets}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {educations.length > 0 && (
                <div>
                  <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-200 pb-1 mb-3">
                    Education & Credentials
                  </h2>
                  <div className="space-y-3">
                    {educations.map(edu => (
                      <div key={edu.id}>
                        <div className="flex items-baseline justify-between text-xs">
                          <span className="font-bold text-neutral-950">{edu.degree}</span>
                          <span className="text-neutral-500 font-medium">{edu.year}</span>
                        </div>
                        <div className="text-xs text-neutral-700 font-semibold">{edu.institution}</div>
                        {edu.details && <p className="text-xs text-neutral-600 mt-0.5">{edu.details}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Footer for Preview */}
            <div className="mt-4 p-4 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm print:hidden">
              <div className="flex items-center space-x-2 text-xs text-neutral-600 dark:text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-medium">Ready to apply? Choose your format:</span>
              </div>
              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={(e) => handleDownloadWord(e)}
                  disabled={isGeneratingWord}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white flex items-center shadow-xs transition-colors cursor-pointer"
                >
                  {isGeneratingWord ? (
                    <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                  ) : (
                    <FileDown className="w-3.5 h-3.5 mr-1" />
                  )}
                  <span>Word (.docx)</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDownloadPdf(e)}
                  disabled={isGeneratingPdf}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white flex items-center shadow-xs transition-colors cursor-pointer"
                >
                  {isGeneratingPdf ? (
                    <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5 mr-1" />
                  )}
                  <span>PDF (.pdf)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
