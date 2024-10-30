import { NextResponse } from "next/server";
import dbConnect from "@/app/db/dbConnect";
import Auth from "@/app/db/models/auth";

export async function POST(req) {
  await dbConnect();

  try {
    const { id, password, nickname, blogTitle, blogInfo } = await req.json();
    const newAuth = await Auth.create({
      id,
      password,
      nickname,
      blogTitle,
      blogInfo,
    });
    return NextResponse.json(newAuth);
  } catch (error) {
    console.error("Error creating auth:", error);
    return NextResponse.json(
      { message: "블로그 어드민 내역 생성 실패" },
      { status: 500 }
    );
  }
}
