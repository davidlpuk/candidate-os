import { useState, useEffect, ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../../contexts/AuthContext";
import {
  LayoutDashboard,
  LayoutList,
  Users,
  Inbox,
  Plus,
  Settings,
} from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  if (!user) return <>{children}</>;

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/pipeline", label: "Pipeline", icon: LayoutList },
    { path: "/contacts", label: "Contacts", icon: Users },
    { path: "/follow-ups", label: "Follow-ups", icon: Inbox },
    { path: "/import", label: "Import", icon: Plus },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="min-h-screen flex bg-gray-900">
      <aside className="hidden md:flex flex-col w-64 bg-gray-800 border-r border-gray-700 fixed h-full">
        <div className="flex items-center gap-2 p-4 border-b border-gray-700">
          <LayoutDashboard className="w-8 h-8 text-blue-400" />
          <span className="text-xl font-bold text-white">CandidateOS</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                location === item.path
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={signOut}
            className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors text-sm font-medium"
          >
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 min-h-screen">
        <header className="md:hidden flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
          <span className="text-xl font-bold text-white">CandidateOS</span>
          <button
            className="text-gray-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </header>

        {mobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
