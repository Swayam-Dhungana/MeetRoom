import { create } from "zustand";
import toast from "react-hot-toast";
interface AuthState {
  user: any;
  loading: boolean;
  setLoading:(loadingStatus: any)=>void;
  signup: (creds: { username: string; email: string; password: string }) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  hello:null,
  user: null,
  loading: false,
  signup: async (data) => {
    try {
      set({ loading: true });
      const response = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const json = await response.json();
      if (json.success) {
        toast.success("Successfully signed up!");
        set({ user: json.user, loading: false });
      } else {
        toast.error(json.msg);
        set({ loading: false });
      }
    } catch (error) {
      toast.error("Some error occurred!");
      set({ loading: false });
    }
  },
  setLoading:(loadingStatus)=>{
    set({loading: loadingStatus})
  }
  ,
}));
