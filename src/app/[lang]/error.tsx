"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="prose prose-invert">
      <h2>Something went wrong!</h2>
      <p>Error: {error.message}</p>
    </div>
  );
}
