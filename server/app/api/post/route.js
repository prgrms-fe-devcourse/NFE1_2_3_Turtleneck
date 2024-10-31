import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/app/db/dbConnect";
import Post from "@/app/db/models/post";
import Category from "@/app/db/models/category";
import Like from "@/app/db/models/like";
import Comment from "@/app/db/models/comment";

export async function GET() {
  await dbConnect();

  try {
    const posts = await Post.find()
      .populate("categoryId", "name")
      .populate("likes")
      .populate("comments"); // 카테고리의 이름 정보 포함

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetch posts:", error);
    return NextResponse.json(
      { message: "게시글 리스트 조회 실패" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await dbConnect();

  try {
    const { title, content, mainImage, categoryId, tags } = await req.json();
    const newPost = await Post.create({
      title,
      content,
      mainImage,
      categoryId,
      tags, // 태그 ID 배열 사용
    });
    return NextResponse.json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ message: "게시글 생성 실패" }, { status: 500 });
  }
}
