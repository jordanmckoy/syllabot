import { prisma } from "@/lib/db";
import CourseView from "@/app/components/course/course";
import { Suspense } from "react";
import Loading from "@/app/components/layout/Loading";

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

        <div>
            <h1>Course not found</h1>
        </div>
    )

    return (
        <Suspense fallback={<Loading />}>
            <CourseView data={data} />
        </Suspense>
    )
}