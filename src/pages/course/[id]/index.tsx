import { useRouter } from "next/router"
import Layout from "~/components/Layout"
import Loading from "~/components/Loading"
import { api } from "~/utils/api"

const CoursePage = () => {
    const router = useRouter()

    const { id } = router.query

    const { data, isLoading } = api.course.getCourse.useQuery(id as string)

    if (isLoading) return <Loading />

    if (!data) return (

        <Layout currentPage="">
            <div>
                <h1>Course not found</h1>
            </div>
        </Layout>
    )

    return (
        <Layout currentPage="">
            
        </Layout>
    )
}

export default CoursePage