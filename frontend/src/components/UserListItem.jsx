import { HStack, Avatar, Text, Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const UserListItem = ({ user }) => {
    return (
        <Link to={`/profile/${user._id}`}>
            <HStack
                spacing={4}
                p={3}
                borderWidth={1}
                borderRadius="md"
                _hover={{ bg: "gray.50" }}
            >
                <Avatar name={user.username} src={user.avatar} />
                <Box>
                    <Text fontWeight="bold">{user.username}</Text>
                    <Text fontSize="sm" color="gray.500">
                        {user.email}
                    </Text>
                </Box>
            </HStack>
        </Link>
    );
};

export default UserListItem;
