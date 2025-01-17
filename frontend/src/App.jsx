import { Routes , Route } from "react-router-dom"
import NavBar from "./components/NavBar"
import SignupPage from "./pages/SignupPage"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import ProfilePage from "./pages/ProfilePage"
import SettingsPage from "./pages/SettingsPage"
import { useAuthStore } from "./store/useAuthStore"
import { useEffect } from "react"
import {Loader} from "lucide-react"
import { Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast";
import {useThemeStore} from "../src/store/useThemeStore"
function App() {
  const {authUser , checkAuth , isCheckingAuth ,onlineUsers } = useAuthStore()
  const {theme} = useThemeStore()
  console.log("Online Users: " ,onlineUsers);
  useEffect(()=>{
    checkAuth()
  } , [checkAuth])
  console.log(authUser);
  if(isCheckingAuth && !authUser ){
    return(
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }
  return(
        <div data-theme={theme}>
          <NavBar />
          <Routes>
            <Route path="/" element= { authUser ?<HomePage /> : <Navigate to="/login" />  } />
            <Route path="/signup" element= { !authUser ? <SignupPage /> : <Navigate to="/"  />  } />
            <Route path="/login" element= { !authUser ? <LoginPage /> :  <Navigate to="/" />  } />
            <Route path="/settings" element= {<SettingsPage />} />
            <Route path="/profile" element= { authUser ? <ProfilePage /> : <Navigate to="/login"/> }/> 
          </Routes>
          <Toaster/>
        </div>
  )
}

export default App