import AddFaculty from "@/components/AdminPanel/Forms/AddFaculty";
import BaseLayout from "@/components/BaseLayout/BaseLayout";
import DashboardLayout from "@/components/DasboardLayout/DashboardLayout";
import React from "react";

const Profile = () => {
  return (
    <BaseLayout title={"Profile"}>
      <DashboardLayout>
        <AddFaculty />
      </DashboardLayout>
    </BaseLayout>
  );
};

export default Profile;
