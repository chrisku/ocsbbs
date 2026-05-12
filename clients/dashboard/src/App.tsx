import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
// Identity
import LoginPage from './pages/auth/LoginPage';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
// Dashboard
import Home from './pages/Home';
// Users / User Companies
import UserList from './pages/users/Index';
import CreateUser from './pages/users/Create';
import EditUser from './pages/users/Edit';
import UserCompaniesList from './pages/userCompanies/Index';
import ShowUserCompany from './pages/userCompanies/Show';
// Ads
import AdList from './pages/ads/Index';
import CreateAd from './pages/ads/Create';
import EditAd from './pages/ads/Edit';
// Ads
import AreaList from './pages/areas/Index';
import CreateArea from './pages/areas/Create';
import EditArea from './pages/areas/Edit';
// Hot Topics
import HotTopicList from './pages/hotTopics/Index';
import CreateHotTopic from './pages/hotTopics/Create';
import EditHotTopic from './pages/hotTopics/Edit';

// ── Guards ────────────────────────────────────────────────────────────────────

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

// ── Route config ──────────────────────────────────────────────────────────────

const protectedRoutes = [
  // Users
  { path: '/users',                   element: <UserList /> },
  { path: '/users/create',            element: <CreateUser /> },
  { path: '/users/:id/edit',          element: <EditUser /> },
  // User Companies
  { path: '/user-companies',          element: <UserCompaniesList /> },
  { path: '/user-companies/:id/show', element: <ShowUserCompany /> },
  // Ads
  { path: '/ads',                     element: <AdList /> },
  { path: '/ads/create',              element: <CreateAd /> },
  { path: '/ads/:id/edit',            element: <EditAd /> },
  // Areas
  { path: '/areas',                     element: <AreaList /> },
  { path: '/areas/create',              element: <CreateArea /> },
  { path: '/areas/:id/edit',            element: <EditArea /> },  
  // Hot Topics
  { path: '/hot-topics',              element: <HotTopicList /> },
  { path: '/hot-topics/create',       element: <CreateHotTopic /> },
  { path: '/hot-topics/:id/edit',     element: <EditHotTopic /> },
];

// ── App ───────────────────────────────────────────────────────────────────────

const App = () => (
  <Routes>
    {/* Public */}
    <Route path="/login"           element={<LoginPage />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password"  element={<ResetPassword />} />

    {/* Home */}
    <Route path="/" element={<ProtectedLayout><Home /></ProtectedLayout>} />

    {/* Protected */}
    {protectedRoutes.map(({ path, element }) => (
      <Route key={path} path={path} element={<ProtectedLayout>{element}</ProtectedLayout>} />
    ))}

    {/* Fallback */}
    <Route path="/*" element={<ProtectedRoute><Navigate to="/" /></ProtectedRoute>} />
  </Routes>
);

export default App;