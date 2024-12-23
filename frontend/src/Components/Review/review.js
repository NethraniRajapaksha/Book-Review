// Review.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './review.css';
import Nav from '../Nav/nav';
import UpdateReviewForm from '../UpdateReview/update'; // Import the new form component

function Review() {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [error, setError] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [filterRating, setFilterRating] = useState(0);
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/reviews');
        setReviews(response.data.reviews);
        setFilteredReviews(response.data.reviews); // Initially show all reviews
      } catch (err) {
        setError('Failed to fetch reviews. Please try again later.');
        console.error('Error fetching reviews:', err);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    filterReviews();
  }, [searchQuery, filterRating, sortOrder, reviews]);

  const openModal = (review) => {
    setEditingReview(review._id);
    setModalData({ ...review });
  };

  const closeModal = () => {
    setEditingReview(null);
    setModalData(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModalData((prev) => ({ ...prev, [name]: value }));
  };

  const saveChanges = async () => {
    try {
      await axios.put(`http://localhost:5000/reviews/${editingReview}`, modalData);
      setReviews((prev) =>
        prev.map((review) =>
          review._id === editingReview ? { ...modalData } : review
        )
      );
      closeModal();
    } catch (err) {
      console.error('Error updating review:', err);
      setError('Failed to update the review. Please try again.');
    }
  };

  const deleteReview = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/reviews/${id}`);
      setReviews((prev) => prev.filter((review) => review._id !== id));
    } catch (err) {
      console.error('Error deleting review:', err);
      setError('Failed to delete the review. Please try again.');
    }
  };

  const renderStars = (rating) => {
    const fullStars = '★'.repeat(rating);
    const emptyStars = '☆'.repeat(5 - rating);
    return <span>{fullStars}{emptyStars}</span>;
  };

  // Function to filter reviews based on search, rating, and sorting
  const filterReviews = () => {
    let filtered = reviews;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((review) =>
        review.BookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.Author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by rating
    if (filterRating > 0) {
      filtered = filtered.filter((review) => review.Rating === filterRating);
    }

    // Sort by date
    if (sortOrder === 'asc') {
      filtered = filtered.sort((a, b) => new Date(a.Date) - new Date(b.Date));
    } else {
      filtered = filtered.sort((a, b) => new Date(b.Date) - new Date(a.Date));
    }

    setFilteredReviews(filtered);
  };

  return (

    <div>
       <Nav />
    
    <div className="review-container">
     
      <h1>All Reviews</h1>

      {error && <p className="error-message">{error}</p>}

      {/* Filters */}
      <div className="review-filters">
        <label>
          Search:
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by book title or author"
          />
        </label>
        <label>
          Filter by Rating:
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(String(e.target.value))}
          >
            <option value={0}>All</option>
            <option value={1}>1 Star</option>
            <option value={2}>2 Stars</option>
            <option value={3}>3 Stars</option>
            <option value={4}>4 Stars</option>
            <option value={5}>5 Stars</option>
          </select>
        </label>
        <label>
          Sort by Date:
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </label>
      </div>

      {/* Reviews List */}
      <ul className="review-list">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <li key={review._id} className="review-item">
              <h3>{review.BookTitle}</h3>
              <p><strong>Author:</strong> {review.Author}</p>
              <p><strong>Rating:</strong> {renderStars(review.Rating)}</p>
              <p>{review.ReviewText}</p>
              <div className="review-actions">
                <button onClick={() => openModal(review)}>Update</button>
                <button onClick={() => deleteReview(review._id)}>Delete</button>
              </div>
            </li>
          ))
        ) : (
          <p>No reviews found matching your filters.</p>
        )}
      </ul>

      {/* Modal for editing review */}
      {editingReview && (
        <UpdateReviewForm
          modalData={modalData}
          handleInputChange={handleInputChange}
          saveChanges={saveChanges}
          closeModal={closeModal}
        />
      )}
    </div>
    </div>
  );
}

export default Review;
