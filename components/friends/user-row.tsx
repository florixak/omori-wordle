import { getAvatarSrc } from "@/lib/friend-utils";
import { FriendListEntry } from "@/types/friends-types";
import { Route } from "next";
import Image from "next/image";
import Link from "next/link";

type UserRowProps = {
  user: FriendListEntry["user"];
  trailing?: React.ReactNode;
};

const UserRow = ({ user, trailing }: UserRowProps) => {
  const profileHref = user.username
    ? (`/profile/${encodeURIComponent(user.username)}` as Route)
    : null;

  const identity = (
    <>
      <Image
        src={getAvatarSrc(user.image)}
        alt={`${user.name}'s avatar`}
        width={32}
        height={32}
        className="size-8 shrink-0 rounded-full border border-black"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.625rem] sm:text-xs">{user.name}</p>
        {user.username ? (
          <p className="truncate text-[0.625rem] text-muted-foreground sm:text-xs">
            @{user.username}
          </p>
        ) : null}
      </div>
    </>
  );

  return (
    <div className="omori-border flex items-center gap-2 bg-(--omori-empty) p-2">
      {profileHref ? (
        <Link
          href={profileHref}
          className="flex min-w-0 flex-1 items-center gap-2 transition-colors hover:opacity-80"
        >
          {identity}
        </Link>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-2">{identity}</div>
      )}
      {trailing}
    </div>
  );
};

export default UserRow;
