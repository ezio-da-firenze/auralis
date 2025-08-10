// src/pages/CommunitiesPage.jsx
import {
    Box,
    Heading,
    Input,
    VStack,
    Text,
    useToast,
    Select,
    Flex,
    Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getAllCommunities } from "../services/community";
import CommunityPageCard from "../components/CommunityPageCard";
import { Link } from "react-router-dom";

const CommunitiesPage = () => {
    const [communities, setCommunities] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [categories, setCategories] = useState([]);
    const toast = useToast();

    useEffect(() => {
        fetchCommunities();
    }, []);

    const fetchCommunities = async () => {
        try {
            const res = await getAllCommunities();
            const data = res.data;
            setCommunities(data);
            setFiltered(data);

            const categorySet = new Set(data.map((c) => c.category));
            setCategories(["all", ...Array.from(categorySet)]);
        } catch (err) {
            toast({
                title: "Failed to load communities",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const applyFilters = (search, category) => {
        let results = communities;

        if (search) {
            results = results.filter((c) =>
                c.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (category && category !== "all") {
            results = results.filter((c) => c.category === category);
        }

        setFiltered(results);
    };

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        applyFilters(term, selectedCategory);
    };

    const handleCategoryChange = (e) => {
        const cat = e.target.value;
        setSelectedCategory(cat);
        applyFilters(searchTerm, cat);
    };

    return (
        <Box maxW="800px" mx="auto" p={6}>
            <Flex justify="space-between" align="center" mb={6}>
                <Heading>All Communities</Heading>
                <Link to="/create-community">
                    <Button colorScheme="purple">Create Community</Button>
                </Link>
            </Flex>

            <Input
                placeholder="Search communities by name..."
                value={searchTerm}
                onChange={handleSearch}
                mb={4}
            />

            <Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                mb={6}
            >
                {categories.map((cat) => (
                    <option key={cat} value={cat}>
                        {cat === "all" ? "All Categories" : cat}
                    </option>
                ))}
            </Select>

            <VStack spacing={5} align="stretch">
                {filtered.map((community) => (
                    <CommunityPageCard
                        key={community._id}
                        community={community}
                    />
                ))}
                {filtered.length === 0 && (
                    <Text textAlign="center" color="gray.500">
                        No communities found.
                    </Text>
                )}
            </VStack>
        </Box>
    );
};

export default CommunitiesPage;
