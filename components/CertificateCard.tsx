import React from 'react';
import { Certificate } from '../types';
import { Award, Calendar, CheckCircle, ExternalLink } from 'lucide-react';

interface CertificateCardProps {
  certificate: Certificate;
  onClick: () => void;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ certificate, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Award className="w-24 h-24 text-blue-600" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-green-600 mb-3">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Verified Credential</span>
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 line-clamp-2 mb-2">
          {certificate.topic}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <Calendar className="w-4 h-4" />
          <span>{new Date(certificate.issuedAt).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center justify-between mt-4">
           <div className="text-xs font-mono text-slate-400">
             ID: {certificate.id.substring(0, 8)}...
           </div>
           <div className="inline-flex items-center text-blue-600 text-sm font-medium group-hover:underline">
             View Details <ExternalLink className="w-3 h-3 ml-1" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateCard;
