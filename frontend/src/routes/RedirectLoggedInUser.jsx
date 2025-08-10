// src/routes/RedirectLoggedInUser.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Spinner, Center } from "@chakra-ui/react";

const RedirectLoggedInUser = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <Center h="100vh">
                <Spinner size="xl" color="blue.500" />
            </Center>
        );
    }

    return user ? <Navigate to="/feed" /> : children;
};

export default RedirectLoggedInUser;
