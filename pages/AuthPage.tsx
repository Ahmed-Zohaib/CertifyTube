import React, { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { loginUser, registerUser } from '../services/storageService';
import { User } from '../types';

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
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
       <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-500 mt-2">
              {mode === 'login' ? 'Enter your details to access your certificates.' : 'Start your learning journey today.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
             {mode === 'register' && (
               <Input 
                 label="Username" 
                 placeholder="johndoe"
                 value={username}
                 onChange={e => setUsername(e.target.value)}
               />
             )}
             <Input 
                 label="Email Address" 
                 type="email"
                 placeholder="john@example.com"
                 value={email}
                 onChange={e => setEmail(e.target.value)}
             />
             <Input 
                 label="Password" 
                 type="password"
                 placeholder="••••••••"
                 value={password}
                 onChange={e => setPassword(e.target.value)}
             />

             {error && (
               <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                 {error}
               </div>
             )}

             <Button type="submit" className="w-full" isLoading={isLoading}>
               {mode === 'login' ? 'Sign In' : 'Sign Up'}
             </Button>
          </form>

          <div className="mt-6 text-center text-sm">
             <span className="text-slate-500">
               {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
             </span>
             <button 
               onClick={onToggleMode}
               className="font-medium text-blue-600 hover:text-blue-800"
             >
               {mode === 'login' ? 'Sign Up' : 'Sign In'}
             </button>
          </div>
          
          <div className="mt-4 text-center">
            <button onClick={onBack} className="text-xs text-slate-400 hover:text-slate-600">
                Back to Home
            </button>
          </div>
       </div>
    </div>
  );
};

export default AuthPage;