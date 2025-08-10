import {
    Box,
    Button,
    Heading,
    Input,
    Stack,
    Text,
    useToast,
    InputGroup,
    InputRightElement,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProfile, loginUser } from "../services/auth";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
    const { setUser } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const toast = useToast();
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            toast({
                title: "Please fill in all fields",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            await loginUser({ email, password });
            // Get user profile right after login
            const res = await getProfile();
            setUser(res.data);
            toast({ title: "Login successful", status: "success" });
            navigate("/feed");
        } catch (err) {
            console.error("Login failed", err);
            toast({ title: "Login failed", status: "error" });
        }
    };

    return (
        <Box
            maxW="md"
            mx="auto"
            mt={20}
            p={6}
            borderWidth="1px"
            borderRadius="md"
        >
            <Heading mb={4}>Login</Heading>
            <Stack spacing={3}>
                <Input
                    variant="flushed"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <InputGroup>
                    <Input
                        variant="flushed"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPassword(!showPassword)}
                            _hover={{ bg: "transparent" }}
                        >
                            {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        </Button>
                    </InputRightElement>
                </InputGroup>
                <Button colorScheme="purple" onClick={handleLogin}>
                    Login
                </Button>
                <Text fontSize="sm" color="gray.500">
                    Don't have an account?{" "}
                    <Link to="/register">
                        <Text as="span" color="purple.500" fontWeight="medium">
                            Register
                        </Text>
                    </Link>
                </Text>
            </Stack>
        </Box>
    );
};

export default LoginPage;
