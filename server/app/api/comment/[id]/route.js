import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/app/db/dbConnect";
import Post from "@/app/db/models/post";
import Comment from "@/app/db/models/comment";

export async function GET(req) {
  await dbConnect();

  try {
    const { pathname } = req.nextUrl;
    const id = pathname.split("/").pop();
    const comment = await Comment.findById(id);
    const comments = await Post.populate(comment, { path: "postId " });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error delete Comment:", error);
    return NextResponse.json({ message: "댓글 조회 실패" }, { status: 500 });
  }
}

export async function PATCH(req) {
  await dbConnect();

  try {
    const { pathname } = req.nextUrl;
    const id = pathname.split("/").pop();

    const updateData = await req.json();
    const updatedComment = await Comment.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedComment) {
      return NextResponse.json(
        { message: "댓글 찾을 수 없음" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error("Error update post:", error);
    return NextResponse.json(
      { message: "댓글 업데이트 실패" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  await dbConnect();

  try {
    const { pathname } = req.nextUrl;
    const id = pathname.split("/").pop();
    const post = await Comment.findById(id);

    await Post.findByIdAndUpdate(
      post.postId, // comment가 속한 포스트 ID
      { $pull: { comments: post._id } }, // comments 배열에서 commentId 제거
      { new: true }
    );

    await Comment.findByIdAndDelete(id);

    return NextResponse.json({ message: "댓글 삭제 성공" }, { status: 200 });
  } catch (error) {
    console.error("Error delete Comment:", error);
    return NextResponse.json({ message: "댓글 삭제 실패" }, { status: 500 });
  }
}
