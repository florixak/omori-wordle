"use client";

import { updateAvatar } from "@/actions/profile-actions";
import { authClient } from "@/lib/auth-client";
import { getAvatarByImage } from "@/lib/friend-utils";
import { resolveErrorMessage } from "@/lib/errors";
import { omoriToast } from "@/lib/omori-toast";
import { useMutation } from "@tanstack/react-query";

const useProfile = () => {
  const { data: session, refetch: refetchSession } = authClient.useSession();

  const { mutate: updateAvatarMutation, isPending: isUpdatingAvatar } =
    useMutation({
      mutationFn: updateAvatar,
      onMutate: () => {
        omoriToast.loading("Updating avatar...");
      },
      onSuccess: async () => {
        await refetchSession();
        omoriToast.success("Avatar updated");
      },
      onError: (error: Error) => {
        omoriToast.error(resolveErrorMessage(error));
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
