import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  Trash2,
  ArrowRight,
  AlertCircle,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  Loader2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getChatHistory, saveChatHistory, clearChatHistory } from '../services/dbService';

const SUGGESTED_QUESTIONS = [
  "What is machine learning?",
  "Should I learn React or Angular?",
  "Write a Java program for binary search",
  "I'm weak in DSA. What should I do?",
  "Suggest projects for my resume",
  "Prepare me for a frontend interview"
];

// Helper component for rendered code blocks with a Copy button
function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 text-slate-100 text-xs font-mono shadow-md">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-800/80 border-b border-slate-700/80 text-[11px] text-slate-400">
        <span className="uppercase font-semibold tracking-wider text-emerald-400">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 hover:text-white transition-colors text-[10px] px-2 py-0.5 rounded hover:bg-slate-700 cursor-pointer"
          title="Copy code"
        >
          {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto leading-relaxed text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// Markdown renderer that safely formats headings, lists, bold/italics, and code blocks
function FormattedMessage({ content }) {
  if (!content) return null;

  // Split content by code blocks: ```lang ... ```
  const parts = [];
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: content.substring(lastIndex, match.index) });
    }
    parts.push({ type: 'code', language: match[1], value: match[2] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({ type: 'text', value: content.substring(lastIndex) });
  }

  const renderTextBlock = (text, keyPrefix) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const key = `${keyPrefix}-${idx}`;

      // Headings: ###
      if (line.startsWith('### ')) {
        return (
          <h4 key={key} className="text-sm font-bold text-slate-800 mt-2 mb-1">
            {formatInline(line.replace('### ', ''))}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={key} className="text-base font-extrabold text-slate-800 mt-2.5 mb-1.5">
            {formatInline(line.replace('## ', ''))}
          </h3>
        );
      }

      // Unordered list item: - or *
      if (/^\s*[-*]\s+/.test(line)) {
        const itemText = line.replace(/^\s*[-*]\s+/, '');
        return (
          <li key={key} className="ml-4 list-disc text-xs sm:text-sm leading-relaxed my-0.5">
            {formatInline(itemText)}
          </li>
        );
      }

      // Ordered list item: 1. 2. etc.
      const orderedMatch = line.match(/^\s*(\d+)\.\s+(.*)/);
      if (orderedMatch) {
        return (
          <div key={key} className="ml-2 flex items-start space-x-1.5 my-0.5 text-xs sm:text-sm leading-relaxed">
            <span className="font-bold text-emerald-600 shrink-0">{orderedMatch[1]}.</span>
            <span>{formatInline(orderedMatch[2])}</span>
          </div>
        );
      }

      // Blank lines -> space
      if (!line.trim()) {
        return <div key={key} className="h-2" />;
      }

      // Normal paragraph
      return (
        <p key={key} className="text-xs sm:text-sm leading-relaxed my-1">
          {formatInline(line)}
        </p>
      );
    });
  };

  const formatInline = (str) => {
    const tokens = [];
    const inlineRegex = /`([^`]+)`/g;
    let last = 0;
    let m;

    while ((m = inlineRegex.exec(str)) !== null) {
      if (m.index > last) {
        tokens.push(formatStyles(str.substring(last, m.index)));
      }
      tokens.push(
        <code key={m.index} className="bg-slate-100 text-emerald-700 px-1.5 py-0.5 rounded text-xs font-mono border border-slate-200">
          {m[1]}
        </code>
      );
      last = m.index + m[0].length;
    }

    if (last < str.length) {
      tokens.push(formatStyles(str.substring(last)));
    }

    return tokens;
  };

  const formatStyles = (s) => {
    let formatted = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    return <span key={s} dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  return (
    <div className="space-y-1">
      {parts.map((part, i) =>
        part.type === 'code' ? (
          <CodeBlock key={i} code={part.value} language={part.language} />
        ) : (
          <div key={i}>{renderTextBlock(part.value, `part-${i}`)}</div>
        )
      )}
    </div>
  );
}

export default function ChatbotPage({ profile }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [lastFailedQuery, setLastFailedQuery] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const chatEndRef = useRef(null);

  // Sync and load history on mount / user change
  useEffect(() => {
    const loadHistory = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const history = await getChatHistory(user.uid);
        if (history && history.length > 0) {
          const cleanHistory = history.filter(
            (m) => !(m.content && m.content.startsWith('⚠️') && m.content.includes('trouble communicating'))
          );
          setMessages(cleanHistory);
        } else {
          const greeting = profile
            ? `Hello **${profile.name}**! I am your FutureAlign AI Career Coach. I've loaded your profile (${profile.degree || 'Degree'} in ${profile.branch || 'Tech'}). How can I help you today? You can ask me technical questions, roadmaps, code examples, interview prep, or general questions!`
            : `Hello! I am your FutureAlign AI Career Coach. Feel free to ask me any technical question, programming problem, concept, or career guidance query!`;
          setMessages([{ role: 'assistant', content: greeting }]);
        }
      } catch (err) {
        console.error('Error loading chat history:', err);
        setErrorMsg('Failed to load past chat history.');
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [user, profile]);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading || !user) return;

    setErrorMsg('');
    setLastFailedQuery(null);
    if (!textToSend) setInput('');

    const userMessage = { role: 'user', content: text };
    const nextMessages = [...messages, userMessage];

    // Immediately display user message
    setMessages(nextMessages);
    setIsLoading(true);

    // Prepare compact profile payload (avoids sending huge metadata)
    const compactProfile = profile
      ? {
          name: profile.name,
          degree: profile.degree,
          branch: profile.branch,
          year: profile.year,
          skills: profile.skills,
          interests: profile.interests,
          goal: profile.goal
        }
      : null;

    try {
      // Start AI request IMMEDIATELY (Do NOT block on Firestore save!)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: nextMessages,
          profile: compactProfile,
          stream: true
        }),
      });

      const contentType = response.headers.get('content-type') || '';

      // Handle Streaming response
      if (response.ok && contentType.includes('text/event-stream') && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedReply = '';
        let hasInitializedBubble = false;

        // Initialize empty assistant message placeholder
        setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);
        setIsLoading(false); // Stop typing indicator as stream starts

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const textChunk = decoder.decode(value, { stream: true });
          const lines = textChunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const parsed = JSON.parse(line.substring(6));
                if (parsed.chunk) {
                  accumulatedReply += parsed.chunk;
                  setMessages((prev) => {
                    const copy = [...prev];
                    copy[copy.length - 1] = {
                      role: 'assistant',
                      content: accumulatedReply
                    };
                    return copy;
                  });
                } else if (parsed.done) {
                  accumulatedReply = parsed.fullContent || accumulatedReply;
                } else if (parsed.error) {
                  throw new Error(parsed.error);
                }
              } catch (e) {
                // Ignore SSE framing parser errors on partial lines
              }
            }
          }
        }

        // Save complete updated conversation to Firestore in background (non-blocking)
        const finalMessages = [...nextMessages, { role: 'assistant', content: accumulatedReply }];
        saveChatHistory(user.uid, finalMessages).catch((dbErr) => {
          console.warn('Background Firestore save failed:', dbErr);
        });

      } else {
        // Handle Standard JSON response
        const data = await response.json();

        if (response.ok && data.success && data.message) {
          const updatedMessages = [...nextMessages, data.message];
          // Display immediately
          setMessages(updatedMessages);

          // Save to Firestore asynchronously in background (zero UI waiting)
          saveChatHistory(user.uid, updatedMessages).catch((dbErr) => {
            console.warn('Background Firestore save failed:', dbErr);
          });
        } else {
          throw new Error(data.error || `Server responded with status ${response.status}`);
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      setErrorMsg(err.message || 'Unable to reach the AI assistant. Please retry.');
      setLastFailedQuery(text);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastFailedQuery) {
      handleSend(lastFailedQuery);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = async () => {
    if (!user) return;
    if (window.confirm('Are you sure you want to clear your conversation history?')) {
      setIsLoading(true);
      try {
        await clearChatHistory(user.uid);
        const greeting = profile
          ? `Hello **${profile.name}**! Let's start a fresh session. What would you like to explore today?`
          : `Hello! What would you like to explore or learn today?`;
        setMessages([{ role: 'assistant', content: greeting }]);
        setErrorMsg('');
        setLastFailedQuery(null);
      } catch (err) {
        console.error(err);
        setErrorMsg('Failed to clear chat history.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCopyMessage = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 h-[calc(100vh-140px)] flex flex-col">
      {/* Upper Alerts Banner for Missing Profile */}
      {!profile && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center justify-between gap-4 mb-3 shrink-0 shadow-sm">
          <div className="flex items-center space-x-2.5 text-amber-800 text-xs">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>Complete your Career Assessment to unlock personalized career matching advice.</span>
          </div>
          <Link
            to="/assessment"
            className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1 uppercase shrink-0 transition-colors"
          >
            <span>Assess Now</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-grow flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <h2 className="font-bold text-slate-800 text-sm">FutureAlign AI Coach</h2>
              <span className="text-[10px] text-slate-400 font-semibold block">
                Ultra-Fast Streaming • {profile ? `${profile.name} (Active Profile)` : 'General Assistant'}
              </span>
            </div>
          </div>
          <button
            onClick={clearChat}
            disabled={isLoading}
            className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-40 cursor-pointer"
            title="Clear Conversation History"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Messages Panel */}
        <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
          {messages.map((msg, idx) => {
            const isAI = msg.role === 'assistant';
            return (
              <div
                key={idx}
                className={`flex items-start space-x-3 max-w-[90%] sm:max-w-[85%] ${
                  isAI ? 'mr-auto' : 'ml-auto flex-row-reverse space-x-reverse'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-xs ${
                    isAI
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-slate-800 border-slate-700 text-white'
                  }`}
                >
                  {isAI ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`group relative p-4 rounded-2xl shadow-xs text-sm leading-relaxed ${
                    isAI
                      ? 'bg-white text-slate-800 border border-slate-200/90'
                      : 'bg-emerald-600 text-white border border-emerald-600'
                  }`}
                >
                  {isAI ? (
                    msg.content ? (
                      <FormattedMessage content={msg.content} />
                    ) : (
                      <div className="flex items-center space-x-2 text-slate-400 text-xs">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600" />
                        <span>Streaming response...</span>
                      </div>
                    )
                  ) : (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  )}

                  {/* Copy Button on hover for AI messages */}
                  {isAI && msg.content && (
                    <button
                      onClick={() => handleCopyMessage(msg.content, idx)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-slate-600 bg-white/90 rounded border border-slate-200 shadow-xs cursor-pointer"
                      title="Copy response"
                    >
                      {copiedIdx === idx ? (
                        <Check className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing / Thinking Indicator */}
          {isLoading && (
            <div className="flex items-start space-x-3 mr-auto max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 animate-pulse" />
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs shadow-xs flex items-center space-x-2 font-medium">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600" />
                <span>Coach is thinking...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggested Questions */}
        <div className="px-4 sm:px-6 py-2.5 border-t border-slate-100 flex flex-wrap gap-1.5 shrink-0 bg-white">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-full px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-40 text-left cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Error Alert with Retry */}
        {errorMsg && (
          <div className="px-6 py-2 bg-rose-50 border-t border-rose-200 flex items-center justify-between text-rose-700 text-xs shrink-0">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span className="font-medium">{errorMsg}</span>
            </div>
            {lastFailedQuery && (
              <button
                onClick={handleRetry}
                disabled={isLoading}
                className="flex items-center space-x-1 font-bold text-rose-700 hover:text-rose-900 bg-rose-100/70 hover:bg-rose-200 px-2 py-1 rounded transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Retry</span>
              </button>
            )}
          </div>
        )}

        {/* Input Form */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50 shrink-0">
          <div className="relative flex items-center bg-white border border-slate-300 rounded-xl overflow-hidden shadow-inner focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder={isLoading ? 'Coach is generating response...' : 'Ask any question: "What is machine learning?", "Java binary search", "Roadmap"...'}
              rows="1"
              className="w-full pl-4 pr-12 py-3 border-none outline-none focus:ring-0 text-sm bg-transparent resize-none h-[46px] max-h-[120px] align-middle placeholder-slate-400"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all disabled:opacity-40 cursor-pointer"
              title="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
