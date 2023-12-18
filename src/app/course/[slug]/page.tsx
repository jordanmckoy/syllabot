import { prisma } from "@/lib/db";
import CourseView from "@/components/course/course";
import { Suspense } from "react";
<<<<<<< HEAD
import Loading from "@/components/layout/Loading";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";

export default async function CoursePage({ params }: { params: { slug: string } }) {
=======
import Loading from "@/app/components/layout/Loading";

export default async function CoursePage({ params }: { params: { slug: string } }) {

>>>>>>> main
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