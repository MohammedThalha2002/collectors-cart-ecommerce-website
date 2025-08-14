import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/shared/navbar/NavBar";
import {
  getAllSubCategories,
  getSubCategoriesByCategoryId,
} from "../services/getProducts";
import ScrollToTop from "../components/shared/others/ScrollToTop";
import Footer from "../components/shared/Footer";

function SubCategories() {
  const { categoryId } = useParams();
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    if (categoryId === "all") {
      getAllSubCategories().then((data) => {
        const groupedSubCategories = data.reduce((acc, subCategory) => {
          if (!acc[subCategory.Category.id]) {
            acc[subCategory.Category.id] = [];
          }
          acc[subCategory.Category.id].push(subCategory);
          return acc;
        }, {});
        setSubCategories(Object.values(groupedSubCategories));
        setLoading(false);
      });
    } else {
      getSubCategoriesByCategoryId(categoryId).then((data) => {
        setSubCategories([data]);
        setLoading(false);
      });
    }
  }, [categoryId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-ivory to-maroon/5"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-maroon/10 rounded-full blur-2xl animate-pulse delay-1000"></div>

        <div className="text-center relative z-10">
          {/* Enhanced Loading Spinner */}
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-gold/20 border-t-gold mx-auto"></div>
            <div className="animate-ping absolute inset-0 rounded-full h-20 w-20 border-4 border-gold/30 mx-auto"></div>
          </div>

          {/* Loading Content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gold/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Loading Collections
            </h2>
            <p className="text-gray-600 mb-4">
              Preparing your premium subcategories...
            </p>

            {/* Loading Steps */}
            <div className="flex justify-center items-center space-x-2 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gold rounded-full animate-bounce"></div>
                <span className="ml-2">Fetching</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gold rounded-full animate-bounce delay-150"></div>
                <span className="ml-2">Organizing</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gold rounded-full animate-bounce delay-300"></div>
                <span className="ml-2">Displaying</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory text-gray-800 font-sans">
      <ScrollToTop />
      <NavBar />

      {/* Hero Section with Gradient Background */}
      <section className="relative bg-gradient-to-br from-gold/20 via-ivory to-gold/10 py-16 shadow-lg overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-maroon/10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="inline-block mb-6">
              <span className="inline-flex items-center px-4 py-2 bg-gold/20 text-gold font-medium rounded-full text-sm border border-gold/30">
                <i className="fas fa-gem mr-2"></i>
                Premium Collections
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              Explore <span className="text-gold">Collections</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our meticulously curated subcategories of rare
              collectibles, featuring
              <span className="text-gold font-semibold"> vintage coins</span>,
              <span className="text-maroon font-semibold">
                {" "}
                historic banknotes
              </span>
              , and
              <span className="text-gold font-semibold">
                {" "}
                precious artifacts
              </span>
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="flex items-center text-gray-600">
                <i className="fas fa-shield-alt text-gold mr-2"></i>
                <span className="text-sm">Authenticated Items</span>
              </div>
              <div className="flex items-center text-gray-600">
                <i className="fas fa-award text-gold mr-2"></i>
                <span className="text-sm">Premium Quality</span>
              </div>
              <div className="flex items-center text-gray-600">
                <i className="fas fa-globe text-gold mr-2"></i>
                <span className="text-sm">Worldwide Collection</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subcategories Content */}
      <div className="container mx-auto px-4 py-16 relative">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-50/50 to-transparent pointer-events-none"></div>

        {subCategories.map((subCategoryArray, index) => (
          <section key={index} className="mb-20 relative">
            {/* Category Header with Enhanced Styling */}
            <div className="text-center mb-16 relative">
              <div className="inline-block relative">
                <div className="flex items-center justify-center mb-2">
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-800 relative">
                    {subCategoryArray[0].Category.name}
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-gold to-maroon rounded-full"></div>
                  </h2>
                  {/* Total Category Count */}
                  <div className="ml-4 bg-gradient-to-r from-gold to-maroon text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {subCategoryArray.reduce(
                      (total, sub) => total + (sub.productCount || 0),
                      0
                    )}{" "}
                    total items
                  </div>
                </div>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
                Explore our premium collection of{" "}
                {subCategoryArray[0].Category.name.toLowerCase()} featuring rare
                and authentic pieces across {subCategoryArray.length}{" "}
                subcategories
              </p>

              {/* Decorative Elements */}
              <div className="flex justify-center items-center mt-6 space-x-4">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-gold"></div>
                <div className="w-3 h-3 bg-gold rounded-full animate-pulse"></div>
                <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-gold"></div>
              </div>
            </div>

            {/* Enhanced Subcategory Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {subCategoryArray.map((subcategory, subIndex) => (
                <div
                  key={subcategory.id}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 hover:border-gold/30 flex flex-col"
                  style={{
                    animationDelay: `${subIndex * 100}ms`,
                  }}
                >
                  {/* Enhanced Image Container */}
                  <div className="relative h-52 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <img
                      src={import.meta.env.VITE_IMAGE_URL + subcategory.image}
                      alt={subcategory.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                    {/* Floating Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gold border border-gold/20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                      <i className="fas fa-star mr-1"></i>
                      Premium
                    </div>
                  </div>

                  {/* Enhanced Content */}
                  <div className="p-6 relative flex flex-col h-full">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gold/5 to-transparent rounded-bl-full"></div>

                    <div className="relative z-10 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-gold transition-colors duration-300 truncate pr-2">
                          {subcategory.name}
                        </h3>
                        {/* Product Count Badge */}
                        <div className="bg-gradient-to-r from-gold/20 to-maroon/20 text-gold px-2 py-1 rounded-full text-xs font-bold border border-gold/30 shrink-0">
                          {subcategory.productCount || 0}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        Discover our exclusive collection of{" "}
                        {subcategory.name.toLowerCase()} featuring authenticated
                        pieces, rare finds, and historical significance.
                      </p>

                      {/* Features List - Compact */}
                      <div className="mb-4 space-y-1">
                        <div className="flex items-center text-xs text-gray-500">
                          <i className="fas fa-check-circle text-green-500 mr-2 text-xs"></i>
                          <span className="truncate">
                            Authenticated {subCategoryArray[0].Category.name}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <i className="fas fa-certificate text-gold mr-2 text-xs"></i>
                          <span className="truncate">Certificate Included</span>
                        </div>
                        {/* Always show this line - conditionally change the content */}
                        <div className="flex items-center text-xs text-gray-500">
                          {subcategory.productCount > 0 ? (
                            <>
                              <i className="fas fa-cubes text-blue-500 mr-2 text-xs"></i>
                              <span className="truncate">
                                {subcategory.productCount} Available Items
                              </span>
                            </>
                          ) : (
                            <>
                              <i className="fas fa-clock text-amber-500 mr-2 text-xs"></i>
                              <span className="truncate">
                                New Items Coming Soon
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Enhanced Button - Always at bottom */}
                      <button
                        onClick={() =>
                          navigate(
                            `/collections/category/${subCategoryArray[0].Category.id}/subcategory/${subcategory.id}`
                          )
                        }
                        disabled={subcategory.productCount === 0}
                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group-hover:shadow-gold/25 relative overflow-hidden mt-auto text-sm ${
                          subcategory.productCount === 0
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-gold to-gold/90 hover:from-gold/90 hover:to-gold text-white"
                        }`}
                      >
                        {/* Button Background Animation */}
                        {subcategory.productCount > 0 && (
                          <div className="absolute inset-0 bg-gradient-to-r from-maroon/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        )}

                        <span className="flex items-center justify-center relative z-10">
                          <span>
                            {subcategory.productCount === 0
                              ? "Coming Soon"
                              : "View Collection"}
                          </span>
                          {subcategory.productCount > 0 && (
                            <i className="fas fa-arrow-right ml-3 transition-transform duration-300 group-hover:translate-x-1"></i>
                          )}
                          {subcategory.productCount === 0 && (
                            <i className="fas fa-clock ml-3"></i>
                          )}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Enhanced Empty State */}
        {subCategories.length === 0 && (
          <div className="text-center py-24 relative">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-100"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-gold/10 to-maroon/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              {/* Icon */}
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gold/20 to-maroon/20 rounded-full border border-gold/30 mb-4">
                  <i className="fas fa-search text-3xl text-gold"></i>
                </div>
              </div>

              {/* Content */}
              <h3 className="text-3xl font-bold text-gray-700 mb-4">
                No Collections Found
              </h3>
              <p className="text-lg text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                We couldn't find any subcategories for this selection. Explore
                our other premium collections instead.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => navigate("/collections")}
                  className="bg-gradient-to-r from-gold to-gold/90 hover:from-gold/90 hover:to-gold text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <i className="fas fa-th-large mr-2"></i>
                  Browse All Collections
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-gold/30 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <i className="fas fa-home mr-2"></i>
                  Return Home
                </button>
              </div>

              {/* Help Text */}
              <div className="mt-8 text-sm text-gray-400">
                <p>
                  Need help finding something specific?{" "}
                  <a href="/contact" className="text-gold hover:underline">
                    Contact our experts
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Elements */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col space-y-4">
        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-14 h-14 bg-gradient-to-br from-gold to-gold/90 hover:from-gold/90 hover:to-gold text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
        >
          <i className="fas fa-chevron-up transition-transform duration-300 group-hover:-translate-y-1"></i>
        </button>

        {/* Quick Filter Button */}
        <button
          onClick={() => navigate("/collections")}
          className="w-14 h-14 bg-white hover:bg-gray-50 text-gold border border-gold/30 hover:border-gold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
        >
          <i className="fas fa-filter transition-transform duration-300 group-hover:rotate-12"></i>
        </button>
      </div>

      <Footer />
    </div>
  );
}

export default SubCategories;
