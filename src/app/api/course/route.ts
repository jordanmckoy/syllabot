import { prisma } from "@/server/db"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const course = await prisma.course.findUnique({
        where: {
            id: id as string
        },
        include: {
            Unit: true
        }
    })
    return Response.json(course)
}
