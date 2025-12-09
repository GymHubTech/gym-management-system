import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 1,
    name: 'Admin User',
    email: 'admin@gym.com',
    role: 'admin', // 'admin' or 'trainer'
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
  });

  const switchRole = (role) => {
    if (role === 'admin') {
      setUser({
        id: 1,
        name: 'Admin User',
        email: 'admin@gym.com',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      });
    } else {
      setUser({
        id: 2,
        name: 'Mike Johnson',
        email: 'mike.j@gym.com',
        role: 'trainer',
        avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&h=150&fit=crop',
      });
    }
  };

  const isAdmin = user.role === 'admin';
  const isTrainer = user.role === 'trainer';

  return (
    <AuthContext.Provider value={{ user, switchRole, isAdmin, isTrainer }}>
      {children}
    </AuthContext.Provider>
  );
};
