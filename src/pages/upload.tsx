import Head from "next/head";
import MultipleFileUploadForm from "~/components/MultipleFileUploader";
import SingleFileUploadForm from "~/components/SingleFileUploader";

const Upload = () => {
    return (
        <div>
            <Head>
                <title>File uploader</title>
                <meta name="description" content="File uploader" />
            </Head>

            <main className="py-10">
                <div className="w-full max-w-3xl px-3 mx-auto">
                    <h1 className="mb-10 text-3xl font-bold text-white">
                        Upload your files
                    </h1>

                    <div className="space-y-10">
                        <div>
                            <h2 className="mb-3 text-xl font-bold text-white">
                                Single File Upload Form
                            </h2>
                            <SingleFileUploadForm />
                        </div>
                        <div>
                            <h2 className="mb-3 text-xl font-bold text-white">
                                Multiple File Upload Form
                            </h2>
                            <MultipleFileUploadForm />
                        </div>
                    </div>
                </div>
            </main>

            <footer>
                <div className="w-full max-w-3xl px-3 mx-auto">
                    <p>All right reserved</p>
                </div>
            </footer>
        </div>
    )
};

export default Upload;