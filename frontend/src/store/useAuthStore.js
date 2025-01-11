import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { data } from "react-router-dom";
import { io } from "socket.io-client"
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/"
export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    isCheckingAuth: true,
    socket: null,
    checkAuth: async () => {
        set({ isCheckingAuth: true })
        try {
            const res = axiosInstance.get("/auth/check")
            set({ authUser: (await res).data })
            get().connectSocket()
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
            get().connectSocket()
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
            get().connectSocket()
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
            get.disconnectSocket();
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
    },
    connectSocket: () => {
        const { authUser } = get()
        if (!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            }
        })
        socket.connect()
        set({ socket: socket })
        
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds })
        })

    },
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect()
    }
}));
