import {
    Box,
    Button,
    Heading,
    Input,
    Stack,
    Select,
    Text,
    useToast,
    InputGroup,
    InputRightElement,
    Tooltip,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, loginUser, getProfile } from "../services/auth";
import { useAuth } from "../contexts/AuthContext";

const RegisterPage = () => {
    const { setUser } = useAuth();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const toast = useToast();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleRegister = async () => {
        const { username, email, password, confirmPassword, role } = formData;

        if (password !== confirmPassword) {
            toast({ title: "Passwords do not match", status: "error" });
            return;
        }

        try {
            await registerUser({ username, email, password, role });

            // Auto login after successful registration
            await loginUser({ email, password });
            const res = await getProfile();
            setUser(res.data);

            toast({ title: "Registered successfully", status: "success" });
            navigate("/feed");
        } catch (err) {
            console.error("Registration failed", err);
            toast({
                title: "Registration failed",
                description: err?.response?.data?.message || "Try again",
                status: "error",
            });
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
            <Heading mb={4}>Register</Heading>
            <Stack spacing={3}>
                <Input
                    variant="flushed"
                    placeholder="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                />
                <Input
                    variant="flushed"
                    placeholder="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <InputGroup>
                    <Input
                        variant="flushed"
                        placeholder="Password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <InputRightElement>
                        <Tooltip
                            label={
                                showPassword ? "Hide password" : "Show password"
                            }
                        >
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowPassword(!showPassword)}
                                _hover={{ bg: "transparent" }}
                            >
                                {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                            </Button>
                        </Tooltip>
                    </InputRightElement>
                </InputGroup>
                <InputGroup>
                    <Input
                        variant="flushed"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    <InputRightElement>
                        <Tooltip
                            label={
                                showConfirmPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                        >
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                _hover={{ bg: "transparent" }}
                            >
                                {showConfirmPassword ? (
                                    <ViewOffIcon />
                                ) : (
                                    <ViewIcon />
                                )}
                            </Button>
                        </Tooltip>
                    </InputRightElement>
                </InputGroup>

                <Select
                    variant="flushed"
                    placeholder="Select Role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                >
                    <option value="Student">Student</option>
                    <option value="Developer">Developer</option>
                    <option value="ML Engineer">ML Engineer</option>
                    <option value="Data Scientist">Data Scientist</option>
                </Select>
                <Button colorScheme="purple" onClick={handleRegister}>
                    Register
                </Button>
                <Text fontSize="sm" color="gray.500">
                    Already have an account?{" "}
                    <Link to="/login">
                        <Text as="span" color="purple.500" fontWeight="medium">
                            Login
                        </Text>
                    </Link>
                </Text>
            </Stack>
        </Box>
    );
};

export default RegisterPage;
