import AddFaculty from "@/components/AdminPanel/Forms/AddFaculty";
import AddIp from "@/components/AdminPanel/Forms/AddIp";
import BaseLayout from "@/components/BaseLayout/BaseLayout";
import DashboardLayout from "@/components/DasboardLayout/DashboardLayout";
import React from "react";

export default function add_ip() {
  return (
    <BaseLayout title={"Add IP"}>
      <DashboardLayout>
        <AddIp />
      </DashboardLayout>
    </BaseLayout>
  );
}
