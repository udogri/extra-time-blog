import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig'; // Adjust the import based on your Firebase setup
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import '../components/category.css';
import NoNewsAvailable from '../components/NoNewsAvailable';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';

export default function Business() {
  const [politicsData, setPoliticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    const fetchPoliticsData = async () => {
      try {
        // Reference to the 'articles' collection
        const articlesRef = collection(db, 'articles'); 
        
        // Query to get only the business category
        const politicsQuery = query(articlesRef, where('category', '==', 'politics')); 
        
        // Fetching the documents
        const querySnapshot = await getDocs(politicsQuery);
        
        const articles = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setPoliticsData(articles);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPoliticsData();
  }, []);

  

  const handleClick = (id) => {
    navigate(`/categories/politics/${id}`);
  };

  return (
    <>
    
    <div className="blog-page">
      {politicsData.length > 0 ? (
      politicsData.map((politics) => {
        // Define timeAgo outside the JSX
        const timeAgo = politics.date
          ? formatArticleDate(new Date(politics.date), { addSuffix: true })
          : 'Unknown time';

        return (
          <div key={politics.id} className="article">
            <h2>{politics.title}</h2>
            <p><em>by {politics.author} {timeAgo}</em></p> {/* Display formatted timeAgo */}
            <img src={politics.image} alt={politics.title} className="thumbnail" />
            <p>{politics.content}</p>
            <button onClick={() => handleClick(politics.id)}>Read more</button>
          </div>
        );
      })
    ): (
      <NoNewsAvailable message="No Politics News available" /> // Centralize this when no articles are available
    )}
    </div>
    <Footer />
    </>
  );
}
