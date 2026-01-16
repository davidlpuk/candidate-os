import { Router, Route } from "wouter";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/layout/Layout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Pipeline from "./pages/Pipeline";
import Contacts from "./pages/Contacts";
import FollowUps from "./pages/FollowUps";
import Import from "./pages/Import";
import Settings from "./pages/Settings";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
            <Route path="/auth" component={Auth} />
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
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
