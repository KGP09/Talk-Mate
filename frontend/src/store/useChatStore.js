import { create } from "zustand";
import toast from "react-hot-toast"
import { axiosInstance } from "../lib/axios"

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUserLoading: true });
        try {
            const res = await axiosInstance.get("/message/users");
            // console.log(res);
            set({ users: res.data }); // Correctly assign user data
            // console.log(users);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching users");
        } finally {
            set({ isUserLoading: false });
        }
    },
    getMessages: async (userId) => {
        set({ isMessagesLoading: true })
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            set({ messages: res.data })
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isMessagesLoading: false })
        }
    },
    setSelectedUser: (selectedUser) => set({ selectedUser: selectedUser }),
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        console.log("logging  :", messages);
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

}))