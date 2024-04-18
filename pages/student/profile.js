import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import BaseLayout from "@/components/BaseLayout/BaseLayout";
import DashboardLayout from "@/components/DasboardLayout/DashboardLayout";
import StudentProfile from "@/components/StudentProfile/StudentProfile";
import axios from "axios";

export default function Profile() {
  const { data: session, status } = useSession();
  const [student, setStudent] = useState(null);

  async function getStudent() {
    try {
      const res = await axios.get("/api/admin/student/get_student");
      //store that student which is in session according to id
      const student = res.data.find((student) => student.p_number === session?.user.id);
      setStudent(student);
    }
    catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    if (session) {
      getStudent();
    }
  }, [session]);

  return (
    <BaseLayout title={"Profile"}>
      <DashboardLayout>
        <StudentProfile student={student} />
      </DashboardLayout>
    </BaseLayout>
  );
}
