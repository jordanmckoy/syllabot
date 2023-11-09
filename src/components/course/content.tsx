import Markdown from "react-markdown";

export default function Content(
    { courseName, courseDescription, unitName, unitContent }
        :
        { courseName: string, courseDescription: string, unitName: string | null, unitContent: string | undefined }
) {
    return (
        <div className="flex flex-col w-3/4">
            <h1 className="text-2xl font-bold text-white">{courseName}</h1>
            <p className="text-gray-300">{courseDescription}</p>
            <h2 className="mt-6 text-xl font-semibold">{unitName ? unitName : "Select a unit"}</h2>
            <Markdown className="prose min-w-full mt-2 text-white" children={unitContent} />
        </div>
    )
}