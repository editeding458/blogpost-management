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
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const handleLogout = () => {
    localStorage.removeItem("loginData");
    navigate("/login");
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
        
        // Process data for charts
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

  // Process posts data for charts (group by author)
  const processChartData = (postsData) => {
    const authorMap = new Map();
    
    postsData.forEach(post => {
      const author = post.author || "Unknown";
      if (authorMap.has(author)) {
        authorMap.set(author, authorMap.get(author) + 1);
      } else {
        authorMap.set(author, 1);
      }
    });

    const chartDataArray = [];
    authorMap.forEach((posts, name) => {
      chartDataArray.push({ name, posts });
    });

    setChartData(chartDataArray);
  };

  // Get current posts for pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // Handle page change
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
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="posts" fill="#8884d8" name="Number of Posts" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="no-data">No data available</p>
                  )}
                </div>
              </div>

              {/* Pie chart */}
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
                          label
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

            {/* Dynamic table */}
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
                    </tr>
                  </thead>
                  <tbody>
                    {currentPosts.length > 0 ? (
                      currentPosts.map((post) => (
                        <tr key={post.id}>
                          <td>{post.id}</td>
                          <td>{post.title}</td>
                          <td>{post.author}</td>
                          <td>{post.date || new Date(post.createdAt).toLocaleDateString('en-GB')}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="no-data">No posts available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Dynamic pagination */}
              {posts.length > postsPerPage && (
                <div className="pagination">
                  <button 
                    className="page-btn" 
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button 
                    className="page-btn" 
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
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