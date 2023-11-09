import { prisma } from "@/lib/db";
import Link from "next/link";
import { Suspense } from "react";
import Loading from "../../components/layout/Loading";
import { getServerAuthSession } from "@/lib/auth";

export default async function Dashboard() {
    const session = await getServerAuthSession()

    const enrollements = await prisma.enrollment.findMany({
        where: {
            userId: session?.user.id
        },
        include: {
            course: true
        },
    })
    return (
        <Suspense fallback={<Loading />}>
            <div className="flex flex-wrap gap-5 mx-auto ">
                {enrollements.length > 0 ? (enrollements?.map(({ course }) => (
                    <Link key={course.id} href={`/course/${course.id}`}>
                        <div className="card w-96 shadow-xl hover:bg-gray-100">
                            <figure><img src={course.image} alt="Shoes" /></figure>
                            <div className="card-body">
                                <h2 className="card-title">
                                    {course.name}
                                    <div className="badge badge-secondary">NEW</div>
                                </h2>
                                <DescriptionWithTruncation
                                    description={course.description}
                                />
                            </div>
                        </div>
                    </Link>
                ))) :
                    <div className="alert alert-error">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>You are not enrolled in any courses</span>
                    </div>
                }
            </div>
        </Suspense>
    );
}

// Extract the description rendering into a separate component
function DescriptionWithTruncation({ description }: { description: string }) {
    const length = 150
    const truncatedDescription = description.length > length
        ? `${description.slice(0, length)}...`
        : description;

    return <p>{truncatedDescription}</p>;
}