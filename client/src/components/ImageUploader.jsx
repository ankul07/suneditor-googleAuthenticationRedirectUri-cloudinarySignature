import React, { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { uploadToCloudinary } from "./cloudinaryConfig/uploadToCloudinary";

const ImageUploader = ({
  onImageUpload,
  currentImage,
  label,
  accept = "image/*",
}) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size should be less than 10MB");
      return;
    }

    setUploading(true);
    try {
      const result = await uploadToCloudinary(file, "blog-images");

      if (result.success) {
        onImageUpload(result.url);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const removeImage = () => {
    onImageUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
        } ${currentImage ? "border-solid border-green-300 bg-green-50" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />

        {currentImage ? (
          <div className="relative">
            <img
              src={currentImage}
              alt="Uploaded thumbnail"
              className="w-full h-40 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              {uploading ? (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              ) : (
                <Upload size={48} />
              )}
            </div>
            <div className="text-sm text-gray-600">
              <p className="font-medium">
                {uploading
                  ? "Uploading..."
                  : "Click to upload or drag and drop"}
              </p>
              <p>PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
