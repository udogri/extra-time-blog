import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import LoadingSpinner from './LoadingSpinner';
import Form from './Form';
import ConfirmationModal from './ConfirmationModal';
import { db } from '../firebaseConfig'; // Import your firebase configuration
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import PropTypes from 'prop-types'; // Import PropTypes
import './PostDetail'

export default function CategoriesDetails({ isAuthenticated }) {
  const { category, id } = useParams(); // Get the category and post ID from the URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Toggle edit modal
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false); // Toggle delete confirmation modal
  const navigate = useNavigate();

  const formatArticleDate = (date) => {
    const now = new Date();
    const diffInWeeks = Math.floor((now - new Date(date)) / (1000 * 60 * 60 * 24 * 7)); // Calculate difference in weeks

    if (diffInWeeks >= 4) {
      return formatDistanceToNow(new Date(date), { addSuffix: true, unit: 'month' }); // Show in months
    } else if (diffInWeeks > 0) {
      return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`; // Show in weeks
    } else {
      return formatDistanceToNow(new Date(date), { addSuffix: true }); // Default fallback
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Reference to the document based on the category and post ID
        const postRef = doc(db, 'articles', id); // Assuming your articles collection is called 'articles'
        
        // Fetching the document
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
          setPost({ id: postSnap.id, ...postSnap.data() }); // Set the post state
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [category, id]);

  const handleEditClick = () => {
    setIsEditing(true); // Show the modal for editing
  };

  const handleDeleteClick = () => {
    setIsConfirmingDelete(true); // Show the confirmation modal
  };

  const confirmDelete = async () => {
    try {
      // Delete the post from Firestore
      await deleteDoc(doc(db, 'articles', id)); // Adjust according to your structure
      navigate(-1); // Redirect to home after deletion
    } catch (error) {
      console.error('Error deleting post:', error);
    }
    setIsConfirmingDelete(false); // Close the modal after confirmation
  };

  const cancelDelete = () => {
    setIsConfirmingDelete(false); // Close the confirmation modal
  };

  const handleUpdatePost = (completeUpdatedPost) => {
    setPost(completeUpdatedPost); // Update the post state
    setIsEditing(false); // Close the modal
  };

  const handleCancelEdit = () => {
    setIsEditing(false); // Close the modal without saving
  };

  const handleClick = () => {
    navigate(-1); // Go back to the previous page
  };

  if (loading) return (
    <div className="blog-page loading">
      <LoadingSpinner />
    </div>
  );

  if (!post) {
    return <p>Post not found</p>;
  }

  // Format the post's date to "time ago" format using formatDistanceToNow
  const timeAgo = post.date ? formatArticleDate(new Date(post.date), { addSuffix: true }) : 'Unknown time';

  return (
    <div className="post-detail">
      <h1>{post.title}</h1>
      <p><em>by {post.author} | {timeAgo}</em></p> {/* Display "time ago" for the post date */}
      <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
        <img src={post.image} alt={post.title} style={{ width: '100%', height: 'auto' }} />
      </div>
      <p>{post.content}</p>

      {isAuthenticated && (
        <>
          <button onClick={handleEditClick}>Edit</button>
          <button className="delete" onClick={handleDeleteClick}>Delete</button>
        </>
      )}

      {isEditing && (
        <div className="modal">
          <div className="modal-content">
            <Form 
              post={post} 
              onSubmit={handleUpdatePost} 
              onCancel={handleCancelEdit}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </div>
      )}

      {isConfirmingDelete && (
        <ConfirmationModal 
          message="Are you sure you want to delete this post? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}

// Define PropTypes
CategoriesDetails.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired, // Define isAuthenticated as a required boolean prop
};
