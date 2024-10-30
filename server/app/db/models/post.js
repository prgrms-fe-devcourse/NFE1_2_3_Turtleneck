import mongoose, { Schema, models } from "mongoose";

export const postSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    mainImage: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: mongoose.Types.ObjectId, // ObjectId로 설정
        ref: "Like", // Like 모델 참조
      },
    ],
    tags: {
      type: [String],
      required: true,
    },
    comments: [
      {
        type: mongoose.Types.ObjectId, // Comment도 ObjectId로 설정
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.models["Post"] || mongoose.model("Post", postSchema);

export default Post;
