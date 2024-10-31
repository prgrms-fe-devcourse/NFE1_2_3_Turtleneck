import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/app/db/dbConnect";
import Comment from "@/app/db/models/comment";
import Post from "@/app/db/models/post";

export async function POST(req) {
  await dbConnect();

  try {
    const { postId, isAdmin, nickname, password, sessionId, content } =
      await req.json();
    const newComment = await Comment.create({
      postId,
      isAdmin,
      nickname,
      password,
      sessionId,
      content,
    });

    await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { comments: newComment._id } },
      { new: true }
    );
    return NextResponse.json(newComment);
  } catch (error) {
    console.error("Error creating Comment:", error);
    return NextResponse.json({ message: "댓글 생성 실패" }, { status: 500 });
  }
}
