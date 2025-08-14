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
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserProfileById } from "../services/auth";
import { getFeed } from "../services/feed";
import FeedCard from "../components/FeedCard";

const UserProfilePage = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [feed, setFeed] = useState([]);
    const [loadingFeed, setLoadingFeed] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                console.log(id);
                const res = await getUserProfileById(id);
                setProfile(res.data);
                console.log(res.data);
            } catch (err) {
                console.error("Failed to fetch user profile:", err);
            } finally {
                setLoadingProfile(false);
            }
        };

        const fetchFeed = async () => {
            try {
                const res = await getFeed();
                setFeed(res.data.data);
            } catch (err) {
                console.error("Failed to fetch feed:", err);
            } finally {
                setLoadingFeed(false);
            }
        };

        fetchProfile();
        fetchFeed();
    }, [id]);

    if (loadingProfile) {
        return (
            <Box textAlign="center" mt={10}>
                <Spinner size="xl" />
            </Box>
        );
    }

    if (!profile) {
        return (
            <Box textAlign="center" mt={10}>
                User not found
            </Box>
        );
    }

    const userPosts = (feed || []).filter((post) => post.author._id === id);

    return (
        <Box maxW="4xl" mx="auto" mt={8} p={4}>
            {/* Profile Info */}
            <Stack
                direction={{ base: "column", md: "row" }}
                spacing={6}
                align="center"
            >
                <Avatar name={profile.username} size="xl" />
                <Box>
                    <Heading size="lg">{profile.username}</Heading>
                    <Text color="gray.500">{profile.email}</Text>
                    <Text fontSize="sm" mt={1}>
                        Role: {profile.role}
                    </Text>
                    <Text fontSize="sm">
                        Joined:{" "}
                        {new Date(profile.createdAt).toLocaleDateString()}
                    </Text>
                </Box>
            </Stack>

            <Divider my={6} />

            {/* Stats */}
            <SimpleGrid columns={[1, 3]} spacing={4} mb={6}>
                <Box textAlign="center">
                    <Link to={`/followers/${id}`}>
                        <Text
                            fontWeight="bold"
                            fontSize="lg"
                            _hover={{ textDecoration: "underline" }}
                        >
                            {profile.followers?.length || 0}
                        </Text>
                    </Link>
                    <Text fontSize="sm" color="gray.500">
                        Followers
                    </Text>
                </Box>

                <Box textAlign="center">
                    <Link to={`/following/${id}`}>
                        <Text
                            fontWeight="bold"
                            fontSize="lg"
                            _hover={{ textDecoration: "underline" }}
                        >
                            {profile.following?.length || 0}
                        </Text>
                    </Link>
                    <Text fontSize="sm" color="gray.500">
                        Following
                    </Text>
                </Box>

                <Box textAlign="center">
                    <Text fontWeight="bold" fontSize="lg">
                        {profile.joinedCommunities?.length || 0}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                        Communities
                    </Text>
                </Box>
            </SimpleGrid>

            <Divider mb={6} />

            <Heading size="md" mb={4}>
                {profile.username}'s Posts
            </Heading>
            {loadingFeed ? (
                <Spinner size="lg" />
            ) : (
                <VStack spacing={4} align="stretch">
                    {userPosts.length > 0 ? (
                        userPosts.map((post) => (
                            <FeedCard key={post._id} post={post} />
                        ))
                    ) : (
                        <Text color="gray.500">No posts yet.</Text>
                    )}
                </VStack>
            )}
        </Box>
    );
};

export default UserProfilePage;
