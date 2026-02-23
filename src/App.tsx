import { Routes, Route, Navigate } from "react-router-dom";
import MainWedding from "./pages/MainWedding";
function Invite() {
  return <div className="p-6 text-2xl font-bold">Invite</div>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainWedding />} />
      <Route path="/invite" element={<Invite />} />

      {/* ✅ 포워딩(리다이렉트) */}
      <Route path="/wedding" element={<Navigate to="/invite" replace />} />

      {/* ✅ 없는 경로는 홈으로 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
