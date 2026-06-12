import { PendingFriendRequest } from "@/types/friends-types";
import { SectionTitle } from "@/components/dialog/friends-dialog";
import UserRow from "./user-row";
import OmoriButton from "@/components/omori/omori-button";
import { Check, X } from "lucide-react";

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
          <UserRow
            key={request.id}
            user={request.user}
            trailing={
              request.direction === "incoming" ? (
                <>
                  <OmoriButton
                    disabled={isBusy}
                    onClick={() => onRespond(request.id, "accept")}
                    aria-label={`Accept request from ${request.user.name}`}
                    title={`Accept request from ${request.user.name}`}
                  >
                    <Check size={24} />
                  </OmoriButton>
                  <OmoriButton
                    disabled={isBusy}
                    onClick={() => onRespond(request.id, "decline")}
                    aria-label={`Decline request from ${request.user.name}`}
                    title={`Decline request from ${request.user.name}`}
                  >
                    <X size={24} />
                  </OmoriButton>
                </>
              ) : (
                <OmoriButton
                  disabled={isBusy}
                  onClick={() => onCancel(request.id)}
                  aria-label={`Cancel request to ${request.user.name}`}
                  title={`Cancel request to ${request.user.name}`}
                >
                  <X size={24} />
                </OmoriButton>
              )
            }
          />
        ))}
      </div>
    </section>
  );
};

export default PendingRequestsSection;
