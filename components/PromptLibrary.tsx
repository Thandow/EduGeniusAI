import React, { useState } from 'react';
import { X, ArrowRight, LayoutTemplate, FileText, BarChart2 } from 'lucide-react';
import { SAMPLES, PROMPT_COMPARISONS, TEMPLATES } from '../constants';
import { SampleContent, Complexity, ContentLength } from '../types';

interface PromptLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadSample: (sample: SampleContent) => void;
}

type Tab = 'samples' | 'matrix' | 'templates';

export const PromptLibrary: React.FC<PromptLibraryProps> = ({ isOpen, onClose, onLoadSample }) => {
  const [activeTab, setActiveTab] = useState<Tab>('samples');
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-teal-500 to-teal-700 p-3 rounded-xl shadow-lg shadow-teal-500/20 text-white">
                <LayoutTemplate className="w-6 h-6" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Prompt Library</h2>
                <p className="text-sm text-slate-500 mt-1">Explore optimized templates and see the science behind the prompts.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-800 transition-colors bg-slate-100 p-2 rounded-full hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-8">
            <button 
                onClick={() => setActiveTab('samples')}
                className={`py-4 px-6 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'samples' ? 'border-teal-600 text-teal-700 bg-teal-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
                <FileText className="w-4 h-4" />
                Sample Gallery
            </button>
            <button 
                onClick={() => setActiveTab('matrix')}
                className={`py-4 px-6 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'matrix' ? 'border-teal-600 text-teal-700 bg-teal-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
                <BarChart2 className="w-4 h-4" />
                Engineering Matrix
            </button>
            <button 
                onClick={() => setActiveTab('templates')}
                className={`py-4 px-6 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'templates' ? 'border-teal-600 text-teal-700 bg-teal-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
                <LayoutTemplate className="w-4 h-4" />
                Template Source
            </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
            
            {/* SAMPLES TAB */}
            {activeTab === 'samples' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {SAMPLES.map((sample) => (
                        <div 
                            key={sample.id} 
                            className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer transform hover:-translate-y-1"
                            onClick={() => { onLoadSample(sample); onClose(); }}
                        >
                            <div className="h-48 overflow-hidden relative">
                                <img 
                                    src={sample.imageUrl} 
                                    alt={sample.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                     <span className="text-xs font-bold uppercase tracking-wider text-white bg-teal-600/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-white/20">
                                        {sample.params.template.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-bold text-lg text-slate-800 mb-2 leading-tight group-hover:text-teal-700 transition-colors">
                                    {sample.title}
                                </h3>
                                <p className="text-sm text-slate-500 line-clamp-3 mb-4 flex-1">
                                    {sample.description}
                                </p>
                                
                                <div className="flex items-center gap-2 mt-auto">
                                    <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                        {sample.params.subject}
                                    </span>
                                    <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                        {sample.params.gradeLevel}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                                <span className="text-sm font-medium text-teal-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                                    Load Template <ArrowRight className="w-4 h-4" />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MATRIX TAB */}
            {activeTab === 'matrix' && (
                <div className="space-y-8 max-w-5xl mx-auto">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex gap-4 items-start">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mt-1">
                            <BarChart2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-blue-900 font-bold text-lg">Iterative Refinement Process</h4>
                            <p className="text-sm text-blue-800 mt-1">
                                This matrix demonstrates the prompt engineering evolution for EduGenie. We moved from naive zero-shot prompts to the current complex, persona-driven structures to ensure high-quality educational output.
                            </p>
                        </div>
                    </div>

                    {PROMPT_COMPARISONS.map((comp) => (
                        <div key={comp.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h3 className="font-bold text-lg text-slate-800">{comp.scenario}</h3>
                                <span className="text-xs bg-teal-100 text-teal-800 px-3 py-1.5 rounded-full font-bold border border-teal-200">
                                    💡 Insight: {comp.insight}
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 bg-white">
                                            <th className="p-5 w-32">Version</th>
                                            <th className="p-5 w-1/3">Prompt Strategy</th>
                                            <th className="p-5 w-1/3">Outcome Analysis</th>
                                            <th className="p-5 w-32 text-center">Quality</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {comp.iterations.map((iter, idx) => (
                                            <tr key={idx} className={`border-b border-slate-100 last:border-0 ${idx === comp.iterations.length - 1 ? 'bg-green-50/30' : ''}`}>
                                                <td className="p-5 font-bold text-slate-700 align-top">
                                                    {iter.version}
                                                    {idx === comp.iterations.length - 1 && (
                                                        <div className="mt-1 inline-block text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200">
                                                            ACTIVE
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-5 align-top">
                                                    <div className="font-mono text-xs text-slate-600 bg-slate-100 rounded-lg p-3 border border-slate-200 shadow-inner">
                                                        "{iter.promptSnippet}"
                                                    </div>
                                                </td>
                                                <td className="p-5 text-slate-600 align-top leading-relaxed">{iter.outcome}</td>
                                                <td className="p-5 align-top">
                                                    <div className="flex items-center justify-center gap-1 bg-slate-100 py-2 rounded-lg">
                                                        {[...Array(5)].map((_, i) => (
                                                            <div key={i} className={`w-2 h-2 rounded-full ${i < iter.qualityScore ? 'bg-teal-500' : 'bg-slate-300'}`} />
                                                        ))}
                                                    </div>
                                                    <div className="text-center text-xs font-bold text-slate-400 mt-1">{iter.qualityScore}/5</div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* TEMPLATES TAB */}
            {activeTab === 'templates' && (
                <div className="grid gap-8 max-w-5xl mx-auto">
                     <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                        <h4 className="text-yellow-900 font-bold flex items-center gap-2">
                             <LayoutTemplate className="w-5 h-5" />
                             Transparency Mode
                        </h4>
                        <p className="text-sm text-yellow-800 mt-2">
                            These are the actual live templates currently running in the application. We believe in open-source prompt engineering.
                        </p>
                    </div>
                    {Object.values(TEMPLATES).map((tmpl) => (
                        <div key={tmpl.id} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-xl text-slate-800">{tmpl.label}</h3>
                                <code className="text-xs bg-slate-100 px-3 py-1.5 rounded-md text-slate-500 border border-slate-200 font-mono">{tmpl.id}</code>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">System Prompt</h4>
                                    <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-xs leading-relaxed shadow-inner">
                                        {tmpl.systemPrompt}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">User Prompt Skeleton</h4>
                                    <div className="bg-slate-50 text-slate-700 p-4 rounded-xl font-mono text-xs whitespace-pre-wrap border border-slate-200 leading-relaxed">
                                        {tmpl.userPromptTemplate({
                                            topic: '[TOPIC]',
                                            subject: '[SUBJECT]',
                                            gradeLevel: '[GRADE]',
                                            template: tmpl.id,
                                            complexity: Complexity.INTERMEDIATE,
                                            length: ContentLength.MEDIUM,
                                            additionalInstructions: '[EXTRA_INSTRUCTIONS]'
                                        }).trim()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
