// client/src/app/post/[id]/page.jsx

"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // URL에서 ID 가져오기
import { postApi } from "@/utils/api";
import MarkdownIt from "markdown-it";
import styles from "./post.module.scss";
import CopyLinkButton from "../components/CopyLinkButton";
import LikeButton from "../components/LikeButton";
import Navigation from "@/app/components/navigation";

const md = new MarkdownIt();

export default function PostDetail() {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const params = useParams(); // 현재 URL의 params 사용하여 post ID 가져오기
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await postApi.getPost(params.id); // 특정 게시글 조회 API 호출
        setPost(data);
      } catch (error) {
        console.error("게시글을 불러오는데 실패했습니다:", error);
        setError("게시글을 불러오는데 실패했습니다.");
        router.push('/not-found'); // not-found.js 페이지로 이동
      }
    };
    fetchPost();
  }, [params.id]);

  if (error) return <div>{error}</div>;
  if (!post) return <div>로딩중...</div>;

  const categoryName = post.categoryId?.name || 'Uncategorized';

  return (
    <div className={styles.post_container}>
      <header className={styles.header_section}>
        <Navigation />
        <button className={styles.btn_back} onClick={() => window.history.back()}>
          <span className={styles.materialIcon}>arrow_back</span>
        </button>
        <h1 className={styles.post_title}>{post.title}</h1>
      </header>

      <aside className={styles.aside_section}>
        <div className={styles.metadata_section}>
          <div className={styles.section_name}>/ METADATA</div>
          <table>
            <tbody>
              <tr>
                <th className={styles.metadata_label}>DATE</th>
                <td className={styles.metadata_value}>{post.createdAt.slice(0,10)}</td>
              </tr>
              <tr>
                <th className={styles.metadata_label}>CATEGORY</th>
                <td className={styles.metadata_value}>{categoryName}</td>
              </tr>
              <tr>
                <th className={styles.metadata_label}>TAGS</th>
                <td className={styles.metadata_value}>
                  {post.tags && post.tags.join(", ")}
                </td>
              </tr>
            </tbody>
          </table>
          <CopyLinkButton />
        </div>
      </aside>

      <div className={styles.article_section}>
        <div className={styles.article_header}>
          <div className={styles.section_name}>/ ARTICLE</div>
          <div className={styles.article_btns}>
            <button className={styles.btn_edit}>EDIT</button>
            <button className={styles.btn_delete}>DELETE</button>
          </div>
        </div>
        <article className={styles.article_content}>
          <div dangerouslySetInnerHTML={{ __html: md.render(post.content) }} />
        </article>
        <LikeButton />
      </div>
    </div>
  );
}
