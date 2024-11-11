import './Navigation.css';
import { Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Home from '../pages/Home';
import AddArticle from '../pages/AddArticle';
import PostDetail from './PostDetail';
import CategoriesDetails from './CategoriesDetails';
import AboutUs from '../pages/AboutUs';
import Business from '../pages/Business';
import Sports from '../pages/Sports';
import Politics from '../pages/Politics';
import ContactUs from '../pages/ContactUs';
import LoginSignup from '../pages/LoginSignup';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import Form from './Form';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import LoadingSpinner from './LoadingSpinner';

export default function Navigation() {
  const [active, setActive] = useState('home');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  const noFooterPaths = ['/', '/Sports', '/Business', '/Politics'];
  const noNavPaths = ['/login', '/logout'];

  useEffect(() => {
    const loadContent = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(true);
      } catch (error) {
        console.error("Error loading content:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();

    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }

    const handleResize = () => {
      if (window.innerWidth > 720) {
        setDropdownOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);

    // Add event listener to close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      clearTimeout(loadContent);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside); // Clean up listener
    };
  }, []);

  // Update active link based on current path
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setActive('home');
    } else if (path === '/Business') {
      setActive('Categories');
      setActiveCategory('Business');
    } else if (path === '/Sports') {
      setActive('Categories');
      setActiveCategory('Sports');
    } else if (path === '/Politics') {
      setActive('Categories');
      setActiveCategory('Politics');
    } else if (path === '/AddArticle') {
      setActive('AddArticle');
    } else if (path === '/ContactUs') {
      setActive('ContactUs');
    } else if (path === '/AboutUs') {
      setActive('AboutUs');
    } else {
      setActive('');
      setActiveCategory('');
    }
  }, [location.pathname]);

  const handleClick = (section, category = '') => {
    setActive(section);
    if (category) setActiveCategory(category);
    setMenuOpen(false);
  };

  const handleMouseEnter = () => setDropdownOpen(true);
  const toggleMenu = () => setMenuOpen((prevState) => !prevState);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  const handleAuthClick = () => {
    isAuthenticated ? handleLogout() : navigate('/login');
  };

  return (
    <div>
      {!noNavPaths.includes(location.pathname) && (
        <div className='nav' ref={menuRef}>
          <h3>Extra Time Blog</h3>
          <div className='hamburger div'>
            <div className={`fas fa-bars ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>

          <ul className={`nav-list ${menuOpen ? 'active' : ''}`}>
            <li>
              <Link to="*" onClick={() => handleClick('home')} className={active === 'home' ? 'active' : ''}>
                Home
              </Link>
            </li>
            <li 
              className="nav-item dropdown" 
              onMouseEnter={handleMouseEnter} 
              ref={dropdownRef}
            >
              <Link onClick={() => handleClick('Categories')} className={active === 'Categories' ? 'active' : ''}>
                Categories
                <span className={`dropdown-icon ${dropdownOpen ? 'open' : ''}`}></span>
              </Link>
              {dropdownOpen && (
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/Business" onClick={() => handleClick('Categories', 'Business')} className={activeCategory === 'Business' ? 'active-category' : ''}>
                      Business
                    </Link>
                  </li>
                  <li>
                    <Link to="/Sports" onClick={() => handleClick('Categories', 'Sports')} className={activeCategory === 'Sports' ? 'active-category' : ''}>
                      Sports
                    </Link>
                  </li>
                  <li>
                    <Link to="/Politics" onClick={() => handleClick('Categories', 'Politics')} className={activeCategory === 'Politics' ? 'active-category' : ''}>
                      Politics
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link to="/AddArticle" onClick={() => handleClick('AddArticle')} className={active === 'AddArticle' ? 'active' : ''}>
                Add Article
              </Link>
            </li>
            <li>
              <Link to="/ContactUs" onClick={() => handleClick('ContactUs')} className={active === 'ContactUs' ? 'active' : ''}>
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/AboutUs" onClick={() => handleClick('AboutUs')} className={active === 'AboutUs' ? 'active' : ''}>
                About Us
              </Link>
            </li>
            <li onClick={handleAuthClick} style={{ cursor: 'pointer' }}>
              {isAuthenticated ? <button>Logout</button> : <button>Login</button>}
            </li>
          </ul>
        </div>
      )}

      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Business" element={<Business />} />
        <Route path="/Sports" element={<Sports />} />
        <Route path="/Politics" element={<Politics />} />
        <Route path="/AddArticle" element={<AddArticle isAuthenticated={isAuthenticated} />} />
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/post/:category/:id" element={<PostDetail isAuthenticated={isAuthenticated} />} />
        <Route path="/categories/:category/:id" element={<CategoriesDetails isAuthenticated={isAuthenticated} />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/login" element={<LoginSignup setAuthenticated={setIsAuthenticated} />} />
      </Routes>

      {!noNavPaths.includes(location.pathname) && !noFooterPaths.includes(location.pathname) && !loading && <Footer />}
    </div>
  );
}
