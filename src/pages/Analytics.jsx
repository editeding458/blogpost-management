import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Navbar from "../components/Navbar";
import "./Analytics.css";

const Analytics = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#FF6B6B",
    "#6B66FF",
  ];

  const handleLogout = () => {
    localStorage.removeItem("loginData");
    navigate("/login");
  };

  const handleEdit = (id) => {
    navigate(`/edit-post/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await fetch(`http://localhost:3000/posts/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setPosts(posts.filter((post) => post.id !== id));
          // Update chart data after deletion
          processChartData(posts.filter((post) => post.id !== id));
          toast.success("Post deleted successfully");
        } else {
          toast.error("Failed to delete post");
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        toast.error("Error deleting post");
      }
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
        processChartData(data);
      } else {
        toast.error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Error loading posts");
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (postsData) => {
    // Calculate author statistics
    const authorStats = postsData.reduce((acc, post) => {
      const author = post.author || "Unknown";
      acc[author] = (acc[author] || 0) + 1;
      return acc;
    }, {});

    // Convert to array format for charts
    const chartDataArray = Object.keys(authorStats).map((author) => ({
      name: author,
      posts: authorStats[author],
    }));

    setChartData(chartDataArray);
  };

  // Pagination calculations
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="analytics-page">
      <Navbar onLogout={handleLogout} />
      <main className="analytics-main">
        <header className="analytics-header">
          <h1>Blog Analytics</h1>
          <p>Insights into your blog's performance and activity.</p>
        </header>

        {loading ? (
          <div className="loading">Loading analytics data...</div>
        ) : (
          <>
            <div className="charts-container">
              <div className="chart-card">
                <h3>Posts per Author</h3>
                <div className="chart-wrapper">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="posts"
                          fill="#8884d8"
                          name="Number of Posts"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="no-data">No data available</p>
                  )}
                </div>
              </div>

              <div className="chart-card">
                <h3>Distribution</h3>
                <div className="chart-wrapper">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="posts"
                          nameKey="name"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {chartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="no-data">No data available</p>
                  )}
                </div>
              </div>
            </div>

            <div className="posts-table-section">
              <h3>All Posts</h3>
              <div className="table-wrapper">
                <table className="analytics-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPosts.length > 0 ? (
                      currentPosts.map((post) => (
                        <tr key={post.id}>
                          <td>{post.id}</td>
                          <td>{post.title}</td>
                          <td>{post.author}</td>
                          <td>
                            {post.date ||
                              new Date(
                                post.createdAt || Date.now(),
                              ).toLocaleDateString("en-GB")}
                          </td>
                          <td className="action-buttons">
                            <button
                              className="edit-btn"
                              onClick={() => handleEdit(post.id)}
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => handleDelete(post.id)}
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="no-data">
                          No posts available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {posts.length > postsPerPage && (
                <div className="pagination">
                  <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="page-btn"
                  >
                    Previous
                  </button>

                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`page-btn ${currentPage === index + 1 ? "active" : ""}`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="page-btn"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Analytics;