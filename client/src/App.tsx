import { useRoutes } from "wouter";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Pipeline from "./pages/Pipeline";
import Contacts from "./pages/Contacts";
import FollowUps from "./pages/FollowUps";
import Import from "./pages/Import";
import Settings from "./pages/Settings";

function App() {
  const routes = useRoutes([
    { path: "/", component: Dashboard },
    { path: "/pipeline", component: Pipeline },
    { path: "/contacts", component: Contacts },
    { path: "/follow-ups", component: FollowUps },
    { path: "/import", component: Import },
    { path: "/auth", component: Auth },
    { path: "/settings", component: Settings },
  ]);

  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
          {routes}
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
