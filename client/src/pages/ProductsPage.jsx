import { useState, useEffect } from "react";
import NavBar from "../components/shared/navbar/NavBar";
import Footer from "../components/shared/Footer";
import { getAllSubCategories, getProducts } from "../services/getProducts";
import ProductCard from "../components/ProductCard";
import { Link, useNavigate, useParams } from "react-router-dom";
import categories from "../static/categories";
import continents from "../static/continents";
import countries from "../static/countries";
import ScrollToTop from "../components/shared/others/ScrollToTop";
import { useDispatch } from "react-redux";
import { addItemsToCart } from "../hooks/features/CartSlice";
import { toast, ToastContainer } from "react-toastify";
import BirthdayDatePickerDialog from "../components/BirthdayDatePicker";
import HorizontalProductCard from "../components/HorizontalProductCard";
import { showToast } from "../components/shared/others/showToast";

const ProductsPage = () => {
  const { categoryId, subcategoryId, searchQuery } = useParams();
  const navigate = useNavigate();

  const initialCategory = categories.find(
    (cat) => cat.id === parseInt(categoryId)
  );
  const initialSubCategory = subcategoryId;

  const itemsPerPageOptions = [12, 24, 36];

  const [products, setProducts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);
  const [sortOption, setSortOption] = useState("newest");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [selectedContinent, setSelectedContinent] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [showAllCountries, setShowAllCountries] = useState(false);
  const [productsMeta, setProductsMeta] = useState({
    total: 0,
    limit: itemsPerPage,
    offset: 0,
    page: 10,
  });
  const [search, setSearch] = useState(searchQuery);
  const [dateDialogVisible, setDateDialogVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const visibleCountries = showAllCountries
    ? countries
    : countries.slice(0, 10);

  useEffect(() => {
    // Set initial category if available
    if (initialCategory) {
      setSelectedCategories([initialCategory]);
    }
    getAllSubCategories().then((data) => {
      setSubCategories(data);
      if (initialSubCategory) {
        const subCat = data.find(
          (sub) => sub.id === parseInt(initialSubCategory)
        );
        if (subCat) {
          setSelectedSubCategories([subCat]);
        }
      }
    });
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [
    selectedCategories,
    selectedSubCategories,
    selectedContinent,
    selectedCountry,
    sortOption,
    currentPage,
  ]);

  useEffect(() => {
    if (search && search.length > 0) {
      const timer = setTimeout(() => {
        fetchProducts();
      }, 500); // Debounce for 500ms
      return () => clearTimeout(timer); // Cleanup on unmount or searchQuery change
    } else {
      fetchProducts();
    }
  }, [search]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const dispatch = useDispatch();

  function fetchProducts() {
    const filters = {
      continent: selectedContinent ? selectedContinent : null,
      country: selectedCountry ? selectedCountry : null,
      categoryIds: selectedCategories.map((cat) => cat.id).join(","),
      subCategoryIds: selectedSubCategories.map((sub) => sub.id).join(","),
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sortByPrice: sortOption.includes("price")
        ? sortOption.split("-")[1] === "high"
          ? "DESC"
          : "ASC"
        : null,
      sortByDate: sortOption === "newest" ? "DESC" : "ASC",
      search: search,
    };

    getProducts(currentPage, filters, itemsPerPage).then((data) => {
      setProducts(data.data);
      setProductsMeta(data.meta);
    });
  }

  const handlePriceRangeChange = (e, index) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(e.target.value, 10);
    setPriceRange(newRange);
  };

  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }

    // clear subcategroies if its category is unselected
    if (selectedSubCategories.some((sub) => sub.Category.id === category.id)) {
      setSelectedSubCategories(
        selectedSubCategories.filter((sub) => sub.Category.id !== category.id)
      );
    }
  };

  const handleSubCategoryChange = (subCategory) => {
    if (selectedSubCategories.includes(subCategory)) {
      setSelectedSubCategories(
        selectedSubCategories.filter((sc) => sc !== subCategory)
      );
    } else {
      setSelectedSubCategories([...selectedSubCategories, subCategory]);
    }
  };

  const handleContinentChange = (continent) => {
    setSelectedContinent(continent);
  };

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
  };

  const handleFilterClearAll = () => {
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setSelectedContinent("");
    setSelectedCountry("");
    setPriceRange([0, 10000]);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleItemsPerPageChange = (count) => {
    setItemsPerPage(count);
    setCurrentPage(1);
  };

  // Calculate total pages
  const totalPages = Math.ceil(productsMeta.total / itemsPerPage);
  // Calculate pagination range
  const getPaginationRange = () => {
    const range = [];
    const maxPagesToShow = 5;
    let start = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let end = Math.min(totalPages, start + maxPagesToShow - 1);
    if (end - start + 1 < maxPagesToShow) {
      start = Math.max(1, end - maxPagesToShow + 1);
    }
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  return (
    <div className="min-h-screen bg-ivory text-gray-800 font-sans">
      <ScrollToTop />
      <ToastContainer />
      <NavBar />
      <main className="pb-16">
        {/* Enhanced Breadcrumb & Page Title Section */}
        <section className="relative bg-gradient-to-br from-gray-50 via-white to-gold/5 py-12 shadow-lg overflow-hidden">
          {/* Background Decorations */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-maroon/5 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <nav className="flex mb-4" aria-label="Breadcrumb">
                  <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                      <Link
                        to="/"
                        data-readdy="true"
                        className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gold cursor-pointer transition-colors"
                      >
                        <i className="fas fa-home mr-2"></i>
                        Home
                      </Link>
                    </li>
                    <li aria-current="page">
                      <div className="flex items-center">
                        <i className="fas fa-chevron-right text-gray-400 mx-2 text-xs"></i>
                        <span className="text-sm font-medium text-gold">
                          All Collections
                        </span>
                      </div>
                    </li>
                  </ol>
                </nav>

                <div className="flex items-center mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold/80 rounded-full flex items-center justify-center mr-4 shadow-lg">
                    <i className="fas fa-store text-white text-lg"></i>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-gray-800">
                      Premium Collections
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Discover authentic rare collectibles from around the world
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-6 mt-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="fas fa-cubes text-gold mr-2"></i>
                    <span className="font-semibold">1000+</span>
                    <span className="ml-1">Items</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="fas fa-tags text-gold mr-2"></i>
                    <span className="font-semibold">{categories.length}</span>
                    <span className="ml-1">Categories</span>
                  </div>
                  {/* Subcategories  */}
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="fas fa-layer-group text-gold mr-2"></i>
                    <span className="font-semibold">
                      {subCategories.length}
                    </span>
                    <span className="ml-1">Subcategories</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="fas fa-shield text-gold mr-2"></i>
                    <span>Authenticated</span>
                  </div>
                </div>
              </div>

              {/* Enhanced View Controls - Moved to Right */}
              <div className="flex flex-col space-y-4 lg:items-end">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-md border border-gray-200">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-3 rounded-md transition-all duration-200 ${
                        viewMode === "grid"
                          ? "bg-gold text-white shadow-md"
                          : "text-gray-600 hover:text-gold hover:bg-gold/5"
                      } cursor-pointer`}
                    >
                      <i className="fas fa-th"></i>
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-3 rounded-md transition-all duration-200 ${
                        viewMode === "list"
                          ? "bg-gold text-white shadow-md"
                          : "text-gray-600 hover:text-gold hover:bg-gold/5"
                      } cursor-pointer`}
                    >
                      <i className="fas fa-list"></i>
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <select
                    className="appearance-none pl-4 pr-12 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold cursor-pointer shadow-md min-w-[200px]"
                    value={sortOption}
                    onChange={handleSortChange}
                  >
                    <option value="newest">✨ Newest First</option>
                    <option value="popular">🕐 Oldest First</option>
                    <option value="price-high">💰 Price: High to Low</option>
                    <option value="price-low">💰 Price: Low to High</option>
                  </select>
                  <i className="fas fa-chevron-down absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Filter and Products Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Enhanced Filter Sidebar */}
              <div className="lg:w-1/4">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-4">
                  {/* Filter Header */}
                  <div className="bg-gradient-to-r from-gold/10 to-maroon/10 p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center mr-3">
                          <i className="fas fa-filter text-white text-sm"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">
                          Smart Filters
                        </h3>
                      </div>
                      <button
                        onClick={handleFilterClearAll}
                        className="text-sm text-gold hover:text-gold/80 font-medium cursor-pointer transition-colors flex items-center"
                      >
                        <i className="fas fa-refresh mr-1"></i>
                        Clear All
                      </button>
                    </div>

                    {/* Active Filters Count */}
                    <div className="mt-3 flex items-center text-sm text-gray-600">
                      <i className="fas fa-check-circle text-green-500 mr-2"></i>
                      <span>
                        {selectedCategories.length +
                          selectedSubCategories.length +
                          (selectedContinent ? 1 : 0) +
                          (selectedCountry ? 1 : 0)}{" "}
                        filters active
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
                    {/* Category Filter */}
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <i className="fas fa-layer-group text-gold mr-2"></i>
                        <h4 className="font-bold text-gray-800">Categories</h4>
                        {selectedCategories.length > 0 && (
                          <span className="ml-auto bg-gold text-white text-xs px-2 py-1 rounded-full">
                            {selectedCategories.length}
                          </span>
                        )}
                      </div>
                      <div className="space-y-3">
                        {categories.map((category) => (
                          <div key={category.id} className="space-y-2">
                            <label className="flex items-center cursor-pointer group">
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={selectedCategories.includes(
                                    category
                                  )}
                                  onChange={() =>
                                    handleCategoryChange(category)
                                  }
                                  className="form-checkbox text-gold rounded border-2 border-gray-300 focus:ring-gold transition-colors"
                                />
                                {selectedCategories.includes(category) && (
                                  <i className="fas fa-check absolute inset-0 flex items-center justify-center text-white text-xs pointer-events-none"></i>
                                )}
                              </div>
                              <span className="ml-3 font-medium text-gray-700 group-hover:text-gold transition-colors">
                                {category.name}
                              </span>
                            </label>

                            {/* Subcategories */}
                            {selectedCategories.includes(category) && (
                              <div className="ml-6 pl-4 border-l-2 border-gold/20 space-y-2">
                                {subCategories
                                  .filter(
                                    (sub) => sub.Category.id === category.id
                                  )
                                  .map((subCategory) => (
                                    <label
                                      key={subCategory.id}
                                      className="flex items-center cursor-pointer group"
                                    >
                                      <div className="relative">
                                        <input
                                          type="checkbox"
                                          checked={selectedSubCategories.includes(
                                            subCategory
                                          )}
                                          onChange={() =>
                                            handleSubCategoryChange(subCategory)
                                          }
                                          className="form-checkbox text-maroon rounded border-2 border-gray-300 focus:ring-maroon transition-colors"
                                        />
                                        {selectedSubCategories.includes(
                                          subCategory
                                        ) && (
                                          <i className="fas fa-check absolute inset-0 flex items-center justify-center text-white text-xs pointer-events-none"></i>
                                        )}
                                      </div>
                                      <span className="ml-3 text-sm text-gray-600 group-hover:text-maroon transition-colors">
                                        {subCategory.name}
                                      </span>
                                    </label>
                                  ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price Range Filter */}
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <i className="fas fa-dollar-sign text-gold mr-2"></i>
                        <h4 className="font-bold text-gray-800">Price Range</h4>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-gold">
                            ₹{priceRange[0].toLocaleString()}
                          </span>
                          <span className="text-gray-500">to</span>
                          <span className="font-semibold text-gold">
                            ₹{priceRange[1].toLocaleString()}
                          </span>
                        </div>

                        <div className="relative">
                          <input
                            type="range"
                            min="0"
                            max="100000"
                            step="100"
                            value={priceRange[1]}
                            onChange={(e) => handlePriceRangeChange(e, 1)}
                            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>₹0</span>
                            <span>₹100K+</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Min Price
                            </label>
                            <input
                              type="number"
                              value={priceRange[0]}
                              onChange={(e) => handlePriceRangeChange(e, 0)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                              min="0"
                              max={priceRange[1]}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Max Price
                            </label>
                            <input
                              type="number"
                              value={priceRange[1]}
                              onChange={(e) => handlePriceRangeChange(e, 1)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                              min={priceRange[0]}
                            />
                          </div>
                        </div>

                        <button
                          onClick={fetchProducts}
                          className="w-full bg-gradient-to-r from-gold to-gold/90 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                        >
                          <i className="fas fa-search mr-2"></i>
                          Apply Price Filter
                        </button>
                      </div>
                    </div>

                    {/* Enhanced Continents Filter */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <i className="fas fa-globe-americas text-gold mr-2"></i>
                          <h4 className="font-bold text-gray-800">
                            Continents
                          </h4>
                        </div>
                        {selectedContinent && (
                          <button
                            onClick={() => {
                              setSelectedContinent("");
                              setSelectedCountry("");
                            }}
                            className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        {continents.map((continent) => (
                          <label
                            key={continent}
                            className={`flex items-center cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                              selectedContinent === continent
                                ? "border-gold bg-gold/10 shadow-md"
                                : "border-gray-200 hover:border-gold/50 hover:bg-gold/5"
                            }`}
                          >
                            <div className="relative">
                              <input
                                type="radio"
                                name="continent"
                                checked={selectedContinent === continent}
                                onChange={() => {
                                  handleContinentChange(continent);
                                  setSelectedCountry(""); // Reset country when continent changes
                                }}
                                className="form-radio text-gold border-2 border-gray-300 focus:ring-gold transition-colors"
                              />
                            </div>
                            <div className="ml-3 flex-1">
                              <span className="font-medium text-gray-700">
                                {continent}
                              </span>
                              <div className="text-xs text-gray-500 mt-1">
                                {
                                  countries.filter((country) => {
                                    // You might need to add continent mapping logic here
                                    return true; // Placeholder
                                  }).length
                                }{" "}
                                countries
                              </div>
                            </div>
                            {selectedContinent === continent && (
                              <i className="fas fa-check-circle text-gold"></i>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Enhanced Countries Filter */}
                    {selectedContinent && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <i className="fas fa-flag text-maroon mr-2"></i>
                            <h4 className="font-bold text-gray-800">
                              Countries
                            </h4>
                          </div>
                          {selectedCountry && (
                            <button
                              onClick={() => setSelectedCountry("")}
                              className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          )}
                        </div>

                        <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar">
                          {visibleCountries.map((country) => (
                            <label
                              key={country}
                              className={`flex items-center cursor-pointer p-2 rounded-lg border transition-all duration-200 ${
                                selectedCountry === country
                                  ? "border-maroon bg-maroon/10 shadow-sm"
                                  : "border-gray-200 hover:border-maroon/50 hover:bg-maroon/5"
                              }`}
                            >
                              <div className="relative">
                                <input
                                  type="radio"
                                  name="country"
                                  checked={selectedCountry === country}
                                  onChange={() => handleCountryChange(country)}
                                  className="form-radio text-maroon border-2 border-gray-300 focus:ring-maroon transition-colors"
                                />
                              </div>
                              <span className="ml-3 text-sm font-medium text-gray-700">
                                {country}
                              </span>
                              {selectedCountry === country && (
                                <i className="fas fa-check-circle text-maroon ml-auto"></i>
                              )}
                            </label>
                          ))}
                        </div>

                        {countries.length > 10 && (
                          <button
                            className="w-full mt-3 text-center text-gold hover:text-gold/80 cursor-pointer font-medium text-sm border border-gold/30 rounded-lg py-2 hover:bg-gold/5 transition-all duration-200"
                            onClick={() =>
                              setShowAllCountries(!showAllCountries)
                            }
                          >
                            {showAllCountries ? (
                              <>
                                <i className="fas fa-chevron-up mr-2"></i>
                                Show Less Countries
                              </>
                            ) : (
                              <>
                                <i className="fas fa-chevron-down mr-2"></i>
                                Show All {countries.length} Countries
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    )}

                    {/* Quick Filters */}
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center">
                        <i className="fas fa-bolt text-gold mr-2"></i>
                        <h4 className="font-bold text-gray-800">
                          Quick Filters
                        </h4>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setPriceRange([0, 1000]);
                            fetchProducts();
                          }}
                          className="p-2 text-xs border border-gray-300 rounded-lg hover:border-gold hover:bg-gold/5 transition-all duration-200"
                        >
                          Under ₹1K
                        </button>
                        <button
                          onClick={() => {
                            setPriceRange([1000, 5000]);
                            fetchProducts();
                          }}
                          className="p-2 text-xs border border-gray-300 rounded-lg hover:border-gold hover:bg-gold/5 transition-all duration-200"
                        >
                          ₹1K - ₹5K
                        </button>
                        <button
                          onClick={() => {
                            setPriceRange([5000, 25000]);
                            fetchProducts();
                          }}
                          className="p-2 text-xs border border-gray-300 rounded-lg hover:border-gold hover:bg-gold/5 transition-all duration-200"
                        >
                          ₹5K - ₹25K
                        </button>
                        <button
                          onClick={() => {
                            setPriceRange([25000, 100000]);
                            fetchProducts();
                          }}
                          className="p-2 text-xs border border-gray-300 rounded-lg hover:border-gold hover:bg-gold/5 transition-all duration-200"
                        >
                          ₹25K+
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Enhanced Products Grid */}
              <div className="lg:w-3/4">
                {/* Enhanced Search Bar */}
                <div className="relative mb-8">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-2">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search for rare collectibles, coins, banknotes..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 text-lg border-0 focus:outline-none focus:ring-0 bg-transparent placeholder-gray-400"
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <i className="fas fa-search text-xl text-gold"></i>
                        </div>
                        {search && (
                          <button
                            onClick={() => setSearch("")}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Search Suggestions */}
                    {!search && (
                      <div className="px-6 pb-4">
                        <div className="flex flex-wrap gap-2">
                          <span className="text-sm text-gray-500 mr-2">
                            Popular:
                          </span>
                          {[
                            "Ancient Coins",
                            "Rare Notes",
                            "Silver Coins",
                            "Gold Coins",
                          ].map((suggestion) => (
                            <button
                              key={suggestion}
                              onClick={() => setSearch(suggestion)}
                              className="text-xs bg-gray-100 hover:bg-gold/10 hover:text-gold px-3 py-1 rounded-full transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Results Summary */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
                  <div className="flex flex-wrap items-center justify-between">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                      <div className="flex items-center">
                        <i className="fas fa-layer-group text-gold mr-2"></i>
                        <p className="text-gray-700 font-medium">
                          Showing{" "}
                          <span className="font-bold text-gold">
                            {Math.min(
                              (currentPage - 1) * itemsPerPage + 1,
                              productsMeta.total
                            )}
                            -
                            {Math.min(
                              currentPage * itemsPerPage,
                              productsMeta.total
                            )}
                          </span>{" "}
                          of{" "}
                          <span className="font-bold text-gold">
                            {productsMeta.total}
                          </span>{" "}
                          premium items
                        </p>
                      </div>

                      {/* Active Filters Preview */}
                      <div className="flex items-center space-x-2">
                        {(selectedCategories.length > 0 ||
                          selectedSubCategories.length > 0 ||
                          selectedContinent ||
                          selectedCountry) && (
                          <div className="flex items-center space-x-1">
                            <i className="fas fa-filter text-sm text-gray-400"></i>
                            <span className="text-sm text-gray-500">
                              {selectedCategories.length +
                                selectedSubCategories.length +
                                (selectedContinent ? 1 : 0) +
                                (selectedCountry ? 1 : 0)}{" "}
                              active
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Items Per Page */}
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600 font-medium">
                        Items per page:
                      </span>
                      <div className="flex items-center space-x-1">
                        {itemsPerPageOptions.map((count) => (
                          <button
                            key={count}
                            onClick={() => handleItemsPerPageChange(count)}
                            className={`px-4 py-2 text-sm border rounded-lg font-medium transition-all duration-200 ${
                              itemsPerPage === count
                                ? "bg-gold text-white border-gold shadow-md"
                                : "border-gray-300 hover:border-gold hover:text-gold hover:bg-gold/5"
                            }`}
                          >
                            {count}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Filter Tags */}
                  {(selectedCategories.length > 0 ||
                    selectedSubCategories.length > 0 ||
                    selectedContinent ||
                    selectedCountry) && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex flex-wrap gap-2">
                        {selectedCategories.map((category) => (
                          <span
                            key={category.id}
                            className="inline-flex items-center bg-gold/10 text-gold px-3 py-1 rounded-full text-sm"
                          >
                            <i className="fas fa-layer-group mr-1"></i>
                            {category.name}
                            <button
                              onClick={() => handleCategoryChange(category)}
                              className="ml-2 hover:text-gold/70"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </span>
                        ))}
                        {selectedSubCategories.map((subCategory) => (
                          <span
                            key={subCategory.id}
                            className="inline-flex items-center bg-maroon/10 text-maroon px-3 py-1 rounded-full text-sm"
                          >
                            <i className="fas fa-tags mr-1"></i>
                            {subCategory.name}
                            <button
                              onClick={() =>
                                handleSubCategoryChange(subCategory)
                              }
                              className="ml-2 hover:text-maroon/70"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </span>
                        ))}
                        {selectedContinent && (
                          <span className="inline-flex items-center bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">
                            <i className="fas fa-globe mr-1"></i>
                            {selectedContinent}
                            <button
                              onClick={() => {
                                setSelectedContinent("");
                                setSelectedCountry("");
                              }}
                              className="ml-2 hover:text-blue-500"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </span>
                        )}
                        {selectedCountry && (
                          <span className="inline-flex items-center bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm">
                            <i className="fas fa-flag mr-1"></i>
                            {selectedCountry}
                            <button
                              onClick={() => setSelectedCountry("")}
                              className="ml-2 hover:text-green-500"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {/* Enhanced Products Grid/List */}
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                    {products.map((data, index) => (
                      <div
                        key={data.id}
                        className="transform transition-all duration-300 hover:scale-105"
                        style={{
                          animationDelay: `${index * 50}ms`,
                        }}
                      >
                        <ProductCard
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
                            const productData = { ...data };
                            productData.quantity = 1;
                            dispatch(addItemsToCart(productData));
                            showToast(toast, "success", "Added to cart");
                          }}
                          isBirthdayNote={
                            data.SubCategory.name == "Birthday Notes"
                          }
                          showDateDialog={() => {
                            setSelectedProduct(data);
                            setDateDialogVisible(true);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6 mb-12">
                    {products.map((item, index) => (
                      <div
                        key={item.id}
                        className="transform transition-all duration-300 hover:scale-[1.02]"
                        style={{
                          animationDelay: `${index * 100}ms`,
                        }}
                      >
                        <HorizontalProductCard
                          productId={item.id}
                          name={item.name}
                          description={item.description}
                          imageUrl={item.images[0]}
                          tag={item.tags[0]}
                          category={item.Category}
                          subCategory={item.SubCategory}
                          price={item.sellingPrice}
                          addToCart={() => {
                            const productData = { ...item };
                            productData.birthdayDate = null;
                            productData.quantity = 1;
                            dispatch(addItemsToCart(productData));
                            showToast(toast, "success", "Added to cart");
                          }}
                          isBirthdayNote={
                            item.SubCategory.name == "Birthday Notes"
                          }
                          showDateDialog={() => {
                            setSelectedProduct(item);
                            setDateDialogVisible(true);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* No Results State */}
                {products.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                    <div className="mb-6">
                      <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4">
                        <i className="fas fa-search text-3xl text-gray-400"></i>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">
                      No Items Found
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      We couldn't find any items matching your criteria. Try
                      adjusting your filters or search terms.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <button
                        onClick={handleFilterClearAll}
                        className="bg-gold hover:bg-gold/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        <i className="fas fa-refresh mr-2"></i>
                        Clear All Filters
                      </button>
                      <button
                        onClick={() => navigate("/collections")}
                        className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        <i className="fas fa-arrow-left mr-2"></i>
                        Browse All
                      </button>
                    </div>
                  </div>
                )}

                {/* Enhanced Pagination */}
                {products.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                      <div className="flex items-center space-x-4">
                        <p className="text-sm text-gray-600 font-medium">
                          Page{" "}
                          <span className="font-bold text-gold">
                            {currentPage}
                          </span>{" "}
                          of{" "}
                          <span className="font-bold text-gold">
                            {totalPages}
                          </span>
                        </p>
                        <div className="hidden md:flex items-center text-xs text-gray-500">
                          <i className="fas fa-info-circle mr-1"></i>
                          <span>{productsMeta.total} total items</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setCurrentPage(Math.max(1, currentPage - 1));
                          }}
                          disabled={currentPage === 1}
                          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-200 font-medium"
                        >
                          <i className="fas fa-chevron-left mr-2"></i>
                          Previous
                        </button>

                        <div className="flex items-center space-x-1">
                          {getPaginationRange().map((page) => (
                            <button
                              key={page}
                              onClick={() => {
                                setCurrentPage(page);
                              }}
                              className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                                currentPage === page
                                  ? "bg-gold text-white shadow-lg"
                                  : "hover:bg-gray-100 text-gray-600"
                              } cursor-pointer`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => {
                            setCurrentPage(
                              Math.min(totalPages, currentPage + 1)
                            );
                          }}
                          disabled={currentPage === totalPages}
                          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-200 font-medium"
                        >
                          Next
                          <i className="fas fa-chevron-right ml-2"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col space-y-4">
        {/* Back to Top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-14 h-14 bg-gradient-to-br from-gold to-gold/90 hover:from-gold/90 hover:to-gold text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
        >
          <i className="fas fa-chevron-up transition-transform duration-300 group-hover:-translate-y-1"></i>
        </button>

        {/* Filter Toggle for Mobile */}
        <button
          onClick={() => {
            // Add mobile filter toggle logic here
            document
              .querySelector(".lg\\:w-1\\/4")
              .scrollIntoView({ behavior: "smooth" });
          }}
          className="w-14 h-14 bg-white hover:bg-gray-50 text-gold border border-gold/30 hover:border-gold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group lg:hidden"
        >
          <i className="fas fa-filter transition-transform duration-300 group-hover:rotate-12"></i>
        </button>

        {/* Quick Search */}
        <button
          onClick={() => {
            document.querySelector('input[placeholder*="Search"]').focus();
          }}
          className="w-14 h-14 bg-maroon hover:bg-maroon/90 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
        >
          <i className="fas fa-search transition-transform duration-300 group-hover:scale-110"></i>
        </button>
      </div>

      {/* Enhanced Date Picker Dialog */}
      {dateDialogVisible && (
        <BirthdayDatePickerDialog
          onSubmit={() => {
            if (selectedDate) {
              selectedProduct.birthdayDate = selectedDate;
              selectedProduct.quantity = 1;
              dispatch(addItemsToCart(selectedProduct));
              setDateDialogVisible(false);
              setSelectedProduct(null);
              showToast(toast, "success", "Added to cart");
            }
          }}
          onCancel={() => {
            setDateDialogVisible(false);
            setSelectedProduct(null);
          }}
          onDateChange={(date) => setSelectedDate(date)}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProductsPage;
