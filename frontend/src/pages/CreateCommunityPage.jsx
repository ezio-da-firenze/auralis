// src/pages/CreateCommunity.jsx
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    Textarea,
    useToast,
    Heading,
    VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createCommunity } from "../services/community";

const CreateCommunityPage = () => {
    const toast = useToast();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createCommunity({ name, description, category });
            toast({
                title: "Community created",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            navigate("/"); // Or redirect to community listing/detail
        } catch (err) {
            toast({
                title: "Error",
                description:
                    err.response?.data?.message || "Something went wrong",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box
            maxW="600px"
            mx="auto"
            mt={10}
            p={6}
            borderWidth={1}
            borderRadius="md"
        >
            <Heading mb={6}>Create Community</Heading>
            <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                    <FormControl isRequired>
                        <FormLabel>Name</FormLabel>
                        <Input
                            placeholder="Enter community name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Description</FormLabel>
                        <Textarea
                            placeholder="Describe your community"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </FormControl>

                    <FormLabel>Category</FormLabel>
                    <FormControl isRequired>
                        <FormLabel>Category</FormLabel>
                        <Input
                            placeholder="Category (e.g., Tech, Music)"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                    </FormControl>

                    <Button colorScheme="purple" type="submit" width="full">
                        Create
                    </Button>
                </VStack>
            </form>
        </Box>
    );
};

export default CreateCommunityPage;
