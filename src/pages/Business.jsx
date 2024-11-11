import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig'; 
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import '../components/category.css';
import NoNewsAvailable from '../components/NoNewsAvailable'; // Import the NoNewsAvailable component
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';

export default function Business() {
  const [businessData, setBusinessData] = useState([]);
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
    const fetchBusinessData = async () => {
      setLoading(true);
      try {
        const articlesRef = collection(db, 'articles'); 
        const businessQuery = query(articlesRef, where('category', '==', 'business')); 
        const querySnapshot = await getDocs(businessQuery);
        
        const articles = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBusinessData(articles);
       
      } catch (err) {
        setError(err.message);
      } finally {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, []);

  if (loading) return (
    <div className="blog-page loading">
      <LoadingSpinner />
    </div>
  );

  if (error) return <p>Error: {error}</p>;

  const handleClick = (id) => {
    navigate(`/categories/business/${id}`);
  };

  return (
    <>
    <div className="blog-page">
      {businessData.length > 0 ? (
        businessData.map((business) => {
          const timeAgo = business.date
            ? formatArticleDate(new Date(business.date), { addSuffix: true })
            : 'Unknown time';

          return (
            <div key={business.id} className="article">
              <h2>{business.title}</h2>
              <p><em>by {business.author} {timeAgo}</em></p>
              <img src={business.image} alt={business.title} className="thumbnail" />
              <p>{business.content}</p>
              <button onClick={() => handleClick(business.id)}>Read more</button>
            </div>
          );
        })
      ) : (
        <NoNewsAvailable message="No Business News available" /> // Centralize this when no articles are available
      )}
    </div>
      <Footer />
    </>
  );
}
