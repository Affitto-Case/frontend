
import { Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full py-6 border-t flex flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-1 text-sm text-gray-600">
        <span>&copy; {new Date().getFullYear()}</span>
        <span className="font-semibold text-gray-900">Giuseppe Tesse</span>
      </div>
      <div className="flex items-center gap-4">
        <a 
          href="https://www.instagram.com/giuseppe_tesse04/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-500 hover:text-pink-600 transition-colors"
        >
          <Instagram size={20} />
        </a>
        <a 
          href="https://www.linkedin.com/in/giuseppe-tesse-a0656019a" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-500 hover:text-blue-700 transition-colors"
        >
          <Linkedin size={20} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
