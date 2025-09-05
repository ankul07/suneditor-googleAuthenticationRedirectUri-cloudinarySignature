import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Blog description is required"],
      trim: true,
    },
    thumbnail: {
      type: String, // Cloudinary URL
      required: [true, "Blog thumbnail is required"],
    },
    category: {
      type: String,
      required: [true, "Blog category is required"],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    content: {
      type: String, // SunEditor provides HTML string
      required: [true, "Blog content is required"],
    },
    author: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      avatar: {
        type: String, // Cloudinary URL
        // required: true,
      },
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
