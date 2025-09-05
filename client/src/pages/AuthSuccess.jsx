import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
// import { server } from "../server";
const server = import.meta.env.VITE_SERVER_URL;

const AuthSuccess = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${server}/auth/me`, {
          withCredentials: true,
        });
        console.log(res.data);
        console.log(res.data.data);
        const user = res.data.data;

        // Store in sessionStorage
        sessionStorage.setItem("user", JSON.stringify(user));

        // ⭐ IMPORTANT: Update the context state too!
        setUser(user);

        const redirectPath =
          sessionStorage.getItem("redirectAfterLogin") || "/";
        sessionStorage.removeItem("redirectAfterLogin");
        navigate(redirectPath);
      } catch (error) {
        console.error("Failed to fetch user", error);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate, setUser]); // Add dependencies

  return <p>Logging you in...</p>;
};

export default AuthSuccess;
