// controllers/user.controller.js
import cloudinary from "../config/cloudinaryConfig.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import AppError from "../utils/AppError.js";
import User from "../models/user.schema.js";

export const getCloudinarySignature = asyncHandler(async (req, res, next) => {
  try {
    // Current timestamp
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Optional: Get folder from request body or use default
    const folder = req.body.folder || "user-uploads";

    // Parameters for signature (add more as needed)
    const params = {
      timestamp: timestamp,
      folder: folder,
      // Optional: Add transformations
      // transformation: "w_500,h_500,c_fill",
      // resource_type: "image"
    };

    // Generate signature using Cloudinary's utility
    const signature = cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_CLIENT_SECRET
    );

    // Send response with all required data
    res.status(200).json({
      success: true,
      signature: signature,
      timestamp: timestamp,
      cloudName: process.env.CLOUDINARY_CLIENT_NAME,
      apiKey: process.env.CLOUDINARY_CLIENT_API,
      folder: folder,
    });
  } catch (error) {
    // console.error("Error generating Cloudinary signature:", error);
    return next(new AppError("Failed to generate signature", 500));
  }
});

export const updateProfile = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const { name, bio, website, socialLinks } = req.body;

  // Validation
  if (!name || name.trim().length < 2) {
    return next(new AppError("Name must be at least 2 characters long", 400));
  }

  if (name.trim().length > 50) {
    return next(new AppError("Name cannot exceed 50 characters", 400));
  }

  if (bio && bio.length > 500) {
    return next(new AppError("Bio cannot exceed 500 characters", 400));
  }

  // Website URL validation (optional)
  if (website && website.trim() !== "") {
    const urlPattern =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(website.trim())) {
      return next(new AppError("Please provide a valid website URL", 400));
    }
  }

  // Social links validation (optional)
  if (socialLinks) {
    const urlPattern =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

    for (const [platform, url] of Object.entries(socialLinks)) {
      if (url && url.trim() !== "" && !urlPattern.test(url.trim())) {
        return next(
          new AppError(`Please provide a valid ${platform} URL`, 400)
        );
      }
    }
  }

  try {
    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        name: name.trim(),
        bio: bio ? bio.trim() : "",
        website: website ? website.trim() : "",
        socialLinks: {
          twitter: socialLinks?.twitter ? socialLinks.twitter.trim() : "",
          linkedin: socialLinks?.linkedin ? socialLinks.linkedin.trim() : "",
          github: socialLinks?.github ? socialLinks.github.trim() : "",
        },
        updatedAt: new Date(),
      },
      {
        new: true, // Return updated document
        runValidators: true, // Run schema validators
      }
    );

    if (!updatedUser) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    // console.error("Error updating profile:", error);

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return next(new AppError(`Validation Error: ${errors.join(", ")}`, 400));
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return next(new AppError("Duplicate field value entered", 400));
    }

    return next(new AppError("Failed to update profile", 500));
  }
});
