import { useState, useEffect } from "react";
import NavBar from "../components/shared/navbar/NavBar";
import Footer from "../components/shared/Footer";
import { Link, useLocation } from "react-router-dom";
import ContactsImage from "../assets/images/contacts.jpg";
import axios from "axios";

function Contacts() {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const faqItems = [
    {
      question: "What are your business hours?",
      answer:
        "Our offices are open Monday through Friday from 9:00 AM to 9:00 PM, and Saturday from 10:00 AM to 4:00 PM. We are closed on Sundays and major holidays.",
    },
    {
      question: "How can I authenticate my collectible?",
      answer:
        "We offer professional authentication services for all types of collectibles. You can bring your item to our office during business hours or schedule an appointment with one of our experts. We also accept mail-in items with proper insurance and tracking.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "No, we ship to only inside India. Shipping rates vary depending on the destination, package weight, and value of the items. All Shipping orders include tracking and insurance.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We currently accept only upi payments for online orders. For in-person transactions, we accept cash, UPI, and major credit/debit cards. All transactions are secure and encrypted.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for most items. All returns must be in the original condition with all packaging and documentation. Custom orders and certain rare collectibles may have different return policies, which will be clearly stated at the time of purchase.",
    },
  ];

  return (
    <div className="min-h-screen bg-ivory text-gray-800 font-sans">
      {/* Header */}
      <NavBar />
      <main className="pb-16">
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-4">
          <div className="container mx-auto px-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link
                    to={"/"}
                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gold cursor-pointer"
                  >
                    <i className="fas fa-home mr-2"></i>
                    Home
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <i className="fas fa-chevron-right text-gray-400 mx-2 text-xs"></i>
                    <span className="text-sm font-medium text-gold">
                      Contact
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative">
          <div className="h-80 overflow-hidden">
            <img
              src={ContactsImage}
              alt="Contact Us"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-xl">
                  <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                    Get in Touch
                  </h1>
                  <p className="text-lg text-white/90">
                    Have questions about our collectibles or need assistance?
                    Our team of experts is here to help you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Requirements forms */}
        <ContactForm title="Requirements" />

        {/* Sell to us Form */}
        <ContactForm title="Sell to us" />

        {/* Map Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold mb-4">
                Our Location
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Visit our place to explore our exclusive collection of rare and
                valuable collectibles. Our experts are available to assist you
                with any inquiries.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-96 w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d31085.349192187547!2d80.0529398236342!3d13.120165288314919!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sNo.%206A%2C%206th%20street%2C%20Thiruvasagam%20Salai%2C%20Balaji%20nagar%2C%20Pattabiram%2C%20Chennai%20-%20600072%20!5e0!3m2!1sen!2sin!4v1752197453276!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="RareCollectibles Location"
                ></iframe>
              </div>

              <div className="p-6 flex flex-wrap gap-6">
                <div className="flex items-center">
                  <div className="bg-gold/10 rounded-full p-2 mr-3">
                    <i className="fas fa-car text-gold"></i>
                  </div>
                  <span className="text-gray-700">Parking available</span>
                </div>

                <div className="flex items-center">
                  <div className="bg-gold/10 rounded-full p-2 mr-3">
                    <i className="fas fa-subway text-gold"></i>
                  </div>
                  <span className="text-gray-700">Avadi, Chennai</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16" id="faq">
          <div className="container mx-auto px-4" id="shipping">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Find answers to common questions about our services,
                authentication process, shipping, and more. If you can't find
                what you're looking for, please contact us.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <button
                      className="w-full flex items-center justify-between p-5 text-left font-medium cursor-pointer"
                      onClick={() => toggleAccordion(index)}
                    >
                      <span>{item.question}</span>
                      <i
                        className={`fas ${
                          activeAccordion === index
                            ? "fa-chevron-up"
                            : "fa-chevron-down"
                        } text-gold transition-transform`}
                      ></i>
                    </button>

                    <div
                      className={`px-5 pb-5 ${
                        activeAccordion === index ? "block" : "hidden"
                      }`}
                    >
                      <p className="text-gray-600">{item.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}

function ContactForm({ title }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...formErrors };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (formData.phone && !/^\+?[0-9()-\s]+$/.test(formData.phone)) {
      newErrors.phone = "Phone number is invalid";
      isValid = false;
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      axios
        .post(import.meta.env.VITE_URL + "/mail/contacts", {
          ...formData,
          title: title,
        })
        .then((res) => {
          setSubmitSuccess(true);
          setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
          });
          setIsSubmitting(false);
        })
        .catch((error) => {
          console.error("Error sending contact form:", error);
          setSubmitSuccess(false);
          setIsSubmitting(false);
        });
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">{title}</h2>

            {submitSuccess ? (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-6 mb-6">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 rounded-full p-2 mr-3">
                    <i className="fas fa-check text-green-500"></i>
                  </div>
                  <h3 className="font-medium text-lg">
                    Message Sent Successfully!
                  </h3>
                </div>
                <p>
                  Thank you for contacting us. One of our representatives will
                  get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        formErrors.name ? "border-red-500" : "border-gray-300"
                      } !rounded-button focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold`}
                      placeholder="Enter your full name"
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        formErrors.email ? "border-red-500" : "border-gray-300"
                      } !rounded-button focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold`}
                      placeholder="Enter your email address"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        formErrors.phone ? "border-red-500" : "border-gray-300"
                      } !rounded-button focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold`}
                      placeholder="Enter your phone number"
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        formErrors.subject
                          ? "border-red-500"
                          : "border-gray-300"
                      } !rounded-button focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold`}
                      placeholder="Enter message subject"
                    />
                    {formErrors.subject && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.subject}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className={`w-full px-4 py-3 border ${
                      formErrors.message ? "border-red-500" : "border-gray-300"
                    } !rounded-button focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold`}
                    placeholder="Enter your message"
                  ></textarea>
                  {formErrors.message && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="privacy"
                    className="form-checkbox text-gold rounded border-gray-300 focus:ring-gold"
                  />
                  <label
                    htmlFor="privacy"
                    className="ml-2 text-sm text-gray-600"
                  >
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-gold hover:underline cursor-pointer"
                    >
                      Privacy Policy
                    </a>{" "}
                    and consent to the processing of my data.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-8 py-3 bg-gold text-white hover:bg-gold/90 transition-colors rounded-lg whitespace-nowrap cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <i className="fas fa-circle-notch fa-spin mr-2"></i>
                      Sending...
                    </span>
                  ) : (
                    "Send"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contacts;
