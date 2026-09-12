"use client";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h2>Щось пішло не так</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Спробувати ще раз</button>
    </div>
  );
}
