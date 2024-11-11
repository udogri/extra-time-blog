import { useState } from 'react'; 
import { auth } from '../firebaseConfig'; // Adjust the path as necessary
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './LoginSignup.css';

const LoginSignup = ({ setAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
    const [isSignup, setIsSignup] = useState(false);
    const [message, setMessage] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Check if passwords match for signup
        if (isSignup && password !== confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        try {
            let userCredential;
            if (isSignup) {
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
                setMessage('Successfully signed up!');
            } else {
                userCredential = await signInWithEmailAndPassword(auth, email, password);
                setMessage('Successfully logged in!');
            }

            const user = userCredential.user;

            // Get the Firebase token
            const token = await user.getIdToken();
            
            // Store the token in localStorage
            localStorage.setItem('token', token);
            
            // Set the authenticated state to true
            setAuthenticated(true);

            // Navigate to the redirected path or homepage
            const redirectPath = location.state?.from || '/'; 
            navigate(redirectPath);
        } catch (error) {
            setMessage('Error: ' + error.message);
        }
    };

    return (
        <>
        <h2 className='header-text'>Extra Time Blog</h2>
        <div className='login-signup-container'>
            <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
            <form className='form' onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                
                {/* Show confirm password field only if the user is signing up */}
                {isSignup && (
                    <div>
                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                )}

                <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
            </form>
            <p>{message}</p>
            <div className='switch-mode' onClick={() => setIsSignup(!isSignup)}>
                {isSignup ? 'Already have an account? Login' : "Don't have an account? Signup"}
            </div>
        </div>
        </>
    );
};

LoginSignup.propTypes = {
    setAuthenticated: PropTypes.func.isRequired,
};

export default LoginSignup;
