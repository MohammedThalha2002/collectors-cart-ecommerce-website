import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Cart from "./Cart";

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt-token");
    setAuthenticated(token != null ? true : false);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const logOut = () => {
    localStorage.removeItem("jwt-token");
    setAuthenticated(false);
    navigate("/login");
  };

  const products = useSelector((state) => state.cart.items);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Mobile Navigation */}
      <nav
        className={`
          md:hidden
          mt-4 pb-4 
          -z-10
          absolute top-10 left-0 w-full bg-white shadow-lg px-4
          transform duration-500 ease-in-out
          ${
            isMenuOpen ? "translate-y" : "-translate-y-full pointer-events-none"
          }
        `}
      >
        <ul className="flex flex-col space-y-4">
          <Link
            to="/"
            className="font-medium hover:text-gold transition-colors cursor-pointer"
          >
            Home
          </Link>
          <Link
            to="/collections/subcategories/all"
            className="font-medium hover:text-gold transition-colors cursor-pointer"
          >
            Categories
          </Link>
          <Link
            to="/collections"
            className="font-medium hover:text-gold transition-colors cursor-pointer"
          >
            Shop
          </Link>
          <Link
            to="/contact"
            className="font-medium hover:text-gold transition-colors cursor-pointer"
          >
            Contact
          </Link>
        </ul>
        {!authenticated && (
          <div className="flex space-x-3 mt-4">
            <button
              onClick={() => navigate("/login")}
              className="flex-1 px-4 py-2 text-sm border border-gold text-gold hover:bg-gold hover:text-white transition-colors rounded-lg whitespace-nowrap cursor-pointer"
            >
              Login In
            </button>
            <button
              onClick={() => navigate("/signin")}
              className="flex-1 px-4 py-2 text-sm bg-gold text-white hover:bg-gold/90 transition-colors rounded-lg whitespace-nowrap cursor-pointer"
            >
              Register
            </button>
          </div>
        )}
        {authenticated && (
          <button
            onClick={() => logOut()}
            className="mt-4 w-full flex-1 px-4 py-2 text-sm border border-gold text-gold hover:bg-gold hover:text-white transition-colors rounded-lg whitespace-nowrap cursor-pointer"
          >
            Log Out
          </button>
        )}
      </nav>
      {/*  */}
      <div className="container mx-auto px-4 py-3 z-10 bg-white">
        <div className="h-8 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-serif font-bold text-maroon">
              <span className="text-gold">Collectors</span>Cart
            </Link>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex ml-10 font-poppins">
              <ul className="flex space-x-8">
                <Link
                  to="/"
                  className="font-medium hover:text-gold transition-colors cursor-pointer"
                >
                  Home
                </Link>
                <Link
                  to="/collections/subcategories/all"
                  className="font-medium hover:text-gold transition-colors cursor-pointer"
                >
                  Categories
                </Link>
                <Link
                  to="/collections"
                  className="font-medium hover:text-gold transition-colors cursor-pointer"
                >
                  Shop
                </Link>
                <Link
                  to="/contact"
                  className="font-medium hover:text-gold transition-colors cursor-pointer"
                >
                  Contact
                </Link>
              </ul>
            </nav>
          </div>
          <div className="flex items-center space-x-6">
            {authenticated && (
              <Link
                to="/profile"
                className="relative hover:text-gold transition-colors cursor-pointer"
                title="Profile"
              >
                <i className="fas fa-user text-lg"></i>
              </Link>
            )}
            <button
              onClick={() => {
                setIsCartOpen(!isCartOpen);
              }}
              className="relative hover:text-gold transition-colors cursor-pointer"
            >
              <i className="fas fa-shopping-cart text-lg"></i>
              {products.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {products.length}
                </span>
              )}
            </button>
            {!authenticated && (
              <div className="hidden md:flex items-center space-x-3">
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 text-sm border border-gold text-gold rounded-lg
               transition-all duration-200 ease-in-out transform
               hover:bg-gold hover:text-white hover:scale-[1.03] hover:shadow-lg"
                >
                  Log In
                </button>
                <button
                  onClick={() => navigate("/signin")}
                  className="px-4 py-2 text-sm bg-gold text-white rounded-lg
               transition-all duration-200 ease-in-out transform
               hover:bg-white hover:border hover:border-gold hover:text-gold
               hover:scale-[1.03] hover:shadow-lg"
                >
                  Register
                </button>
              </div>
            )}
            {authenticated && (
              <div className="hidden md:flex">
                <button
                  onClick={() => logOut()}
                  className="px-4 py-2 text-sm border border-gold text-gold rounded-lg
               transition-all duration-200 ease-in-out transform
               hover:bg-gold hover:text-white hover:scale-[1.03] hover:shadow-lg"
                >
                  Log Out
                </button>
              </div>
            )}
            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-800 hover:text-gold cursor-pointer"
            >
              <i
                className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"} text-xl`}
              ></i>
            </button>
          </div>
        </div>
      </div>
      <Cart setOpen={setIsCartOpen} open={isCartOpen} />
    </header>
  );
}

export default NavBar;
