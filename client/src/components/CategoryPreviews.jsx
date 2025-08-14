import Coin from "../assets/images/category/coins.jpg";
import Banknote from "../assets/images/category/bank_notes.jpg";
import Stamp from "../assets/images/category/stamps.jpg";
import Antique from "../assets/images/category/accessories.jpg";
import { useNavigate } from "react-router-dom";

function CategoryPreviews() {
  const navigate = useNavigate();
  return (
    <section className="py-20 bg-gradient-to-br from-ivory via-white to-gold/50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-maroon/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold/80 rounded-full flex items-center justify-center mr-4 shadow-xl">
              <i className="fas fa-gem text-white text-xl"></i>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-2 text-gray-800">
                Explore Our Collections
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-gold to-maroon mx-auto"></div>
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our meticulously curated categories of rare and valuable
            collectibles, each with a story to tell and history to preserve.
            Every piece is authenticated and graded by our expert numismatists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Coins Category */}
          <Category
            title={"Rare Coins"}
            description={
              "Explore our collection of 2,500+ rare coins from ancient civilizations to modern limited editions."
            }
            imageUrl={Coin}
            stats="2,500+ Items"
            icon="fas fa-coins"
            onClick={() => {
              navigate("/collections/subcategories/1");
            }}
          />
          {/* Banknotes Category */}
          <Category
            title={"Historic Banknotes"}
            description={
              "Pristine paper currency from around the world, featuring artistic designs and historical significance."
            }
            imageUrl={Banknote}
            stats="1,200+ Notes"
            icon="fas fa-money-bill"
            onClick={() => {
              navigate("/collections/subcategories/2");
            }}
          />
          {/* Stamps Category */}
          <Category
            title={"Philatelic Treasures"}
            description={
              "Rare global stamps, including limited editions, errors, and commemoratives."
            }
            imageUrl={Stamp}
            stats="800+ Stamps"
            icon="fas fa-envelope"
            onClick={() => {
              navigate("/collections/subcategories/3");
            }}
          />
          {/* Accessories Category */}
          <Category
            title={"Antique Accessories"}
            description={
              "Exquisite collection of pocket watches, fountain pens, and other refined collectible accessories."
            }
            imageUrl={Antique}
            stats="500+ Pieces"
            icon="fas fa-clock"
            onClick={() => {
              navigate("/collections/subcategories/4");
            }}
          />
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fas fa-shield-alt text-green-600 text-lg"></i>
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-800">
                  100% Authenticated
                </div>
                <div className="text-sm text-gray-600">Expert Verified</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="fas fa-shipping-fast text-blue-600 text-lg"></i>
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-800">Secure Shipping</div>
                <div className="text-sm text-gray-600">India-wide Delivery</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <i className="fas fa-undo text-purple-600 text-lg"></i>
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-800">30-Day Returns</div>
                <div className="text-sm text-gray-600">
                  Satisfaction Guaranteed
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Category({ title, description, imageUrl, stats, icon, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer transform hover:scale-105 transition-all duration-300 border border-gray-100 hover:shadow-2xl"
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        <div className="absolute top-4 left-4">
          <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
            <i className={`${icon} text-gold text-lg`}></i>
          </div>
        </div>
        <div className="absolute bottom-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-sm font-semibold text-gray-800">{stats}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-serif font-bold text-gray-800 group-hover:text-gold transition-colors">
            {title}
          </h3>
          <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-all">
            <i className="fas fa-arrow-right text-sm"></i>
          </div>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <button className="text-gold hover:text-gold/80 font-semibold text-sm flex items-center group-hover:scale-105 transition-transform">
            Explore Collection
            <i className="fas fa-chevron-right ml-2 text-xs"></i>
          </button>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-xs text-gray-500">Available</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryPreviews;
