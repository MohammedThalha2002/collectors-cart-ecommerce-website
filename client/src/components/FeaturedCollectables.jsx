import { useEffect, useState } from "react";
import { getBestSeller } from "../services/getProducts";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItemsToCart } from "../hooks/features/CartSlice";
import { useNavigate } from "react-router-dom";
import { showToast } from "./shared/others/showToast";
import { toast } from "react-toastify";

function FeaturedCollectables() {
  const [bestSeller, setBestSeller] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const bestSellerRes = await getBestSeller(8);
    setBestSeller(bestSellerRes);
  }

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-400/5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-red-900/5 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-900 to-red-800 rounded-full flex items-center justify-center mr-4 shadow-xl">
              <i className="fas fa-star text-white text-xl"></i>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-2 text-gray-800">
                Featured Collectibles
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-red-900 to-yellow-400 mx-auto"></div>
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Handpicked treasures from our premium collection. These exceptional
            pieces represent the finest in numismatic artistry and historical
            significance.
          </p>
        </div>

        {/* Loading State */}
        {!bestSeller && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 rounded-2xl h-80 animate-pulse"
              ></div>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {bestSeller && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSeller.map((data) => (
              <ProductCard
                key={data.id}
                id={data.id}
                imageUrl={import.meta.env.VITE_IMAGE_URL + data.images[0]}
                name={data.name}
                description={data.description}
                price={data.sellingPrice}
                tag={data.tags[0] || "Graded"}
                onClick={() => {
                  navigate("/collections/" + data.id);
                }}
                addToCart={() => {
                  const productData = { ...data };
                  productData.quantity = 1;
                  dispatch(addItemsToCart(productData));
                  showToast(toast, "success", "Added to cart");
                }}
              />
            ))}
          </div>
        )}

        {/* Enhanced CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-br from-gray-50 via-white to-yellow-400/5 rounded-2xl p-8 border border-gray-100 shadow-lg">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-eye text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                Discover More Treasures
              </h3>
            </div>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Explore our complete collection of over 5,000 authenticated
              collectibles
            </p>
            <Link
              to="/collections"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gold/70 to-gold/80 text-gray-900 hover:from-gold/80 hover:to-gold/90 transition-all duration-200 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <i className="fas fa-store mr-3"></i>
              View All Collectibles
              <i className="fas fa-arrow-right ml-3"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedCollectables;
