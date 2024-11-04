import dbConnect from '@/app/db/dbConnect';
import Category from '@/app/db/models/category';
import Post from '@/app/db/models/post';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req) {
  await dbConnect();

  try {
    const { pathname } = req.nextUrl;
    const id = pathname.split('/').pop();

    // 카테고리 정보 조회
    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        { message: '카테고리를 찾을 수 없습니다' },
        { status: 404 },
      );
    }

    // 해당 카테고리의 게시글 조회
    const posts = await Post.find({ categoryId: id })
      .sort({ createdAt: -1 })
      .populate('likes')
      .populate('comments');

    // 해당 카테고리의 모든 게시글에서 고유한 태그 추출
    const tags = [...new Set(posts.flatMap((post) => post.tags))];

    // 카테고리 정보, 게시글 목록, 태그 목록을 함께 반환
    return NextResponse.json({
      category,
      posts,
      tags,
    });
  } catch (error) {
    console.error('Error view category:', error);
    return NextResponse.json(
      { message: '카테고리 조회 실패' },
      { status: 500 },
    );
  }
}

export async function PATCH(req) {
  await dbConnect();

  try {
    const { pathname } = req.nextUrl;
    const id = pathname.split('/').pop();
    const { name } = await req.json();

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true },
    );

    if (!updatedCategory) {
      return NextResponse.json(
        { message: '카테고리를 찾을 수 없습니다' },
        { status: 404 },
      );
    }

    const categories = await Category.find().sort({ createdAt: -1 });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error update category:', error);
    return NextResponse.json(
      { message: '카테고리 업데이트 실패' },
      { status: 500 },
    );
  }
}

export async function DELETE(req) {
  await dbConnect();

  try {
    const { pathname } = req.nextUrl;
    const id = pathname.split('/').pop();

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json(
        { message: '카테고리를 찾을 수 없습니다' },
        { status: 404 },
      );
    }

    const categories = await Category.find().sort({ createdAt: -1 });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error delete category:', error);
    return NextResponse.json(
      { message: '카테고리 삭제 실패' },
      { status: 500 },
    );
  }
}
