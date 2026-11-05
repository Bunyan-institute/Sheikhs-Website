import { getProfile, getJourney, getQualifications } from "@/lib/db/repository";
import { ProfileClient } from "./profile-client";

export default async function AdminProfilePage() {
  const profile = await getProfile();
  const journey = await getJourney();
  const qualifications = await getQualifications();

  return (
    <ProfileClient
      initialProfile={profile}
      initialJourney={journey}
      initialQualifications={qualifications}
    />
  );
}
