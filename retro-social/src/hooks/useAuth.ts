// src/hooks/useAuth.ts

export const useAuth = () => {
  return {
    user: { 
      username: "retro_user", 
      displayName: "Retro Enthusiast" 
    },
    isLoading: false,
    login: async () => {},
    logout: async () => {},
    register: async () => {}
  };
};

export const useLogin = () => ({ mutateAsync: async () => ({}), isPending: false });
export const useRegister = () => ({ mutateAsync: async () => ({}), isPending: false });
export const useLogout = () => ({ mutateAsync: async () => ({}), isPending: false });
