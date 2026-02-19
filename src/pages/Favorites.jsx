import { FaRegStar } from "react-icons/fa";
import { MdDeleteSweep, MdOpenInNew } from "react-icons/md";
import Navbar from "../components/Navbar";
import "./Favorites.css";

const Favorites = () => {
  return (
    <div className="favorites-page-container">
      <Navbar />
      <main className="favorites-main">
        <div className="favorites-hero">
          <div className="hero-shape"></div>
          <div className="hero-content">
            <h1>your reading list</h1>
            <p>Enjoy the collection of stories you've curated.</p>
          </div>
        </div>
        <div className="favorites-content">
          <div className="favorites-header">
            <h2>
              curated Collection
              <span className="count-badge">3</span>
            </h2>

            <button className="clar-all-btn">
              <MdDeleteSweep size={20} /> Clear List
            </button>
          </div>

            {/*  */}
          <div className="fav-empty-state">
             <div className="empty-icon-wrapper">
              < FaRegStar className="empty-icon"/>
             </div>
             <h3>Your list is empty</h3>
             <p>Discover interesting posts and save them to read later </p>
             <button className="browse-btn">
              Explore Stories
             </button>
          </div>

        {/*  */}
          <div className="favorites-grid">
            <div className="fav-card">
              <div className="fav-card-image">
                <img
                  src="https://www.google.com/imgres?q=images&imgurl=https%3A%2F%2Fwww.bigfootdigital.co.uk%2Fwp-content%2Fuploads%2F2020%2F07%2Fimage-optimisation-scaled.jpg&imgrefurl=https%3A%2F%2Fwww.bigfootdigital.co.uk%2Fhow-to-optimise-images&docid=dTbNgrJF6xXg5M&tbnid=s_UYcOUl07ucGM&vet=12ahUKEwiF1sLU4-SSAxX42jgGHSefBXAQM3oECBkQAA..i&w=2560&h=1707&hcb=2&ved=2ahUKEwiF1sLU4-SSAxX42jgGHSefBXAQM3oECBkQAA"
                  alt="Post"
                />
                <div className="fav-card-overlay">
                  <button className="read-btn">
                    <MdOpenInNew /> Read Article
                  </button>
                </div>
              </div>

              <div className="fav-card-body">
                <div className="fav-meta">
                  <span className="fav-author">Author Name</span>
                  <span className="fav-date">Recent</span>
                </div>

                <h3 className="fav-title">Sample Post Title</h3>

                <p className="fav-excerpt">
                  this is a sample description of the post used only favorites
                </p>

                <button className="remove-fav-btn">Remove

                </button>
              </div>
            </div>
              </div>
            </div>
      </main>
    </div>
  );
};

export default Favorites;