import { useUser, useClerk } from "@clerk/clerk-react";

const useAuth = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();

  return {
    user: user
      ? {
          id: user.id,
          username: user.username || user.firstName || "User",
          fullName:
            user.fullName ||
            `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          email: user.primaryEmailAddress?.emailAddress,
          imageUrl: user.imageUrl,
        }
      : null,
    loading: !isLoaded,
    isAuthenticated: isSignedIn,
    initializing: !isLoaded,
    logout: signOut,
  };
};

export default useAuth;
