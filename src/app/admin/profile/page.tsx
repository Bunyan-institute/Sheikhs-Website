import { getProfile, getJourney, getQualifications } from "@/lib/db/repository";
import { ProfileClient } from "./profile-client";

export default function AdminProfilePage() {
  const profile = getProfile();
  const journey = getJourney();
  const qualifications = getQualifications();

  return (
    <ProfileClient
      initialProfile={profile}
      initialJourney={journey}
      initialQualifications={qualifications}
    />
  );
}
