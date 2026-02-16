import { useEffect, useState } from "react";
import { FaArrowLeft, FaCalendarAlt, FaClock } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import "./PostDetails.css";

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/posts/${id}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data);
      } else {
        toast.error("Post not found");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      toast.error("Failed to load post");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  // Calculate read time (simple: 200 words per minute)
  const calculateReadTime = (text) => {
    if (!text) return 1;
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  // Share on Twitter
  const shareOnTwitter = () => {
    const text = encodeURIComponent(`Check out this post: ${post.title}`);
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
    );
  };

  // Share on LinkedIn
  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);
    const summary = encodeURIComponent(post.description.substring(0, 100));
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank",
    );
  };

  // Copy link to clipboard
  const copyLinkToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      toast.success("Link copied to clipboard!");

      // Reset success message after 2 seconds
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy link");
    }
  };

  if (loading) {
    return (
      <div className="post-details-page">
        <Navbar />
        <main className="post-details-main">
          <div className="loading-spinner">Loading post...</div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="post-details-page">
        <Navbar />
        <main className="post-details-main">
          <div className="error-message">Post not found</div>
        </main>
      </div>
    );
  }

  const readTime = calculateReadTime(post.description);
  const postDate =
    post.date ||
    new Date(post.createdAt || Date.now())
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .split("/")
      .join("/");

  return (
    <div className="post-details-page">
      <Navbar />

      <main className="post-details-main">
        <button className="back-btn" onClick={handleBack}>
          <FaArrowLeft /> Back to Feed
        </button>

        <article className="full-post">
          <header className="post-header">
            <div className="post-category">Journal</div>

            <h1 className="post-full-title">{post.title}</h1>

            <div className="post-author-meta">
              <div className="author-info">
                <div className="author-avatar">
                  {post.author ? post.author[0].toUpperCase() : "A"}
                </div>

                <div>
                  <span className="author-name">
                    {post.author || "Anonymous"}
                  </span>

                  <div className="post-date-row">
                    <span>
                      <FaCalendarAlt /> {postDate}
                    </span>

                    <span className="dot">•</span>

                    <span>
                      <FaClock /> {readTime} min read
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {post.image && (
            <div className="post-featured-image">
              <img src={post.image} alt={post.title} />
            </div>
          )}

          <div className="post-body">
            <p>{post.description}</p>
          </div>

          <footer className="post-footer">
            <div className="post-share">
              <span>Share this story:</span>

              <div className="share-buttons">
                <button
                  className="share-btn twitter-btn"
                  onClick={shareOnTwitter}
                  title="Share on Twitter"
                >
                  Twitter
                </button>
                <button
                  className="share-btn linkedin-btn"
                  onClick={shareOnLinkedIn}
                  title="Share on LinkedIn"
                >
                  LinkedIn
                </button>
                <button
                  className={`share-btn link-btn ${copySuccess ? "copied" : ""}`}
                  onClick={copyLinkToClipboard}
                  title="Copy link to clipboard"
                >
                  {copySuccess ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </div>
          </footer>
        </article>
      </main>
    </div>
  );
};

export default PostDetails;