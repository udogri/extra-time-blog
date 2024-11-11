import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import NoNewsAvailable from '../components/NoNewsAvailable';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';

function HomePage() {
  const [topStory, setTopStory] = useState(null);
  const [latestNews, setLatestNews] = useState([]);
  const [trendingNews, setTrendingNews] = useState([]);
  const [localNews, setLocalNews] = useState([]);
  const [worldNews, setWorldNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastDocs, setLastDocs] = useState({});
  const [hasMore, setHasMore] = useState({ latestNews: true, trending: true, local: true, world: true });
  const [noMoreNewsMessage, setNoMoreNewsMessage] = useState(false);

  const navigate = useNavigate();

  const fetchArticles = async (category, limitCount, lastDoc) => {
    try {
      const articlesRef = collection(db, 'articles');
      let q = query(
        articlesRef,
        where('category', '==', category),
        orderBy('date', 'desc'),
        limit(limitCount)
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      const articles = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      return { articles, newLastDoc };
    } catch (error) {
      console.error(`Error fetching articles for ${category}:`, error);
      throw error;
    }
  };

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
    const fetchAllArticles = async () => {
      setLoading(true);
      try {
        const { articles: latestArticles, newLastDoc: latestLastDoc } = await fetchArticles('latestNews', 4);
        const { articles: trendingArticles, newLastDoc: trendingLastDoc } = await fetchArticles('trending', 3);
        const { articles: localArticles, newLastDoc: localLastDoc } = await fetchArticles('local', 3);
        const { articles: worldArticles, newLastDoc: worldLastDoc } = await fetchArticles('world', 3);

        if (latestArticles.length > 0) {
          const randomIndex = Math.floor(Math.random() * latestArticles.length);
          const randomTopStory = latestArticles[randomIndex];
          setTopStory(randomTopStory);
          setLatestNews(latestArticles.filter((_, index) => index !== randomIndex));
        } else {
          setTopStory(null);
        }
  
        setTrendingNews(trendingArticles);
        setLocalNews(localArticles);
        setWorldNews(worldArticles);
  
        setLastDocs({ latestNews: latestLastDoc, trending: trendingLastDoc, local: localLastDoc, world: worldLastDoc });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching all articles:', error);
      } finally {
        console.error('Error fetching all articles:', error);
        setLoading(false);
      }
    };
  

    fetchAllArticles();
  }, []);

  const loadMore = async (category) => {
    if (!hasMore[category]) return;

    const { articles, newLastDoc } = await fetchArticles(category, 3, lastDocs[category]);

    if (articles.length === 0) {
      setHasMore(prev => ({ ...prev, [category]: false }));
      setNoMoreNewsMessage(true);
      setTimeout(() => {
        setNoMoreNewsMessage(false);
      }, 3000); // Display message for 3 seconds
    } else {
      switch (category) {
        case 'latestNews':
          setLatestNews(prevArticles => [...prevArticles, ...articles]);
          break;
        case 'trending':
          setTrendingNews(prevArticles => [...prevArticles, ...articles]);
          break;
        case 'local':
          setLocalNews(prevArticles => [...prevArticles, ...articles]);
          break;
        case 'world':
          setWorldNews(prevArticles => [...prevArticles, ...articles]);
          break;
        default:
          break;
      }
      setLastDocs(prevLastDocs => ({ ...prevLastDocs, [category]: newLastDoc }));
    }
  };

  const categories = [
    { name: 'Latest News', articles: latestNews, loadMoreHandler: () => loadMore('latestNews'), hasMore: hasMore.latestNews },
    { name: 'Trending', articles: trendingNews, loadMoreHandler: () => loadMore('trending'), hasMore: hasMore.trending },
    { name: 'Local News', articles: localNews, loadMoreHandler: () => loadMore('local'), hasMore: hasMore.local },
    { name: 'World News', articles: worldNews, loadMoreHandler: () => loadMore('world'), hasMore: hasMore.world },
  ];

  if (loading) return (
    <div className="blog-page loading">
      <LoadingSpinner />
    </div>
  );

  return (
    <>
      <div className="home-page">
        <h2>Top Story</h2>
        <div className="top-story">
          {topStory ? (
            <div key={topStory.id} className="top-article">
              <h2>{topStory.title}</h2>
              <p>
                <em>by {topStory.author} {topStory.date && formatArticleDate(topStory.date)}</em>
              </p>
              <img src={topStory.image} alt={topStory.title} />
              <p>{topStory.summary}</p>
              <button onClick={() => navigate(`/post/latestnews/${topStory.id}`)}>Read More</button>
            </div>
          ) : (
            <NoNewsAvailable message="No Top Story Available" />
          )}
        </div>

        {categories.map(({ name, articles, loadMoreHandler, hasMore }, index) => (
          <div key={index} className="categories">
            <h2>{name}</h2>
            <div className={`news-section ${articles.length > 3 ? 'more-than-3' : ''}`}>
              {articles.length > 0 ? (
                <>
                  {articles.map((article, index) => (
                    <div key={`${name}-${article.id}-${index}`} className="news-article">
                      <h3>{article.title}</h3>
                      <div>
                        <p>by {article.author}</p>
                        <p>{article.date && formatArticleDate(article.date)}</p>
                      </div>
                      <img src={article.image} alt={article.title} />
                      <p>{article.content}</p>
                      <button onClick={() => navigate(`/post/${name.toLowerCase()}/${article.id}`)}>Read More</button>
                    </div>
                  ))}
                  {hasMore ? (
                    <button className="load-more-btn" onClick={loadMoreHandler}>Load More</button>
                  ) : (
                    noMoreNewsMessage && <p className="no-more-news-message">No more news available</p>
                  )}
                </>
              ) : (
                <div className="not-available">
                  <NoNewsAvailable message={`No ${name} available`} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
}

export default HomePage;
