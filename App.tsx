import React, { useState, useEffect, useRef } from 'react';
import { 
  ContentTemplate, 
  Complexity, 
  ContentLength, 
  GenerationParams, 
  GeneratedContent,
  SampleContent
} from './types';
import { TEMPLATES } from './constants';
import { geminiService } from './services/geminiService';
import { HistorySidebar } from './components/HistorySidebar';
import { PromptDocs } from './components/PromptDocs';
import { PromptLibrary } from './components/PromptLibrary';
import { StatsBadge } from './components/StatsBadge';
import { SplashScreen } from './components/SplashScreen';
import { InteractiveQuiz } from './components/InteractiveQuiz';
import { 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Menu, 
  X, 
  AlertCircle,
  Settings2,
  FileQuestion
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Declare html2pdf for TypeScript since it's loaded via CDN
declare var html2pdf: any;

function App() {
  // State
  const [showSplash, setShowSplash] = useState(true);
  const [params, setParams] = useState<GenerationParams>({
    topic: '',
    subject: 'General',
    gradeLevel: 'High School',
    template: ContentTemplate.LESSON_PLAN,
    complexity: Complexity.INTERMEDIATE,
    length: ContentLength.MEDIUM,
    additionalInstructions: '',
    includeExplanations: false
  });

  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('Initializing...');
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  const [error, setError] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<GeneratedContent | null>(null);
  const [history, setHistory] = useState<GeneratedContent[]>([]);
  const [showHistoryMobile, setShowHistoryMobile] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Validation state
  const [topicTouched, setTopicTouched] = useState(false);

  // Refs for PDF export
  const contentRef = useRef<HTMLDivElement>(null);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('edugenie_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history on change
  useEffect(() => {
    localStorage.setItem('edugenie_history', JSON.stringify(history));
  }, [history]);

  // Simulated progress effect
  useEffect(() => {
    let interval: any;
    if (loading) {
        setLoadingProgress(5);
        interval = setInterval(() => {
            setLoadingProgress(prev => {
                if (prev >= 95) return prev;
                // Slow down as we get higher
                const increment = prev < 50 ? 2 : prev < 80 ? 1 : 0.2;
                return prev + increment;
            });
        }, 100);
    } else {
        setLoadingProgress(100);
        setTimeout(() => setLoadingProgress(0), 500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleGenerate = async () => {
    // Force touched on submit
    setTopicTouched(true);

    // Validation
    if (!params.topic.trim()) {
      setError("Please enter a topic.");
      return;
    }
    if (params.topic.length > 200) {
        setError("Topic is too long.");
        return;
    }

    setLoading(true);
    setLoadingStage('Analyzing Request...');
    setError(null);
    setCurrentResult(null);

    try {
      const result = await geminiService.generateContent(params, (stage) => setLoadingStage(stage));
      setCurrentResult(result);
      setHistory(prev => [result, ...prev]);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = (sample: SampleContent) => {
      setParams(sample.params);
      setTopicTouched(false);
      
      const sampleResult: GeneratedContent = {
          id: sample.id,
          params: sample.params,
          content: sample.content,
          imageUrl: sample.imageUrl,
          timestamp: Date.now(),
          metrics: {
              durationMs: 0,
              inputTokens: 0,
              outputTokens: 0,
              totalTokens: 0,
              estimatedCost: 0
          }
      };
      
      setCurrentResult(sampleResult);
      setError(null);
      if (window.innerWidth < 1024) setShowHistoryMobile(false);
  };

  const handleDeleteHistory = (id: string) => {
    setHistory(prev => prev.filter(i => i.id !== id));
    if (currentResult?.id === id) {
      setCurrentResult(null);
    }
  };

  const handleExportPDF = () => {
    if (!currentResult || !contentRef.current) return;
    
    // Small timeout to allow render update
    setTimeout(() => {
        const element = contentRef.current;
        const opt = {
          margin:       [0.5, 0.5, 0.5, 0.5], // inches
          filename:     `edugenie-${currentResult.params.template}-${Date.now()}.pdf`,
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2, useCORS: true },
          jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        if (typeof html2pdf !== 'undefined') {
            html2pdf().set(opt).from(element).save();
        } else {
            alert("PDF library not loaded. Please try printing via browser (Ctrl+P).");
        }
    }, 100);
  };

  const handleCopy = () => {
    if (!currentResult) return;
    navigator.clipboard.writeText(currentResult.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // UI Validation Helpers
  const isTopicError = topicTouched && !params.topic.trim();
  const isTopicTooLong = params.topic.length > 200;

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      
      <div className="h-screen bg-slate-100 p-2 md:p-4 font-sans overflow-hidden flex flex-col relative text-slate-800">
        
        {/* Mobile Mobile Toggle */}
        <button 
          className="lg:hidden fixed bottom-4 right-4 z-40 bg-teal-600 text-white p-3 rounded-full shadow-lg"
          onClick={() => setShowHistoryMobile(!showHistoryMobile)}
        >
          {showHistoryMobile ? <X /> : <Menu />}
        </button>

        {/* Mobile Sidebar Overlay */}
        <div className={`
          fixed inset-y-0 left-0 z-30 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden
          ${showHistoryMobile ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <HistorySidebar 
            history={history} 
            onSelect={(item) => {
              setCurrentResult(item);
              setParams(item.params);
              setTopicTouched(false);
              setShowHistoryMobile(false);
            }} 
            onDelete={handleDeleteHistory}
            onOpenDocs={() => setShowDocs(true)}
            onOpenLibrary={() => setShowLibrary(true)}
          />
        </div>

        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border border-slate-200 p-4 rounded-2xl shadow-sm mb-4 flex justify-between items-center shrink-0 z-10">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-teal-500 to-blue-600 text-white p-2 rounded-xl shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                 <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none">EduGenie</h1>
                 <p className="text-[10px] text-slate-500 font-medium">AI-POWERED EDUCATION TOOL</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> Gemini 2.5 Flash Active</span>
            </div>
        </header>

        {/* Main Workspace Layout (Containers) */}
        <div className="flex-1 flex gap-4 overflow-hidden min-h-0">
            
            {/* Desktop Sidebar Container */}
            <div className="hidden lg:flex flex-col w-72 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden shrink-0">
               <HistorySidebar 
                history={history} 
                onSelect={(item) => {
                    setCurrentResult(item);
                    setParams(item.params);
                    setTopicTouched(false);
                }} 
                onDelete={handleDeleteHistory}
                onOpenDocs={() => setShowDocs(true)}
                onOpenLibrary={() => setShowLibrary(true)}
               />
            </div>

            {/* Middle Container: Generator Form */}
            <div className="w-full lg:w-[400px] xl:w-[450px] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col shrink-0">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-slate-500" />
                    <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Configuration</h2>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Template Selection */}
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Template Strategy</label>
                        <select 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all text-sm font-medium"
                        value={params.template}
                        onChange={(e) => setParams({...params, template: e.target.value as ContentTemplate})}
                        >
                        {Object.values(TEMPLATES).map(t => (
                            <option key={t.id} value={t.id}>{t.label}</option>
                        ))}
                        </select>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">{TEMPLATES[params.template].description}</p>
                    </div>

                    {/* Quiz specific options */}
                    {params.template === ContentTemplate.QUIZ && (
                      <div className="flex items-start gap-3 p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                          <div className="mt-0.5 text-blue-500">
                             <FileQuestion className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input 
                                        type="checkbox"
                                        className="peer w-4 h-4 text-teal-600 rounded focus:ring-teal-500 border-slate-300"
                                        checked={params.includeExplanations || false}
                                        onChange={(e) => setParams({...params, includeExplanations: e.target.checked})}
                                    />
                                </div>
                                <span className="text-sm font-medium text-slate-700 group-hover:text-teal-700 transition-colors">Include Explanations</span>
                            </label>
                            <p className="text-xs text-slate-500 mt-1 pl-6">
                                The AI will explain why the correct answer is right in the key.
                            </p>
                          </div>
                      </div>
                    )}

                    {/* Main Inputs */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                            Topic <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input 
                            type="text"
                            placeholder="e.g., Photosynthesis"
                            className={`w-full p-3 bg-white border ${isTopicError || isTopicTooLong ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-teal-500'} rounded-xl focus:ring-2 outline-none transition-all text-sm pr-16 shadow-sm`}
                            value={params.topic}
                            onBlur={() => setTopicTouched(true)}
                            onChange={(e) => {
                                setParams({...params, topic: e.target.value});
                                if (!topicTouched) setTopicTouched(true);
                            }}
                            />
                             <span className={`absolute right-3 top-3.5 text-[10px] font-bold ${isTopicTooLong ? 'text-red-500' : 'text-slate-300'}`}>
                                {params.topic.length}/200
                            </span>
                        </div>
                         {(isTopicError || isTopicTooLong) && (
                            <div className="flex items-center gap-1.5 mt-2 text-red-500 text-xs font-medium animate-pulse">
                                <AlertCircle className="w-3 h-3" />
                                {isTopicTooLong ? 'Topic exceeds limit' : 'Topic is required'}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Subject</label>
                            <input 
                                type="text"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                                value={params.subject}
                                onChange={(e) => setParams({...params, subject: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Grade</label>
                            <select 
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                                value={params.gradeLevel}
                                onChange={(e) => setParams({...params, gradeLevel: e.target.value})}
                            >
                                <option>Elementary</option>
                                <option>Middle School</option>
                                <option>High School</option>
                                <option>College</option>
                                <option>Professional</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Complexity</label>
                             <select 
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                                value={params.complexity}
                                onChange={(e) => setParams({...params, complexity: e.target.value as Complexity})}
                             >
                                {Object.values(Complexity).map(v => <option key={v} value={v}>{v}</option>)}
                             </select>
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Length</label>
                             <select 
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                                value={params.length}
                                onChange={(e) => setParams({...params, length: e.target.value as ContentLength})}
                             >
                                {Object.values(ContentLength).map(v => <option key={v} value={v}>{v}</option>)}
                             </select>
                        </div>
                    </div>
                    
                    <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Custom Instructions</label>
                         <textarea 
                            rows={3}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm resize-none"
                            placeholder="Add specific focus..."
                            value={params.additionalInstructions}
                            onChange={(e) => setParams({...params, additionalInstructions: e.target.value})}
                         />
                    </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-white">
                     {error && (
                        <div className="mb-3 p-3 bg-red-50 text-red-600 text-xs rounded-lg flex items-center gap-2 border border-red-100">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error}
                        </div>
                    )}
                    
                    {/* Progress Bar */}
                    {loading && (
                        <div className="mb-4">
                            <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                                <span>{loadingStage}</span>
                                <span>{Math.round(loadingProgress)}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-teal-500 transition-all duration-300 ease-out"
                                    style={{ width: `${loadingProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <button 
                        onClick={handleGenerate}
                        disabled={loading || isTopicError || isTopicTooLong}
                        className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold rounded-xl shadow-lg shadow-teal-500/30 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center gap-2"
                    >
                        {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Generating...
                        </>
                        ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            Generate Material
                        </>
                        )}
                    </button>
                </div>
            </div>

            {/* Right Container: Output */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative min-w-0">
                {!currentResult ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/30">
                    <div 
                        className="w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center mb-6 cursor-pointer hover:scale-110 transition-transform group"
                        onClick={() => setShowLibrary(true)}
                    >
                      <Sparkles className="w-10 h-10 text-teal-500 group-hover:text-teal-600 group-hover:rotate-12 transition-all" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Your content canvas is empty</h3>
                    <p className="max-w-xs mt-3 text-slate-500 leading-relaxed">
                        Fill out the configuration on the left or <button onClick={() => setShowLibrary(true)} className="text-teal-600 font-semibold hover:underline">load a template from the library</button> to get started.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                        <div className="flex items-center gap-2">
                             <span className="text-xs font-bold uppercase text-slate-400 bg-slate-100 px-2 py-1 rounded">
                                {currentResult.params.template.replace('_', ' ')}
                             </span>
                             <span className="text-slate-300">|</span>
                             <span className="text-sm font-medium text-slate-600 truncate max-w-[200px]">{currentResult.params.topic}</span>
                        </div>
                        <div className="flex gap-2">
                             <button 
                                onClick={handleCopy}
                                className={`p-2 rounded-lg transition-all ${copied ? 'bg-green-100 text-green-700' : 'text-slate-500 hover:bg-slate-100'}`}
                                title="Copy"
                            >
                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </button>
                            <button 
                                onClick={handleExportPDF}
                                className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                PDF
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-50/50 p-4 border-b border-slate-100">
                        <StatsBadge metrics={currentResult.metrics} />
                    </div>

                    <div className="flex-1 overflow-y-auto w-full mx-auto bg-white" id="print-area">
                        <div ref={contentRef} className="p-8 md:p-12 max-w-3xl mx-auto">
                            
                            {/* Generated Image Header */}
                            {currentResult.imageUrl && (
                                <div className="mb-8 rounded-xl overflow-hidden shadow-md border border-slate-100">
                                    <img 
                                        src={currentResult.imageUrl} 
                                        alt="Generated content visualization" 
                                        className="w-full h-auto object-cover max-h-[400px]"
                                    />
                                    <div className="bg-slate-50 px-4 py-2 text-xs text-slate-400 text-right">
                                        AI Generated Illustration
                                    </div>
                                </div>
                            )}

                            {/* Render Content */}
                            {currentResult.quizData ? (
                                <InteractiveQuiz data={currentResult.quizData} />
                            ) : (
                                <article className="prose prose-slate prose-lg max-w-none prose-headings:text-teal-900 prose-headings:font-bold prose-a:text-teal-600 prose-blockquote:border-l-teal-500 prose-blockquote:bg-teal-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:rounded-r-lg">
                                    <ReactMarkdown>{currentResult.content}</ReactMarkdown>
                                </article>
                            )}
                        </div>
                    </div>
                  </>
                )}
            </div>
        </div>

      </div>

      <PromptDocs isOpen={showDocs} onClose={() => setShowDocs(false)} />
      <PromptLibrary 
        isOpen={showLibrary} 
        onClose={() => setShowLibrary(false)} 
        onLoadSample={handleLoadSample} 
      />
    </>
  );
}

export default App;