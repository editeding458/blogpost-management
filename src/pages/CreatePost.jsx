import { useEffect, useRef, useState } from "react";
import {
  FaCloudUploadAlt,
  FaHeading,
  FaLink,
  FaRegPaperPlane,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import "./CreatePost.css";

const CreatePost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editPost = location.state?.post;
  const isEditing = location.state?.isEditing || false;

  // Get current logged in user from loginData
  const loginData = JSON.parse(localStorage.getItem("loginData") || "{}");

  // Get all users from authData
  const allUsers = JSON.parse(localStorage.getItem("authData") || "[]");

  // Find the current logged in user by email
  const currentUser = allUsers.find((user) => user.email === loginData.email);
  const userName = currentUser?.username || "";

  const [formData, setFormData] = useState({
    title: "",
    author: userName,
    description: "",
    imageUrl: "",
    imageTab: "url",
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Load post data if editing
  useEffect(() => {
    if (isEditing && editPost) {
      setFormData({
        title: editPost.title || "",
        author: editPost.author || userName,
        description: editPost.description || "",
        imageUrl: editPost.image || "",
        imageTab: "url",
      });
      setImagePreview(editPost.image || null);
    }
  }, [isEditing, editPost, userName]);

  const validate = () => {
    const newErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Post title is required.";
    } else if (formData.title.length < 3) {
      newErrors.title = "Minimum 3 characters required.";
    }

    // Author validation
    if (!formData.author.trim()) {
      newErrors.author = "Author name is required.";
    } else if (formData.author.length < 2) {
      newErrors.author = "Minimum 2 characters required.";
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    } else if (formData.description.length < 10) {
      newErrors.description = "Minimum 10 characters required.";
    }

    // Image validation
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = "Cover image is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, imageUrl: url });
    // Clear image error
    if (errors.imageUrl) {
      setErrors({
        ...errors,
        imageUrl: "",
      });
    }
    if (url) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
        // Clear image error
        if (errors.imageUrl) {
          setErrors({
            ...errors,
            imageUrl: "",
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validate()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    setLoading(true);

    try {
      const postData = {
        title: formData.title,
        author: formData.author || userName || "Anonymous",
        description: formData.description,
        image: formData.imageUrl,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        updatedAt: new Date().toISOString(),
      };

      if (isEditing && editPost) {
        postData.createdAt = editPost.createdAt || new Date().toISOString();
      } else {
        postData.createdAt = new Date().toISOString();
      }

      let url = "http://localhost:3000/posts";
      let method = "POST";

      if (isEditing && editPost?.id) {
        url = `http://localhost:3000/posts/${editPost.id}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        toast.success(
          isEditing
            ? "Post updated successfully!"
            : "Post created successfully!",
        );
        navigate("/dashboard");
      } else {
        throw new Error(
          isEditing ? "Failed to update post" : "Failed to create post",
        );
      }
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error(
        isEditing ? "Failed to update post" : "Failed to create post",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearForm = () => {
    if (isEditing && editPost) {
      setFormData({
        title: editPost.title || "",
        author: editPost.author || userName,
        description: editPost.description || "",
        imageUrl: editPost.image || "",
        imageTab: "url",
      });
      setImagePreview(editPost.image || null);
    } else {
      setFormData({
        title: "",
        author: userName,
        description: "",
        imageUrl: "",
        imageTab: "url",
      });
      setImagePreview(null);
    }
    setErrors({});
    toast.info("Form reset");
  };

  return (
    <div className="create-post-page">
      <Navbar
        onLogout={() => {
          localStorage.removeItem("loginData");
          navigate("/login");
        }}
      />

      <div className="create-post-container">
        <header className="form-header">
          <h1>{isEditing ? "Edit Post" : "Create New Post"}</h1>
          <p>
            {isEditing
              ? "Update your thoughts and stories"
              : "Share your thoughts and stories with the world"}
          </p>
        </header>

        <div className="post-form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                Post Title <span className="required-star">*</span>
              </label>
              <div className="input-wrapper">
                <FaHeading className="input-icon" />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`form-control ${errors.title ? "error" : ""}`}
                  placeholder="Enter a catchy title..."
                />
              </div>
              {errors.title && (
                <span className="error-msg">{errors.title}</span>
              )}
            </div>

            <div className="form-group">
              <label>
                Author Name <span className="required-star">*</span>
              </label>
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className={`form-control ${errors.author ? "error" : ""}`}
                  placeholder="Your name"
                />
              </div>
              {errors.author && (
                <span className="error-msg">{errors.author}</span>
              )}
            </div>

            <div className="form-group">
              <label>
                Description <span className="required-star">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`form-control ${errors.description ? "error" : ""}`}
                placeholder="What's on your mind? Write your story here."
                rows="6"
              ></textarea>
              {errors.description && (
                <span className="error-msg">{errors.description}</span>
              )}
            </div>

            <div className="form-group">
              <label>
                Cover Image <span className="required-star">*</span>
              </label>

              {!imagePreview ? (
                <>
                  <div className="image-source-tabs">
                    <button
                      type="button"
                      className={`tab-btn ${formData.imageTab === "url" ? "active" : ""}`}
                      onClick={() =>
                        setFormData({ ...formData, imageTab: "url" })
                      }
                    >
                      Image URL
                    </button>
                    <button
                      type="button"
                      className={`tab-btn ${formData.imageTab === "upload" ? "active" : ""}`}
                      onClick={() =>
                        setFormData({ ...formData, imageTab: "upload" })
                      }
                    >
                      Upload File
                    </button>
                  </div>

                  {formData.imageTab === "url" && (
                    <div className="input-wrapper">
                      <FaLink className="input-icon" />
                      <input
                        type="url"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleImageUrlChange}
                        className={`form-control ${errors.imageUrl ? "error" : ""}`}
                        placeholder="Paste image URL here (e.g., https://...)"
                      />
                    </div>
                  )}

                  {formData.imageTab === "upload" && (
                    <div
                      className={`image-upload-area ${errors.imageUrl ? "error" : ""}`}
                      onClick={triggerFileSelect}
                    >
                      <FaCloudUploadAlt className="upload-icon" />
                      <p>Click to upload image from your device</p>
                      <input
                        ref={fileInputRef}
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: "none" }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="image-preview-container">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="image-preview"
                  />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={removeImage}
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
              {errors.imageUrl && (
                <span className="error-msg">{errors.imageUrl}</span>
              )}
            </div>

            <div className="form-actions-row">
              <button type="submit" className="submit-btn" disabled={loading}>
                <FaRegPaperPlane />
                {loading
                  ? isEditing
                    ? "Updating..."
                    : "Publishing..."
                  : isEditing
                    ? "Update Post"
                    : "Publish Post"}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={handleClearForm}
              >
                Reset Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;