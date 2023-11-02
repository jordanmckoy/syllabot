import DashboardLayout from "@/app/components/layout/Dashboard"
import { prisma } from "@/server/db";
import CourseView from "@/app/components/course/course";

export default async function CoursePage({ params }: { params: { slug: string } }) {

    const data = await prisma.course.findUnique({
        where: {
            id: params.slug
        },
        include: {
            Unit: true
        }
    })

    if (!data) return (

        <DashboardLayout>
            <div>
                <h1>Course not found</h1>
            </div>
        </DashboardLayout>
    )

    return (
        <DashboardLayout>
            <CourseView data={data} />
        </DashboardLayout >
    )
}