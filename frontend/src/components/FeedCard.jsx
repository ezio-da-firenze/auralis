import { useState } from "react";
import {
    Box,
    Text,
    Avatar,
    IconButton,
    Flex,
    Spacer,
    Input,
    Button,
    VStack,
    Badge,
} from "@chakra-ui/react";
import { FaHeart, FaRegHeart, FaComment } from "react-icons/fa";
import { togglePostLike, getPostComments, addComment } from "../services/post";
import { useAuth } from "../contexts/AuthContext";
import CommentCard from "./CommentCard";
import { Link } from "react-router-dom";

// Utility to format date as "time ago"
const timeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffMs = now - postDate;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "Just now";
};

const FeedCard = ({ post }) => {
    const { user } = useAuth();
    const [liked, setLiked] = useState(post.likes.includes(user._id));
    const [likesCount, setLikesCount] = useState(post.likes.length);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    const handleLike = async () => {
        try {
            await togglePostLike(post._id);
            setLiked(!liked);
            setLikesCount((prev) => prev + (liked ? -1 : 1));
        } catch (err) {
            console.error("Failed to like/unlike:", err);
        }
    };

    const handleToggleComments = async () => {
        setShowComments(!showComments);
        if (!showComments) {
            try {
                const res = await getPostComments(post._id);
                setComments(res.data);
            } catch (err) {
                console.error("Failed to fetch comments:", err);
            }
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            const res = await addComment(post._id, newComment.trim());
            setComments((prev) => [res.data, ...prev]);
            setNewComment("");
        } catch (err) {
            console.error("Failed to add comment:", err);
        }
    };

    // Post visibility tag logic
    let tag = "Public";
    if (user.following.includes(post.author._id)) {
        tag = "Following";
    } else if (
        post.community &&
        user.joinedCommunities.includes(post.community._id)
    ) {
        tag = "Community";
    }

    const tagColor = {
        Following: "green",
        Community: "blue",
        Public: "gray",
    };

    return (
        <Box p={4} shadow="md" borderWidth="1px" borderRadius="md" mb={4}>
            <Flex align="center" mb={2}>
                <Avatar size="sm" name={post.author.username} />
                <Text fontWeight="bold" ml={2}>
                    {post.author.username}
                </Text>
                <Badge
                    ml={2}
                    colorScheme={tagColor[tag]}
                    fontSize="0.7em"
                    borderRadius="full"
                    px={2}
                >
                    {tag}
                </Badge>
                <Spacer />
                <Text fontSize="xs" color="gray.500">
                    {timeAgo(post.createdAt)}
                </Text>
            </Flex>

            <Text>{post.content}</Text>

            <Flex align="center" mt={2} gap={4}>
                <IconButton
                    icon={liked ? <FaHeart /> : <FaRegHeart />}
                    onClick={handleLike}
                    size="sm"
                    aria-label="Like"
                />
                <Text fontSize="sm">{likesCount} Likes</Text>

                <IconButton
                    icon={<FaComment />}
                    onClick={handleToggleComments}
                    size="sm"
                    aria-label="Comment"
                />
                <Text fontSize="sm">{post.commentCount || 0} Comments</Text>
            </Flex>

            {showComments && (
                <Box mt={3} pl={4} pt={2} borderTop="1px solid #eee">
                    <Flex gap={2} mb={3}>
                        <Input
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            size="sm"
                        />
                        <Button size="sm" onClick={handleAddComment}>
                            Post
                        </Button>
                    </Flex>

                    <VStack align="start" spacing={3}>
                        {comments.map((comment) => (
                            <CommentCard key={comment._id} comment={comment} />
                        ))}
                    </VStack>
                </Box>
            )}
        </Box>
    );
};

export default FeedCard;
