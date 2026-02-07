import React, { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { loginUser, registerUser } from '../services/storageService';
import { User } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';

interface AuthPageProps {
  mode: 'login' | 'register';
  onSuccess: (user: User) => void;
  onToggleMode: () => void;
  onBack: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ mode, onSuccess, onToggleMode, onBack }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        let user: User;
        if (mode === 'register') {
          if (!username || !email || !password) throw new Error("All fields are required");
          user = await registerUser(username, email, password);
        } else {
           if (!email || !password) throw new Error("All fields are required");
           user = await loginUser(email, password);
        }
        onSuccess(user);
    } catch (err: any) {
        setError(err.message || "Authentication failed");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0a0a0c] text-white p-4 overflow-hidden">
      
      {/* Leonardo-style Animated Background Auras */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-[#16161a]/80 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl border border-white/10 mb-6">
                <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              {mode === 'login' ? 'Welcome Back' : 'Join the Future'}
            </h2>
            <p className="text-slate-500 mt-3 text-sm font-medium uppercase tracking-wider">
              {mode === 'login' ? 'Access your AI certificates' : 'Start your journey today'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
             <AnimatePresence mode='wait'>
               {mode === 'register' && (
                 <motion.div
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   exit={{ opacity: 0, height: 0 }}
                 >
                    <Input 
                      label="Username" 
                      placeholder="Enter a username"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="py-4"
                    />
                 </motion.div>
               )}
             </AnimatePresence>

             <Input 
                 label="Email Address" 
                 type="email"
                 placeholder="name@company.com"
                 value={email}
                 onChange={e => setEmail(e.target.value)}
                 className="py-4"
             />
             <Input 
                 label="Password" 
                 type="password"
                 placeholder="••••••••"
                 value={password}
                 onChange={e => setPassword(e.target.value)}
                 className="py-4"
             />

             {error && (
               <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-red-500/10 text-red-400 text-xs rounded-xl border border-red-500/20 flex items-center gap-2"
               >
                 <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                 {error}
               </motion.div>
             )}

             <Button 
                type="submit" 
                className="w-full py-8 text-lg" 
                isLoading={isLoading}
                variant="primary"
             >
               {mode === 'login' ? 'Sign In' : 'Create Account'}
             </Button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 text-center">
             <button 
               onClick={onToggleMode}
               className="text-sm font-semibold text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
             >
               {mode === 'login' ? "New here? Create account" : "Already a member? Sign in"}
             </button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <button 
              onClick={onBack} 
              className="group inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-purple-400 transition-all uppercase tracking-widest"
            >
              <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
              Return to Entrance
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;