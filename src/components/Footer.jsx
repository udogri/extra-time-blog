import { Link, useNavigate } from 'react-router-dom';
import './Footer.css'; // Assuming you have a CSS file for the footer styles
import NewsLetter from './NewsLetter';

export default function Footer() {
  const navigate = useNavigate();

  const scrollToTop = (path) => {
    navigate(path);
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-links">
          <h2>Extra Time Blog</h2>
          <ul>
            <li>
              <Link to="/" onClick={() => scrollToTop('/')}>Home</Link>
            </li>
            <li>
              <Link to="/AddArticle" onClick={() => scrollToTop('/AddArticle')}>Add Article</Link>
            </li>
            <li>
              <Link to="/ContactUs" onClick={() => scrollToTop('/ContactUs')}>Contact Us</Link>
            </li>
            <li>
              <Link to="/AboutUs" onClick={() => scrollToTop('/AboutUs')}>About Us</Link>
            </li>
          </ul>
        </div>

        <div className="footer-social-media">
          <h3>Follow Us</h3>
          <div className='icons'>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-facebook-f"></i>
  </a>
  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-twitter"></i>
  </a>
  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-instagram"></i>
  </a>
  </div>
        </div>
      
        <NewsLetter />

      </div>
      
      <div className="footer-copyright">
        <p>&copy; {new Date().getFullYear()} Extra Time Blog. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
