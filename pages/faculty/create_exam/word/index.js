import BaseLayout from '@/components/BaseLayout/BaseLayout'
import CreateExam from '@/components/CreateExam/CreateExam'
import DashboardLayout from '@/components/DasboardLayout/DashboardLayout'
import React from 'react'

export default function objective() {
  return (
    <BaseLayout title={"Create Objective Exam"}>
        <DashboardLayout>
            <CreateExam paperType={"Word"} />
        </DashboardLayout>
    </BaseLayout>
  )
}
