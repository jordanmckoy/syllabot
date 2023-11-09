import { NextResponse } from 'next/server';
import { currentUser, auth } from "@clerk/nextjs";

export async function GET() {

    // Get the userId from auth() -- if null, the user is not logged in
    const { userId } = auth();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await currentUser();

    // Perform your Route Handler's logic with the returned user object

    return NextResponse.json({ "user": user }, { status: 200 })
}