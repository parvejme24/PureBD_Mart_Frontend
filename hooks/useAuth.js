"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  registerUser,
  getLoggedInUser,
  updateProfile,
  getAllUsers,
  changeUserRole,
  deleteUser,
} from "@/lib/auth";

// Main auth hook
export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const user = session?.user || null;

  // Login with credentials
  const login = async (credentials) => {
    try {
      const result = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
        return { success: false, error: result.error };
      }

      toast.success("Login successful!");
      router.push("/");
      router.refresh();
      return { success: true };
    } catch (error) {
      const errorMessage = error.message || "Login failed";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Login with Google
  const loginWithGoogle = () => {
    signIn("google", { callbackUrl: "/" });
  };

  // Logout
  const logout = async () => {
    await signOut({ redirect: false });
    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === "admin";
  };

  return {
    user,
    session,
    isAuthenticated,
    isLoading,
    login,
    loginWithGoogle,
    logout,
    isAdmin,
    updateSession: update,
  };
}

// Hook for user registration
export function useRegister() {
  const router = useRouter();
  const { login } = useAuth();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: async (data) => {
      // Backend returns: { message, user, token }
      if (data?.user && data?.token) {
        toast.success(data.message || "Registration successful!");
        // Auto-login after registration
        router.push("/login");
      }
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Registration failed";
      toast.error(errorMessage);
    },
  });
}

// Hook for fetching current user profile
export function useCurrentUser() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await getLoggedInUser();
      // Backend returns: { user }
      return response;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for updating user profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { updateSession } = useAuth();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: async (data) => {
      // Backend returns: { message, user }
      if (data?.user) {
        // Update session with new user data
        await updateSession({
          name: data.user.fullName,
          image: data.user.image?.url,
        });
        // Invalidate current user query
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        toast.success(data.message || "Profile updated successfully!");
      }
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Update failed";
      toast.error(errorMessage);
    },
  });
}

// Hook for fetching all users (admin only)
export function useAllUsers() {
  const { isAdmin } = useAuth();

  return useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const response = await getAllUsers();
      // Backend returns: { users }
      return response;
    },
    enabled: isAdmin(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook for changing user role (admin only)
export function useChangeUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeUserRole,
    onSuccess: (data) => {
      if (data?.user) {
        queryClient.invalidateQueries({ queryKey: ["allUsers"] });
        toast.success(data.message || "User role updated successfully!");
      }
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Role update failed";
      toast.error(errorMessage);
    },
  });
}

// Hook for deleting user (admin only)
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      toast.success(data?.message || "User deleted successfully!");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Delete failed";
      toast.error(errorMessage);
    },
  });
}
