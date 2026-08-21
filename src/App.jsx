import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import Incidents from "./pages/Incidents";
import Responders from "./pages/Responders";
import Map from "./pages/Map";
import Alerts from "./pages/Alerts";
import Analytics from "./pages/Analytics";
import CCTV from "./pages/CCTV";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

function Layout({ children }) {
  return (
    <div className="app">

      <Sidebar />

      <main className="main-content">

        <Navbar />

        {children}

      </main>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* PUBLIC */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* PROTECTED */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/incidents"
          element={
            <ProtectedRoute>
              <Layout>
                <Incidents />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/responders"
          element={
            <ProtectedRoute>
              <Layout>
                <Responders />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <Layout>
                <Map />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/alerts"
          element={
            <ProtectedRoute>
              <Layout>
                <Alerts />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Layout>
                <Analytics />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/cctv"
          element={
            <ProtectedRoute>
              <Layout>
                <CCTV />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Layout>
                <Reports />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;