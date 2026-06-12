import {
  OmoriDialog,
  OmoriDialogContent,
  OmoriDialogDescription,
  OmoriDialogFooter,
  OmoriDialogHeader,
  OmoriDialogTitle,
} from "@/components/omori/omori-dialog";
import OmoriButton from "@/components/omori/omori-button";

type OmoriLoginDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: () => void | Promise<void>;
  isLoading?: boolean;
};

const OmoriLoginDialog = ({
  open,
  onOpenChange,
  onLogin,
  isLoading = false,
}: OmoriLoginDialogProps) => {
  const handleLogin = () => {
    void onLogin();
  };

  return (
    <OmoriDialog open={open} onOpenChange={onOpenChange}>
      <OmoriDialogContent>
        <OmoriDialogHeader>
          <OmoriDialogTitle>Sign in</OmoriDialogTitle>
          <OmoriDialogDescription>
            Save your daily results, track streaks, and compete on the
            friends-only leaderboard.
          </OmoriDialogDescription>
        </OmoriDialogHeader>
        <OmoriDialogFooter>
          <OmoriButton
            className="w-full gap-2"
            onClick={handleLogin}
            disabled={isLoading}
          >
            Continue with Discord
          </OmoriButton>
        </OmoriDialogFooter>
      </OmoriDialogContent>
    </OmoriDialog>
  );
};

export default OmoriLoginDialog;
