/** Shared Omori pixel-border design tokens as Tailwind class strings. */

export const omoriBorder =
  "border-2 border-black shadow-[2px_2px_0px_var(--omori-shadow)]";

export const omoriBorderLg =
  "border-2 border-black shadow-[2px_2px_0px_var(--omori-shadow)] sm:shadow-[3px_3px_0px_var(--omori-shadow)]";

export const omoriPress =
  "transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none";

export const omoriFont = "font-pixel";

export const omoriPanel = "rounded-none bg-[var(--omori-empty)]";

export const omoriButtonDisabled =
  "disabled:cursor-not-allowed disabled:opacity-100 disabled:bg-[var(--omori-absent)] disabled:text-white";

export const omoriInteractive = `${omoriBorder} ${omoriPress}`;
