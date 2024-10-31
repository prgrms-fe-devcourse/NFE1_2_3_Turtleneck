import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/app/db/dbConnect";
import Post from "@/app/db/models/post";
import Like from "@/app/db/models/like";

export async function POST(req) {
  await dbConnect();

  try {
    const { postId } = await req.json();
    const newLike = await Like.create({ postId });

    await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: newLike._id } },
      { new: true }
    );
    return NextResponse.json(newLike);
  } catch (error) {
    console.error("Error creating like:", error);
    return NextResponse.json({ message: "좋아요 생성 실패" }, { status: 500 });
  }
}
