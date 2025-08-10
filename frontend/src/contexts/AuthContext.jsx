import { createContext, useContext, useState, useEffect } from "react";
import { getProfile, logoutUser } from "../services/auth";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
            const res = await getProfile();
            setUser(res.data);
            console.log(res.data.joinedCommunities);

            // console.log(res.data);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await logoutUser();
        } catch (err) {
            console.error("Logout failed", err);
        }
        setUser(null);
        navigate("/");
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for authentication context
export const useAuth = () => useContext(AuthContext);
