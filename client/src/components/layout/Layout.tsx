import { Link, useLocation } from "wouter";
import { useAuth } from "../contexts/AuthContext";
import {
  Home,
  LayoutDashboard,
  LayoutList,
  Users,
  Calendar,
  Inbox,
  Plus,
  Settings,
  Moon,
  Sun,
} from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return children;

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/pipeline", label: "Pipeline", icon: LayoutList },
    { path: "/contacts", label: "Contacts", icon: Users },
    { path: "/follow-ups", label: "Follow-ups", icon: Inbox },
    { path: "/import", label: "Import", icon: Plus },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex">
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-2">
            <LayoutDashboard className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold text-white">CandidateOS</span>
          </Link>
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                location.pathname === item.path
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
            className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
          >
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64">
        <header className="md:hidden flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
          <span className="text-xl font-bold text-white">CandidateOS</span>
          <button
            className="text-gray-400 hover:text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="text-2xl">&#9776;</span>
          </button>
        </header>

        {children}
      </main>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
