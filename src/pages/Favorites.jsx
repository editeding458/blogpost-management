import { useEffect, useState } from "react";
import { FaRegStar } from "react-icons/fa";
import { MdDeleteSweep, MdOpenInNew } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import "./Favorites.css";

const Favorites = () => {
  const [posts, setPosts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/posts");
      const data = await response.json();
      if (Array.isArray(data)) {
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = (postId) => {
    const currentFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const newFavorites = currentFavorites.filter(id => id !== postId);

    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setFavorites(newFavorites);
    toast.info("Removed from collection");
  };

  const clearAllFavorites = () => {
    if (window.confirm("Clear all your saved posts?")) {
      localStorage.setItem('favorites', '[]');
      setFavorites([]);
      toast.info("Collection cleared");
    }
  };

  const handleReadArticle = (post) => {
    navigate(`/post/${post.id}`);
  };

  const handleExploreStories = () => {
    navigate('/dashboard');
  };

  const favoritePosts = posts.filter(post => favorites.includes(post.id));

  return (
    <div className="favorites-page-container">
      <Navbar />

      <main className="favorites-main">
        <div className="favorites-hero">
          <div className="hero-shape"></div>
          <div className="hero-content">
            <h1>Your Reading List</h1>
            <p>Enjoy the collection of stories you've curated.</p>
          </div>
        </div>

        <div className="favorites-content">
          <div className="favorites-header">
            <h2>
              Curated Collection
              <span className="count-badge">{favoritePosts.length}</span>
            </h2>

            {favoritePosts.length > 0 && (
              <button className="clear-all-btn" onClick={clearAllFavorites}>
                <MdDeleteSweep size={20} /> Clear List
              </button>
            )}
          </div>

          {loading ? (
            <div className="loading-spinner">Loading your favorites...</div>
          ) : favoritePosts.length === 0 ? (
            <div className="fav-empty-state">
              <div className="empty-icon-wrapper">
                <FaRegStar className="empty-icon" />
              </div>
              <h3>Your list is empty</h3>
              <p>Discover interesting posts and save them to read later</p>
              <button className="browse-btn" onClick={handleExploreStories}>
                Explore Stories
              </button>
            </div>
          ) : (
            <div className="favorites-grid">
              {favoritePosts.map((post) => (
                <div className="fav-card" key={post.id}>
                  <div className="fav-card-image">
                    <img 
                      src={post.image || 'https://via.placeholder.com/300x200'} 
                      alt={post.title} 
                    />
                    <div className="fav-card-overlay">
                      <button 
                        className="read-btn"
                        onClick={() => handleReadArticle(post)}
                      >
                        <MdOpenInNew /> Read Article
                      </button>
                    </div>
                  </div>

                  <div className="fav-card-body">
                    <div className="fav-meta">
                      <span className="fav-author">
                        By {post.author || "Anonymous"}
                      </span>
                      <span className="fav-date">
                        {post.date || 
                          new Date(post.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="fav-title">{post.title}</h3>
                    <p className="fav-excerpt">{post.description}</p>
                    
                    <button 
                      className="remove-fav-btn"
                      onClick={() => removeFavorite(post.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Favorites;