"use client";

import { deleteAccount, updateAvatar } from "@/actions/profile-actions";
import { authClient } from "@/lib/auth-client";
import { resolveErrorMessage } from "@/lib/errors";
import { getAvatarByImage } from "@/lib/friend-utils";
import { omoriToast } from "@/lib/omori-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const useProfile = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
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

  const { mutateAsync: deleteAccountMutation, isPending: isDeletingAccount } =
    useMutation({
      mutationFn: deleteAccount,
      onMutate: () => {
        return omoriToast.loading("Deleting account...");
      },
      onSuccess: async (_, __, loadingToastId) => {
        if (typeof loadingToastId === "string") {
          toast.dismiss(loadingToastId);
        }

        queryClient.clear();
        await authClient.signOut();
        router.refresh();
        omoriToast.success("Account deleted");
      },
      onError: (error: Error, _, loadingToastId) => {
        if (typeof loadingToastId === "string") {
          toast.dismiss(loadingToastId);
        }

        omoriToast.error(resolveErrorMessage(error));
      },
    });

  const selectedAvatarId =
    getAvatarByImage(session?.user.image ?? null)?.id ?? undefined;

  return {
    updateAvatarMutation,
    isUpdatingAvatar,
    selectedAvatarId,
    deleteAccountMutation,
    isDeletingAccount,
  };
};

export default useProfile;
