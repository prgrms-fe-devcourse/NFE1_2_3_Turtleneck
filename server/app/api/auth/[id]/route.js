import { NextResponse } from "next/server";
import dbConnect from "@/app/db/dbConnect";
import Auth from "@/app/db/models/auth";

export async function PATCH(req) {
  await dbConnect();

  try {
    const { pathname } = req.nextUrl;
    const id = pathname.split("/").pop();

    const updateData = await req.json();
    const updatedAuth = await Auth.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedAuth) {
      return NextResponse.json(
        { message: "auth 찾을 수 없음" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedAuth);
  } catch (error) {
    console.error("Error update post:", error);
    return NextResponse.json(
      { message: "auth 업데이트 실패" },
      { status: 500 }
    );
  }
}
