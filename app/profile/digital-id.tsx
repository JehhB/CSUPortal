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
    <ScrollView
      refreshing={profileQuery.isFetching || picturesQuery.isFetching}
      onRefresh={() => {
        profileQuery.refetch();
        picturesQuery.refetch();
      }}
    >
      <StudentId
        profile={profileQuery.data ?? null}
        pictures={picturesQuery.data ?? null}
      />
    </ScrollView>
  );
}
