import { PendingFriendRequest } from "@/types/friends-types";
import { SectionTitle } from "@/components/dialog/friends-dialog";
import UserRow from "./user-row";
import WordleButton from "@/components/wordle-button";

const PendingRequestsSection = ({
  requests,
  onRespond,
  onCancel,
  isBusy,
}: {
  requests: PendingFriendRequest[];
  onRespond: (requestId: number, action: "accept" | "decline") => void;
  onCancel: (requestId: number) => void;
  isBusy: boolean;
}) => {
  if (requests.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-2">
      <SectionTitle>Pending requests</SectionTitle>
      <div className="flex flex-col gap-2">
        {requests.map((request) => (
          <div
            key={request.id}
            className="flex flex-col gap-2 sm:flex-row sm:items-center"
          >
            <div className="min-w-0 flex-1">
              <UserRow user={request.user} />
            </div>
            <div className="flex gap-2">
              {request.direction === "incoming" ? (
                <>
                  <WordleButton
                    className="flex-1 px-2 text-[0.625rem] sm:text-xs"
                    disabled={isBusy}
                    onClick={() => onRespond(request.id, "accept")}
                  >
                    Accept
                  </WordleButton>
                  <WordleButton
                    className="flex-1 px-2 text-[0.625rem] sm:text-xs"
                    disabled={isBusy}
                    onClick={() => onRespond(request.id, "decline")}
                  >
                    Decline
                  </WordleButton>
                </>
              ) : (
                <WordleButton
                  className="w-full px-2 text-[0.625rem] sm:text-xs"
                  disabled={isBusy}
                  onClick={() => onCancel(request.id)}
                >
                  Cancel
                </WordleButton>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PendingRequestsSection;
