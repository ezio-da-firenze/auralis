// src/components/CommunityCard.jsx
import { Avatar, Box, Flex, Spacer, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const CommunityPageCard = ({ community }) => {
    return (
        <Link to={`/communities/${community._id}`}>
            <Flex
                borderWidth={1}
                borderRadius="md"
                p={4}
                align="center"
                gap={4}
                _hover={{ bg: "gray.50", cursor: "pointer" }}
            >
                <Avatar name={community.name} />
                <Box>
                    <Text fontWeight="bold" fontSize="lg">
                        {community.name}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                    {community.description}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                        Category: {community.category}
                    </Text>
                </Box>
                <Spacer />
                <Box textAlign="right">
                    <Text fontSize="sm" color="gray.600">
                        Members: {community.members.length}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                        Admin: {community.admin?.username}
                    </Text>
                </Box>
            </Flex>
        </Link>
    );
};

export default CommunityPageCard;
