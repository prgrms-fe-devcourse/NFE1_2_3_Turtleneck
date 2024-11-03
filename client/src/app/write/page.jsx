'use client';

import styles from './write.module.scss';
import MarkdownIt from 'markdown-it';
import Image from 'next/image';
import MdEditor from 'react-markdown-editor-lite';
import { useRef, useState, useEffect } from 'react';
import './editor.css';
import axios from 'axios';
import { categoryApi } from '@/utils/api';

export default function write() {
  const mdParser = new MarkdownIt(/* Markdown-it options */);

  //FORM DATA BASE
  const [Selected, setSelected] = useState('');
  const [titleData, setTitleData] = useState('');
  const [tagData, setTagData] = useState('');
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
    setFormTitle(titleData); // 보낼값
  };

  function handleEditorChange({ html, text }) {
    setTextData(text);
    setFormText(textData); // 보낼값
  }

  const tagHandler = (e) => {
    const newTag = e.currentTarget.value;
    setTagData(newTag); // 상태 업데이트
    setFormTag(tagData); // 보낼값
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImage(file); // 파일 객체를 상태에 설정
    } else {
      setImage(null); // 파일이 없을 경우 상태 초기화
    }
  };

  //submit 요청보내기
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!formTitle.trim()) {
      alert('내용을 입력하세요.');
      return;
    }

    const formData = new FormData();
    formData.append('title', formTitle);
    formData.append('content', formText);
    formData.append('categoryId', Selected);
    formData.append('tags', formTag);
    if (image) {
      formData.append('mainImage', image); // 이미지 파일 추가
    }

    try {
      const res = await axios.post(`/api/post`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(res);
      // 성공적으로 추가된 경우 리다이렉트
      NextResponse.redirect(`/`, 302);
    } catch (error) {
      console.error('Error posting:', error);
      alert('게시글 작성 실패'); // 사용자에게 에러 알림
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <form className="" action="" onSubmit={onSubmitHandler}>
            <div>
              <div className={styles.header}>
                <Image
                  src="/images/arrow-left.png"
                  width={33}
                  height={34}
                  alt="deco global img"
                />
                <button className="submit_button">글쓰기</button>
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

                <hr className={styles.HR} />

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

                <div className={styles.tag_wrap}>
                  <span className={styles.tag_title}>태그</span>
                  <input
                    className={styles.tag_input}
                    type="text"
                    placeholder="태그를 입력하세요"
                    onChange={tagHandler}
                  ></input>
                </div>
              </div>

              <MdEditor
                className={styles.editor}
                renderHTML={(text) => mdParser.render(text)}
                onChange={handleEditorChange}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
