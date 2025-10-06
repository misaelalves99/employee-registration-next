'use client';

import React, { ReactNode, useState, useCallback, useEffect } from 'react';
import { AuthContext, User } from './AuthContext';
import { auth, googleProvider, facebookProvider } from '../lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';

interface Props {
  children: ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Mantém o usuário logado entre reloads
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser({
        id: result.user.uid,
        name: result.user.displayName || '',
        email: result.user.email || '',
      });
      return true;
    } catch (error) {
      console.error(error);
      alert('Credenciais inválidas.');
      return false;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      setUser({
        id: result.user.uid,
        name,
        email: result.user.email || '',
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser({
        id: result.user.uid,
        name: result.user.displayName || '',
        email: result.user.email || '',
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }, []);

  const loginWithFacebook = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      setUser({
        id: result.user.uid,
        name: result.user.displayName || '',
        email: result.user.email || '',
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loginWithGoogle,
        loginWithFacebook,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
