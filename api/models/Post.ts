import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    title: { type: String, required: true },
    description: {
      type: String,
      required: [
        function (this: { image: string | null }) {
          return !this.image;
        },
        'Description is required when there is no image',
      ],
    },
    image: { type: String, default: null },
  },
  { timestamps: true },
);

const Post = mongoose.model('Post', PostSchema);
export default Post;
