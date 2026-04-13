"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  usersService,
  type UserProfile,
  type UpdateProfilePayload,
  type ChangePasswordPayload,
} from "@/src/services/users.service";

export function useProfile() {
  return useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: usersService.getProfile,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      usersService.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      usersService.changePassword(payload),
  });
}