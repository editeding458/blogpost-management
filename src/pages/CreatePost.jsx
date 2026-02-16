import { useEffect, useRef, useState } from "react";
import {
  FaCloudUploadAlt,
  FaHeading,
  FaLink,
  FaRegPaperPlane,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import "./CreatePost.css";

const CreatePost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const loginData = JSON.parse(localStorage.getItem("loginData") || "{}");
  const allUsers = JSON.parse(localStorage.getItem("authData") || "[]");
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

  // Allowed image formats
  const allowedFormats = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/webp',
    'image/svg+xml'
  ];

  const allowedExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i;

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      fetchPostToEdit();
    } else {
      setIsEditing(false);
      setFormData({
        title: "",
        author: userName,
        description: "",
        imageUrl: "",
        imageTab: "url",
      });
      setImagePreview(null);
    }
  }, [id, userName]);

  const fetchPostToEdit = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/posts/${id}`);
      if (response.ok) {
        const post = await response.json();
        setFormData({
          title: post.title || "",
          author: post.author || userName,
          description: post.description || "",
          imageUrl: post.image || "",
          imageTab:
            post.image && post.image.startsWith("http") ? "url" : "file",
        });
        setImagePreview(post.image || null);
      } else {
        toast.error("Failed to fetch post for editing");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error fetching post for edit:", error);
      toast.error("Error loading post");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Post title is required.";
    } else if (formData.title.length < 3) {
      newErrors.title = "Minimum 3 characters required.";
    }

    if (!formData.author.trim()) {
      newErrors.author = "Author name is required.";
    } else if (formData.author.length < 2) {
      newErrors.author = "Minimum 2 characters required.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    } else if (formData.description.length < 10) {
      newErrors.description = "Minimum 10 characters required.";
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = "Cover image is required.";
    } else {
      // Validate image format for URL
      if (formData.imageTab === "url") {
        if (!allowedExtensions.test(formData.imageUrl)) {
          newErrors.imageUrl = "Please provide a valid image URL (JPG, JPEG, PNG, GIF, BMP, WEBP, SVG)";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
    
    // Validate URL format
    if (errors.imageUrl) {
      setErrors({
        ...errors,
        imageUrl: "",
      });
    }
    
    if (url) {
      // Check if URL has valid image extension
      if (allowedExtensions.test(url)) {
        setImagePreview(url);
      } else {
        setImagePreview(null);
        if (url.trim()) {
          setErrors({
            ...errors,
            imageUrl: "Invalid image format. Please use JPG, JPEG, PNG, GIF, BMP, WEBP, or SVG",
          });
        }
      }
    } else {
      setImagePreview(null);
    }
  };

  const validateImageFile = (file) => {
    // Check file type
    if (!allowedFormats.includes(file.type)) {
      toast.error("Invalid file format. Please upload JPG, JPEG, PNG, GIF, BMP, WEBP, or SVG");
      return false;
    }
    
    // Check file size (optional - 5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File size too large. Maximum size is 5MB");
      return false;
    }
    
    return true;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file before processing
      if (!validateImageFile(file)) {
        // Reset file input
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
        if (errors.imageUrl) {
          setErrors({
            ...errors,
            imageUrl: "",
          });
        }
        toast.success(`${file.name} uploaded successfully!`);
      };
      reader.onerror = () => {
        toast.error("Error reading file. Please try again.");
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
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        createdAt: isEditing ? undefined : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      let url = "http://localhost:3000/posts";
      let method = "POST";

      if (isEditing && id) {
        url = `http://localhost:3000/posts/${id}`;
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
    if (isEditing && id) {
      fetchPostToEdit();
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
                      className={`tab-btn ${formData.imageTab === "url" ? "tab-btn-active" : ""}`}
                      onClick={() =>
                        setFormData({ ...formData, imageTab: "url" })
                      }
                    >
                      Image URL
                    </button>
                    <button
                      type="button"
                      className={`tab-btn ${formData.imageTab === "upload" ? "tab-btn-active" : ""}`}
                      onClick={() =>
                        setFormData({ ...formData, imageTab: "upload" })
                      }
                    >
                      Upload File
                    </button>
                  </div>

                  {formData.imageTab === "url" && (
                    <>
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
                      <small className="format-hint">
                        Supported formats: JPG, JPEG, PNG, GIF, BMP, WEBP, SVG
                      </small>
                    </>
                  )}

                  {formData.imageTab === "upload" && (
                    <>
                      <div
                        className={`image-upload-area ${errors.imageUrl ? "error" : ""}`}
                        onClick={triggerFileSelect}
                      >
                        <FaCloudUploadAlt className="upload-icon" />
                        <p>Click to upload image from your device</p>
                        <small className="upload-hint">
                          Supported: JPG, JPEG, PNG, GIF, BMP, WEBP, SVG (Max 5MB)
                        </small>
                        <input
                          ref={fileInputRef}
                          id="imageUpload"
                          type="file"
                          accept=".jpg,.jpeg,.png,.gif,.bmp,.webp,.svg,image/jpeg,image/png,image/gif,image/bmp,image/webp,image/svg+xml"
                          onChange={handleImageUpload}
                          style={{ display: "none" }}
                        />
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="image-preview-container">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="image-preview"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-image.jpg'; // Add a placeholder image
                      toast.error("Failed to load image. Please check the URL or file.");
                    }}
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
                Clear Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;