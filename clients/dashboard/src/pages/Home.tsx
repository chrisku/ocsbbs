import { Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h1 className="text-xl font-semibold text-neutral-800 mr-auto">OCS BBS Dashboard</h1>
      </div>
      <Typography variant="h5" component="h2" gutterBottom>
        Welcome, {user?.firstName} {user?.lastName}
      </Typography>
    </div>
  );
};

export default Home;