import mongoose from 'mongoose';

export const authSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
    },
    blogTitle: {
      type: String,
    },
    blogInfo: {
      type: String,
    },
    mainPostCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Auth = mongoose.models['Auth'] || mongoose.model('Auth', authSchema);

export default Auth;
