import React from "react";
import BaseLayout from "@/components/BaseLayout/BaseLayout";
import DashboardLayout from "@/components/DasboardLayout/DashboardLayout";
import G2OfficerDashboard from "@/components/G2OfficerDashboard";

const Print = () => {
  return (
    <BaseLayout>
      <DashboardLayout>
        <G2OfficerDashboard />
      </DashboardLayout>
    </BaseLayout>
  );
};

export default Print;
