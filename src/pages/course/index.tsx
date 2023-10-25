import Layout from "~/components/Layout"
import Loading from "~/components/Loading";
import { api } from "~/utils/api"

const CoursesPage = () => {
    const { data, isLoading } = api.course.getAllCourses.useQuery();

    if (isLoading) return <Loading />

    return (
        <Layout currentPage={'Course'}>
            <div className="flex flex-wrap gap-5 justify-center">
                {data?.map((course) => (
                    <a href={`/course/${course.id}`}>
                        <div className="card w-96 shadow-xl hover:bg-gray-100">
                            <figure><img src={course.image} alt="Shoes" /></figure>
                            <div className="card-body">
                                <h2 className="card-title">
                                    {course.name}
                                    <div className="badge badge-secondary">NEW</div>
                                </h2>
                                <p>{course.description}</p>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </Layout>
    )
}

export default CoursesPage