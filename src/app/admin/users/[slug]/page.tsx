import Alert from "@/components/ui/alert";
import Details from "@/components/users/form";
import UserForm from "@/components/users/form";
import { prisma } from "@/lib/db";
import { Course } from "@prisma/client";

export default async function Page({ params }: { params: { slug: string } }) {

    const user = await prisma.user.findUnique({
        where: {
            id: params.slug
        }
    })

    const enrollements = await prisma.enrollment.findMany({
        where: {
            userId: params.slug
        },
        include: {
            course: true
        },
    })

    let courses: Course[] = []

    enrollements.map(({ course }) => {
        courses.push(course)
    })

    if (!user) return <Alert message="User Not Found" type="alert-error" />

    return (
        <>
            <Details courses={courses} user={user} />
        </>
    )
}