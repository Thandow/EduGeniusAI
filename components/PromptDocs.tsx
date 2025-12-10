import React from 'react';
import { X, DollarSign, Activity, AlertTriangle, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { PROMPT_METHODOLOGY, COST_PER_1K_INPUT, COST_PER_1K_OUTPUT } from '../constants';

interface PromptDocsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PromptDocs: React.FC<PromptDocsProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
          <div className="flex items-center gap-2">
            <div className="bg-teal-100 p-1.5 rounded-lg">
                <Info className="w-5 h-5 text-teal-700" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Prompt Engineering Methodology</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-full p-1 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Methodology Section */}
            <section className="prose prose-sm prose-slate max-w-none">
                <ReactMarkdown>{PROMPT_METHODOLOGY}</ReactMarkdown>
            </section>

            {/* Usage Costs Section */}
            <section className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Usage Costs (Estimated)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Input Cost</span>
                        <div className="text-2xl font-bold text-slate-800 mt-1">${(COST_PER_1K_INPUT * 1000).toFixed(2)} <span className="text-xs font-normal text-slate-500">/ 1M Tokens</span></div>
                        <p className="text-xs text-slate-400 mt-2">Prompts & System Instructions</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Output Cost</span>
                        <div className="text-2xl font-bold text-slate-800 mt-1">${(COST_PER_1K_OUTPUT * 1000).toFixed(2)} <span className="text-xs font-normal text-slate-500">/ 1M Tokens</span></div>
                        <p className="text-xs text-slate-400 mt-2">Generated Educational Content</p>
                    </div>
                </div>
                <p className="text-xs text-slate-500 mt-3 italic">
                    * Costs are approximations based on Gemini Flash pricing. Actual billing depends on your specific Google Cloud API project settings.
                </p>
            </section>

            {/* Rate Limits Section */}
            <section className="bg-orange-50 border border-orange-100 rounded-xl p-5">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-orange-600" />
                    Rate Limits & Performance
                </h3>
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="bg-white p-2 rounded-full shadow-sm">
                             <AlertTriangle className="w-4 h-4 text-orange-500" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-slate-800">RPM (Requests Per Minute)</h4>
                            <p className="text-xs text-slate-600 mt-1">
                                The Free Tier allows for approximately 15 RPM. The Pay-as-you-go tier scales significantly higher. 
                                This application handles 429 (Too Many Requests) errors by alerting the user to wait.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="bg-white p-2 rounded-full shadow-sm">
                             <Activity className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-slate-800">TPM (Tokens Per Minute)</h4>
                            <p className="text-xs text-slate-600 mt-1">
                                Limits are generally around 1 million TPM. Given the textual nature of educational content, 
                                it is unlikely to hit this limit unless generating extremely long lesson plans in bulk.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

             <div className="pt-4 border-t border-slate-200">
                <h3 className="text-sm font-bold text-slate-800 uppercase mb-2">Technical Specs</h3>
                <ul className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <li><span className="font-semibold">Model:</span> Gemini 2.5 Flash</li>
                    <li><span className="font-semibold">Context Window:</span> 1,000,000 Tokens</li>
                    <li><span className="font-semibold">Avg. Latency:</span> ~1.5s per request</li>
                    <li><span className="font-semibold">Safety:</span> Standard Google AI Safety Settings</li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
};