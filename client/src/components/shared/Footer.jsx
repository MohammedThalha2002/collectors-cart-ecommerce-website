import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 font-poppins">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="text-2xl font-serif font-bold text-maroon">
              <span className="text-gold">Collectors</span>Cart
            </div>
            <p className="text-gray-400 mb-6">
              Preserving history through exceptional collectibles. Trusted by
              collectors, museums, and investors worldwide.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/coinnnote?mibextid=LQQJ4d"
                className="text-gray-400 hover:text-gold transition-colors cursor-pointer"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://twitter.com/coin_n_note"
                className="text-gray-400 hover:text-gold transition-colors cursor-pointer"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://instagram.com/coin_n_note_?igshid=OGQ5ZDc2ODk2ZA=="
                className="text-gray-400 hover:text-gold transition-colors cursor-pointer"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://www.linkedin.com/company/coin-n-note/"
                className="text-gray-400 hover:text-gold transition-colors cursor-pointer"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-medium mb-4">Quick Links</h4>
            <QuickLinks />
          </div>
          <div>
            <h4 className="text-lg font-medium mb-4">Customer Service</h4>
            <CustomServiceLinks />
          </div>
          <ContactInfo />
        </div>
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            © 2025 RareCollectibles. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

function QuickLinks() {
  return (
    <ul className="space-y-3">
      <li>
        <Link
          to="/"
          className="text-gray-400 hover:text-gold transition-colors cursor-pointer"
        >
          Home
        </Link>
      </li>
      <li>
        <Link
          to="/collections/subcategories/all"
          className="text-gray-400 hover:text-gold transition-colors cursor-pointer"
        >
          Categories
        </Link>
      </li>
      <li>
        <Link
          to="/collections"
          className="text-gray-400 hover:text-gold transition-colors cursor-pointer"
        >
          Collections
        </Link>
      </li>
      <li>
        <Link
          to="/contact"
          className="text-gray-400 hover:text-gold transition-colors cursor-pointer"
        >
          Contact Us
        </Link>
      </li>
    </ul>
  );
}

function CustomServiceLinks() {
  return (
    <ul className="space-y-3">
      <li>
        <Link
          to="/contact#faq"
          className="text-gray-400 hover:text-gold transition-colors cursor-pointer"
        >
          FAQ
        </Link>
      </li>
      <li>
        <Link
          to="/contact#shipping"
          className="text-gray-400 hover:text-gold transition-colors cursor-pointer"
        >
          Shipping & Returns
        </Link>
      </li>
      <li>
        <Link
          to="/privacy-policy"
          className="text-gray-400 hover:text-gold transition-colors cursor-pointer"
        >
          Privacy Policy
        </Link>
      </li>
      <li>
        <Link
          to="/terms-and-conditions"
          className="text-gray-400 hover:text-gold transition-colors cursor-pointer"
        >
          Terms & Conditions
        </Link>
      </li>
    </ul>
  );
}

function ContactInfo() {
  return (
    <div>
      <h4 className="text-lg font-medium mb-4">Contact Information</h4>
      <ul className="space-y-3 text-gray-400">
        <li className="flex items-start">
          <i className="fas fa-map-marker-alt mt-1 mr-3 text-gold"></i>
          <span>Avadi, Chennai - 600072</span>
        </li>
        <li className="flex items-center">
          <i className="fas fa-phone-alt mr-3 text-gold"></i>
          <span>+91 9677033653</span>
        </li>
        <li className="flex items-center">
          <i className="fas fa-envelope mr-3 text-gold"></i>
          <span>info@coinnote.com</span>
        </li>
        <li className="flex items-center">
          <i className="fas fa-clock mr-3 text-gold"></i>
          <span>Mon-Fri: 9AM-6PM, Sat: 10AM-4PM</span>
        </li>
      </ul>
    </div>
  );
}

export default Footer;
