# BookMark Web Application (MERN)

SetUp Instructions

```bash
cd BACKEND
```
```bash
npm install
```
```bash
npm start
```

```bash
cd frontend
```
```bash
npm install
```
```bash
npm start
```

## Features Implemented

### 1. **Display List of All Book Reviews**
The application displays a list of all book reviews fetched from the backend. Each review includes the book title, author, rating, review text, and the date the review was submitted.

### 2. **Create Form for Adding New Review**
A form is provided to add new reviews. The form includes fields for:
- Book Title
- Author
- Rating (1 to 5 stars)
- Review Text  
Once the form is submitted, the new review is added to the list and saved in the backend.

### 3. **Enable Editing Existing Review**
Users can edit existing reviews. Clicking the "Edit" button next to a review opens a modal with the review's details, allowing the user to modify the review and save the changes. This updates the review both in the UI and in the backend.

### 4. **Provide Delete Functionality**
Each review has a "Delete" button that allows users to remove a review from the list. When clicked, the review is deleted from the UI and the backend.

### 5. **Average Rating Calculation**
The application calculates the average rating for each book based on the ratings of all reviews. The average rating is displayed alongside each review.

### 6. **Filter by Rating**
Users can filter the reviews by rating. The filter allows users to view reviews that match a specific rating (e.g., 1 star, 2 stars, etc.).

### 7. **Sort by Date**
Reviews can be sorted by date. Users can choose to display reviews in either ascending (oldest first) or descending (newest first) order.




