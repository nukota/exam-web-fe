import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { 
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import type { User } from '../dtos';

interface AuthContextType {
  currentUser: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // In a real application, you would:
      // 1. Check if user exists in your backend
      // 2. If not, create a new user
      // 3. Fetch user details including role
      
      // For now, we'll create a mock user based on email
      const mockUser: User = {
        user_id: user.uid,
        username: user.email?.split('@')[0] || 'user',
        full_name: user.displayName || '',
        email: user.email || '',
        role: (user.email === 'thanhhsnvlxd2000@gmail.com' || user.email?.includes('admin')) ? 'admin' : 'student',
        school_name: 'Demo School',
      };
      
      setCurrentUser(mockUser);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      
      if (user) {
        // In a real application, fetch user details from your backend
        const mockUser: User = {
          user_id: user.uid,
          username: user.email?.split('@')[0] || 'user',
          full_name: user.displayName || '',
          email: user.email || '',
          role: (user.email === 'thanhhsnvlxd2000@gmail.com' || user.email?.includes('admin')) ? 'admin' : 'student',
          school_name: 'Demo School',
        };
        setCurrentUser(mockUser);
      } else {
        setCurrentUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    firebaseUser,
    loading,
    signInWithGoogle,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
