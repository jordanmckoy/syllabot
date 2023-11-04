import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Suspense } from "react";
import Loading from "../components/layout/Loading";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const session = await getServerSession();

    if (!session) {
        redirect("/api/auth/signin");
    }

    const data = await prisma.course.findMany({
        orderBy: {
            name: "asc"
        }
    });
    return (
        <Suspense fallback={<Loading />}>
            <div className="flex flex-wrap gap-5 mx-auto ">
                {data?.map((course) => (
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
                ))}
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