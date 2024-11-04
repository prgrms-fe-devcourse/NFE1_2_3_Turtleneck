import mongoose, { Schema, models } from 'mongoose';

export const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Post',
    },
    isAdmin: {
      type: Boolean,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.isAdmin;
      },
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Comment =
  mongoose.models['Comment'] || mongoose.model('Comment', commentSchema);

export default Comment;
