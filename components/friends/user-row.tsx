import { getAvatarSrc } from "@/lib/friend-utils";
import { FriendListEntry } from "@/types/friends-types";
import Image from "next/image";

type UserRowProps = {
  user: FriendListEntry["user"];
  trailing?: React.ReactNode;
};

const UserRow = ({ user, trailing }: UserRowProps) => {
  const identity = (
    <div className="flex items-center gap-2 justify-start w-full">
      <Image
        src={getAvatarSrc(user.image)}
        alt={`${user.name}'s avatar`}
        width={48}
        height={48}
        className="size-12 shrink-0 rounded-full border border-black"
        loading="lazy"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.625rem] sm:text-xs">{user.name}</p>
        {user.username ? (
          <p className="truncate text-[0.625rem] text-muted-foreground sm:text-xs">
            @{user.username}
          </p>
        ) : null}
      </div>
    </div>
  );

  return (
    <div className="omori-border flex items-center gap-2 bg-(--omori-empty) p-2">
      {identity}
      {trailing}
    </div>
  );
};

export default UserRow;
