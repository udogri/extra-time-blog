import './Form.css';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns'; // Import from date-fns
import { db } from '../firebaseConfig'; // Ensure this path is correct
import { doc, updateDoc } from 'firebase/firestore';


export default function Form({ post, onSubmit, onCancel, isAuthenticated }) {
    const [updatedPost, setUpdatedPost] = useState(post); // Initialize with post data

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedPost((prevPost) => ({
            ...prevPost,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setUpdatedPost((prevPost) => ({
                    ...prevPost,
                    image: reader.result, // Set the image as the base64 string for preview
                }));
            };
            reader.readAsDataURL(file); // Convert image file to base64 string for preview
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        // Automatically assign the current date at submission time
        const currentDate = new Date().toISOString(); // Get the full ISO date

        const completeUpdatedPost = {
            ...updatedPost,
            category: post.category,
            id: post.id,
            date: currentDate, // Set the date here
        };

        // Ensure category and id exist before submitting
        if (!completeUpdatedPost.category || !completeUpdatedPost.id) {
            console.error('Missing category or id');
            return;
        }

        try {
            if (isAuthenticated) {
                // Reference to the document to update
                const postRef = doc(db, 'articles', completeUpdatedPost.id); // Assuming articles are stored in a collection called 'articles'
                
                // Update the document in Firestore
                await updateDoc(postRef, {
                    title: completeUpdatedPost.title,
                    author: completeUpdatedPost.author,
                    content: completeUpdatedPost.content,
                    image: completeUpdatedPost.image,
                    date: completeUpdatedPost.date,
                    category: completeUpdatedPost.category,
                });
            
                onSubmit(completeUpdatedPost); // Pass the updated data back to the parent
                console.log('Is user authenticated?', isAuthenticated);
            } else {
                throw new Error('User is not authenticated. Please log in.');
            }
        } catch (error) {
            console.error('Error updating post:', error.message); // Log the error message
        }
    };

    // Display the "time ago" format for the post date if it exists
    const timeAgo = updatedPost.date ? formatDistanceToNow(new Date(updatedPost.date), { addSuffix: true }) : 'Unknown time';

    return (
        <div className="modal">
            <form onSubmit={handleUpdateSubmit} className="edit-post-form">
                <h2>Edit Post</h2>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={updatedPost.title || ''}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="author">Author:</label>
                    <input
                        type="text"
                        id="author"
                        name="author"
                        value={updatedPost.author || ''}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    {/* Display the "time ago" format for the date */}
                    <label htmlFor="date">Date:</label>
                    <p>{timeAgo}</p> {/* Display the relative date here */}
                </div>
                <div>
                    <label htmlFor="image">Image:</label>
                    <input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} />
                </div>
                <div>
                    <label htmlFor="content">Content:</label>
                    <textarea
                        id="content"
                        name="content"
                        value={updatedPost.content || ''}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit">Save Changes</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </form>
        </div>
    );
}


