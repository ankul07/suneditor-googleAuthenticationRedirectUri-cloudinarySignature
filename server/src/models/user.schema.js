import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    // Basic user information
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },

    // Manual authentication fields
    password: {
      type: String,
      minlength: 6,
      // Password required only for manual registration
      required: function () {
        return !this.googleId; // Password required if not Google user
      },
    },

    // Google authentication fields
    googleId: {
      type: String,
      sparse: true, // Allows multiple null values but unique non-null values
    },

    // Authentication provider tracking
    authProvider: {
      type: String,
      enum: ["manual", "google", "both"],
      default: "manual",
    },

    // Profile information (mostly from Google)
    profilePicture: {
      type: String,
      default: null,
    },

    // Account status
    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // Email verification (for manual signup)
    emailVerificationToken: {
      type: String,
      default: null,
    },

    emailVerificationExpires: {
      type: Date,
      default: null,
    },

    // Password reset (for manual login)
    passwordResetToken: {
      type: String,
      default: null,
    },

    passwordResetExpires: {
      type: Date,
      default: null,
    },

    // User role and permissions
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },

    // Login tracking
    lastLogin: {
      type: Date,
      default: null,
    },

    loginCount: {
      type: Number,
      default: 0,
    },

    // Blog specific fields (if needed)
    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    socialLinks: {
      twitter: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// Hide sensitive fields when converting to JSON
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.emailVerificationToken;
  delete user.passwordResetToken;
  return user;
};

// Generate Refresh Token (Long-lived)
userSchema.methods.getRefreshToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || "7d",
    }
  );
};

// Compare password method
userSchema.methods.comparePassword = async function (password) {
  if (!this.password) return false;
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
