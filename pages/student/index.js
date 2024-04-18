import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { detectIncognito } from "detectincognitojs";

import BaseLayout from "@/components/BaseLayout/BaseLayout";
import Loader from "@/components/Loader";
import DashboardLayout from "@/components/DasboardLayout/DashboardLayout";
import StudentDashboard from "@/components/StudentDashboard/StudentDashboard";

export default function Dashboard() {
  const session = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isIncognito, setIsIncognito] = useState(false);

  useEffect(() => {
    if (session.status !== "authenticated") {
      router.push("/");
    }
  }, [session]);

  useEffect(() => {
    detectIncognito().then((result) => {
      if (result.isPrivate) {
        setIsIncognito(true);
      }
    });
    setLoading(false);
  }, []);

  if (loading) return <Loader />;

  if (isIncognito)
    return (
      <BaseLayout title={"Dashboard"}>
        <DashboardLayout>
          <div className="px-10">
            <h1 className="text-2xl font-bold text-center">
              Please disable incognito mode to continue.
            </h1>
          </div>
        </DashboardLayout>
      </BaseLayout>
    );

  return (
    <BaseLayout title={"Dashboard"}>
      <DashboardLayout>
        <StudentDashboard session={session} />
      </DashboardLayout>
    </BaseLayout>
  );
}
