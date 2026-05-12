import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, AuthLoginRequest, LoginResponse } from '../../../shared/src/types';
import { login as apiLogin, logout as apiLogout } from '../api/auth';

interface AuthContextType extends AuthState {
  login: (request: AuthLoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

const storedToken = localStorage.getItem('token');
const storedUser  = localStorage.getItem('user');

const [authState, setAuthState] = useState<AuthState>({
  token:           storedToken,
  user:            storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: !!storedToken && !!storedUser,
});

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');

    if (token && userJson) {
      setAuthState({
        token,
        user: JSON.parse(userJson),
        isAuthenticated: true
      });
    }
  }, []);

  const login = async (request: AuthLoginRequest) => {
    const response: LoginResponse = await apiLogin(request);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response));
    setAuthState({
      token: response.token,
      user: response,
      isAuthenticated: true
    });
  };

  const logout = async () => {
    await apiLogout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState({
      token: null,
      user: null,
      isAuthenticated: false
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};