import React, { useEffect, useContext } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import CreateBlogPage from "./pages/CreateBlogPage";
import AuthSuccess from "./pages/AuthSuccess";
import Profile from "./pages/Profile";
import Setting from "./pages/Setting";
import BlogsDetail from "./pages/BlogsDetail";
import { AuthContext } from "./context/AuthContext";
import axios from "axios";
// import { server } from "./server";
const server = import.meta.env.VITE_SERVER_URL;

const App = () => {
  const { setUser } = useContext(AuthContext);

  // 🔥 Fetch user on initial load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${server}/auth/me`, {
          withCredentials: true, // ✅ Important to send HttpOnly cookie
        });
        // console.log(data.data);
        setUser(data.data); // ✅ Assuming response like { user: {...} }
      } catch (error) {
        setUser(null); // ❌ Not authenticated
        console.error("User not authenticated");
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-blog" element={<CreateBlogPage />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/blog/:id" element={<BlogsDetail />} />
      </Routes>
    </>
  );
};

export default App;
