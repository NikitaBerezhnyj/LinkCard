import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Welcome to LinkCard</h1>
      <p>This is the main page of your application.</p>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
    </main>
  );
}
