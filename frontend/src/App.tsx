import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import MarketplaceDesktop from "./MarketplaceDesktop";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/marketplace" element={<MarketplaceDesktop />} />
      <Route path="*" element={<div style={{padding:24}}>404</div>} />
    </Routes>
  );
}
