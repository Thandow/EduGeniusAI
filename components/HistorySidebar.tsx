import React from 'react';
import { GeneratedContent } from '../types';
import { BookOpen, HelpCircle, Trash2, History, LayoutTemplate } from 'lucide-react';

interface HistorySidebarProps {
  history: GeneratedContent[];
  onSelect: (item: GeneratedContent) => void;
  onDelete: (id: string) => void;
  onOpenDocs: () => void;
  onOpenLibrary: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onSelect, onDelete, onOpenDocs, onOpenLibrary }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-200 bg-white space-y-3">
        <div className="flex justify-between items-center">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <History className="w-5 h-5 text-teal-600" />
            History
            </h2>
             <button 
                onClick={onOpenDocs} 
                className="text-slate-400 hover:text-teal-600 transition-colors p-1"
                title="Methodology Docs"
            >
                <HelpCircle className="w-5 h-5" />
            </button>
        </div>
        
        <button 
            onClick={onOpenLibrary}
            className="w-full py-2 px-3 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 border border-teal-100"
        >
            <LayoutTemplate className="w-4 h-4" />
            Open Prompt Library
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {history.length === 0 ? (
          <div className="text-center p-4 text-slate-400 text-sm italic">
            No saved history yet.
          </div>
        ) : (
          history.map((item) => (
            <div 
              key={item.id} 
              className="group relative bg-white border border-slate-200 rounded-md p-3 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onSelect(item)}
            >
              <div className="flex items-start justify-between">
                <div>
                   <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">
                    {item.params.template.replace('_', ' ')}
                  </span>
                  <h3 className="text-sm font-medium text-slate-800 mt-1 line-clamp-1">{item.params.topic}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(item.timestamp).toLocaleDateString()} • {item.params.gradeLevel}
                  </p>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};