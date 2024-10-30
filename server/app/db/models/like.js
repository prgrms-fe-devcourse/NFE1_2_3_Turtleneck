import mongoose, { Schema } from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Types.ObjectId, ref: "Post" },
  },
  {
    timestamps: true,
  }
);

const Like = mongoose.models["Like"] || mongoose.model("Like", likeSchema);
export default Like;
