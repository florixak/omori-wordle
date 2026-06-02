import WordleButton from "@/components/wordle-button";
import { FriendListEntry } from "@/types/friends-types";
import { SectionTitle } from "@/components/dialog/friends-dialog";
import UserRow from "./user-row";

const FriendsListSection = ({
  friends,
  onRemove,
  isBusy,
}: {
  friends: FriendListEntry[];
  onRemove: (userId: string) => void;
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
              <WordleButton
                className="px-2 text-[0.625rem] sm:text-xs"
                disabled={isBusy}
                onClick={() => onRemove(user.id)}
              >
                Remove
              </WordleButton>
            }
          />
        ))}
      </div>
    )}
  </section>
);

export default FriendsListSection;
