import dbConnect from "@/app/db/dbConnect";
import Category from "@/app/db/models/category";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    const categories = await Category.find();

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetch categories:", error);
    return NextResponse.json(
      { message: "카테고리 리스트 조회 실패" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await dbConnect();

  try {
    const { name } = await req.json();
    const newCategory = await Category.create({
      name,
    });
    return NextResponse.json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { message: "카테고리 생성 실패" },
      { status: 500 }
    );
  }
}
