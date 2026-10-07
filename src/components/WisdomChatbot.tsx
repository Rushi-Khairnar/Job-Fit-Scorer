import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  X,
  RotateCcw,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { UserProfile } from './AccountModal';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface WisdomChatbotProps {
  currentProfile: UserProfile;
  uploadedFileName?: string;
  uploadedFileText?: string;
  extractedSkills?: string[];
  targetRole: string;
  onNavigate?: (toolId: string) => void;
  isDarkMode?: boolean;
}

export const WisdomChatbot: React.FC<WisdomChatbotProps> = ({
  currentProfile,
  uploadedFileName,
  uploadedFileText,
  extractedSkills = [],
  targetRole
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with personalized welcome message when first opened or profile switches
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: `Hi **${currentProfile.name.split(' ')[0]}**! I'm **Wisdom**, your AI Career Copilot.\n\nI have context of your profile as a **${currentProfile.occupation || 'Software Professional'}** targeting **${currentProfile.title || targetRole || 'Tech Opportunities'}**.\n\nHow can I help you today? Ask me anything about your resume, interview preparation, career roadmap, or skills.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [currentProfile.id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Auto focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/wisdom-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          candidateContext: {
            name: currentProfile.name,
            occupation: currentProfile.occupation,
            targetRole: currentProfile.title || targetRole,
            email: currentProfile.email,
            experienceYears: currentProfile.experienceYears,
            savedSkills: currentProfile.savedSkills?.map(s => s.name) || extractedSkills,
            enrolledRoadmapRole: currentProfile.enrolledRoadmapRole,
            resumeFileName: uploadedFileName || currentProfile.resumeFileName,
            resumeTextSnippet: uploadedFileText || currentProfile.resumeText || '',
            hasVideoCv: Boolean(currentProfile.videoCvFileName || currentProfile.videoCvUrl)
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `asst_${Date.now()}`,
        role: 'assistant',
        content: data.reply || "I've reviewed your question. Let me know if you need any further clarification!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Wisdom chat error:', err);
      const fallbackMessage: ChatMessage = {
        id: `asst_err_${Date.now()}`,
        role: 'assistant',
        content: `I'm having trouble connecting right now, but feel free to ask any career or interview question and I'll do my best to assist.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([]);
    setTimeout(() => {
      setMessages([
        {
          id: 'welcome_reset',
          role: 'assistant',
          content: `Chat session refreshed! How can I help you today, **${currentProfile.name.split(' ')[0]}**?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 50);
  };

  // Simple Markdown formatter for clean paragraph, bold, and list display
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      // Format bold markdown (**text**)
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-semibold text-neutral-900 dark:text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
        return (
          <div key={idx} className="flex items-start space-x-2 my-0.5 pl-1">
            <span className="text-blue-500 font-bold shrink-0 leading-relaxed">•</span>
            <span className="text-xs leading-relaxed">{renderedParts.slice(1)}</span>
          </div>
        );
      }

      if (/^\d+\.\s/.test(line.trim())) {
        const match = line.trim().match(/^(\d+\.)\s*(.*)$/);
        return (
          <div key={idx} className="flex items-start space-x-2 my-1 pl-1">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0">
              {match?.[1]}
            </span>
            <span className="text-xs leading-relaxed">{match?.[2]}</span>
          </div>
        );
      }

      return (
        <p key={idx} className="text-xs leading-relaxed my-0.5">
          {renderedParts}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] md:bottom-6 right-3 sm:right-6 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`group flex items-center space-x-2 sm:space-x-2.5 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl shadow-xl transition-all duration-200 cursor-pointer min-h-[48px] active:scale-95 ${
            isOpen
              ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 ring-4 ring-neutral-300 dark:ring-neutral-700'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-2xl ring-2 ring-blue-400/30'
          }`}
          aria-label={isOpen ? 'Close Wisdom Chat' : 'Open Wisdom AI Assistant'}
          title="Wisdom AI Career Copilot"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white group-hover:scale-105 transition-transform" />
            {!isOpen && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-blue-600 animate-pulse" />
            )}
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold leading-tight">Wisdom AI</div>
            <div className="text-[10px] opacity-80 leading-tight">Career Copilot</div>
          </div>
          <span className="sm:hidden text-xs font-bold">Wisdom</span>
          {isOpen ? (
            <ChevronDown className="w-4 h-4 opacity-75" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-blue-200 group-hover:rotate-12 transition-transform" />
          )}
        </button>
      </div>

      {/* Expandable Chat Drawer Window */}
      {isOpen && (
        <div 
          className="fixed inset-x-2 bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] sm:inset-x-auto sm:right-6 sm:bottom-20 z-50 w-auto sm:w-[400px] sm:max-w-[420px] h-[520px] max-h-[72dvh] bg-white dark:bg-neutral-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200"
          role="dialog"
          aria-label="Wisdom Career Copilot Chat Window"
        >
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-neutral-50 dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-700/80 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white">Wisdom</h3>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                    AI Assistant
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate max-w-[170px] sm:max-w-[200px]">
                  {currentProfile.name.split(' ')[0]} · {currentProfile.title || targetRole}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-700/60 transition-colors cursor-pointer"
                title="Restart conversation"
                aria-label="Restart conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-700/60 transition-colors cursor-pointer"
                title="Close chat window"
                aria-label="Close chat window"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Context Banner */}
          <div className="px-4 py-1.5 bg-neutral-100/70 dark:bg-neutral-800/50 border-b border-neutral-200/70 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-300 flex items-center justify-between shrink-0">
            <span className="truncate">
              Role: <strong className="font-semibold text-neutral-900 dark:text-white">{currentProfile.title || targetRole}</strong>
            </span>
            <span className="shrink-0 text-[10px] text-neutral-400">
              {currentProfile.experienceYears}y exp
            </span>
          </div>

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 overscroll-contain">
            {messages.map((message) => {
              const isUser = message.role === 'user';
              return (
                <div
                  key={message.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl text-xs ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-xs shadow-xs'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-tl-xs border border-neutral-200/70 dark:border-neutral-700/70'
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    ) : (
                      renderFormattedContent(message.content)
                    )}
                  </div>

                  <span className="text-[9px] text-neutral-400 px-1">
                    {message.timestamp}
                  </span>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start space-x-2 animate-in fade-in">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 text-xs">
                  <Bot className="w-4 h-4 animate-pulse" />
                </div>
                <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-xs flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" />
                  </div>
                  <span className="text-[11px]">Wisdom is typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Clean Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex items-center space-x-2 shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Wisdom anything..."
              disabled={isLoading}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-base sm:text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 min-h-[44px]"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 text-white disabled:text-neutral-400 transition-all cursor-pointer disabled:cursor-not-allowed shadow-xs shrink-0 active:scale-95"
              title="Send message"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
