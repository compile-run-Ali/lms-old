import React from "react";
import ReviewContainer from "@/components/Review/ReviewContainer";
import DashboardLayout from "@/components/DasboardLayout/DashboardLayout";
import BaseLayout from "@/components/BaseLayout/BaseLayout";

export default function Review() {
  return (
    <BaseLayout>
      <DashboardLayout>
        <ReviewContainer />
      </DashboardLayout>
    </BaseLayout>
  );
}
