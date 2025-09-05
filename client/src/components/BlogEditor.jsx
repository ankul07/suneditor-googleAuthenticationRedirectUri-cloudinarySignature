import React, { useRef, useEffect } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { uploadToCloudinary } from "./cloudinaryConfig/uploadToCloudinary";

const BlogEditor = ({ content, onChange }) => {
  const editorRef = useRef(null);

  const handleImageUploadBefore = (files, info, uploadHandler) => {
    const file = files[0];

    if (!file) return;

    // Upload to Cloudinary
    uploadToCloudinary(file, "blog-content")
      .then((result) => {
        if (result.success) {
          // Call the upload handler with the response
          uploadHandler({
            result: [
              {
                url: result.url,
                name: file.name,
                size: file.size,
              },
            ],
          });
        } else {
          console.error("Image upload failed:", result.error);
          alert("Image upload failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Image upload error:", error);
        alert("Image upload failed. Please try again.");
      });

    return false; // Prevent default upload
  };

  const editorOptions = {
    height: 400,
    // placeholder: "Write your blog content here...",
    imageUploadUrl: null, // We're handling uploads manually
    videoUploadUrl: null,
    buttonList: [
      // Basic editing tools
      ["undo", "redo"],

      // Font and text formatting
      ["font", "fontSize", "formatBlock"],

      // Text styling
      ["paragraphStyle", "blockquote"],
      ["bold", "underline", "italic", "strike", "subscript", "superscript"],
      ["removeFormat"],

      // Colors
      ["fontColor", "hiliteColor"],

      // Alignment and spacing
      ["outdent", "indent"],
      ["align", "horizontalRule", "list", "lineHeight"],

      // Insert tools
      ["table", "link", "image", "video"],

      // Code tools - ye working hai
      ["codeView", "showBlocks"],

      // Utility tools
      ["fullScreen", "preview", "print"],

      // Save
      ["save"],
    ],

    // Format options - Only working formats
    formats: [
      "p",
      "div",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "pre",
    ],

    // Font options - Safe fonts only
    font: [
      "Arial",
      "Georgia",
      "Impact",
      "Tahoma",
      "Times New Roman",
      "Verdana",
      "Courier New",
    ],

    // Font size options
    fontSize: [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72],

    // Color palette
    colorList: [
      "#ff0000",
      "#ff5e00",
      "#ffe400",
      "#abf200",
      "#00d4aa",
      "#00d4ff",
      "#0162ff",
      "#5300eb",
      "#eb00ff",
      "#ff00c4",
      "#ff007f",
      "#ff0040",
      "#000000",
      "#ffffff",
      "#cccccc",
      "#999999",
      "#666666",
      "#333333",
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#f9ca24",
      "#f0932b",
      "#eb4d4b",
      "#6c5ce7",
      "#a29bfe",
      "#fd79a8",
      "#fdcb6e",
      "#e17055",
      "#74b9ff",
    ],

    // Remove problematic options
    imageResizing: true,
    imageHeightShow: true,
    imageAlignShow: true,
    imageMultipleFile: true,
    imageAccept: ".jpg,.jpeg,.png,.gif,.bmp,.svg,.webp",

    // Video options
    videoResizing: true,
    videoHeightShow: true,
    videoAlignShow: true,

    // Link options
    linkProtocol: "https://",

    // Code view options
    codeViewKeepButton: true,

    // Character counter
    charCounter: true,
    charCounterLabel: "Characters:",

    // Placeholder options
    placeholder: "Write your blog content here...",

    // Resizing
    resizingBar: true,

    // Show path
    showPathLabel: true,

    // Callback functions
    callBackSave: (contents) => {
      onChange({ target: { value: contents } });
    },
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Blog Content <span className="text-red-500">*</span>
      </label>
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <SunEditor
          ref={editorRef}
          setContents={content}
          onChange={onChange}
          onImageUploadBefore={handleImageUploadBefore}
          setOptions={editorOptions}
        />
      </div>
      <p className="text-xs text-gray-500">
        Use the rich editor to format your blog content. Add images, links,
        tables, code blocks, math equations, and styling. All tools are
        available!
      </p>
    </div>
  );
};

export default BlogEditor;
