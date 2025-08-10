import {
    Box,
    Heading,
    Text,
    Spinner,
    Button,
    Flex,
    Avatar,
    useToast,
    HStack,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getCommunityById,
    joinCommunity,
    leaveCommunity,
    deleteCommunity,
} from "../services/community";
import { useAuth } from "../contexts/AuthContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const CommunityDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const toast = useToast();
    const cancelRef = useRef();

    const [community, setCommunity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    useEffect(() => {
        fetchCommunity();
    }, [id]);

    const fetchCommunity = async () => {
        try {
            const res = await getCommunityById(id);
            setCommunity(res.data);
        } catch (err) {
            toast({
                title: "Failed to fetch community details",
                description: err.response?.data?.message || err.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const isMember = () => {
        return (
            user && community?.members.some((member) => member._id === user._id)
        );
    };

    const isAdmin = () => {
        return user && community?.admin?._id === user._id;
    };

    const handleJoinLeave = async () => {
        setJoining(true);
        try {
            if (isMember()) {
                await leaveCommunity(community._id);
                toast({
                    title: "Left the community",
                    status: "info",
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                await joinCommunity(community._id);
                toast({
                    title: "Joined the community",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            }
            fetchCommunity();
        } catch (err) {
            toast({
                title: "Action failed",
                description: err.response?.data?.message || err.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setJoining(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteCommunity(community._id);
            toast({
                title: "Community deleted",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            navigate("/");
        } catch (err) {
            console.log(err);
            toast({
                title: "Delete failed",
                description: err.response?.data?.message || err.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setDeleting(false);
            setIsDeleteOpen(false);
        }
    };

    if (loading) {
        return (
            <Flex justify="center" mt={20}>
                <Spinner size="lg" />
            </Flex>
        );
    }

    if (!community) {
        return (
            <Text textAlign="center" mt={20} color="gray.600">
                Community not found.
            </Text>
        );
    }

    return (
        <Box maxW="800px" mx="auto" p={6}>
            <Flex align="center" mb={6} gap={4}>
                <Avatar name={community.name} size="lg" />
                <Box>
                    <Heading>{community.name}</Heading>
                    <Text color="gray.600" fontSize="sm">
                        Created {dayjs(community.createdAt).fromNow()}
                    </Text>
                </Box>
                <Flex ml="auto" gap={3}>
                    {user && (
                        <Button
                            colorScheme={isMember() ? "red" : "blue"}
                            onClick={handleJoinLeave}
                            isLoading={joining}
                        >
                            {isMember() ? "Leave" : "Join"}
                        </Button>
                    )}

                    {isAdmin() && (
                        <Button
                            colorScheme="red"
                            onClick={() => setIsDeleteOpen(true)}
                        >
                            Delete
                        </Button>
                    )}
                </Flex>
            </Flex>

            <Text mb={4}>{community.description}</Text>

            <HStack spacing={6} mb={4} flexWrap="wrap">
                <Text>
                    <strong>Category:</strong> {community.category}
                </Text>
                <Text>
                    <strong>Members:</strong> {community.members.length}
                </Text>
                <Text>
                    <strong>Posts:</strong> {community.postCount}
                </Text>
                <Text>
                    <strong>Admin:</strong> {community.admin.username}
                </Text>
            </HStack>

            {/* Delete Confirmation Modal */}
            <AlertDialog
                isOpen={isDeleteOpen}
                leastDestructiveRef={cancelRef}
                onClose={() => setIsDeleteOpen(false)}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Community
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure you want to delete this community? This
                            action cannot be undone.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button
                                ref={cancelRef}
                                onClick={() => setIsDeleteOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={handleDelete}
                                isLoading={deleting}
                                ml={3}
                            >
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};

export default CommunityDetail;
