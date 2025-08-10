import { Box, Text, Flex, Avatar } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";

const CommentCard = ({ comment }) => {
    return (
        <Box>
            <Flex align="center" gap={2}>
                <Avatar size="xs" name={comment.author.username} />
                <Text fontWeight="bold" fontSize="sm">
                    {comment.author.username}
                </Text>
                <Text fontSize="xs" color="gray.500">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                    })}
                </Text>
            </Flex>
            <Text fontSize="sm" ml={6}>
                {comment.content}
            </Text>
        </Box>
    );
};

export default CommentCard;
