import dbConnect from '@/server/app/db/dbConnect';
import Like from '@/server/app/db/models/like';
import Post from '@/server/app/db/models/post';

export async function POST(req) {
  try {
    await dbConnect();
    const { postId } = await req.json();

    if (!postId) {
      return new Response(JSON.stringify({ error: 'postId가 없습니다' }), {
        status: 400,
      });
    }

    // 새로운 좋아요 생성
    const newLike = await Like.create({ postId });

    // 생성된 likeId를 해당 게시글의 likes 배열에 추가
    await Post.findByIdAndUpdate(postId, { $push: { likes: newLike._id } });

    return new Response(JSON.stringify({ likeId: newLike._id }), {
      status: 201,
    });
  } catch (error) {
    console.error('좋아요 추가 오류:', error);
    return new Response(JSON.stringify({ error: '서버 오류가 발생했습니다' }), {
      status: 500,
    });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id: likeId } = params; // URL에서 `likeId`를 가져옴

    if (!likeId) {
      return new Response(JSON.stringify({ error: 'likeId가 없습니다' }), {
        status: 400,
      });
    }

    // 좋아요 삭제
    const deletedLike = await Like.findByIdAndDelete(likeId);

    if (!deletedLike) {
      return new Response(JSON.stringify({ error: '해당 likeId가 없습니다' }), {
        status: 404,
      });
    }

    // 게시글의 likes 배열에서 likeId 제거
    await Post.updateOne({ likes: likeId }, { $pull: { likes: likeId } });

    return new Response(
      JSON.stringify({ message: '좋아요가 삭제되었습니다' }),
      { status: 200 },
    );
  } catch (error) {
    console.error('좋아요 삭제 오류:', error);
    return new Response(JSON.stringify({ error: '서버 오류가 발생했습니다' }), {
      status: 500,
    });
  }
}
