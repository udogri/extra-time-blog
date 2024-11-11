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
import ScrollToTop from './ScrollToTop'; // Import ScrollToTop component

export default function Navigation() {
  const [active, setActive] = useState('home');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeCategory, setActiveCategory] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const dropdownRef = useRef(null);

  // Check authentication on component mount
  useEffect(() => {
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

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Toggle active section and category for highlighting
  const handleClick = (section, category = '') => {
    setActive(section);
    if (category) setActiveCategory(category);
    setMenuOpen(false);
  };

  // Handle dropdown menu visibility
  const handleMouseEnter = () => {
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setDropdownOpen(false);
  };

  // Toggle the hamburger menu visibility
  const toggleMenu = () => {
    setMenuOpen((prevState) => !prevState);
  };

  // Handle logout
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
    if (isAuthenticated) {
      handleLogout();
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Paths where Navigation and Footer shouldn't be rendered
  const noNavPaths = ['/login', '/logout'];

  return (
    <div>
      <ScrollToTop /> {/* Add ScrollToTop component here */}

      {!noNavPaths.includes(location.pathname) && (
        <div className='nav'>
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
              <Link to="/" onClick={() => handleClick('home')} className={active === 'home' ? 'active' : ''}>
                Home
              </Link>
            </li>
            <li className="nav-item dropdown" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
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

      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/Business" element={<Business />} />
        <Route path="/Sports" element={<Sports />} />
        <Route path="/Politics" element={<Politics />} />
        <Route path="/AddArticle" element={<AddArticle isAuthenticated={isAuthenticated} />} />
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/post/:category/:id" element={<PostDetail handleAuthClick={handleAuthClick} isAuthenticated={isAuthenticated} />} />
        <Route path="/categories/:category/:id" element={<CategoriesDetails isAuthenticated={isAuthenticated}/>} />
        <Route path="AboutUs" element={<AboutUs />} />
        <Route path="/newsletter" element={<Home />} />
        <Route path="/login" element={<LoginSignup setAuthenticated={setIsAuthenticated} />} />
        <Route path="/post/:category/:id/edit" element={<Form isAuthenticated={isAuthenticated} />} />
      </Routes>

      {!noNavPaths.includes(location.pathname) && <Footer />}
    </div>
  );
}
