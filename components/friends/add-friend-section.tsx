import { searchUser } from "@/actions/friends-actions";
import { useState } from "react";
import WordleButton from "../wordle-button";
import { SectionTitle } from "../dialog/friends-dialog";

const AddFriendSection = ({
  onSendRequest,
  isBusy,
}: {
  onSendRequest: (username: string) => void;
  isBusy: boolean;
}) => {
  const [username, setUsername] = useState("");
  const [searchResult, setSearchResult] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchResult(null);
    onSendRequest(username);
  };

  const handleSearch = async () => {
    setSearchResult(null);
    const result = await searchUser(username);
    if (!result) {
      setSearchResult("No user found with that username.");
      return;
    }

    setSearchResult(`Found ${result.name}. Send a request to add them.`);
  };

  return (
    <section className="flex flex-col gap-2 border-t-2 border-black pt-4">
      <SectionTitle>Add friend</SectionTitle>
      <p className="text-[0.625rem] leading-relaxed text-muted-foreground sm:text-xs">
        Search by Discord display name for now.
      </p>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="username"
          autoComplete="off"
          spellCheck={false}
          className="omori-border h-10 w-full bg-[var(--omori-empty)] px-3 font-pixel text-[0.625rem] uppercase outline-none placeholder:normal-case placeholder:text-muted-foreground sm:text-xs"
        />
        <div className="grid grid-cols-2 gap-2">
          <WordleButton
            type="button"
            className="w-full text-[0.625rem] sm:text-xs"
            disabled={isBusy || username.trim().length === 0}
            onClick={() => void handleSearch()}
          >
            Search
          </WordleButton>
          <WordleButton
            type="submit"
            className="w-full text-[0.625rem] sm:text-xs"
            disabled={isBusy || username.trim().length === 0}
          >
            Send request
          </WordleButton>
        </div>
      </form>
      {searchResult ? (
        <p className="text-center text-[0.625rem] text-muted-foreground sm:text-xs">
          {searchResult}
        </p>
      ) : null}
    </section>
  );
};

export default AddFriendSection;
