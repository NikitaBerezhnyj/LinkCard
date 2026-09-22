import { PublicCard } from "@/components/card/PublicCard/PublicCard";
import { getPublicUser } from "@/services/userServices";
import { notFound } from "next/navigation";

export default async function PublicCardPage({
  params
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getPublicUser(username);

  if (!user) {
    notFound();
  }

  const cardUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${username}`;

  return <PublicCard user={user} cardUrl={cardUrl} />;
}
