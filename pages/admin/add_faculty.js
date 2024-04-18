import AddFaculty from "@/components/AdminPanel/Forms/AddFaculty";
import BaseLayout from "@/components/BaseLayout/BaseLayout";
import DashboardLayout from "@/components/DasboardLayout/DashboardLayout";
import React from "react";

export default function add_faculty() {
  return (
    <BaseLayout title={"Add Faculty"}>
      <DashboardLayout>
        <AddFaculty />
      </DashboardLayout>
    </BaseLayout>
  );
}
