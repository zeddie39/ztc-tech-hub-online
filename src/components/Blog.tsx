
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [visiblePosts, setVisiblePosts] = useState(3);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setBlogPosts(data);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };

  const openModal = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPost(null);
  };

  const loadMorePosts = () => {
    setVisiblePosts(prev => prev + 3);
  };

  return (
    <section className="blog" id="blog">
      <div className="container">
        <h2>Tech Insights</h2>
        <p className="section-subtitle">Latest news, tips, and insights from our experts</p>
        
        <div className="blog-grid">
          {blogPosts.slice(0, visiblePosts).map((post) => (
            <div key={post.id} className="blog-card">
              <img src={post.image_url} alt={post.title} />
              <div className="card-content">
                <h3>{post.title}</h3>
                <p className="excerpt">{post.excerpt}</p>
                <div className="blog-meta">
                  <span className="author">By {post.author}</span>
                  <span className="read-time">{post.read_time}</span>
                </div>
                <button 
                  className="btn btn-primary read-more-btn"
                  onClick={() => openModal(post)}
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>

        {visiblePosts < blogPosts.length && (
          <div className="blog-load-more">
            <button className="btn btn-secondary" onClick={loadMorePosts}>
              Load More Articles
            </button>
          </div>
        )}

        {/* Blog Post Modal */}
        {showModal && selectedPost && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModal}>&times;</button>
              <img src={selectedPost.image_url} alt={selectedPost.title} />
              <h2>{selectedPost.title}</h2>
              <div className="blog-meta">
                <span className="author">By {selectedPost.author}</span>
                <span className="read-time">{selectedPost.read_time}</span>
              </div>
              <div className="blog-content">
                {selectedPost.content.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;
