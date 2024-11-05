import dbConnect from '@/app/db/dbConnect';
import Post from '@/app/db/models/post';
import Category from '@/app/db/models/category';
import Like from '@/app/db/models/like';
import Comment from '@/app/db/models/comment';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req) {
  await dbConnect();

  try {
    const { pathname } = req.nextUrl;
    const id = pathname.split('/').pop();
    const post = await Post.findById(id)
      .populate('categoryId', 'name') // 카테고리 정보 포함
      .populate('likes') // 좋아요 정보 포함
      .populate('comments');

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error view post:', error);
    return NextResponse.json({ message: '게시글 조회 실패' }, { status: 500 });
  }
}

export async function PATCH(req) {
  await dbConnect();

  try {
    const { pathname } = req.nextUrl;
    const id = pathname.split('/').pop();

    const formData = await req.formData();
    const title = formData.get('title');
    const content = formData.get('content');
    const categoryId = formData.get('categoryId');
    const mainImage = formData.get('mainImage');
    const tags = formData.getAll('tags');

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        title,
        content,
        mainImage,
        categoryId,
        tags, // 태그 ID 배열 사용
      },
      {
        new: true,
      },
    );

    if (!updatedPost) {
      return NextResponse.json(
        { message: '게시글 찾을 수 없음' },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error update post:', error);
    return NextResponse.json(
      { message: '게시글 업데이트 실패' },
      { status: 500 },
    );
  }
}

export async function DELETE(req) {
  await dbConnect();

  try {
    const { pathname } = req.nextUrl;
    const id = pathname.split('/').pop();
    await Post.findByIdAndDelete(id);

    return NextResponse.json({ message: '게시글 삭제 성공' }, { status: 200 });
  } catch (error) {
    console.error('Error delete post:', error);
    return NextResponse.json({ message: '게시글 삭제 실패' }, { status: 500 });
  }
}
