import React from "react";
import ScrollView from "@/shared/components/ScrollView";
import StudentId from "@/graphs/StudentId";
import useStudentProfile from "@/student/profile/useStudentProfile";
import useAuth from "@/auth/useAuth";
import useStudentPictures from "@/student/profile/useStudentPictures";

export default function DigitalId() {
  const { accessToken } = useAuth();
  const { profileQuery } = useStudentProfile(accessToken);
  const { picturesQuery } = useStudentPictures(accessToken);

  return (
    <ScrollView>
      <StudentId profile={profileQuery.data} pictures={picturesQuery.data} />
    </ScrollView>
  );
}
