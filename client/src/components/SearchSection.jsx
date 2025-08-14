import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchSection = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-yellow-400/5 py-12 shadow-lg overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-900/5 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
              <i className="fas fa-search text-white text-lg"></i>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Discover Your Treasures
            </h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Search through our extensive collection of authenticated rare
            collectibles from around the world
          </p>
        </div>

        {/* Enhanced Search Controls */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="relative flex-grow w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for rare collectibles, coins, stamps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={
                    "w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all duration-200 text-lg" +
                    (searchResults.length > 0 ? " rounded-b-none" : "")
                  }
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <i className="fas fa-search text-yellow-600 text-lg"></i>
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
              <div className="relative min-w-[200px]">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                  }}
                  className="w-full appearance-none pl-4 pr-12 py-4 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 cursor-pointer text-gray-700 font-medium"
                >
                  <option value={0}>🏛️ All Categories</option>
                  <option value={1}>🪙 Coins</option>
                  <option value={2}>💵 Banknotes</option>
                  <option value={3}>📮 Stamps</option>
                  <option value={4}>⚱️ Accessories</option>
                </select>
                <i className="fas fa-chevron-down absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
              </div>

              <button
                onClick={() => navigate(`/collections/search/${searchQuery}`)}
                disabled={!searchQuery.trim()}
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "fas fa-cubes", label: "Items", value: "5000+" },
            {
              icon: "fas fa-shield-alt",
              label: "Authenticated",
              value: "100%",
            },
            { icon: "fas fa-globe", label: "Countries", value: "50+" },
            { icon: "fas fa-medal", label: "Premium Grade", value: "90%" },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 text-center shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold/80 rounded-full flex items-center justify-center mx-auto mb-2">
                <i className={`${stat.icon} text-white text-sm`}></i>
              </div>
              <div className="text-xl font-bold text-gray-800">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
