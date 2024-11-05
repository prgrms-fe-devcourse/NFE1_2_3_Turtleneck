import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/app/db/dbConnect';
import Post from '@/app/db/models/post';
import Comment from '@/app/db/models/comment';
import bcrypt from 'bcrypt';

// 스팸 체크를 위한 방문자 기록
const recentComments = new Map();

// 내용 및 XSS 검사
function validateContent(content) {
  if (!content?.trim()) {
    throw new Error('내용을 입력해주세요');
  }

  if (content.length > 1000) {
    throw new Error('댓글은 1000자를 넘을 수 없습니다');
  }

  // 악성 js 코드를 방지
  if (/<script|javascript:|data:|onclick|onerror/.test(content)) {
    throw new Error('유효하지 않은 내용이 포함되어 있습니다');
  }
}

// 비로그인 사용자 입력 검사
function validateGuestInput(nickname, password) {
  if (!nickname?.trim() || nickname.length < 2 || nickname.length > 10) {
    throw new Error('닉네임은 2-10자로 입력해주세요');
  }

  if (!password || password.length < 4) {
    throw new Error('비밀번호는 4자 이상이어야 합니다');
  }
}

function getVisitorInfo(req) {
  const userAgent = req.headers['user-agent'] || '';
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || '';

  // User-Agent 문자열에서 직접 정보 추출
  const browser =
    userAgent.match(/Chrome|Firefox|Safari|Edge|MSIE/i)?.[0] || '';
  const os = userAgent.match(/Windows|Mac|Linux|Android|iOS/i)?.[0] || '';
  const device =
    userAgent.match(/Mobile|iPhone|iPad|Android/i)?.[0] || 'Desktop';

  // console.log로 방문자 정보 확인 (개발 시에만 사용)
  console.log('Visitor Info:', { ip, browser, os, device });

  return `${ip}_${browser}_${os}_${device}`;
}

export async function POST(req) {
  await dbConnect();

  try {
    const { postId, isAdmin, nickname, password, content } = await req.json();

    // 방문자 식별자 생성
    const visitorId = getVisitorInfo(req);

    // 내용 검사
    validateContent(content);

    // 비로그인 사용자 검사
    if (!isAdmin) {
      // 스팸 체크
      const now = Date.now();
      const visitorRequests = recentComments.get(visitorId) || [];
      const recentRequests = visitorRequests.filter(
        (time) => now - time < 60000, // 1분 이내 요청만 필터
      );

      if (recentRequests.length >= 3) {
        throw new Error('잠시 후에 다시 시도해주세요');
      }

      // 닉네임/비밀번호 검사
      validateGuestInput(nickname, password);

      // 요청 기록 업데이트
      recentRequests.push(now);
      recentComments.set(visitorId, recentRequests);
    }

    // 비밀번호 해싱 (비회원일 경우에만)
    const hashedPassword = !isAdmin ? await bcrypt.hash(password, 10) : null;

    const newComment = await Comment.create({
      postId,
      isAdmin,
      nickname,
      password: hashedPassword,
      content,
    });

    await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { comments: newComment._id } },
      { new: true },
    );

    return NextResponse.json(newComment);
  } catch (error) {
    console.error('Error creating Comment:', error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function GET(req) {
  await dbConnect();

  try {
    const { pathname } = req.nextUrl;
    const postId = pathname.split('/').pop();

    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });

    if (!comments || comments.length === 0) {
      return NextResponse.json([]);
    }

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching Comments:', error);
    return NextResponse.json({ message: '댓글 조회 실패' }, { status: 500 });
  }
}

export async function PATCH(req) {
  await dbConnect();

  try {
    const { pathname } = req.nextUrl;
    const id = pathname.split('/').pop();
    const updateData = await req.json();

    // 내용 수정 시 검사
    if (updateData.content) {
      validateContent(updateData.content);
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return NextResponse.json(
        { message: '댓글을 찾을 수 없습니다' },
        { status: 404 },
      );
    }

    // 관리자 댓글은 관리자만 수정 가능
    if (comment.isAdmin && !updateData.isAdmin) {
      return NextResponse.json({ message: '권한이 없습니다' }, { status: 403 });
    }

    // 비로그인 사용자는 비밀번호 확인
    if (!comment.isAdmin && updateData.password) {
      const isPasswordValid = await bcrypt.compare(
        updateData.password,
        comment.password,
      );

      if (!isPasswordValid) {
        return NextResponse.json(
          { message: '비밀번호가 일치하지 않습니다' },
          { status: 401 },
        );
      }
    }

    // 비밀번호 필드는 업데이트에서 제외
    const { password, ...updateFields } = updateData;

    const updatedComment = await Comment.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(req) {
  await dbConnect();

  try {
    const { pathname } = req.nextUrl;
    const id = pathname.split('/').pop();
    const comment = await Comment.findById(id);
    const body = await req.json();

    if (!comment) {
      return NextResponse.json(
        { message: '댓글을 찾을 수 없습니다' },
        { status: 404 },
      );
    }

    // 관리자 댓글은 관리자만 삭제 가능
    if (comment.isAdmin && !body.isAdmin) {
      return NextResponse.json({ message: '권한이 없습니다' }, { status: 403 });
    }

    // 관리자가 삭제하는 경우 (isAdmin이 true로 전달됨)
    if (body.isAdmin) {
      await Post.findByIdAndUpdate(
        comment.postId,
        { $pull: { comments: comment._id } },
        { new: true },
      );
      await Comment.findByIdAndDelete(id);
      return NextResponse.json({ message: '댓글이 삭제되었습니다' });
    }

    // 비관리자가 삭제하는 경우
    const isPasswordValid = await bcrypt.compare(
      body.password,
      comment.password,
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: '비밀번호가 일치하지 않습니다' },
        { status: 401 },
      );
    }

    await Post.findByIdAndUpdate(
      comment.postId,
      { $pull: { comments: comment._id } },
      { new: true },
    );

    await Comment.findByIdAndDelete(id);
    return NextResponse.json({ message: '댓글이 삭제되었습니다' });
  } catch (error) {
    console.error('Error deleting Comment:', error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
