// src/pages/FollowersPage.jsx
import { Box, Heading, VStack, Spinner, Text } from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";
import UserListItem from "../components/UserListItem";

const FollowersPage = () => {
    const { user, loading } = useAuth();

    if (loading || !user) {
        return <Spinner />;
    }

    const followers = user.followers || [];

    return (
        <Box p={6}>
            <Heading mb={4}>Followers</Heading>
            <VStack spacing={4} align="stretch">
                {followers.length === 0 ? (
                    <Text>No followers yet.</Text>
                ) : (
                    followers.map((follower) => (
                        <UserListItem key={follower._id} user={follower} />
                    ))
                )}
            </VStack>
        </Box>
    );
};

export default FollowersPage;
