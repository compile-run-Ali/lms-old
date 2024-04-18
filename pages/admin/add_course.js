import AddCourse from '@/components/AdminPanel/Forms/AddCourse'
import BaseLayout from '@/components/BaseLayout/BaseLayout'
import DashboardLayout from '@/components/DasboardLayout/DashboardLayout'
import React from 'react'

export default function add_faculty() {
    return (
        <BaseLayout title={'Add Course'}>
            <DashboardLayout>
                <AddCourse />
            </DashboardLayout>
        </BaseLayout>
    )
}
