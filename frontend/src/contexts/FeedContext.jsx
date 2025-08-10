import { createContext, useState, useEffect, useContext } from "react";
import { getFeed } from "../services/feed";
import { useAuth } from "./AuthContext"; // Make sure the path is correct

const FeedContext = createContext();

export const FeedProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getFeed();
                setPosts(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetch();
        } else {
            setLoading(false);
        }
    }, [user]);

    return (
        <FeedContext.Provider value={{ posts, setPosts, loading }}>
            {children}
        </FeedContext.Provider>
    );
};

export const useFeed = () => useContext(FeedContext);
