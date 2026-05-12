import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import Layout from './components/Layout';
import CompanyOfficers from './pages/reports/CompanyOfficers';
import CompanyQualifications from './pages/reports/CompanyQualifications';
import { Box, Typography } from '@mui/material';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/reports/company-qualifications"
        element={
          <ProtectedRoute>
            <Layout>
              <CompanyQualifications />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports/company-officers"
        element={
          <ProtectedRoute>
            <Layout>
              <CompanyOfficers />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Box sx={{ p: 3 }}>
                <Typography>Select a report from the sidebar.</Typography>
              </Box>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;