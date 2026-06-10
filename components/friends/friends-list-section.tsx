import WordleButton from "@/components/wordle-button";
import { FriendListEntry } from "@/types/friends-types";
import { SectionTitle } from "@/components/dialog/friends-dialog";
import UserRow from "./user-row";
import { BarChart, X } from "lucide-react";

const FriendsListSection = ({
  friends,
  onRemove,
  onViewStats,
  isBusy,
}: {
  friends: FriendListEntry[];
  onRemove: (userId: string) => void;
  onViewStats: (userId: string) => void;
  isBusy: boolean;
}) => (
  <section className="flex flex-col gap-2">
    <SectionTitle>Your friends</SectionTitle>
    {friends.length === 0 ? (
      <p className="text-center text-[0.625rem] leading-relaxed text-muted-foreground sm:text-xs">
        No friends yet. Search below to send a request.
      </p>
    ) : (
      <div className="flex flex-col gap-2">
        {friends.map(({ user }) => (
          <UserRow
            key={user.id}
            user={user}
            trailing={
              <>
                <WordleButton
                  disabled={isBusy}
                  onClick={() => onViewStats(user.id)}
                  aria-label={`View stats for ${user.name}`}
                  title={`View stats for ${user.name}`}
                >
                  <BarChart size={24} />
                </WordleButton>
                <WordleButton
                  disabled={isBusy}
                  onClick={() => onRemove(user.id)}
                  aria-label={`Remove ${user.name} from friends`}
                  title={`Remove ${user.name} from friends`}
                >
                  <X size={24} />
                </WordleButton>
              </>
            }
          />
        ))}
      </div>
    )}
  </section>
);

export default FriendsListSection;
