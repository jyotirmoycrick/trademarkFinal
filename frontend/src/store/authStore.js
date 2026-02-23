import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      
      setAuth: (token, user) => {
        set({ token, user });
      },
      
      logout: () => {
        set({ token: null, user: null });
      },
      
      isAuthenticated: () => {
        return !!set.getState?.token;
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;