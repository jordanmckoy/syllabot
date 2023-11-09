import { UserTable } from "@/components/users/user-table";
import Alert from "@/components/ui/alert";
import { getServerAuthSession } from "@/lib/auth";
import { User, UserRole } from "@prisma/client";
import { Suspense } from "react";
import Loading from "../../components/layout/Loading";
import { prisma } from "@/lib/db";

export default async function Page() {
    const session = await getServerAuthSession();

    if (session?.user.role != UserRole.TEACHER) return <Alert message="You are not a teacher" type="alert-error" />

    const teacherCourses = await prisma.course.findMany({
        where: {
            teacherId: session.user.id
        }
    })

    const courseIds = teacherCourses.map((course) => course.id);

    const enrollement = await prisma.enrollment.findMany({
        where: {
            courseId: {
                in: courseIds
            }
        },
        select: {
            user: true
        },
        distinct: ["userId"],
    })

    let tableData: User[] = [];

    enrollement.map(({ user }) => {
        tableData.push(user)
    })

    // const overallProgressPercentage = progressArray.reduce((sum, progress) => sum + progress.progress, 0) / progressArray.length;
    return (
        <>
            <Suspense fallback={<Loading />}>
                <UserTable userProgressRows={tableData} />
            </Suspense>
        </>
    )
}