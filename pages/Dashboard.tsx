import React, { useState, useEffect } from 'react';
import { User, Certificate, Quiz } from '../types';
import { getUserCertificates } from '../services/storageService';
import { generateQuizFromTopic } from '../services/geminiService';
import Input from '../components/Input';
import Button from '../components/Button';
import CertificateCard from '../components/CertificateCard';
import FullCertificate from '../components/FullCertificate';
import { PlusCircle, Youtube, Loader2, Award, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardPageProps {
  user: User;
  onStartQuiz: (quiz: Quiz) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, onStartQuiz }) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loadingCerts, setLoadingCerts] = useState(true);
  const [viewingCert, setViewingCert] = useState<Certificate | null>(null);
  
  const [videoUrl, setVideoUrl] = useState('');
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState('');

  useEffect(() => {
    getUserCertificates(user.id)
      .then(data => setCertificates(data))
      .catch(err => console.error("Failed to load certs", err))
      .finally(() => setLoadingCerts(false));
  }, [user.id]);

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl || !topic) {
        setGenError("Please provide both the video URL and the topic.");
        return;
    }
    setGenError('');
    setIsGenerating(true);
    try {
        const questions = await generateQuizFromTopic(topic, videoUrl);
        const newQuiz: Quiz = {
            id: Date.now().toString(),
            videoUrl,
            topic,
            questions,
            createdAt: new Date().toISOString()
        };
        onStartQuiz(newQuiz);
    } catch (err: any) {
        setGenError(err.message || "Failed to generate quiz.");
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0c] text-white overflow-hidden">
      {/* Leonardo-style Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-purple-600/20 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -80, 0],
            y: [0, 100, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-blue-600/20 blur-[120px] rounded-full"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Section */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="text-xs font-bold tracking-widest uppercase text-purple-400">Dashboard</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500">
              Welcome, {user.username}
            </h1>
            <p className="text-slate-400 mt-2 text-lg">Unleash your learning potential with AI assessments.</p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Create Quiz Card (Left) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4"
          >
            <div className="bg-[#16161a]/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-gradient-to-br from-red-500 to-orange-600 p-3 rounded-2xl shadow-lg shadow-red-500/20">
                    <Youtube className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">New Assessment</h2>
                    <p className="text-xs text-slate-400">Convert video to knowledge</p>
                  </div>
                </div>

                <form onSubmit={handleCreateQuiz} className="space-y-6">
                  <div className="space-y-2">
                    <Input 
                        label="YouTube Video Link"
                        placeholder="Paste URL here..."
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="bg-[#0f0f12] border-white/5 focus:border-purple-500/50 transition-all"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">Video Topic / Content Summary</label>
                    <textarea 
                        className="w-full px-4 py-3 bg-[#0f0f12] border border-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent min-h-[120px] text-sm text-slate-200 placeholder:text-slate-600 transition-all"
                        placeholder="e.g. Master React Hooks in 10 minutes..."
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                    />
                  </div>

                  {genError && (
                    <div className="p-3 bg-red-500/10 text-red-400 text-xs rounded-xl border border-red-500/20">
                        {genError}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]" 
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing...</>
                    ) : (
                        <><Zap className="w-5 h-5 mr-2 fill-current" /> Generate Quiz</>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </motion.div>

          {/* Certificates Section (Right) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8 space-y-8"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
               <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Award className="w-6 h-6 text-blue-400" />
                  My Collection
                  <span className="bg-white/5 text-slate-400 text-xs py-1 px-3 rounded-full border border-white/10">
                      {certificates.length} Earned
                  </span>
               </h2>
            </div>

            {loadingCerts ? (
               <div className="flex flex-col items-center justify-center p-24 bg-[#16161a]/40 rounded-3xl border border-white/5">
                  <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
                  <p className="text-slate-500 animate-pulse">Fetching your achievements...</p>
               </div>
            ) : certificates.length === 0 ? (
                <div className="bg-[#16161a]/40 backdrop-blur-md border border-dashed border-white/10 rounded-3xl p-16 text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Award className="w-10 h-10 text-slate-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Ready to start?</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">Complete assessments with an 80% score to populate your gallery with unique certificates.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {certificates.map((cert, index) => (
                      <motion.div
                        key={cert.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <CertificateCard 
                           certificate={cert} 
                           onClick={() => setViewingCert(cert)} 
                        />
                      </motion.div>
                    ))}
                </div>
            )}
          </motion.div>
        </div>

        <AnimatePresence>
          {viewingCert && (
              <FullCertificate 
                certificate={viewingCert} 
                onClose={() => setViewingCert(null)} 
              />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardPage;