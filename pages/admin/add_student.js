import React from "react";
import BaseLayout from "@/components/BaseLayout/BaseLayout";
import DashboardLayout from "@/components/DasboardLayout/DashboardLayout";
import AddStudent from "@/components/AdminPanel/Forms/AddStudent";

export default function add_student() {
  return (
    <BaseLayout title={"Add Student"}>
      <DashboardLayout>
        <AddStudent />
      </DashboardLayout>
    </BaseLayout>
  );
}
