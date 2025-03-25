import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb"; // ✅ Import ObjectId

export async function POST(req) {
  try {
    const { userId, stacks } = await req.json();

    if (!userId || !stacks) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const db = (await clientPromise).db("stackex");
    await db.collection("stackex").insertOne({ userId, stacks, createdAt: new Date() });

    return NextResponse.json({ message: "Stack saved successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save stack" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { stackId } = await req.json();

    if (!stackId) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const db = (await clientPromise).db("stackex");
    await db.collection("stackex").deleteOne({ _id: new ObjectId(stackId.toString()) });

    return NextResponse.json({ message: "Stack deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete stack" }, { status: 500 });
  }
}
