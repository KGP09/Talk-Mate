import axios from "axios"
// export const axiosInstance = axios.create({
//     baseURL: "http://localhost:5001/api",
//     withCredentials: true,
// })


// Example of axiosInstance
export const axiosInstance = axios.create({
    baseURL: "http://localhost:5001/api",  // Adjust URL as needed
    withCredentials: true,  // Important if you're using cookies
});
