import { Router, Route } from "wouter";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/layout/Layout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Pipeline from "./pages/Pipeline";
import Contacts from "./pages/Contacts";
import FollowUps from "./pages/FollowUps";
import Import from "./pages/Import";
import Settings from "./pages/Settings";

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 text-xl">Loading CandidateOS...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
        <Route path="/auth" component={Auth} />

        {user ? (
          <>
            <Route
              path="/"
              component={() => (
                <Layout>
                  <Dashboard />
                </Layout>
              )}
            />
            <Route
              path="/pipeline"
              component={() => (
                <Layout>
                  <Pipeline />
                </Layout>
              )}
            />
            <Route
              path="/contacts"
              component={() => (
                <Layout>
                  <Contacts />
                </Layout>
              )}
            />
            <Route
              path="/follow-ups"
              component={() => (
                <Layout>
                  <FollowUps />
                </Layout>
              )}
            />
            <Route
              path="/import"
              component={() => (
                <Layout>
                  <Import />
                </Layout>
              )}
            />
            <Route
              path="/settings"
              component={() => (
                <Layout>
                  <Settings />
                </Layout>
              )}
            />
          </>
        ) : (
          <Route
            path="/"
            component={() => (
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-white mb-4">
                    CandidateOS
                  </h1>
                  <p className="text-gray-400 mb-8">
                    Job application management system
                  </p>
                  <a href="/auth" className="btn btn-primary text-lg px-8 py-3">
                    Sign In to Continue
                  </a>
                </div>
              </div>
            )}
          />
        )}
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
