import AppError from "../utils/AppError.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import cloudinary from "../config/cloudinaryConfig.js";
import User from "../models/user.schema.js";
import Blog from "../models/blog.schema.js";

// Create a new blog
export const createBlog = asyncHandler(async (req, res, next) => {
  const { title, description, thumbnail, category, tags, content, status } =
    req.body;
  const user = req.user;
  // console.log(req.body);

  // Validate required fields
  if (!title || !description || !content || !category) {
    return next(new AppError("All required fields must be provided", 400));
  }

  // Validate thumbnail
  if (!thumbnail) {
    return next(new AppError("Blog thumbnail is required", 400));
  }

  // Process tags - convert string to array if needed
  let processedTags = [];
  if (tags) {
    if (typeof tags === "string") {
      processedTags = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
    } else if (Array.isArray(tags)) {
      processedTags = tags.map((tag) => tag.trim()).filter((tag) => tag);
    }
  }

  // Get user details for author field
  const authorDetails = await User.findById(user._id).select("name avatar");
  if (!authorDetails) {
    return next(new AppError("User not found", 404));
  }

  // Create blog data
  const blogData = {
    title: title.trim(),
    description: description.trim(),
    thumbnail,
    category: category.trim(),
    tags: processedTags,
    content,
    author: {
      _id: user._id,
      name: authorDetails.name,
      avatar: authorDetails.avatar,
    },
    status: status || "draft",
  };

  // Create the blog
  const blog = await Blog.create(blogData);

  // Populate author details
  await blog.populate("author._id", "name avatar");

  res.status(201).json({
    success: true,
    message:
      status === "published"
        ? "Blog published successfully!"
        : "Blog saved as draft!",
    blog,
  });
});

export const publishedBlogs = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build query
  const query = { status: "published" };

  // Optional filters
  if (req.query.category) {
    query.category = { $regex: req.query.category, $options: "i" };
  }

  if (req.query.tags) {
    query.tags = { $in: req.query.tags.split(",") };
  }

  if (req.query.search) {
    query.$or = [
      { title: { $regex: req.query.search, $options: "i" } },
      { description: { $regex: req.query.search, $options: "i" } },
    ];
  }

  // Get blogs with pagination
  const blogs = await Blog.find(query)
    .populate("author._id", "name avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Get total count for pagination
  const totalBlogs = await Blog.countDocuments(query);
  const totalPages = Math.ceil(totalBlogs / limit);

  res.status(200).json({
    success: true,
    message: "Published blogs retrieved successfully",
    blogs,
    pagination: {
      currentPage: page,
      totalPages,
      totalBlogs,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
});
export const blogById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // 2. Find blog by ID and populate author._id
  const blog = await Blog.findById(id).populate("author._id", "name avatar");

  // 3. Blog not found
  if (!blog) {
    return next(new AppError("Blog not found", 404));
  }

  // 4. If status is draft and the requesting user is not the author, restrict access
  if (
    blog.status === "draft" &&
    (!req.user || req.user._id.toString() !== blog.author._id._id.toString())
  ) {
    return next(
      new AppError("You are not authorized to view this draft blog", 403)
    );
  }

  // 5. Optional: Increment view count for published blogs
  if (blog.status === "published") {
    blog.views += 1;
    await blog.save();
  }

  res.status(200).json({
    success: true,
    message: "Blog retrieved successfully",
    blog,
  });
});

export const userBlogs = asyncHandler(async (req, res, next) => {
  const user = req.user;

  // Check if user exists
  if (!user || !user._id) {
    return next(new AppError("User not found", 401));
  }

  try {
    // Find all blogs where author._id matches current user's _id
    const userBlogs = await Blog.find({
      "author._id": user._id,
    })
      .sort({ createdAt: -1 }) // Latest blogs first
      .select("-__v"); // Exclude version field

    // Send response with user's blogs
    res.status(200).json({
      success: true,
      message: "User blogs fetched successfully",
      data: {
        totalBlogs: userBlogs.length,
        blogs: userBlogs,
      },
    });
  } catch (error) {
    // console.error("Error fetching user blogs:", error);
    return next(new AppError("Failed to fetch user blogs", 500));
  }
});
