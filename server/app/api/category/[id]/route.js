import dbConnect from "@/app/db/dbConnect";
import Category from "@/app/db/models/category";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect();

  try {
    const { pathname } = req.nextUrl;
    const id = pathname.split("/").pop();
    const category = await Category.findById(id);

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error view category:", error);
    return NextResponse.json(
      { message: "카테고리 조회 실패" },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  await dbConnect();

  try {
    const { pathname } = req.nextUrl;
    const id = pathname.split("/").pop();

    const updateData = await req.json();
    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedCategory) {
      return NextResponse.json(
        { message: "카테고리 찾을 수 없음" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error update category:", error);
    return NextResponse.json(
      { message: "카테고리 업데이트 실패" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  await dbConnect();

  try {
    const { pathname } = req.nextUrl;
    const id = pathname.split("/").pop();
    await Category.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "카테고리 삭제 성공" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error delete category:", error);
    return NextResponse.json(
      { message: "카테고리 삭제 실패" },
      { status: 500 }
    );
  }
}
