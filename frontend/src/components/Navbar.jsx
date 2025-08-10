// src/components/Navbar.jsx
import {
    Box,
    Flex,
    HStack,
    IconButton,
    Button,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useDisclosure,
    Stack,
    Text,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useRef, useState } from "react";

const Navbar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isLogoutOpen,
        onOpen: onLogoutOpen,
        onClose: onLogoutClose,
    } = useDisclosure();

    const cancelRef = useRef();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout(); // This should call logoutUser API
        onLogoutClose();
        navigate("/login");
    };

    const NavLinks = (
        <>
            <Button as={RouterLink} to="/" variant="ghost">
                Home
            </Button>
            {user && (
                <>
                    <Button as={RouterLink} to="/search" variant="ghost">
                        Search
                    </Button>
                    <Button as={RouterLink} to="/communities" variant="ghost">
                        Communities
                    </Button>
                    <Button onClick={onLogoutOpen} variant="ghost">
                        Logout
                    </Button>
                </>
            )}
        </>
    );

    return (
        <Box
            bg="gray.100"
            px={4}
            py={2}
            boxShadow="sm"
            position="sticky"
            top={0}
            zIndex={10}
        >
            <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
                {/* Logo */}
                <Box>
                    <Text
                        fontWeight="bold"
                        fontSize="xl"
                        as={RouterLink}
                        to="/"
                    >
                        Auralis
                    </Text>
                </Box>

                {/* Desktop Nav */}
                <HStack spacing={4} display={{ base: "none", md: "flex" }}>
                    {NavLinks}
                </HStack>

                {/* Avatar (right) */}
                {user && (
                    <Menu>
                        <MenuButton>
                            <Avatar size="sm" name={user.username} />
                        </MenuButton>
                        <MenuList>
                            <MenuItem as={RouterLink} to="/profile">
                                My Profile
                            </MenuItem>
                        </MenuList>
                    </Menu>
                )}

                {/* Mobile Nav Toggle */}
                <IconButton
                    size="md"
                    icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                    aria-label="Open Menu"
                    display={{ md: "none" }}
                    onClick={isOpen ? onClose : onOpen}
                />
            </Flex>

            {/* Mobile Nav Menu */}
            {isOpen && (
                <Box pb={4} display={{ md: "none" }}>
                    <Stack spacing={4}>
                        {NavLinks}
                        {user && (
                            <Button
                                as={RouterLink}
                                to="/profile"
                                variant="ghost"
                            >
                                My Profile
                            </Button>
                        )}
                    </Stack>
                </Box>
            )}

            {/* Logout Confirmation Modal */}
            <AlertDialog
                isOpen={isLogoutOpen}
                leastDestructiveRef={cancelRef}
                onClose={onLogoutClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Logout
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure you want to logout?
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onLogoutClose}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={handleLogout}
                                ml={3}
                            >
                                Logout
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};

export default Navbar;
