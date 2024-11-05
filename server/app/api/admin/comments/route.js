import { NextResponse } from 'next/server';
import dbConnect from '@/app/db/dbConnect';
import Comment from '@/app/db/models/comment';
import Post from '@/app/db/models/post';

export async function GET() {
  await dbConnect();

  try {
    const comments = await Comment.find()
      .sort({ createdAt: -1 })
      .populate('postId');

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching all comments:', error);
    return NextResponse.json(
      { message: '댓글 목록 조회 실패' },
      { status: 500 },
    );
  }
}

export async function DELETE(req) {
  await dbConnect();

  try {
    const data = await req.json();
    const { commentId } = data;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return NextResponse.json(
        { message: '댓글을 찾을 수 없습니다' },
        { status: 404 },
      );
    }

    // 게시글에서 댓글 ID 제거
    await Post.findByIdAndUpdate(comment.postId, {
      $pull: { comments: comment._id },
    });

    // 댓글 삭제
    await Comment.findByIdAndDelete(commentId);

    return NextResponse.json({ message: '댓글이 삭제되었습니다' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ message: '댓글 삭제 실패' }, { status: 500 });
  }
}
