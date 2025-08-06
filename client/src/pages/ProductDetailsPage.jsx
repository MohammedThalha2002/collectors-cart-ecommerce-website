import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import ScrollToTop from "../components/shared/others/ScrollToTop";
import NavBar from "../components/shared/navbar/NavBar";
import { addItemsToCart } from "../hooks/features/CartSlice";
import ProductCard from "../components/ProductCard";
import Footer from "../components/shared/Footer";
import BirthdayDatePickerDialog from "../components/BirthdayDatePicker";
import { showToast } from "../components/shared/others/showToast";
import {
  addToWishlist,
  removeFromWishlist,
  checkWishlistStatus,
} from "../services/profileService";

const ProductDetailsPage = () => {
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const [dateDialogVisible, setDateDialogVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { productId } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(import.meta.env.VITE_API_URL + `/products/${productId}`)
      .then((res) => {
        setProduct(res.data);
        const category = res.data.Category.name;
        axios
          .get(
            `${
              import.meta.env.VITE_API_URL
            }/products?limit=4&category=${category}`
          )
          .then((res) => {
            setRelatedProducts(res.data.data);
          });
      })
      .catch((err) => {
        const error = err.response.data.error.message;
        showToast(toast, "error", error);
      })
      .finally(() => {
        setLoading(false);
      });
    const token = localStorage.getItem("jwt-token");
    setAuthenticated(token != null ? true : false);

    // Check wishlist status if user is authenticated
    if (token && productId) {
      checkWishlistStatus(productId)
        .then((response) => {
          setIsInWishlist(response.isInWishlist);
        })
        .catch((error) => {
          // Silent fail for wishlist status check
          console.log("Could not check wishlist status:", error);
        });
    }
  }, [productId]);

  const handleWishlistToggle = async () => {
    if (!authenticated) {
      showToast(toast, "error", "Please log in to add items to wishlist");
      return;
    }

    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        await removeFromWishlist(productId);
        setIsInWishlist(false);
        showToast(toast, "success", "Removed from wishlist");
      } else {
        await addToWishlist(productId);
        setIsInWishlist(true);
        showToast(toast, "success", "Added to wishlist");
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      showToast(toast, "error", "Failed to update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  function notifyOnStockUpdate() {
    axios
      .get(import.meta.env.VITE_API_URL + `/notify/stock/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
        },
      })
      .then((res) => {
        showToast(toast, "success", res.data.message);
      })
      .catch((err) => {
        const error = err.response.data.error.message;
        showToast(toast, "error", error);
      });
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <ToastContainer />
      <ScrollToTop />
      <NavBar />
      {dateDialogVisible && (
        <BirthdayDatePickerDialog
          onSubmit={() => {
            if (selectedDate) {
              const selectedProduct = { ...product };
              selectedProduct.birthdayDate = selectedDate;
              selectedProduct.quantity = 1;
              dispatch(addItemsToCart(selectedProduct));
              setDateDialogVisible(false);
              showToast(toast, "success", "Added to cart");
            }
          }}
          onCancel={() => {
            setDateDialogVisible(false);
          }}
          onDateChange={(date) => setSelectedDate(date)}
        />
      )}
      <main className="pb-16">
        {/* Enhanced Breadcrumb Section */}
        <section className="relative bg-gradient-to-br from-white via-gray-50 to-yellow-400/5 py-4 md:py-8 shadow-md overflow-hidden">
          {/* Background Decorations */}
          <div className="absolute top-0 right-0 w-48 h-48 md:w-72 md:h-72 bg-yellow-400/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 md:w-64 md:h-64 bg-red-900/5 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>

          <div className="container mx-auto px-4 relative z-10">
            <nav
              className="flex items-center space-x-2 md:space-x-3 text-sm md:text-base overflow-x-auto"
              aria-label="Breadcrumb"
            >
              <Link
                to={"/"}
                className="flex items-center text-gray-600 hover:text-yellow-600 transition-colors font-medium whitespace-nowrap"
              >
                <i className="fas fa-home mr-1 md:mr-2"></i>
                <span className="hidden sm:inline">Home</span>
                <span className="sm:hidden">🏠</span>
              </Link>
              <i className="fas fa-chevron-right text-gray-400 text-xs flex-shrink-0"></i>
              <Link
                to={"/collections"}
                className="text-gray-600 hover:text-yellow-600 transition-colors font-medium whitespace-nowrap truncate max-w-20 sm:max-w-none"
              >
                {product?.Category?.name}
              </Link>
              <i className="fas fa-chevron-right text-gray-400 text-xs flex-shrink-0"></i>
              <span className="text-gray-600 font-medium whitespace-nowrap truncate max-w-24 sm:max-w-none">
                {product?.SubCategory?.name}
              </span>
              <i className="fas fa-chevron-right text-gray-400 text-xs flex-shrink-0"></i>
              <span className="text-yellow-600 font-semibold whitespace-nowrap truncate max-w-32 sm:max-w-none">
                {product?.name}
              </span>
            </nav>
          </div>
        </section>

        {/* Product Details */}
        {loading ? (
          <ProductViewSkeleton />
        ) : (
          product && (
            <section className="relative bg-white py-6 md:py-12 overflow-hidden">
              {/* Background Decorations */}
              <div className="absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-yellow-400/3 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-56 h-56 md:w-80 md:h-80 bg-red-900/3 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>

              <div className="container mx-auto px-4 relative z-10">
                <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl border border-gray-100 p-4 md:p-8 lg:p-12">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
                    {/* Enhanced Product Images */}
                    <div className="space-y-4 md:space-y-6">
                      <div className="relative group">
                        <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-r from-yellow-400 to-red-900 rounded-xl md:rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-gray-50 shadow-xl border border-gray-200">
                          <img
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            src={
                              import.meta.env.VITE_IMAGE_URL +
                              product.images[selectedImage]
                            }
                            alt={product.name}
                          />
                          {/* Image overlay with zoom effect */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                      </div>

                      {/* Enhanced Thumbnail Grid */}
                      <div className="grid grid-cols-4 gap-2 md:gap-4">
                        {product.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`relative aspect-square rounded-lg md:rounded-xl overflow-hidden bg-gray-50 border-2 md:border-3 transition-all duration-300 hover:scale-105 ${
                              selectedImage === index
                                ? "border-yellow-400 shadow-lg ring-2 md:ring-4 ring-yellow-400/20"
                                : "border-gray-200 hover:border-yellow-400/50"
                            }`}
                          >
                            <img
                              src={import.meta.env.VITE_IMAGE_URL + image}
                              alt={`${product.name} view ${index + 1}`}
                              className="w-full h-full object-cover object-center"
                            />
                            {selectedImage === index && (
                              <div className="absolute inset-0 bg-yellow-400/10"></div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Enhanced Product Info */}
                    <div className="space-y-4 md:space-y-8">
                      {/* Product Header */}
                      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-100">
                        <div className="flex items-start justify-between mb-4 md:mb-6">
                          <div className="flex-1 pr-4">
                            <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
                              <span
                                className={`text-white text-xs md:text-sm font-semibold px-3 md:px-4 py-1 md:py-2 rounded-full shadow-md ${
                                  product.tags[0] === "Ultra Rare"
                                    ? "bg-gradient-to-r from-red-900 to-red-800"
                                    : "bg-gradient-to-r from-yellow-400 to-yellow-500"
                                }`}
                              >
                                <i className="fas fa-star mr-1"></i>
                                {product.tags[0]}
                              </span>
                            </div>

                            <h1 className="text-2xl md:text-4xl font-serif font-bold mb-2 md:mb-3 text-gray-800 leading-tight">
                              {product.name}
                            </h1>

                            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-gray-600 mb-3 md:mb-4">
                              <div className="flex items-center bg-white px-2 md:px-3 py-1 rounded-lg border border-gray-200 text-sm">
                                <i className="fas fa-layer-group text-yellow-600 mr-1 md:mr-2"></i>
                                <span className="font-medium">
                                  {product.Category.name}
                                </span>
                              </div>
                              <div className="text-gray-400 hidden sm:block">
                                •
                              </div>
                              <div className="flex items-center bg-white px-2 md:px-3 py-1 rounded-lg border border-gray-200 text-sm">
                                <i className="fas fa-tag text-yellow-600 mr-1 md:mr-2"></i>
                                <span className="font-medium">
                                  {product.SubCategory.name}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Enhanced Wishlist Button */}
                          <button
                            onClick={handleWishlistToggle}
                            disabled={wishlistLoading}
                            className={`w-12 h-12 md:w-14 md:h-14 rounded-full transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 flex-shrink-0 ${
                              isInWishlist
                                ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                                : "bg-white border-2 border-red-200 text-red-500 hover:bg-red-50"
                            } ${
                              wishlistLoading
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {wishlistLoading ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div>
                            ) : (
                              <i
                                className={`fas fa-heart text-lg ${
                                  isInWishlist ? "text-white" : "text-red-500"
                                }`}
                              ></i>
                            )}
                          </button>
                        </div>

                        {/* Stock Status */}
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-4 md:mb-6">
                          {product.inStock > 0 ? (
                            <div className="flex items-center bg-green-50 text-green-700 px-3 md:px-4 py-2 rounded-lg border border-green-200 text-sm">
                              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                              <span className="font-semibold">In Stock</span>
                              <span className="ml-2 text-green-600 hidden sm:inline">
                                ({product.inStock} available)
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center bg-red-50 text-red-700 px-3 md:px-4 py-2 rounded-lg border border-red-200 text-sm">
                              <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                              <span className="font-semibold">
                                Out of Stock
                              </span>
                            </div>
                          )}
                          <div className="flex items-center bg-blue-50 text-blue-700 px-3 md:px-4 py-2 rounded-lg border border-blue-200 text-sm">
                            <i className="fas fa-shield-alt mr-2"></i>
                            <span className="font-semibold">Authenticated</span>
                          </div>
                        </div>

                        {/* Price Section */}
                        <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Current Price
                              </p>
                              <div className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-red-900">
                                ₹{product.sellingPrice.toLocaleString()}
                              </div>
                            </div>
                            <div className="sm:text-right">
                              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-3 md:px-4 py-2 rounded-lg font-semibold text-sm md:text-base">
                                <i className="fas fa-certificate mr-1"></i>
                                Premium Grade
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Product Description */}
                      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-100 shadow-sm">
                        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4 flex items-center">
                          <i className="fas fa-info-circle text-yellow-600 mr-2"></i>
                          Description
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                          {product.description}
                        </p>
                      </div>

                      {/* Enhanced Add to Cart Section */}
                      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl md:rounded-2xl p-4 md:p-8 border border-yellow-200 shadow-lg">
                        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center">
                          <i className="fas fa-shopping-cart text-yellow-600 mr-2"></i>
                          Add to Collection
                        </h3>

                        <div className="space-y-4 md:space-y-6">
                          {/* Quantity Selector */}
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
                            <div className="flex items-center">
                              <label className="text-sm font-semibold text-gray-700 mr-3 md:mr-4">
                                Quantity:
                              </label>
                              <div className="flex items-center bg-white border-2 border-gray-300 rounded-lg md:rounded-xl shadow-sm">
                                <button
                                  onClick={() => {
                                    setQuantity(Math.max(1, quantity - 1));
                                  }}
                                  className="px-3 md:px-4 py-2 md:py-3 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 transition-colors rounded-l-lg md:rounded-l-xl"
                                >
                                  <i className="fas fa-minus"></i>
                                </button>
                                <input
                                  type="number"
                                  value={quantity}
                                  readOnly={true}
                                  className="w-12 md:w-16 text-center border-none focus:ring-0 bg-transparent focus:outline-none font-semibold text-base md:text-lg"
                                />
                                <button
                                  onClick={() => {
                                    if (quantity >= product.inStock) {
                                      if (!toast.isActive("error-toast")) {
                                        showToast(
                                          toast,
                                          "error",
                                          "Cannot increase quantity beyond stock limit"
                                        );
                                      }
                                      return;
                                    }
                                    setQuantity(quantity + 1);
                                  }}
                                  className="px-3 md:px-4 py-2 md:py-3 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 transition-colors rounded-r-lg md:rounded-r-xl"
                                >
                                  <i className="fas fa-plus"></i>
                                </button>
                              </div>
                            </div>

                            {/* Price Calculator */}
                            <div className="bg-white px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl border border-gray-200 shadow-sm flex-shrink-0">
                              <span className="text-sm text-gray-500">
                                Total:{" "}
                              </span>
                              <span className="text-lg md:text-xl font-bold text-yellow-600">
                                ₹
                                {(
                                  product.sellingPrice * quantity
                                ).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="space-y-3 md:space-y-4">
                            {product.inStock <= 0 ? (
                              <button
                                onClick={() => {
                                  if (!authenticated) {
                                    showToast(
                                      toast,
                                      "error",
                                      "Please Log in to notify"
                                    );
                                    return;
                                  }
                                  notifyOnStockUpdate();
                                }}
                                className="w-full py-3 md:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 rounded-lg md:rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm md:text-base"
                              >
                                <i className="fas fa-bell mr-2"></i>
                                Notify Me When Available
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  if (
                                    product.SubCategory.name == "Birthday Notes"
                                  ) {
                                    setDateDialogVisible(true);
                                  } else {
                                    product.quantity = quantity;
                                    dispatch(addItemsToCart(product));
                                    showToast(
                                      toast,
                                      "success",
                                      "Added to cart"
                                    );
                                  }
                                }}
                                className="w-full py-3 md:py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 rounded-lg md:rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm md:text-base"
                              >
                                <i className="fas fa-shopping-cart mr-2"></i>
                                Add to Cart
                              </button>
                            )}

                            {/* Additional Info */}
                            <div className="grid grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm">
                              <div className="flex items-center text-gray-600 bg-white px-2 md:px-3 py-2 rounded-lg">
                                <i className="fas fa-shield-alt text-green-500 mr-1 md:mr-2"></i>
                                <span className="truncate">Secure Payment</span>
                              </div>
                              <div className="flex items-center text-gray-600 bg-white px-2 md:px-3 py-2 rounded-lg">
                                <i className="fas fa-truck text-blue-500 mr-1 md:mr-2"></i>
                                <span className="truncate">Fast Shipping</span>
                              </div>
                              <div className="flex items-center text-gray-600 bg-white px-2 md:px-3 py-2 rounded-lg">
                                <i className="fas fa-undo text-purple-500 mr-1 md:mr-2"></i>
                                <span className="truncate">30-Day Returns</span>
                              </div>
                              <div className="flex items-center text-gray-600 bg-white px-2 md:px-3 py-2 rounded-lg">
                                <i className="fas fa-certificate text-yellow-500 mr-1 md:mr-2"></i>
                                <span className="truncate">Authenticated</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Items */}
              <section className="mt-8 md:mt-16 bg-gradient-to-br from-gray-50 to-white">
                <div className="container mx-auto px-4 py-6 md:py-12">
                  <div className="border-t border-gray-200 pt-6 md:pt-8">
                    <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6 md:mb-8 text-center bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">
                      Related Collectibles
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                      {relatedProducts.map((data) => (
                        <ProductCard
                          key={data.id}
                          id={data.id}
                          imageUrl={
                            import.meta.env.VITE_IMAGE_URL + data.images[0]
                          }
                          name={data.name}
                          description={data.description}
                          price={data.sellingPrice}
                          tag={data.tags[0] || "Graded"}
                          onClick={() => {
                            navigate("/collections/" + data.id);
                          }}
                          addToCart={() => {
                            data.quantity = 1;
                            dispatch(addItemsToCart(data));
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </section>
          )
        )}
      </main>
      <Footer />
    </div>
  );
};

function ProductViewSkeleton() {
  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 animate-pulse">
        {/* Product Images */}
        <div className="space-y-3 md:space-y-4">
          <div className="aspect-square rounded-lg md:rounded-xl overflow-hidden bg-gray-200 border-2">
            <div className="w-full h-full animate-pulse" />
          </div>
          <div className="grid grid-cols-4 gap-2 md:gap-4">
            {Array(2)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg overflow-hidden bg-gray-200 border-2"
                ></div>
              ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-4 md:mb-6">
            <div className="space-y-3 md:space-y-4">
              <div className="w-20 md:w-24 h-4 md:h-6 bg-gray-200 rounded-full" />
              <div className="w-3/4 h-8 md:h-10 bg-gray-200 rounded" />
              <div className="flex space-x-2">
                <div className="w-20 md:w-24 h-3 md:h-4 bg-gray-200 rounded" />
                <div className="w-4 md:w-6 h-3 md:h-4 bg-gray-200 rounded" />
                <div className="w-20 md:w-24 h-3 md:h-4 bg-gray-200 rounded" />
              </div>
              <div className="w-32 md:w-40 h-6 md:h-8 bg-gray-200 rounded" />
              <div className="h-16 md:h-20 bg-gray-200 rounded" />
              <div className="h-12 md:h-16 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;
