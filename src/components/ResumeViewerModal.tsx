import React, { useState, useMemo } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Search, 
  Maximize2, 
  Minimize2, 
  ExternalLink,
  Eye,
  Sparkles,
  BookOpen,
  Video
} from 'lucide-react';

interface ResumeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName?: string;
  fileUrl?: string | null;
  resumeText?: string;
  videoCvUrl?: string | null;
  videoCvFileName?: string;
  detectedSkills?: string[];
  isDarkMode?: boolean;
}

export const ResumeViewerModal: React.FC<ResumeViewerModalProps> = ({
  isOpen,
  onClose,
  fileName = 'Resume.pdf',
  fileUrl = null,
  resumeText = '',
  videoCvUrl = null,
  videoCvFileName,
  detectedSkills = [],
  isDarkMode = false
}) => {
  const isPdf = fileName?.toLowerCase().endsWith('.pdf');
  const [activeTab, setActiveTab] = useState<'pdf' | 'text' | 'video'>(fileUrl && isPdf ? 'pdf' : videoCvUrl && !resumeText ? 'video' : 'text');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Filter / count matches in text
  const matchCount = useMemo(() => {
    if (!searchQuery.trim() || !resumeText) return 0;
    try {
      const regex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const matches = resumeText.match(regex);
      return matches ? matches.length : 0;
    } catch {
      return 0;
    }
  }, [searchQuery, resumeText]);

  if (!isOpen) return null;

  const handleCopyText = async () => {
    if (!resumeText) return;
    try {
      await navigator.clipboard.writeText(resumeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleDownload = () => {
    if (fileUrl) {
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (resumeText) {
      const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName.replace(/\.[^/.]+$/, "") + ".txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Helper to render text with search & skill highlights
  const renderHighlightedText = () => {
    if (!resumeText) {
      return (
        <div className="py-20 text-center text-neutral-400 dark:text-neutral-500 text-sm">
          No extracted text available for this resume yet.
        </div>
      );
    }

    if (!searchQuery.trim()) {
      return (
        <div className="font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-neutral-800 dark:text-neutral-200">
          {resumeText}
        </div>
      );
    }

    // Split text by query for highlight
    const parts = resumeText.split(new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));

    return (
      <div className="font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-neutral-800 dark:text-neutral-200">
        {parts.map((part, i) => 
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <mark key={i} className="bg-amber-300 dark:bg-amber-500/60 text-neutral-950 font-bold px-0.5 rounded">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className={`bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isFullscreen 
            ? 'w-[98vw] h-[96vh]' 
            : 'w-full max-w-4xl h-[88vh]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white truncate">
                  {fileName}
                </h3>
                <span className="text-[11px] text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md font-medium">
                  {isPdf ? 'PDF Document' : 'Document Text'}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                {detectedSkills.length > 0 
                  ? `${detectedSkills.length} extracted skills identified` 
                  : 'Document loaded from profile vault'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar / Tabs Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/30 text-xs">
          {/* View Mode Tabs */}
          <div className="flex items-center space-x-1 bg-neutral-200/60 dark:bg-neutral-800 p-1 rounded-xl">
            {fileUrl && isPdf && (
              <button
                onClick={() => setActiveTab('pdf')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'pdf'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>PDF Document</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('text')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'text'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Extracted Text Reader</span>
            </button>
            {videoCvUrl && (
              <button
                onClick={() => setActiveTab('video')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'video'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video CV Pitch</span>
              </button>
            )}
          </div>

          {/* Search bar inside extracted text tab */}
          {activeTab === 'text' && (
            <div className="flex items-center space-x-2 flex-1 max-w-xs ml-auto">
              <div className="relative w-full">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find in document..."
                  className="w-full pl-8 pr-16 py-1 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                {searchQuery && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400 font-semibold">
                    {matchCount} {matchCount === 1 ? 'match' : 'matches'}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action buttons: Copy & Download */}
          <div className="flex items-center space-x-2 ml-auto sm:ml-0">
            {resumeText && (
              <button
                onClick={handleCopyText}
                className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
                title="Copy all text to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
            )}

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer"
              title="Download file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative bg-neutral-100/50 dark:bg-neutral-950/40 p-4 sm:p-6">
          {activeTab === 'video' && videoCvUrl ? (
            <div className="w-full h-full rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-950 flex flex-col items-center justify-center p-6 shadow-xs">
              <div className="max-w-2xl w-full space-y-3">
                <div className="rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center shadow-2xl">
                  <video
                    src={videoCvUrl}
                    controls
                    className="w-full h-full object-contain"
                    autoPlay={false}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
                  <span className="font-semibold text-white">{videoCvFileName || 'Candidate Video CV'}</span>
                  <span>Elevator Pitch</span>
                </div>
              </div>
            </div>
          ) : activeTab === 'pdf' && fileUrl ? (
            <div className="w-full h-full rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white shadow-xs">
              <iframe
                src={`${fileUrl}#view=FitH`}
                title="Resume PDF Document"
                className="w-full h-full border-none"
              />
            </div>
          ) : (
            <div className="w-full h-full rounded-2xl overflow-y-auto border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs space-y-4">
              {/* Highlighted Detected Skills Banner */}
              {detectedSkills.length > 0 && (
                <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/80 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 flex items-center">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Identified Tech Skills ({detectedSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {detectedSkills.map(sk => (
                      <span
                        key={sk}
                        className="px-2 py-0.5 rounded-md text-xs font-semibold bg-white dark:bg-neutral-800 border border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Document Text */}
              <div className="pt-2">
                {renderHighlightedText()}
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-5 py-3 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-between text-[11px] text-neutral-500">
          <span>{fileName}</span>
          <span>Stored in browser local vault</span>
        </div>
      </div>
    </div>
  );
};
