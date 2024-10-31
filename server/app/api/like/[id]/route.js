import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/app/db/dbConnect";
import Like from "@/app/db/models/like";
import Post from "@/app/db/models/post";

export async function DELETE(req) {
  await dbConnect();

  try {
    const { pathname } = req.nextUrl;
    const id = pathname.split("/").pop();
    const post = await Like.findById(id);
    console.log(post);

    await Post.findByIdAndUpdate(
      post.postId, // 좋아요가 속한 포스트 ID
      { $pull: { likes: post._id } }, // likes 배열에서 likeId 제거
      { new: true }
    );

    await Like.findByIdAndDelete(id);

    return NextResponse.json({ message: "좋아요 삭제 성공" }, { status: 200 });
  } catch (error) {
    console.error("Error delete like:", error);
    return NextResponse.json({ message: "좋아요 삭제 실패" }, { status: 500 });
  }
}
