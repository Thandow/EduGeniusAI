import React, { useState } from 'react';
import { QuizData, QuizQuestion } from '../types';
import { CheckCircle, XCircle, RefreshCw, Trophy, ArrowRight, AlertTriangle } from 'lucide-react';

interface InteractiveQuizProps {
  data: QuizData;
  onReset?: () => void;
}

export const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({ data, onReset }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Safety guard for invalid data
  const questions = data?.questions || [];
  if (questions.length === 0) {
    return (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-6 flex items-center gap-3 text-amber-800">
            <AlertTriangle className="w-5 h-5" />
            <p>This quiz cannot be played because no questions were generated correctly.</p>
        </div>
    );
  }

  const currentQuestion = questions[currentQuestionIdx];
  if (!currentQuestion) return null; // Should not happen with check above

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === currentQuestion.correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
    if (onReset) onReset();
  };

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    let feedback = "Good effort!";
    if (percentage >= 90) feedback = "Excellent Master!";
    if (percentage < 60) feedback = "Keep studying!";

    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md mx-auto mt-8 border border-slate-200">
        <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-10 h-10 text-yellow-600" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">{feedback}</h3>
        <p className="text-slate-500 mb-6">You scored {score} out of {questions.length} ({percentage}%)</p>
        
        <button 
          onClick={handleRestart}
          className="bg-teal-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 w-full"
        >
          <RefreshCw className="w-4 h-4" />
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden max-w-2xl mx-auto mt-4">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
        <span className="text-sm font-bold text-slate-500 uppercase">Question {currentQuestionIdx + 1} / {questions.length}</span>
        <span className="text-sm font-bold text-teal-600">Score: {score}</span>
      </div>

      <div className="p-6 md:p-8">
        <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-6 leading-relaxed">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options && currentQuestion.options.map((option, idx) => {
            let statusClass = "border-slate-200 hover:border-teal-500 hover:bg-teal-50";
            let icon = null;

            if (isAnswered) {
              if (idx === currentQuestion.correctAnswerIndex) {
                statusClass = "border-green-500 bg-green-50 text-green-800 ring-1 ring-green-500";
                icon = <CheckCircle className="w-5 h-5 text-green-500" />;
              } else if (idx === selectedOption) {
                statusClass = "border-red-500 bg-red-50 text-red-800";
                icon = <XCircle className="w-5 h-5 text-red-500" />;
              } else {
                statusClass = "border-slate-200 opacity-50";
              }
            } else if (selectedOption === idx) {
              statusClass = "border-teal-500 bg-teal-50 ring-1 ring-teal-500";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center group ${statusClass}`}
              >
                <span className="font-medium">{option}</span>
                {icon}
              </button>
            );
          })}
        </div>

        {/* Explanation & Next Button */}
        {isAnswered && (
          <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-bold">Explanation:</span> {currentQuestion.explanation}
                </p>
            </div>
            <button
              onClick={handleNext}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {currentQuestionIdx === questions.length - 1 ? "Finish Quiz" : "Next Question"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};