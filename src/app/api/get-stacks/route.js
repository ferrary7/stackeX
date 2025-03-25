import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "User ID is required" }, { status: 400 });

    const db = (await clientPromise).db();
    const stackex = await db.collection("stackex").find({ userId }).toArray();

    return NextResponse.json({ stacks: stackex });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stacks" }, { status: 500 });
  }
}
