import { formatAttempts, getAvatarSrc } from "@/lib/friend-utils";
import { FriendsLeaderboardEntry } from "@/types/friends-types";
import Image from "next/image";
import { SectionTitle } from "@/components/dialog/friends-dialog";
import OmoriBadge from "@/components/omori/omori-badge";

const LeaderboardSection = ({
  entries,
  date,
}: {
  entries: FriendsLeaderboardEntry[];
  date: string;
}) => (
  <section className="flex flex-col gap-2">
    <SectionTitle>Today&apos;s leaderboard</SectionTitle>
    <p className="text-[0.625rem] text-muted-foreground sm:text-xs">{date}</p>
    {entries.length === 0 ? (
      <p className="text-center text-[0.625rem] leading-relaxed text-muted-foreground sm:text-xs">
        Add friends to compare today&apos;s puzzle.
      </p>
    ) : (
      <div className="flex flex-col gap-1.5">
        {entries.map((entry) => (
          <div
            key={entry.user.id}
            className="omori-border grid grid-cols-[auto_1fr_auto] items-center gap-2 bg-(--omori-empty) p-2"
          >
            <span className="font-pixel w-5 text-center text-[0.625rem] sm:text-xs">
              {entry.rank}
            </span>
            <div className="flex min-w-0 items-center gap-2">
              <Image
                src={getAvatarSrc(entry.user.image)}
                alt={`${entry.user.name}'s avatar`}
                width={32}
                height={32}
                className="size-8 shrink-0 rounded-full border border-black"
              />
              <p className="truncate text-[0.625rem] sm:text-xs">
                {entry.user.name}
              </p>
            </div>
            <div className="flex items-center justify-end gap-2">
              {entry.isHinted ? (
                <OmoriBadge variant="hint">Hint used</OmoriBadge>
              ) : null}
              <span className="font-pixel w-6 text-center text-[0.625rem] sm:text-xs">
                {formatAttempts(entry.attempts, entry.won)}
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </section>
);

export default LeaderboardSection;
