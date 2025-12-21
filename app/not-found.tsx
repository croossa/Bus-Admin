import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center px-4">
      
      {/* Card Container */}
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full transform transition-all hover:scale-[1.01]">
        
        {/* Icon */}
        <div className="flex justify-center mb-6">
            <div className="bg-red-50 p-6 rounded-full border border-red-100">
                <AlertCircle size={48} className="text-red-500" />
            </div>
        </div>
        
        {/* Text Content */}
        <h1 className="text-6xl font-black text-slate-900 mb-2 tracking-tighter">404</h1>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Page Not Found</h2>
        
        <p className="text-slate-500 mb-8 leading-relaxed">
          Oops! The page you are looking for might have been removed, renamed, or does not exist.
        </p>
        
        {/* Action Button */}
        <Link 
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all w-full group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

      </div>

      {/* Footer Branding */}
      <div className="mt-8 text-slate-400 text-sm font-medium">
        CROSSA<span className="text-yellow-600">ADMIN</span>
      </div>
    </div>
  );
}