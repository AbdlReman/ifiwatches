import { Fragment, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import emailjs from '@emailjs/browser';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EMAILJS_CONFIG } from "../../config/emailjs";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

const Contact = () => {
  let { pathname } = useLocation();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [submitStatus, setSubmitStatus] = useState('');

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // setSubmitStatus('');

    // Check if EmailJS is properly configured
    if (!EMAILJS_CONFIG.SERVICE_ID || !EMAILJS_CONFIG.CONTACT_TEMPLATE_ID || !EMAILJS_CONFIG.PUBLIC_KEY) {
      // setSubmitStatus('error');
      setIsSubmitting(false);
      toast.error('EmailJS is not properly configured. Please check your configuration.');
      return;
    }

    try {
      const result = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.CONTACT_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_name: 'IFIwatches Store'
        }
      );

      if (result.status === 200) {
        // setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        toast.success('Thank you! Your message has been sent successfully.');
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      // setSubmitStatus('error');
      toast.error('Sorry! There was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Fragment>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <SEO titleTemplate="Contact IFIwatches" description="Get in touch with IFIwatches for any questions about our premium quality watches, orders, or customer support. Visit https://www.ifiwatches.pk/" />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "Contact", path: process.env.PUBLIC_URL + pathname },
          ]}
        />
        
        {/* City-wise Contact Representatives Section */}
        <div className="contact-area pt-50 pb-50">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="section-title text-center mb-50">
                  <h2>📞 Contact Our Nearest Representative for Assistance</h2>
                  <p>If you face any problem, please feel free to reach out to the nearest ambassador in your area:</p>
                </div>
              </div>
            </div>
                         <div className="row">
               {/* Karachi - Idrees Khan */}
               <div className="col-lg-4 col-md-6 col-sm-12 mb-30">
                 <div className="contact-info-wrap">
                   <div className="single-contact-info">
                     <div className="contact-icon">
                       <i className="fa fa-map-marker" />
                     </div>
                     <div className="contact-info-dec">
                       <h4>Karachi – Idrees Khan</h4>
                     </div>
                   </div>
                   <div className="single-contact-info">
                     <div className="contact-icon">
                       <i className="fa fa-phone" />
                     </div>
                     <div className="contact-info-dec">
                       <p>0341-0435017</p>
                     </div>
                   </div>
                   <div className="single-contact-info">
                     <div className="contact-icon">
                       <i className="fa fa-home" />
                     </div>
                     <div className="contact-info-dec">
                       <p>Metroville Site, near Bab-e-Khyber Road, Karachi</p>
                     </div>
                   </div>
                 </div>
               </div>
               
               {/* Islamabad - Abdul Hannan */}
               <div className="col-lg-4 col-md-6 col-sm-12 mb-30">
                 <div className="contact-info-wrap">
                   <div className="single-contact-info">
                     <div className="contact-icon">
                       <i className="fa fa-map-marker" />
                     </div>
                     <div className="contact-info-dec">
                       <h4>Islamabad – Abdul Hannan</h4>
                     </div>
                   </div>
                   <div className="single-contact-info">
                     <div className="contact-icon">
                       <i className="fa fa-phone" />
                     </div>
                     <div className="contact-info-dec">
                       <p>0318-0977696</p>
                     </div>
                   </div>
                   <div className="single-contact-info">
                     <div className="contact-icon">
                       <i className="fa fa-home" />
                     </div>
                     <div className="contact-info-dec">
                       <p>G-9/4, Islamabad</p>
                     </div>
                   </div>
                 </div>
               </div>
               
               {/* Karachi - Fahad Hussain */}
               <div className="col-lg-4 col-md-6 col-sm-12 mb-30">
                 <div className="contact-info-wrap">
                   <div className="single-contact-info">
                     <div className="contact-icon">
                       <i className="fa fa-map-marker" />
                     </div>
                     <div className="contact-info-dec">
                       <h4>Karachi – Fahad Hussain</h4>
                     </div>
                   </div>
                   <div className="single-contact-info">
                     <div className="contact-icon">
                       <i className="fa fa-phone" />
                     </div>
                     <div className="contact-info-dec">
                       <p>+92 340-0534185</p>
                     </div>
                   </div>
                   <div className="single-contact-info">
                     <div className="contact-icon">
                       <i className="fa fa-home" />
                     </div>
                     <div className="contact-info-dec">
                       <p>Site Town, Banaras, Main Sarafa Bazar, near Shahi Masjid, Karachi</p>
                     </div>
                   </div>
                 </div>
               </div>
               
               {/* Swat - Ibrar Khan */}
               <div className="col-lg-4 col-md-6 col-sm-12 mb-30">
                 <div className="contact-info-wrap">
                   <div className="single-contact-info">
                     <div className="contact-icon">
                       <i className="fa fa-map-marker" />
                     </div>
                     <div className="contact-info-dec">
                       <h4>Swat – Ibrar Khan</h4>
                     </div>
                   </div>
                   <div className="single-contact-info">
                     <div className="contact-icon">
                       <i className="fa fa-home" />
                     </div>
                     <div className="contact-info-dec">
                       <p>Tehsil Matta, District Swat, Khyber Pakhtunkhwa</p>
                     </div>
                   </div>
                   <div className="single-contact-info">
                     <div className="contact-icon">
                       <i className="fa fa-phone" />
                     </div>
                     <div className="contact-info-dec">
                       <p>03448935702</p>
                     </div>
                   </div>
                 </div>
               </div>
               
               {/* Islamabad - Abdul Moiz Paracha */}
               <div className="col-lg-4 col-md-6 col-sm-12 mb-30">
                 <div className="contact-info-wrap">
                   <div className="single-contact-info">
                     <div className="contact-icon">
                       <i className="fa fa-map-marker" />
                     </div>
                     <div className="contact-info-dec">
                       <h4>Islamabad – A.Moiz Paracha</h4>
                     </div>
                   </div>
                   <div className="single-contact-info">
                     <div className="contact-icon">
                       <i className="fa fa-phone" />
                     </div>
                     <div className="contact-info-dec">
                       <p>+92 328-5315636</p>
                     </div>
                   </div>
                   <div className="single-contact-info">
                     <div className="contact-icon">
                       <i className="fa fa-home" />
                     </div>
                     <div className="contact-info-dec">
                       <p>House 108, Street 85, G-8/1, Islamabad</p>
                     </div>
                   </div>
                 </div>
               </div>
               
               {/* Kohat - Abdul Moiz */}
               <div className="col-lg-4 col-md-6 col-sm-12 mb-30">
                 <div className="contact-info-wrap">
                   <div className="single-contact-info">
                     <div className="contact-icon">
                       <i className="fa fa-map-marker" />
                     </div>
                     <div className="contact-info-dec">
                       <h4>Kohat – Abdul Moiz</h4>
                     </div>
                   </div>
                   <div className="single-contact-info">
                     <div className="contact-icon">
                       <i className="fa fa-phone" />
                     </div>
                     <div className="contact-info-dec">
                       <p>0332-9779996</p>
                     </div>
                   </div>
                   <div className="single-contact-info">
                     <div className="contact-icon">
                       <i className="fa fa-home" />
                     </div>
                     <div className="contact-info-dec">
                       <p>House 122, Street 3, Post Office Street, KDA, Kohat</p>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </div>

        <div className="contact-area pt-100 pb-100">
          <div className="container">
            <div className="custom-row-2">
              <div className="col-12 col-lg-4 col-md-5">
                <div className="contact-info-wrap">
                  <div className="single-contact-info">
                    <div className="contact-icon">
                      <i className="fa fa-phone" />
                    </div>
                    <div className="contact-info-dec">
                      <p>03448935702</p>
                    </div>
                  </div>
                  <div className="single-contact-info">
                    <div className="contact-icon">
                      <i className="fa fa-globe" />
                    </div>
                    <div className="contact-info-dec">
                      <p>
                                                                <a href="mailto:info@ifiwatches.pk">
                          info@ifiwatches.pk
                        </a>
                      </p>
                      <p>
                                                                <a href="mailto:support@ifiwatches.pk">
                          support@ifiwatches.pk
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="single-contact-info">
                    <div className="contact-icon">
                      <i className="fa fa-map-marker" />
                    </div>
                    <div className="contact-info-dec">
                      <p>IFIwatches Store, </p>
                      <p>Islamabad, Pakistan.</p>
                    </div>
                  </div>
                  <div className="contact-social text-center">
                    <h3>Follow IFIwatches</h3>
                    <ul>
                      <li>
                        <a href="//facebook.com">
                          <i className="fa fa-facebook" />
                        </a>
                      </li>
                      <li>
                        <a href="//instagram.com">
                          <i className="fa fa-instagram" />
                        </a>
                      </li>
                      <li>
                        <a href="//twitter.com">
                          <i className="fa fa-twitter" />
                        </a>
                      </li>
                      <li>
                        <a href="//youtube.com">
                          <i className="fa fa-youtube" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-8 col-md-7">
                <div className="contact-form">
                  <div className="contact-title mb-30">
                    <h2>Get In Touch</h2>
                  </div>
                  <form className="contact-form-style" onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-lg-6">
                        <input 
                          name="name" 
                          placeholder="Name*" 
                          type="text" 
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-lg-6">
                        <input 
                          name="email" 
                          placeholder="Email*" 
                          type="email" 
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-lg-12">
                        <input
                          name="subject"
                          placeholder="Subject*"
                          type="text"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-lg-12">
                        <textarea
                          name="message"
                          placeholder="Your Message*"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                        />
                        <button 
                          className="submit" 
                          type="submit"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'SENDING...' : 'SEND'}
                        </button>
                      </div>
                    </div>
                  </form>

                  <p className="form-message" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Contact;

