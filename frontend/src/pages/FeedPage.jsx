import {
    Box,
    Heading,
    Spinner,
    VStack,
    Text,
    Flex,
    Button,
    Input,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getFeed } from "../services/feed";
import FeedCard from "../components/FeedCard";
import { useNavigate } from "react-router-dom";

const FeedPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
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

    // Filter posts by author name or community name
    const filteredPosts = posts.filter((post) => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return true; // If search is empty, show all

        const authorMatch = post.author?.username
            ?.toLowerCase()
            .includes(query);
        const communityMatch = post.community?.name
            ?.toLowerCase()
            .includes(query);
        return authorMatch || communityMatch;
    });

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

            <Input
                placeholder="Search by author or community..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                mb={4}
            />

            {loading ? (
                <Spinner />
            ) : (
                <VStack spacing={4} align="stretch">
                    {filteredPosts.length === 0 ? (
                        <Text>No posts available.</Text>
                    ) : (
                        filteredPosts.map((post) => (
                            <FeedCard key={post._id} post={post} />
                        ))
                    )}
                </VStack>
            )}
        </Box>
    );
};

export default FeedPage;
