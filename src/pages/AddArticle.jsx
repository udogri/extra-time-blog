import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig.js'; 
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './AddArticle.css';

const AddArticle = () => {
  const [currentArticle, setCurrentArticle] = useState({
    title: '',
    author: '',
    date: '',
    image: '',
    content: '',
    category: 'latestnews',
  });
  const [notification, setNotification] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const storage = getStorage();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        navigate('/login', { state: { from: '/AddArticle' } });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentArticle((prevArticle) => ({
      ...prevArticle,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setCurrentArticle((prevArticle) => ({
      ...prevArticle,
      image: e.target.files[0],
    }));
  };

  // Helper function to check for long words without spaces
  const hasLongWordWithoutSpaces = (text, maxLength = 12) => {
    return text.split(' ').some(word => word.length > maxLength);
  };

  // Handle form submission to send the article to Firebase Firestore and Storage
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, content } = currentArticle;

    // Validate title and content lengths
    if (title.length > 50) {
      setNotification('Title is too long (maximum 50 characters)');
      return;
    }
    if (content.length > 500) {
      setNotification('Content is too long (maximum 500 characters)');
      return;
    }

    // Check for long words without spaces in title and content
    if (hasLongWordWithoutSpaces(title) || hasLongWordWithoutSpaces(content)) {
      setNotification('Title or content contains a long word without spaces. Please add spaces.');
      return;
    }

    const currentDate = new Date().toISOString();
    const articleWithDate = {
      ...currentArticle,
      date: currentDate,
      timestamp: Date.now(), // Add timestamp for sorting
    };

    try {
      // Upload image to Firebase Storage
      let imageUrl = '';
      if (articleWithDate.image) {
        const imageRef = ref(storage, `images/${articleWithDate.image.name}`);
        const snapshot = await uploadBytes(imageRef, articleWithDate.image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      // Use addDoc to add a new article to the Firestore collection
      const articlesCollection = collection(db, 'articles');
      await addDoc(articlesCollection, {
        ...articleWithDate,
        image: imageUrl,
      });

      setNotification('Article submitted successfully!');
      setCurrentArticle({
        title: '',
        author: '',
        date: '',
        image: '',
        content: '',
        category: 'latestnews',
      });
    } catch (error) {
      console.error('Error submitting article:', error.message);
      setNotification(`Error: ${error.message}`);
    }

    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className='addArticle'>
      {notification && <p className="notification">{notification}</p>}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={currentArticle.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="author">Author:</label>
            <input
              type="text"
              id="author"
              name="author"
              value={currentArticle.author}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="image">Image:</label>
            <input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} required />
          </div>
          <div>
            <label htmlFor="content">Content:</label>
            <textarea
              id="content"
              name="content"
              value={currentArticle.content}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              name="category"
              value={currentArticle.category}
              onChange={handleChange}
              required
            >
              <option value="topStory">Top Story</option>
              <option value="latestNews">Latest News</option>
              <option value="trending">Trending</option>
              <option value="local">Local</option>
              <option value="world">World</option>
              <option value="entertainment">Entertainment</option>
              <option value="business">Business</option>
              <option value="sports">Sports</option>
              <option value="politics">Politics</option>
            </select>
          </div>
          <button type="submit">Submit Article</button>
        </form>
      ) : (
        <p>Redirecting to login...</p>
      )}
    </div>
  );
};

export default AddArticle;
