import BaseLayout from "@/components/BaseLayout/BaseLayout";
import DashboardLayout from "@/components/DasboardLayout/DashboardLayout";
import React from "react";
import PasswordComponent from "@/components/PasswordComponent";
const PasswordRecovery = () => {
  return (
    <BaseLayout title={"Password"}>
      <DashboardLayout>
        <PasswordComponent />
      </DashboardLayout>
    </BaseLayout>
  );
};

export default PasswordRecovery;
