"use client";

import { updateAvatar } from "@/actions/profile-actions";
import { authClient } from "@/lib/auth-client";
import { getAvatarByImage } from "@/lib/friend-utils";
import { useMutation } from "@tanstack/react-query";

const useProfile = () => {
  const { data: session, refetch: refetchSession } = authClient.useSession();

  const { mutate: updateAvatarMutation, isPending: isUpdatingAvatar } =
    useMutation({
      mutationFn: updateAvatar,
      onSuccess: () => {
        void refetchSession();
        //toast.success("Avatar updated successfully");
      },
    });

  const selectedAvatarId =
    getAvatarByImage(session?.user.image ?? null)?.id ?? undefined;

  return {
    updateAvatarMutation,
    isUpdatingAvatar,
    selectedAvatarId,
  };
};

export default useProfile;
