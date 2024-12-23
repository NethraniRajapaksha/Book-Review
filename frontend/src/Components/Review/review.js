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
        setFilteredReviews(response.data.reviews); //showing all reviews
      } catch (err) {
        setError('Failed to fetch reviews. Please try again later.'); //db connection faill
        console.error('Error fetching reviews:', err);
      }
    };

    fetchReviews();
  }, []);

  // hook fo filter reviews
  useEffect(() => {
    filterReviews();
  }, [searchQuery, filterRating, sortOrder, reviews]);

  // set the updating data to the relevent id

  const openModal = (review) => {
    setEditingReview(review._id);
    setModalData({ ...review });
  };

  // close the model and  reset state
  const closeModal = () => {
    setEditingReview(null);
    setModalData(null);
  };

  // handle the input values with updated data
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

  //delete review
  const deleteReview = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/reviews/${id}`);
      setReviews((prev) => prev.filter((review) => review._id !== id));
    } catch (err) {
      console.error('Error deleting review:', err);
      setError('Failed to delete the review. Please try again.');
    }
  };


// star calculation
  const renderStars = (rating) => {
    const fullStars = '★'.repeat(rating);
    const emptyStars = '☆'.repeat(5 - rating);
    return <span>{fullStars}{emptyStars}</span>; //combine full stars with empty stars
  };

  const calculateAverageRating = (bookTitle) => {
    // Filter reviews for the specific book
    const bookReviews = reviews.filter((review) => review.BookTitle === bookTitle);
  
    // If no reviews found, return 0
    if (bookReviews.length === 0) return 0;
  
    // Ensure Rating is treated as a number
    const totalRating = bookReviews.reduce((acc, review) => acc + Number(review.Rating), 0);
  
    // Calculate and return the average rating
    return totalRating / bookReviews.length;
  };
  
  const filterReviews = () => {
    let filtered = reviews;
  
    if (searchQuery) {
      filtered = filtered.filter((review) =>
        review.BookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.Author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  
    if (filterRating > 0) {
      filtered = filtered.filter((review) => Number(review.Rating) === Number(filterRating));
    }
  
    if (sortOrder === 'asc') {
      filtered = filtered.sort((a, b) => new Date(a.Date) - new Date(b.Date));
    } else {
      filtered = filtered.sort((a, b) => new Date(b.Date) - new Date(a.Date));
    }
  
    setFilteredReviews(filtered);
  };

  const renderDate = (date) => {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return <span>{formattedDate}</span>;
  };

  // Handle star click for rating
  const handleStarClick = (newRating) => {
    setModalData((prev) => ({ ...prev, Rating: newRating }));
  };

  return (
    <div>
      <Nav />
      <div className="review-container">
        <h1>Review Collection</h1>
        {error && <p className="error-message">{error}</p>}

        <div className="review-filters">
          <label>
            Search  <br/>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by book or author"
            />
          </label>
          <label>
            Filter by Rating  <br/>
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
            Sort by Date <br/>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </label>
        </div>

        <ul className="review-list">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <li key={review._id} className="review-item">
                <h3>{review.BookTitle}</h3>
                <p><strong>Author:</strong> {review.Author}</p>
                <p><strong>Rating:</strong> {renderStars(review.Rating)}</p>
                <p><strong>Average Rating:</strong> {calculateAverageRating(review.BookTitle).toFixed(1)} Stars</p>
                <p>{review.ReviewText}</p>
                <p><strong>Reviewed on:</strong> {renderDate(review.Date)}</p>
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

        {editingReview && (
          <UpdateReviewForm
            modalData={modalData}
            handleInputChange={handleInputChange}
            saveChanges={saveChanges}
            closeModal={closeModal}
            handleStarClick={handleStarClick}
          />
        )}
      </div>
    </div>
  );
}

export default Review;
