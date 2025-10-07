export default function UserPage({ params }: { params: { username: string } }) {
  const { username } = params;

  return (
    <main>
      <h1>User Profile</h1>
      <p>Username: {username}</p>
    </main>
  );
}
