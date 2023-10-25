import Layout from "~/components/Layout";
import { api } from "~/utils/api"
import { notesSchema } from "~/utils/schemas";
import Loading from "~/components/Loading";
import Form, { useZodForm } from '~/components/forms/Form';
import Input from '~/components/forms/Input';
import Select from '~/components/forms/Select';
import SubmitButton from '~/components/forms/SubmitButton';
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "~/server/auth";
import { useSession } from "next-auth/react";
import Login from "~/components/Login";

const UploadNotes = () => {
    const router = useRouter()

    const { data: session } = useSession();

    if (!session) return <Login />

    const { id } = router.query

    const form = useZodForm({
        schema: notesSchema,
    });

    const { mutate } = api.documents.createDocument.useMutation();

    const { data, isLoading } = api.course.getCourseUnits.useQuery(id as string);

    if (isLoading) return <Loading />

    return (
        <Layout currentPage="Notes Upload" session={session!}>
            <Form
                form={form}
                onSubmit={(data) => {
                    console.log(data);
                    mutate(data);
                }}
            >
                <div className="p-4 space-y-4">
                    <Input
                        label="Notes"
                        required
                        {...form.register('notes')}
                    />
                    <Select label="Unit" {...form.register('unitId')}>
                        <option disabled selected>Select Unit</option>
                        {data?.map((unit) => (
                            <option value={unit.id}>{unit.name}</option>
                        ))}
                    </Select>

                    <SubmitButton>Submit</SubmitButton>
                </div>
            </Form >
        </Layout>
    );
}

export default UploadNotes

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const session = await getServerAuthSession(ctx);

    return {
        props: {
            session: session,
        },
    };
};
