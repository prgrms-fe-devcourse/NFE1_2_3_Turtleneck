'use client';

import styles from './write.module.scss';
import MarkdownIt from 'markdown-it';
import Image from 'next/image';
import MdEditor from 'react-markdown-editor-lite';
import { useRef, useState, useEffect } from 'react';
import './editor.css';
import { categoryApi, postApi, uploadApi } from '@/utils/api';
import { useRouter } from 'next/navigation';

export default function write() {
  const mdParser = new MarkdownIt(/* Markdown-it options */);
  const router = useRouter();
  const imgRef = useRef(null);

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

  //카테고리 가져오기
  const [categories, setCategories] = useState([]);

  async function getCategory() {
    try {
      const res = await categoryApi.getCategories();
      setCategories(res);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('카테고리 가져오기 실패'); // 사용자에게 에러 알림
    }
  }

  useEffect(() => {
    getCategory();
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
    console.log('handleEditorChange', html, text);
    setFormTag(tagsData);
    setTextData(text);
    setFormText(textData);
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

  const imgReset = () => {
    if (imgRef.current) {
      imgRef.current.value = '';
    }
  };

  //에디터 파일 업로드
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

  //대표이미지 파일 업로드
  const handleDefaultImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // 파일 객체를 상태에 설정

    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', file.name); // 파일 이름 추가

    try {
      // 이미지 파일을 서버로 업로드
      const response = await uploadApi.createFile(formData);

      // 서버에서 반환한 이미지 URL 사용
      const imageUrl = response.url;
      setImage(imageUrl);

      return imageUrl;
    } catch (error) {
      console.error('Image upload failed: ', error);
      return '';
    }
  };

  //submit 요청보내기
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    console.log(image);

    if (!formTitle.trim()) {
      alert('내용을 입력하세요.');
      return;
    }
    try {
      const response = await postApi.createPost({
        categoryId: Selected,
        title: formTitle,
        tags: formTag, // 태그 배열
        content: formText,
        mainImage: image, // 이미지 주소
      });

      // 성공적으로 추가된 경우 리다이렉트
      router.push('http://localhost:3000/');
    } catch (error) {
      console.error('Error posting:', error);
      alert('게시글 작성 실패'); // 사용자에게 에러 알림
    }
  };

  //edit버튼 이동기능
  const goBack = (e) => {
    router.back();
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
                  글쓰기
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
                    value={titleData}
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
                  <div>
                    <span className={styles.input_title}>대표이미지</span>
                    <label htmlFor="file">
                      <input
                        className={styles.file_input_button}
                        type="file"
                        accept="image/jpg, image/jpeg, image/png"
                        onChange={handleDefaultImageUpload}
                        name="file"
                        id="file"
                        ref={imgRef}
                      />
                    </label>
                  </div>
                  <button type="button" onClick={imgReset}>
                    삭제하기
                  </button>
                </div>
              </div>

              <MdEditor
                className={styles.editor}
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
