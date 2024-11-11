import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig'; // Adjust the import based on your Firebase setup
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import '../components/category.css';
import NoNewsAvailable from '../components/NoNewsAvailable';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';

export default function Business() {
  const [sportsData, setSportsData] = useState([]);
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
    const fetchSportsData = async () => {
      try {
        // Reference to the 'articles' collection
        const articlesRef = collection(db, 'articles'); 
        
        // Query to get only the business category
        const sportsQuery = query(articlesRef, where('category', '==', 'sports')); 
        
        // Fetching the documents
        const querySnapshot = await getDocs(sportsQuery);
        
        const articles = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setSportsData(articles);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSportsData();
  }, []);

  if (loading) return (
    <div className="blog-page loading">
      <LoadingSpinner />
    </div>
  );

  if (error) return <p>Error: {error}</p>;

  const handleClick = (id) => {
    navigate(`/categories/sports/${id}`);
  };

  return (
    <>
    <div className="blog-page">
      {sportsData.length > 0 ? (
      sportsData.map((sports) => {
        // Define timeAgo outside the JSX
        const timeAgo = sports.date
          ? formatArticleDate(new Date(sports.date), { addSuffix: true })
          : 'Unknown time';

        return (
          <div key={sports.id} className="article">
            <h2>{sports.title}</h2>
            <p><em>by {sports.author} {timeAgo}</em></p> {/* Display formatted timeAgo */}
            <img src={sports.image} alt={sports.title} className="thumbnail" />
            <p>{sports.content}</p>
            <button onClick={() => handleClick(sports.id)}>Read more</button>
          </div>
        );
      })
    ): (
        <NoNewsAvailable message="No Sports News available" /> // Centralize this when no articles are available
      )}
    </div>
    <Footer />
    </>
  );
}
