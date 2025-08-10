import {
    Box,
    Heading,
    Text,
    Avatar,
    Stack,
    SimpleGrid,
    Divider,
    VStack,
    Spinner,
} from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";
import FeedCard from "../components/FeedCard";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFeed } from "../services/feed";

const ProfilePage = () => {
    const { user, loading: userLoading } = useAuth();
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const res = await getFeed();
                setFeed(res.data.data);
            } catch (err) {
                console.error("Failed to fetch feed:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, []);

    if (userLoading || !user) {
        return (
            <Box textAlign="center" mt={10}>
                <Spinner size="xl" />
            </Box>
        );
    }

    const myPosts = (feed || []).filter((post) => post.author._id === user._id);

    return (
        <Box maxW="4xl" mx="auto" mt={8} p={4}>
            {/* Profile Info */}
            <Stack
                direction={{ base: "column", md: "row" }}
                spacing={6}
                align="center"
            >
                <Avatar name={user.username} size="xl" />
                <Box>
                    <Heading size="lg">{user.username}</Heading>
                    <Text color="gray.500">{user.email}</Text>
                    <Text fontSize="sm" mt={1}>
                        Role: {user.role}
                    </Text>
                    <Text fontSize="sm">
                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </Text>
                </Box>
            </Stack>

            <Divider my={6} />

            {/* Stats */}
            <SimpleGrid columns={[1, 3]} spacing={4} mb={6}>
                <Box textAlign="center">
                    <Link to="/followers">
                        <Text
                            fontWeight="bold"
                            fontSize="lg"
                            _hover={{ textDecoration: "underline" }}
                        >
                            {user.followers?.length || 0}
                        </Text>
                    </Link>
                    <Text fontSize="sm" color="gray.500">
                        Followers
                    </Text>
                </Box>

                <Box textAlign="center">
                    <Link to="/following">
                        <Text
                            fontWeight="bold"
                            fontSize="lg"
                            _hover={{ textDecoration: "underline" }}
                        >
                            {user.following?.length || 0}
                        </Text>
                    </Link>
                    <Text fontSize="sm" color="gray.500">
                        Following
                    </Text>
                </Box>
                <Box textAlign="center">
                    <Text fontWeight="bold" fontSize="lg">
                        {user.joinedCommunities?.length || 0}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                        Communities
                    </Text>
                </Box>
            </SimpleGrid>

            <Divider mb={6} />

            <Heading size="md" mb={4}>
                My Posts
            </Heading>
            {loading ? (
                <Spinner size="lg" />
            ) : (
                <VStack spacing={4} align="stretch">
                    {myPosts.length > 0 ? (
                        myPosts.map((post) => (
                            <FeedCard key={post._id} post={post} />
                        ))
                    ) : (
                        <Text color="gray.500">
                            You haven’t posted anything yet.
                        </Text>
                    )}
                </VStack>
            )}
        </Box>
    );
};

export default ProfilePage;
