import { Routes, Route } from "react-router-dom";
import { Web3Provider } from "./context/Web3Context";
import Navbar from "./components/layout/Navbar";
import Ticker from "./components/layout/Ticker";
import Footer from "./components/layout/Footer";
import LandingPage from "./pages/LandingPage";
import UserPage from "./pages/UserPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <Web3Provider>
      <div className="app-layout">
        <Navbar />
        <Ticker />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<UserPage />} />
            <Route path="/submit" element={<UserPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Web3Provider>
  );
}
