import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/app/db/dbConnect';
import Post from '@/app/db/models/post';
import Category from '@/app/db/models/category';
import Like from '@/app/db/models/like';
import Comment from '@/app/db/models/comment';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET(request) {
  await dbConnect();

  try {
    // URL에서 searchParams 가져오기
    const { searchParams } = new URL(request.url);
    // limit 값이 없으면 null 반환 (전체 게시글 조회)
    const limit = parseInt(searchParams.get('limit')) || null;
    const categoryId = searchParams.get('categoryId');

    // 기본 쿼리 조건
    let queryConditions = {};

    // categoryId가 있는 경우 쿼리 조건에 추가
    if (categoryId) {
      queryConditions.categoryId = categoryId;
    }

    let query = Post.find(queryConditions)
      .sort({ createdAt: -1 }) // 최신순 정렬
      .populate('categoryId', 'name')
      .populate('likes')
      .populate('comments');

    // limit이 있는 경우에만 적용
    if (limit && limit > 0) {
      query = query.limit(limit);
    }

    // 쿼리 실행
    const posts = await query;

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetch posts:', error);
    return NextResponse.json(
      { message: '게시글 리스트 조회 실패' },
      { status: 500 },
    );
  }
}

export async function POST(req, res) {
  await dbConnect();

  try {
    const formData = await req.formData();
    const title = formData.get('title');
    const content = formData.get('content');
    const categoryId = formData.get('categoryId');
    const mainImage = formData.get('mainImage');
    const tags = formData.getAll('tags');

    // 4. 새로운 게시글 생성
    const newPost = await Post.create({
      title,
      content,
      mainImage,
      categoryId,
      tags, // 태그 ID 배열 사용
    });
    return NextResponse.json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ message: '게시글 생성 실패' }, { status: 500 });
  }
}
