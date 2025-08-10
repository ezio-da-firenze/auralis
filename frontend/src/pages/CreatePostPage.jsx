import {
    Box,
    Button,
    Heading,
    Input,
    Textarea,
    VStack,
    useToast,
    Select,
    Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/post";
import { useAuth } from "../contexts/AuthContext";
import { getCommunityById } from "../services/community";

const CreatePostPage = () => {
    const { user, loading } = useAuth();
    const [content, setContent] = useState("");
    const [mediaUrl, setMediaUrl] = useState("");
    const [selectedCommunityId, setSelectedCommunityId] = useState("");
    const [joinedCommunities, setJoinedCommunities] = useState([]);
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCommunities = async () => {
            if (!user?.joinedCommunities?.length) return;

            try {
                const communityData = await Promise.all(
                    user.joinedCommunities.map(async (id) => {
                        const res = await getCommunityById(id);
                        return res.data;
                    })
                );
                setJoinedCommunities(communityData);
            } catch (err) {
                console.error("Failed to fetch community details:", err);
            }
        };

        fetchCommunities();
    }, [user]);

    const handleSubmit = async () => {
        try {
            const postData = {
                content,
                mediaUrls: mediaUrl ? [mediaUrl] : [],
            };

            if (selectedCommunityId) {
                postData.communityId = selectedCommunityId;
            }

            await createPost(postData);

            toast({
                title: "Post created.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            navigate("/feed");
        } catch (error) {
            toast({
                title: "Error creating post.",
                description: error.response?.data?.message || error.message,
                status: "error",
                duration: 4000,
                isClosable: true,
            });
        }
    };

    if (loading) {
        return (
            <Box textAlign="center" mt={8}>
                <Spinner size="lg" />
            </Box>
        );
    }

    return (
        <Box maxW="600px" mx="auto" mt={8} p={6}>
            <Heading mb={4}>Create New Post</Heading>
            <VStack spacing={4}>
                <Textarea
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <Input
                    placeholder="Optional media URL"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                />
                {joinedCommunities.length > 0 && (
                    <Select
                        placeholder="Post publicly or select a community"
                        value={selectedCommunityId}
                        onChange={(e) => setSelectedCommunityId(e.target.value)}
                    >
                        {joinedCommunities.map((community, index) => (
                            <option
                                key={String(community._id)}
                                value={String(community._id)}
                            >
                                {community.name}
                            </option>
                        ))}
                    </Select>
                )}
                <Button colorScheme="blue" onClick={handleSubmit}>
                    Post
                </Button>
            </VStack>
        </Box>
    );
};

export default CreatePostPage;
