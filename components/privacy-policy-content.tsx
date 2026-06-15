import { siteConfig } from "@/lib/site-config";
import Link from "next/link";

const CONTACT_EMAIL = "omoriwordle@gmail.com";
const EFFECTIVE_DATE = "15 June 2026";

const PrivacyPolicyContent = () => {
  return (
    <article>
      <header className="space-y-2">
        <h1 className="font-pixel text-2xl sm:text-3xl">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">
          Effective date: {EFFECTIVE_DATE}
        </p>
        <p className="text-sm text-muted-foreground">
          Website:{" "}
          <Link href="/" className="underline">
            {siteConfig.url.replace(/^https?:\/\//, "")}
          </Link>
        </p>
      </header>

      <div className="mt-8 space-y-8 text-sm leading-relaxed sm:text-base">
        <section className="space-y-3">
          <h2 className="font-pixel text-lg">Introduction</h2>
          <p>
            OMORI Wordle is a free, non-commercial fan-made word puzzle inspired
            by the OMORI video game. It is not affiliated with, endorsed by, or
            connected to OMOCAT LLC.
          </p>
          <p>
            We do not sell your data, run ads, or use analytics trackers. This
            policy explains what we collect, why we collect it, and what rights
            you have under the General Data Protection Regulation (GDPR).
          </p>
          <p>
            You can play without an account. Signing in with Discord is optional
            and unlocks saved stats, streaks, and the friends leaderboard.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-pixel text-lg">What Data We Collect and Why</h2>

          <div className="space-y-2">
            <h3 className="font-medium">When you sign in with Discord</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Display name</strong> — shown on your profile and the
                friends leaderboard
              </li>
              <li>
                <strong>Username</strong> — your public profile URL and
                leaderboard identity
              </li>
              <li>
                <strong>Avatar URL</strong> — your profile picture
              </li>
              <li>
                <strong>Email address</strong> — account identification and
                support (for example, deletion requests)
              </li>
            </ul>
            <p>We do not use your email for marketing or newsletters.</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">
              When you play the game (signed-in users)
            </h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Daily game results</strong> — record whether you
                completed today&apos;s puzzle
              </li>
              <li>
                <strong>Guess history</strong> — reconstruct your grid in game
                history
              </li>
              <li>
                <strong>Win/loss statistics</strong> — your stats page
              </li>
              <li>
                <strong>Current and max streak</strong> — streak tracking
              </li>
              <li>
                <strong>Hint usage count</strong> — hint-related statistics
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">When you play without signing in</h3>
            <p>
              Your in-progress game may be stored locally in your browser.
              Completed guest results stay on your device and are not sent to
              our servers unless you sign in and choose to save them.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">What we do not collect</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>No analytics or tracking platforms</li>
              <li>No advertising or marketing pixels</li>
              <li>No newsletter or mailing list</li>
              <li>
                No payment or billing information — the game is completely free
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-pixel text-lg">
            How We Collect It — Discord OAuth
          </h2>
          <p>
            We use <strong>Discord OAuth</strong> as our only sign-in method.
            There is no email/password registration.
          </p>
          <p>When you choose &ldquo;Sign in with Discord&rdquo;:</p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              You are redirected to Discord&apos;s login page (operated by
              Discord Inc.).
            </li>
            <li>
              Discord asks you to authorize OMORI Wordle to access basic profile
              information.
            </li>
            <li>If you approve, Discord sends us the data listed above.</li>
            <li>
              We create or update your account and issue a session cookie so you
              stay signed in.
            </li>
          </ol>
          <p>
            We only receive what Discord shares for the permissions you grant.
            You can review or revoke access in your{" "}
            <Link
              href="https://discord.com/settings/applications"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord account settings
            </Link>
            .
          </p>
          <p>
            Discord processes your data under its own privacy policy when you
            use their service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-pixel text-lg">Data Storage</h2>
          <p>Your account and game data are stored in:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Vercel</strong> — application hosting (EU-based servers)
            </li>
            <li>
              <strong>Neon</strong> — serverless PostgreSQL database (EU-based
              servers)
            </li>
          </ul>
          <p>
            We do not intentionally transfer your personal data outside the
            European Union. Processing takes place on infrastructure located in
            the EU.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-pixel text-lg">Data Retention</h2>
          <p>
            We keep your personal data{" "}
            <strong>until you delete your account</strong>.
          </p>
          <p>
            Account deletion is <strong>permanent</strong> — we remove your
            profile, game results, statistics, friendships, and other associated
            data (hard delete, not soft delete).
          </p>
          <p>
            You can delete your account from your profile settings in the app,
            or email{" "}
            <Link href={`mailto:${CONTACT_EMAIL}`} className="underline">
              {CONTACT_EMAIL}
            </Link>{" "}
            from the address linked to your Discord account. We may ask you to
            confirm your identity before processing the request.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-pixel text-lg">Your Rights Under GDPR</h2>
          <p>
            If you are in the European Economic Area (including the Czech
            Republic), you have the following rights regarding your personal
            data:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Access</strong> — request a copy of the personal data we
              hold about you
            </li>
            <li>
              <strong>Rectification</strong> — ask us to correct inaccurate or
              incomplete data
            </li>
            <li>
              <strong>Erasure</strong> — ask us to delete your data
              (&ldquo;right to be forgotten&rdquo;)
            </li>
            <li>
              <strong>Data portability</strong> — request your data in a
              structured, commonly used, machine-readable format
            </li>
            <li>
              <strong>Restriction and objection</strong> — in certain cases, ask
              us to limit or stop processing
            </li>
            <li>
              <strong>Withdraw consent</strong> — where processing is based on
              consent, withdraw it at any time
            </li>
          </ul>
          <p>
            <strong>How to exercise your rights:</strong> email{" "}
            <Link href={`mailto:${CONTACT_EMAIL}`} className="underline">
              {CONTACT_EMAIL}
            </Link>{" "}
            with your request and enough detail for us to identify your account
            (for example, your Discord username). We will respond within{" "}
            <strong>30 days</strong>, as required by GDPR.
          </p>
          <p>
            <strong>Right to complain:</strong> if you believe we have not
            handled your data properly, you may lodge a complaint with your
            local supervisory authority. A list of EU supervisory authorities is
            available at{" "}
            <Link
              href="https://edpb.europa.eu/about-edpb/about-edpb/members_en"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://edpb.europa.eu/about-edpb/about-edpb/members_en
            </Link>
            .
          </p>

          <p>
            We encourage you to contact us first so we can try to resolve your
            concern.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-pixel text-lg">Cookies</h2>
          <p>
            We use <strong>one cookie</strong>: a session cookie managed by
            BetterAuth to keep you signed in after Discord authentication.
          </p>
          <p>This cookie:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Is strictly necessary for authentication</li>
            <li>Is not used for advertising, analytics, or tracking</li>
            <li>Expires when you sign out or when the session ends</li>
          </ul>
          <p>
            We do not use non-essential cookies or cookie consent banners for
            marketing purposes because we do not run tracking or advertising
            cookies.
          </p>
          <p>
            You can control cookies through your browser settings. Blocking the
            session cookie will prevent you from staying signed in.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-pixel text-lg">Age Restriction</h2>
          <p>
            OMORI Wordle is intended for users{" "}
            <strong>aged 18 and older</strong>, consistent with the PEGI 18
            rating of the OMORI video game.
          </p>
          <p>
            We do not knowingly collect personal data from children under 18. If
            you believe a child under 18 has created an account, please contact
            us at{" "}
            <Link href={`mailto:${CONTACT_EMAIL}`} className="underline">
              {CONTACT_EMAIL}
            </Link>{" "}
            and we will delete the account and associated data promptly.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-pixel text-lg">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time — for example,
            if our features or data practices change.
          </p>
          <p>When we do, we will:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Post the updated policy on this page</li>
            <li>Update the effective date at the top</li>
          </ul>
          <p>
            We encourage you to review this page occasionally. Continued use of
            OMORI Wordle after changes are posted means you accept the updated
            policy, to the extent permitted by law.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-pixel text-lg">Contact</h2>
          <p>For privacy questions, data requests, or account deletion:</p>
          <ul className="list-none space-y-1">
            <li>
              <strong>Email:</strong>{" "}
              <Link href={`mailto:${CONTACT_EMAIL}`} className="underline">
                {CONTACT_EMAIL}
              </Link>
            </li>
            <li>
              <strong>Website:</strong>{" "}
              <Link href="/" className="underline">
                {siteConfig.url.replace(/^https?:\/\//, "")}
              </Link>
            </li>
            <li>
              <strong>Data controller:</strong> OMORI Wordle (non-commercial fan
              project, EU)
            </li>
          </ul>
        </section>

        <p className="border-t border-border pt-6 text-sm text-muted-foreground">
          OMORI Wordle is a fan-made project and is not affiliated with OMOCAT
          LLC or the official OMORI game.
        </p>
      </div>
    </article>
  );
};

export default PrivacyPolicyContent;
