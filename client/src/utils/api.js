const BASE_URL = 'http://localhost:3005';

export const fetchApi = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(
        data.message || '요청 처리 중 오류가 발생했습니다',
      );
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

//글작성용 header세팅
export const fetchApimulti = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '요청 처리 중 오류가 발생했습니다');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// 로그인
export const authApi = {
  login: async (id, password) => {
    return fetchApi('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ id, password }),
    });
  },
};

//파일 업로드 기능
export const uploadApi = {
  createFile: async (formData) => {
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    return fetchApimulti('/api/upload', {
      method: 'POST',
      body: formData,
    });
  },
};

export const postApi = {
  // 최신 게시글 조회
  getRecentPosts: async (limit = 2, categoryId = null) => {
    // categoryId가 없으면 전체 게시글 중 최신 순으로 limit개 조회
    // categoryId가 있으면 해당 카테고리의 게시글 중 최신 순으로 limit개 조회
    let url = `/api/post?limit=${limit}`;
    if (categoryId) {
      url += `&categoryId=${categoryId}`;
    }
    return fetchApi(url);
  },

  // 특정 카테고리의 게시글만 조회하는 함수
  getPostsByCategory: async (categoryId, limit = 2) => {
    return fetchApi(`/api/post?categoryId=${categoryId}&limit=${limit}`);
  },

  // 모든 게시글 조회
  getAllPosts: async () => {
    return fetchApi('/api/post');
  },

  // 새 게시글 작성
  createPost: async ({ categoryId, title, tags, content, mainImage }) => {
    const formData = new FormData();
    formData.append('categoryId', categoryId);
    formData.append('title', title);
    tags.forEach((tag) => formData.append('tags', tag));
    formData.append('content', content);
    formData.append('file', mainImage);
    if (mainImage) {
      formData.append('mainImage', mainImage);
    }

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    return fetchApimulti('/api/post', {
      method: 'POST',
      body: formData, // FormData 사용
    });
  },

  // 특정 게시글 조회
  getPost: async (postId) => {
    return fetchApi(`/api/post/${postId}`);
  },

  // 게시글 수정
  updatePost: async (postId, updateData) => {
    return fetchApi(`/api/post/${postId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
  },

  updatePost: async ({
    postId,
    categoryId,
    title,
    tags,
    content,
    mainImage,
  }) => {
    const formData = new FormData();
    formData.append('categoryId', categoryId);
    formData.append('title', title);
    tags.forEach((tag) => formData.append('tags', tag));
    formData.append('content', content);
    formData.append('file', mainImage);
    if (mainImage) {
      formData.append('mainImage', mainImage);
    }

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    return fetchApimulti(`/api/post/${postId}`, {
      method: 'PATCH',
      body: formData, // FormData 사용
    });
  },

  // 게시글 삭제
  deletePost: async (postId) => {
    return fetchApi(`/api/post/${postId}`, {
      method: 'DELETE',
    });
  },
};

// 좋아요 API
export const likeApi = {
  addLike: async (postId) => {
    return fetchApi('/api/like', {
      method: 'POST',
      body: JSON.stringify({ postId }),
    });
  },

  // 좋아요 삭제
  removeLike: async (likeId) => {
    return fetchApi(`/api/like/${likeId}`, {
      method: 'DELETE',
    });
  },
};

export const commentApi = {
  // 댓글 생성
  createComment: async ({ postId, content, isAdmin, nickname, password }) => {
    const commentData = isAdmin
      ? {
          postId,
          content,
          isAdmin: true,
          nickname,
        }
      : {
          postId,
          content,
          isAdmin: false,
          nickname,
          password,
        };

    return fetchApi(`/api/comment/${postId}`, {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  },

  // 게시글의 모든 댓글 조회
  getComments: async (postId) => {
    return fetchApi(`/api/comment/${postId}`);
  },

  updateComment: async (commentId, { content, password }) => {
    return fetchApi(`/api/comment/${commentId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        content,
        password,
      }),
    });
  },

  deleteComment: async (commentId, password, isAdmin = false) => {
    return fetchApi(`/api/comment/${commentId}`, {
      method: 'DELETE',
      body: JSON.stringify({ password, isAdmin }),
    });
  },
};

export const categoryApi = {
  // 카테고리 목록 조회
  getCategories: async () => {
    return fetchApi('/api/category', {
      method: 'GET',
    });
  },

  // 특정 카테고리 조회 (게시글, 태그 정보 포함)
  getCategory: async (categoryId) => {
    return fetchApi(`/api/category/${categoryId}`, {
      method: 'GET',
    });
    // 반환값: { category: {...}, posts: [...], tags: [...] }
  },

  // 새 카테고리 생성 (전체 목록 반환)
  createCategory: async (name) => {
    return fetchApi('/api/category', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },

  // 카테고리 수정 (전체 목록 반환)
  updateCategory: async (categoryId, name) => {
    return fetchApi(`/api/category/${categoryId}`, {
      method: 'PATCH',
      body: JSON.stringify({ name }),
    });
  },

  // 카테고리 삭제 (전체 목록 반환)
  deleteCategory: async (categoryId) => {
    return fetchApi(`/api/category/${categoryId}`, {
      method: 'DELETE',
    });
  },
};

export const adminApi = {
  // 관리자 설정 조회
  getAdminSettings: () => {
    return fetchApi('/api/admin');
  },

  // 관리자 설정 업데이트 (닉네임, 블로그 이름, 블로그 설명)
  updateSetting: (type, value) => {
    return fetchApi(`/api/admin/${type}`, {
      method: 'PATCH',
      body: JSON.stringify({ [type]: value }),
    });
  },

  // 관리자 권한 댓글 불러오기
  getAllComments: () => {
    return fetchApi('/api/admin/comments');
  },

  // 관리자 권한 댓글 삭제
  deleteComment: (commentId) => {
    return fetchApi(`/api/comment/${commentId}`, {
      method: 'DELETE',
      body: JSON.stringify({ isAdmin: true }),
    });
  },

  updateMainPostCategory: (categoryId) => {
    return fetchApi('/api/admin/mainPostCategory', {
      method: 'PATCH',
      body: JSON.stringify({ mainPostCategoryId: categoryId }),
    });
  },
};
