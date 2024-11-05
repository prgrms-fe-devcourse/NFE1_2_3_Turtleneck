'use client';

import styles from './edit.module.scss';
import MarkdownIt from 'markdown-it';
import Image from 'next/image';
import MdEditor from 'react-markdown-editor-lite';
import { useRef, useState, useEffect } from 'react';
import './editor.css';
import { categoryApi, postApi, uploadApi } from '@/utils/api';
import { useParams, useRouter } from 'next/navigation';

export default function write() {
  const mdParser = new MarkdownIt(/* Markdown-it options */);
  const params = useParams(); // 현재 URL의 params 사용하여 post ID 가져오기
  const router = useRouter();

  //ORIGIN DATA
  const postId = params.id;
  const [originTitle, setOriginTitle] = useState('');

  //FORM DATA BASE
  const [Selected, setSelected] = useState('');
  const [titleData, setTitleData] = useState('');
  const [tag, setTag] = useState('');
  const [tagsData, setTagsData] = useState([]);
  const [textData, setTextData] = useState('');
  const [image, setImage] = useState(null);

  //SEND DATA
  const [formTitle, setFormTitle] = useState('');
  const [formTag, setFormTag] = useState('');
  const [formText, setFormText] = useState('');

  //카테고리와 이전글 데이터 가져오기
  const [categories, setCategories] = useState([]);
  const [post, setPost] = useState(null);

  useEffect(() => {
    async function getCategory() {
      try {
        const res = await categoryApi.getCategories();
        setCategories(res);
      } catch (error) {
        console.error('Error fetching categories:', error);
        alert('카테고리 가져오기 실패'); // 사용자에게 에러 알림
      }
    }

    async function fetchPost() {
      try {
        const data = await postApi.getPost(params.id); // 특정 게시글 조회 API 호출
        setPost(data);

        setOriginTitle(data.title);
        setSelected(data.categoryId._id);
        setTextData(data.content);

        function setTagsArray() {
          const tagArray = data.tags;
          setTagsData(tagArray);
        }

        setTagsArray();
      } catch (error) {
        console.error('게시글을 불러오는데 실패했습니다:', error);
        setError('게시글을 불러오는데 실패했습니다.');
        router.push('/not-found'); // not-found.js 페이지로 이동
      }
    }
    getCategory();
    fetchPost();
  }, []);

  //formdata에 따라서 textarea길이변경하기
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '0px'; // 초기화
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`; // 높이 조절
    }
  }, [titleData]); // text가 변경될 때마다 호출

  const titleHandler = (e) => {
    const newTitle = e.currentTarget.value;
    setTitleData(newTitle); // 상태 업데이트
    setFormTitle(titleData);
  };

  function handleEditorChange({ html, text }) {
    setFormTag(tagsData);
    setTextData(text);
    setFormText(text);
  }

  const tagHandler = (e) => {
    const newTag = e.currentTarget.value;
    setTag(newTag); // 입력한 tag를 tag에 저장
  };

  //tag추가 기능
  const tagsHandle = (e) => {
    e.preventDefault();

    if (tag.trim()) {
      // 빈 태그를 추가하지 않도록 체크
      setTagsData((prevList) => [...prevList, tag]);
      setTag(''); // 입력 필드를 비우기
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImage(file); // 파일 객체를 상태에 설정
    } else {
      setImage(null); // 파일이 없을 경우 상태 초기화
    }
  };

  const imgReset = () => {
    if (imgRef.current) {
      imgRef.current.value = '';
    }
  };

  //파일 업로드
  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', file.name); // 파일 이름 추가

    try {
      // 이미지 파일을 서버로 업로드
      const response = await uploadApi.createFile(formData);

      // 서버에서 반환한 이미지 URL 사용
      const imageUrl = response.url;
      return imageUrl;
    } catch (error) {
      console.error('Image upload failed: ', error);
      return '';
    }
  };

  //submit 요청보내기
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!formTitle.trim()) {
      alert('내용을 입력하세요.');
      return;
    }
    try {
      const response = await postApi.updatePost({
        postId: params.id,
        categoryId: Selected,
        title: formTitle,
        tags: formTag, // 태그 배열
        content: formText,
        mainImage: image, // 이미지 파일
      });

      // 성공적으로 추가된 경우 리다이렉트
      router.push(`http://localhost:3000/post/${params.id}`);
    } catch (error) {
      console.error('Error update:', error);
      alert('게시글 작성 실패'); // 사용자에게 에러 알림
    }
  };

  //edit버튼 이동기능
  const goBack = (e) => {
    router.push(`http://localhost:3000/post/${params.id}`);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <form
            className=""
            action=""
            onSubmit={onSubmitHandler}
            encType="multipart/form-data"
          >
            <div>
              <div className={styles.header}>
                <Image
                  src="/images/arrow-left.png"
                  width={33}
                  height={34}
                  alt="deco global img"
                  onClick={goBack}
                />
                <button className="submit_button" type="submit">
                  수정하기
                </button>
              </div>

              <div className={styles.info_wrap}>
                <div>
                  <select
                    className={styles.select}
                    onChange={(e) => {
                      setSelected(e.target.value);
                    }}
                    key=""
                    value={Selected}
                  >
                    <option value="category">카테고리</option>
                    {categories.map((category) => (
                      <option value={category._id} key={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.title_wrap}>
                  <h1>/</h1>
                  <textarea
                    className={styles.title}
                    placeholder="제목"
                    id="title"
                    name="title"
                    ref={textareaRef}
                    defaultValue={originTitle}
                    maxLength="36"
                    wrap="soft"
                    onChange={titleHandler}
                  ></textarea>
                </div>

                <hr className={styles.HR1} />

                <div className={styles.tag_wrap}>
                  <span className={styles.tag_title}>태그</span>
                  <span className={styles.tag_list}>{tagsData.join(', ')}</span>
                  <div className={styles.tag_input_wrap}>
                    <input
                      className={styles.tag_input}
                      type="text"
                      placeholder="태그입력 후 태그추가 버튼 클릭"
                      onChange={tagHandler}
                      value={tag}
                    ></input>
                    <button type="button" onClick={tagsHandle}>
                      태그추가
                    </button>
                  </div>
                </div>

                <hr className={styles.HR2} />

                <div className={styles.img_select}>
                  <span className={styles.input_title}>대표이미지</span>
                  <label htmlFor="file">
                    <input
                      className={styles.file_input_button}
                      type="file"
                      accept="image/jpg, image/jpeg, image/png"
                      onChange={handleFileChange}
                      name="file"
                      id="file"
                    />
                  </label>
                </div>
              </div>

              <MdEditor
                className={styles.editor}
                value={textData}
                renderHTML={(text) => mdParser.render(text)}
                onChange={handleEditorChange}
                onImageUpload={handleImageUpload}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
