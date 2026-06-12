"use client";

import ErrorPage from "@/components/error-page";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const Error = ({ error, reset }: ErrorProps) => {
  return <ErrorPage error={error} reset={reset} />;
};

export default Error;
