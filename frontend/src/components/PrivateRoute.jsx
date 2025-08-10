import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Spinner, Center } from "@chakra-ui/react";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <Center h="100vh">
                <Spinner size="xl" thickness="4px" color="blue.500" />
            </Center>
        );
    }

    return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;
