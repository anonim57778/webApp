"use client";

export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-2xl font-medium">Error: {JSON.stringify(error)}</p>
    </div>
  );
}
