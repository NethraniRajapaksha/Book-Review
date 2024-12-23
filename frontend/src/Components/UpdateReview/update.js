import React from 'react';
import '../Review/review.css';

function UpdateReviewForm({ modalData, handleInputChange, saveChanges, closeModal, handleStarClick }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Review</h2>
        <label>
          Book Title:
          <input
            type="text"
            name="BookTitle"
            value={modalData.BookTitle}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Author:
          <input
            type="text"
            name="Author"
            value={modalData.Author}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Rating:
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= modalData.Rating ? 'filled' : ''}`}
                onClick={() => handleStarClick(star)} // Handle star click to set rating
              >
                ★
              </span>
            ))}
          </div>
        </label>
        <label>
          Review Text:
          <textarea
            name="ReviewText"
            value={modalData.ReviewText}
            onChange={handleInputChange}
          />
        </label>
        <button onClick={saveChanges}>Save</button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
}

export default UpdateReviewForm;
