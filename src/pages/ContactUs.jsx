import { useState } from 'react';
import './ContactUs.css';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You would normally handle form submission here, such as sending data to an API
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <p>
        Have questions, comments, or feedback? We&apos;d love to hear from you! Please fill out the form below,
        and our team will get back to you as soon as possible.
      </p>
      {submitted ? (
        <div className="thank-you-message">
          <h2>Thank You!</h2>
          <p>Your message has been received. We&apos;ll get back to you shortly.</p>
        </div>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Send Message</button>
        </form>
      )}
    </div>
  );
}

export default ContactUs;
