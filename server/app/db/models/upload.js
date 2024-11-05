import mongoose, { Schema } from 'mongoose';

const uploadSchema = new mongoose.Schema({
  imageUrl: { type: String },
});

const Upload =
  mongoose.models['Upload'] || mongoose.model('Upload', uploadSchema);
export default Upload;
