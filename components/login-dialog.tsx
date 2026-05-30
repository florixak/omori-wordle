import {
  OmoriDialog,
  OmoriDialogContent,
  OmoriDialogDescription,
  OmoriDialogFooter,
  OmoriDialogHeader,
  OmoriDialogTitle,
} from "./omori/omori-dialog";
import WordleButton from "./wordle-button";

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
          <WordleButton
            className="w-full gap-2"
            onClick={handleLogin}
            disabled={isLoading}
          >
            Continue with Discord
          </WordleButton>
        </OmoriDialogFooter>
      </OmoriDialogContent>
    </OmoriDialog>
  );
};

export default OmoriLoginDialog;
