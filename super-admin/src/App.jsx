import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import SuperAdminLogin from './pages/SuperAdminLogin';
import SuperAdminInvite from './pages/SuperAdminInvite';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/super-admin/login" element={<SuperAdminLogin />} />
        <Route path="/super-admin/invite" element={<SuperAdminInvite />} />
        <Route path="/" element={<Navigate to="/super-admin/login" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
