import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { data } from "react-router-dom";
export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
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
            const res = await axiosInstance.post("/auth/signup", data);
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
            // Call the backend logout endpoint
            await axiosInstance.post("/auth/logout");

            // Clear the local authUser state to log the user out
            set({ authUser: null });

            // Optionally redirect the user to the login page (if using React Router)
            window.location.href = '/login';  // Or use React Router's `navigate('/login')`
        } catch (error) {
            console.log("Logout Error with Axios Instance:", error);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true })
        try {
            const res = await axiosInstance.put("/auth/update-profile", data)
            set({ authUser: res.data })
            toast.success("Profile Updated Successfully!")
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUpdatingProfile: false })
        }
    }
}));
