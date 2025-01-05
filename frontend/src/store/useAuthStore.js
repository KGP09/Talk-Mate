import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { data } from "react-router-dom";
export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    checkAuth: async () => {
        try {
            const res = axiosInstance.get("/auth/check")
            set({ authUser: (await res).data })
        } catch (error) {
            console.log("Error in check auth :", error);
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },
    signup: async (data) => {
        set({ isSigningUp: true })
        try {
            await axiosInstance.post("/auth/signup", data);
            set({ authUser: (await res).data })
            toast.success("Account Created Successfully!")
        } catch (error) {
            console.log('Toast Error!');
            toast.error(error.response.data.message)

        } finally {
            set({ isSigningUp: false })
        }
    },

    login: async (data) => {
        try {
            const res = await axiosInstance.post("/auth/login", data)
            set({ authUser: res.data })
            toast.success("Logged In!")
        } catch (error) {
            toast.error("Invalid Credentials!")
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout")
            set({ authUser: null })
        } catch (error) {
            console.log("Logout Error AXOIS Instance");
        }
    },
}));
