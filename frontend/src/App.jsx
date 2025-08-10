import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import FeedPage from "./pages/FeedPage";
import { AuthProvider } from "./contexts/AuthContext";
import { FeedProvider } from "./contexts/FeedContext";
import ProfilePage from "./pages/ProfilePage";
import FollowersPage from "./pages/FollowersPage";
import FollowingPage from "./pages/FollowingPage";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import RedirectLoggedInUser from "./routes/RedirectLoggedInUser";
import RegisterPage from "./pages/RegisterPage";
import CreatePostPage from "./pages/CreatePostPage";
import CreateCommunityPage from "./pages/CreateCommunityPage";
import CommunitiesPage from "./pages/CommunitiesPage";
import CommunityDetail from "./components/CommunityDetail";

const App = () => {
    return (
        <ChakraProvider>
            <Router>
                <AuthProvider>
                    <FeedProvider>
                        <Navbar />
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <RedirectLoggedInUser>
                                        <LoginPage />
                                    </RedirectLoggedInUser>
                                }
                            />
                            <Route path="register" element={<RegisterPage />} />
                            <Route path="login" element={<LoginPage />} />
                            {/* Private Routes */}
                            <Route
                                path="/feed"
                                element={
                                    <PrivateRoute>
                                        <FeedPage />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/profile"
                                element={
                                    <PrivateRoute>
                                        <ProfilePage />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/followers"
                                element={
                                    <PrivateRoute>
                                        <FollowersPage />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/following"
                                element={
                                    <PrivateRoute>
                                        <FollowingPage />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/create-post"
                                element={
                                    <PrivateRoute>
                                        <CreatePostPage />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/create-community"
                                element={
                                    <PrivateRoute>
                                        <CreateCommunityPage />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/communities"
                                element={
                                    <PrivateRoute>
                                        <CommunitiesPage />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/communities/:id"
                                element={
                                    <PrivateRoute>
                                        <CommunityDetail />
                                    </PrivateRoute>
                                }
                            />
                        </Routes>
                    </FeedProvider>
                </AuthProvider>
            </Router>
        </ChakraProvider>
    );
};

export default App;
