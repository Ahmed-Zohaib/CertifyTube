import React, { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { getCertificateById } from '../services/storageService';
import { Certificate } from '../types';
import { Search, CheckCircle, Shield, ArrowLeft, Loader2 } from 'lucide-react';
import FullCertificate from '../components/FullCertificate';

interface VerifyPageProps {
  onBack: () => void;
}

const VerifyPage: React.FC<VerifyPageProps> = ({ onBack }) => {
  const [certId, setCertId] = useState('');
  const [result, setResult] = useState<Certificate | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showFullCert, setShowFullCert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) return;
    
    setIsLoading(true);
    try {
        const cert = await getCertificateById(certId.trim());
        setResult(cert);
        setHasSearched(true);
    } catch (error) {
        console.error(error);
        setResult(null);
        setHasSearched(true);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex flex-col items-center pt-16 px-4">
       <div className="w-full max-w-xl text-center mb-8">
           <div className="bg-white p-4 rounded-full shadow-sm w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-blue-600" />
           </div>
           <h1 className="text-3xl font-bold text-slate-900 mb-2">Certificate Verification</h1>
           <p className="text-slate-500">
               Enter a unique certificate ID to verify its authenticity and view the achievement details.
           </p>
       </div>

       <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <form onSubmit={handleVerify} className="space-y-4">
             <Input 
                placeholder="Enter Certificate ID (e.g. 8A2F9...)"
                value={certId}
                onChange={e => {
                    setCertId(e.target.value);
                    setHasSearched(false);
                }}
                className="text-center font-mono tracking-wider"
             />
             <Button type="submit" className="w-full" disabled={!certId || isLoading}>
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <>
                        <Search className="w-4 h-4 mr-2" /> Verify Credential
                    </>
                )}
             </Button>
          </form>

          {hasSearched && (
              <div className="mt-8 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-top-4">
                  {result ? (
                      <div className="text-center">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <CheckCircle className="w-6 h-6 text-green-600" />
                          </div>
                          <h3 className="text-lg font-bold text-slate-900">Valid Certificate Found</h3>
                          <div className="text-sm text-slate-500 mt-2 space-y-1">
                              <p>Issued to: <span className="font-semibold text-slate-800">{result.userName}</span></p>
                              <p>Topic: <span className="font-semibold text-slate-800">{result.topic}</span></p>
                              <p>Date: {new Date(result.issuedAt).toLocaleDateString()}</p>
                          </div>
                          <Button 
                            variant="outline" 
                            className="mt-4 w-full"
                            onClick={() => setShowFullCert(true)}
                          >
                            View Full Certificate
                          </Button>
                      </div>
                  ) : (
                      <div className="text-center text-slate-500">
                          <p className="font-semibold text-red-500 mb-1">No Certificate Found</p>
                          <p className="text-sm">The ID provided does not match any valid records in our database.</p>
                      </div>
                  )}
              </div>
          )}
       </div>
       
       <button onClick={onBack} className="mt-8 flex items-center text-slate-400 hover:text-slate-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
       </button>

       {showFullCert && result && (
           <FullCertificate certificate={result} onClose={() => setShowFullCert(false)} />
       )}
    </div>
  );
};

export default VerifyPage;