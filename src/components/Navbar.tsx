import { Compass, User, LayoutDashboard, Target, Map, MessageSquare, Briefcase, ShieldCheck, Moon, Sun, LogOut, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/src/lib/auth-context";
import { signOut } from "@/src/lib/supabase-storage";
import { useXP } from "@/src/hooks/useXP";

export default function Navbar() {
  const { user } = useAuth();
  const { streakXP, level } = useXP();

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark") || 
             localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <nav className="fixed top-0 w-full border-b border-border bg-background/80 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <Compass className="w-8 h-8 text-accent" />
            <span className="text-xl font-bold tracking-tight text-primary">PM Navigator</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link to="/assessment" className="hover:text-accent transition-colors flex items-center gap-1">
              <Target className="w-4 h-4" /> Assessment
            </Link>
            <Link to="/roadmap" className="hover:text-accent transition-colors flex items-center gap-1">
              <Map className="w-4 h-4" /> Roadmap
            </Link>
            <Link to="/dashboard" className="hover:text-accent transition-colors flex items-center gap-1">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
            <Link to="/mock-interview" className="hover:text-accent transition-colors flex items-center gap-1">
              <MessageSquare className="w-4 h-4" /> Mock Interview
            </Link>
            <Link to="/gate" className="hover:text-accent transition-colors flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Gate
            </Link>
            <Link to="/jobs" className="hover:text-accent transition-colors flex items-center gap-1">
              <Briefcase className="w-4 h-4" /> Jobs
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {/* Streak & Level indicators */}
            {streakXP.totalXP > 0 && (
              <>
                <Link
                  to="/dashboard"
                  className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                    streakXP.currentStreak > 0
                      ? 'bg-orange-500/10 text-orange-500'
                      : 'bg-secondary text-muted-foreground'
                  }`}
                  title={`${streakXP.currentStreak} day streak`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  {streakXP.currentStreak}
                </Link>
                <Link
                  to="/dashboard"
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold"
                  title={level.title}
                >
                  Lv {level.level}
                </Link>
              </>
            )}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-secondary transition-colors text-primary"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/dashboard" className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold">
                  {user.email?.[0]?.toUpperCase() || 'U'}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="p-2 rounded-full hover:bg-secondary transition-colors text-primary">
                <User className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
