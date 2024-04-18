import React from "react";
import ViewContainer from "@/components/ViewPaper/ViewContainer";
import BaseLayout from "@/components/BaseLayout/BaseLayout";
import DashboardLayout from "@/components/DasboardLayout/DashboardLayout";
export default function View() {
  return (
    <BaseLayout>
      <DashboardLayout>
        <ViewContainer />
      </DashboardLayout>
    </BaseLayout>
  );
}
