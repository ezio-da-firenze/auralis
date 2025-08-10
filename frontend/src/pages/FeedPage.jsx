import {
    Box,
    Heading,
    Spinner,
    VStack,
    Text,
    Flex,
    Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getFeed } from "../services/feed";
import FeedCard from "../components/FeedCard";
import { useNavigate } from "react-router-dom";

const FeedPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const res = await getFeed();
                setPosts(res.data.data);
            } catch (err) {
                console.error("Failed to fetch feed:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, []);

    return (
        <Box p={6}>
            <Flex justify="space-between" align="center" mb={4}>
                <Heading>Feed</Heading>
                <Button
                    colorScheme="blue"
                    onClick={() => navigate("/create-post")}
                >
                    Create Post
                </Button>
            </Flex>

            {loading ? (
                <Spinner />
            ) : (
                <VStack spacing={4} align="stretch">
                    {posts.length === 0 ? (
                        <Text>No posts available.</Text>
                    ) : (
                        posts.map((post) => (
                            <FeedCard key={post._id} post={post} />
                        ))
                    )}
                </VStack>
            )}
        </Box>
    );
};

export default FeedPage;
