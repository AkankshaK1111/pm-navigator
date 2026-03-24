import { Github, Twitter, Linkedin, Compass } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-16 px-4 border-t border-border bg-primary text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <Compass className="w-10 h-10 text-accent" />
              <span className="text-2xl font-bold tracking-tight">PM Navigator</span>
            </div>
            <p className="text-slate-300 max-w-xs leading-relaxed">
              Empowering the next generation of product managers with data-driven career navigation.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-3 rounded-full bg-white/5 hover:bg-accent transition-all"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="p-3 rounded-full bg-white/5 hover:bg-accent transition-all"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="p-3 rounded-full bg-white/5 hover:bg-accent transition-all"><Github className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Platform</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><a href="#" className="hover:text-accent transition-colors">Assessment</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Roadmap</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Readiness</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Resources</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Company</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><a href="#" className="hover:text-accent transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <p>© 2026 PM Navigator. All rights reserved.</p>
          <p className="flex items-center gap-1">Built with <span className="text-accent">❤</span> for aspiring Product Managers.</p>
        </div>
      </div>
    </footer>
  );
}
