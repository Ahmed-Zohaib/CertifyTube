import React from 'react';
import Button from '../components/Button';
import { CheckCircle2, PlayCircle, ShieldCheck, Trophy } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
  onVerifyClick: () => void;
  isLoggedIn: boolean;
  onDashboardClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ 
  onLoginClick, 
  onVerifyClick, 
  isLoggedIn, 
  onDashboardClick 
}) => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Turn <span className="text-blue-600">Watching</span> into <span className="text-blue-600">Achieving</span>.
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
               CertifyTube uses AI to generate quizzes from any educational video. Pass the quiz, earn a verifiable certificate, and showcase your knowledge.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               {isLoggedIn ? (
                 <Button onClick={onDashboardClick} className="w-full sm:w-auto text-lg px-8 py-4">
                    Go to Dashboard
                 </Button>
               ) : (
                 <Button onClick={onLoginClick} className="w-full sm:w-auto text-lg px-8 py-4">
                    Get Started Free
                 </Button>
               )}
               <Button variant="outline" onClick={onVerifyClick} className="w-full sm:w-auto text-lg px-8 py-4">
                  Verify a Certificate
               </Button>
            </div>
         </div>
         
         {/* Decoration */}
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100 rounded-full blur-3xl opacity-50"></div>
         </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 bg-slate-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                    <PlayCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Watch & Learn</h3>
                  <p className="text-slate-500">Paste any YouTube link. Our AI analyzes the video topic and prepares a comprehensive assessment for you.</p>
               </div>
               <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                    <Trophy className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Test Your Skills</h3>
                  <p className="text-slate-500">Take the generated quiz. Score 80% or higher to prove your mastery of the material.</p>
               </div>
               <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                    <ShieldCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Get Certified</h3>
                  <p className="text-slate-500">Receive a unique, ID-verifiable certificate. Share it on LinkedIn or your portfolio.</p>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default LandingPage;
