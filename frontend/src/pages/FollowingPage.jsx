// src/pages/FollowingPage.jsx
import { Box, Heading, VStack, Spinner, Text } from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";
import UserListItem from "../components/UserListItem";

const FollowingPage = () => {
    const { user, loading } = useAuth();

    if (loading || !user) {
        return <Spinner />;
    }

    const following = user.following || [];

    return (
        <Box p={6}>
            <Heading mb={4}>Following</Heading>
            <VStack spacing={4} align="stretch">
                {following.length === 0 ? (
                    <Text>You're not following anyone.</Text>
                ) : (
                    following.map((followed) => (
                        <UserListItem key={followed._id} user={followed} />
                    ))
                )}
            </VStack>
        </Box>
    );
};

export default FollowingPage;
