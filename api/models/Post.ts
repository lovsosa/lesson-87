import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: true },
    description: {
      type: String,
      default: null,
      required: [
        function (this: { image: string | null }) {
          return !this.image;
        },
        'Description is required when there is no image',
      ],
    },
    image: {
      type: String,
      default: null,
      required: [
        function (this: { description: string | null }) {
          return !this.description;
        },
        'Image is required when there is no description',
      ],
    },
  },
  { timestamps: true },
);

const Post = mongoose.model('Post', PostSchema);
export default Post;
