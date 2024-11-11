import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import Form from './Form';
import ConfirmationModal from './ConfirmationModal';
import { formatDistanceToNow } from 'date-fns';
import { db } from '../firebaseConfig'; // Ensure this path is correct
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import PropTypes from 'prop-types';
import './PostDetail.css';

export default function PostDetail({ isAuthenticated }) {
  const { category, id } = useParams(); 
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const navigate = useNavigate();

  // Fetch post data from Firestore
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true); // Set loading state to true before fetching
      try {
        const postRef = doc(db, 'articles', id); // Assuming articles are stored in a collection called 'articles'
        const postDoc = await getDoc(postRef);

        if (postDoc.exists()) {
          setPost({ id: postDoc.id, ...postDoc.data() });
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
        window.scrollTo(0, 0); // Scroll to top after loading completes
      }
    };

    fetchPost();
  }, [category, id]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDeleteClick = () => {
    setIsConfirmingDelete(true);
  };

  const confirmDelete = async () => {
    try {
      const postRef = doc(db, 'articles', id); // Reference to the specific post to delete
      await deleteDoc(postRef);
      navigate(`/`); // Navigate back after deletion
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setIsConfirmingDelete(false);
    }
  };

  const cancelDelete = () => {
    setIsConfirmingDelete(false);
  };

  const handleUpdatePost = (updatedPost) => {
    setPost(updatedPost);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // Conditional rendering to hide footer during loading
  if (loading) return (
    <div className="blog-page loading">
      <LoadingSpinner />
    </div>
  );

  if (!post) {
    return <p>Post not found</p>;
  }

  const timeAgo = post.date ? formatDistanceToNow(new Date(post.date), { addSuffix: true }) : 'Unknown time';
  
  return (
    <div className="post-detail">
      <h1>{post.title}</h1>
      <p><em>by {post.author} | {timeAgo}</em></p>
      <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
        <img src={post.image} alt={post.title} style={{ width: '100%', height: 'auto' }} />
      </div>
      <p>{post.content}</p>

      {/* Show edit and delete buttons only if user is authenticated */}
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

PostDetail.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired, // Define isAuthenticated as a required boolean prop
};
