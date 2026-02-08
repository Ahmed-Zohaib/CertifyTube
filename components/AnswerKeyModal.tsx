import React from 'react';
import { Certificate } from '../types';
import { BookOpen, CheckCircle, XCircle } from 'lucide-react';

interface AnswerKeyModalProps {
  certificate: Certificate;
  onClose: () => void;
}

const AnswerKeyModal: React.FC<AnswerKeyModalProps> = ({ certificate, onClose }) => {
  // Guard clause: If data is missing, don't render a broken UI.
  if (!certificate.questions || certificate.questions.length === 0) {
    return null; 
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-auto my-8 overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-800">Assessment Review</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-6">
            {certificate.questions.map((q, idx) => {
              const userAnswer = certificate.userAnswers?.[idx];
              const isCorrect = userAnswer === q.correctAnswerIndex;
              
              return (
                <div key={idx} className="p-4 rounded-xl border-2 transition-all" style={{ borderColor: isCorrect ? '#dcfce7' : '#fee2e2' }}>
                  <div className="flex items-start gap-3 mb-3">
                    <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {idx + 1}
                    </span>
                    <p className="font-semibold text-slate-800 pt-1">{q.question}</p>
                  </div>

                  <div className="space-y-2 pl-11">
                    {q.options.map((opt, optIdx) => {
                      const correctOpt = optIdx === q.correctAnswerIndex;
                      const picked = optIdx === userAnswer;
                      
                      let optionStyle = "bg-slate-50 text-slate-600 border-transparent";
                      if (correctOpt) optionStyle = "bg-green-50 text-green-800 border-green-200 ring-1 ring-green-200";
                      else if (picked && !correctOpt) optionStyle = "bg-red-50 text-red-800 border-red-200 ring-1 ring-red-200";

                      return (
                        <div key={optIdx} className={`p-3 rounded-lg border flex items-center justify-between ${optionStyle}`}>
                          <span className="text-sm">{opt}</span>
                          {correctOpt && <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />}
                          {picked && !correctOpt && <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm"
          >
            Close Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnswerKeyModal;