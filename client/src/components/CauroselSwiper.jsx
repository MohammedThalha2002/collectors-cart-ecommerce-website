import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../styles/carousel-animations.css";
import {
  getBestSeller,
  getDealOfTheDay,
  getNewArrival,
} from "../services/getProducts";
import { useNavigate } from "react-router-dom";

function CauroselSwiper() {
  const [dealOfTheDay, setDealOfTheDay] = useState(null);
  const [bestSeller, setBestSeller] = useState(null);
  const [newArrival, setNewArrival] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      setIsLoading(true);
      const [dealOfTheDayRes, bestSellerRes, newArrivalRes] = await Promise.all(
        [getDealOfTheDay(), getBestSeller(1), getNewArrival()]
      );

      setDealOfTheDay(dealOfTheDayRes);
      setBestSeller(bestSellerRes[0]);
      setNewArrival(newArrivalRes);
    } catch (error) {
      console.error("Error fetching carousel data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Loading skeleton component
  if (isLoading) {
    return (
      <section className="relative overflow-hidden">
        <div className="h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-white text-xl font-semibold mb-2">
              Loading Amazing Collections...
            </h3>
            <p className="text-white/70">Preparing your visual journey</p>
          </div>

          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-20 w-2 h-2 bg-gold/50 rounded-full animate-ping"></div>
            <div className="absolute top-40 right-32 w-1 h-1 bg-white/50 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute bottom-32 left-16 w-1.5 h-1.5 bg-gold/30 rounded-full animate-ping delay-500"></div>
            <div className="absolute bottom-20 right-20 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-1500"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden">
      {/* Background overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/20 z-10 pointer-events-none"></div>

      <Swiper
        modules={[Pagination, Autoplay, Navigation]}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          renderBullet: function (index, className) {
            return (
              '<span class="' +
              className +
              ' !bg-white/70 !w-3 !h-3 hover:!bg-white transition-all duration-300"></span>'
            );
          },
        }}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
          waitForTransition: false,
          stopOnLastSlide: false,
        }}
        loop={true}
        speed={800}
        effect="slide"
        watchSlidesProgress={true}
        className="h-[400px] md:h-[500px] lg:h-[600px] group"
      >
        <SwiperSlide>
          <div className="relative h-full w-full overflow-hidden group">
            <div
              className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-[3000ms] ease-out"
              style={{
                backgroundImage: `url('${
                  import.meta.env.VITE_IMAGE_URL + dealOfTheDay?.images[0]
                }')`,
              }}
            >
              {/* Enhanced gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

              {/* Animated particles overlay */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-20 left-20 w-2 h-2 bg-gold rounded-full animate-pulse"></div>
                <div className="absolute top-40 right-32 w-1 h-1 bg-white rounded-full animate-ping delay-1000"></div>
                <div className="absolute bottom-32 left-16 w-1.5 h-1.5 bg-gold/70 rounded-full animate-pulse delay-500"></div>
                <div className="absolute bottom-20 right-20 w-1 h-1 bg-white/70 rounded-full animate-ping delay-1500"></div>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center z-20">
              <div className="container mx-auto px-6 md:px-12 lg:px-16">
                <div className="max-w-2xl">
                  {/* Enhanced badge */}
                  <div className="inline-flex items-center px-4 py-2 mb-6 bg-gradient-to-r from-gold via-yellow-400 to-gold text-black text-sm font-bold rounded-full shadow-lg transform animate-bounce-subtle">
                    <i className="fas fa-fire mr-2 text-red-500"></i>
                    Deal of the Day
                    <div className="absolute inset-0 bg-gradient-to-r from-gold to-yellow-400 rounded-full blur opacity-30 animate-pulse"></div>
                  </div>

                  {/* Enhanced title */}
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4 leading-tight transform animate-fade-in-up">
                    <span className="bg-gradient-to-r from-white via-gray-100 to-gold bg-clip-text text-transparent">
                      {dealOfTheDay?.name}
                    </span>
                  </h1>

                  {/* Enhanced description */}
                  <p className="text-base md:text-lg text-white/90 mb-6 leading-relaxed transform animate-fade-in-up delay-200 max-w-xl">
                    {dealOfTheDay?.description}
                  </p>

                  {/* Enhanced CTA button */}
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() =>
                        navigate(`/collections/${dealOfTheDay?.id}`)
                      }
                      className="group relative px-8 py-4 bg-gradient-to-r from-gold to-yellow-500 text-black font-bold rounded-full shadow-2xl hover:shadow-gold/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 animate-fade-in-up delay-300"
                    >
                      <span className="relative z-10 flex items-center">
                        View Collection
                        <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-200"></i>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>

                    {dealOfTheDay?.originalPrice && (
                      <div className="text-white animate-fade-in-up delay-400">
                        <div className="text-sm opacity-75 line-through">
                          ${dealOfTheDay.originalPrice}
                        </div>
                        <div className="text-xl font-bold text-gold">
                          ${dealOfTheDay.price}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative h-full w-full overflow-hidden group">
            <div
              className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-[3000ms] ease-out"
              style={{
                backgroundImage: `url('${
                  import.meta.env.VITE_IMAGE_URL + bestSeller?.images[0]
                }')`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

              {/* Premium seller particles */}
              <div className="absolute inset-0 opacity-40">
                <div className="absolute top-16 right-24 w-3 h-3 bg-amber-400 rounded-full animate-pulse delay-300"></div>
                <div className="absolute top-32 left-28 w-1 h-1 bg-blue-300 rounded-full animate-ping delay-700"></div>
                <div className="absolute bottom-40 right-16 w-2 h-2 bg-amber-300/80 rounded-full animate-pulse delay-1200"></div>
                <div className="absolute bottom-24 left-24 w-1.5 h-1.5 bg-blue-200/60 rounded-full animate-ping delay-900"></div>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center z-20">
              <div className="container mx-auto px-6 md:px-12 lg:px-16">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center px-4 py-2 mb-6 bg-gradient-to-r from-amber-500 via-orange-400 to-red-500 text-white text-sm font-bold rounded-full shadow-lg transform animate-bounce-subtle">
                    <i className="fas fa-crown mr-2 text-yellow-200"></i>
                    Best Seller
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-red-400 rounded-full blur opacity-40 animate-pulse"></div>
                  </div>

                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4 leading-tight transform animate-fade-in-up">
                    <span className="bg-gradient-to-r from-white via-amber-200 to-orange-300 bg-clip-text text-transparent">
                      {bestSeller?.name}
                    </span>
                  </h1>

                  <p className="text-base md:text-lg text-white/90 mb-6 leading-relaxed transform animate-fade-in-up delay-200 max-w-xl">
                    {bestSeller?.description}
                  </p>

                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => navigate(`/collections/${bestSeller?.id}`)}
                      className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold rounded-full shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 animate-fade-in-up delay-300"
                    >
                      <span className="relative z-10 flex items-center">
                        Explore Now
                        <i className="fas fa-star ml-2 group-hover:rotate-12 transition-transform duration-200"></i>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>

                    <div className="flex items-center text-white animate-fade-in-up delay-400">
                      <i className="fas fa-fire text-orange-400 mr-1"></i>
                      <span className="text-sm font-medium">Trending</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative h-full w-full overflow-hidden group">
            <div
              className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-[3000ms] ease-out"
              style={{
                backgroundImage: `url('${
                  import.meta.env.VITE_IMAGE_URL + newArrival?.images[0]
                }')`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

              {/* New arrival sparkles */}
              <div className="absolute inset-0 opacity-50">
                <div className="absolute top-24 left-32 w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-200"></div>
                <div className="absolute top-36 right-28 w-1 h-1 bg-white rounded-full animate-ping delay-800"></div>
                <div className="absolute bottom-36 left-20 w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse delay-600"></div>
                <div className="absolute bottom-28 right-32 w-1 h-1 bg-white/80 rounded-full animate-ping delay-400"></div>
                <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-emerald-400 rounded-full animate-ping delay-1100"></div>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center z-20">
              <div className="container mx-auto px-6 md:px-12 lg:px-16">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center px-4 py-2 mb-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white text-sm font-bold rounded-full shadow-lg transform animate-bounce-subtle">
                    <i className="fas fa-sparkles mr-2 text-yellow-300"></i>
                    New Arrival
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full blur opacity-40 animate-pulse"></div>
                  </div>

                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4 leading-tight transform animate-fade-in-up">
                    <span className="bg-gradient-to-r from-white via-emerald-200 to-cyan-300 bg-clip-text text-transparent">
                      {newArrival?.name}
                    </span>
                  </h1>

                  <p className="text-base md:text-lg text-white/90 mb-6 leading-relaxed transform animate-fade-in-up delay-200 max-w-xl">
                    {newArrival?.description}
                  </p>

                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => navigate(`/collections/${newArrival?.id}`)}
                      className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-full shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 animate-fade-in-up delay-300"
                    >
                      <span className="relative z-10 flex items-center">
                        Discover More
                        <i className="fas fa-magic ml-2 group-hover:rotate-12 transition-transform duration-200"></i>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>

                    <div className="flex items-center text-white animate-fade-in-up delay-400">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping mr-2"></div>
                      <span className="text-sm font-medium">Just Launched</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      {/* Custom Navigation Buttons */}
      <div className="swiper-button-prev-custom absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-all duration-300 group opacity-0 group-hover:opacity-100">
        <i className="fas fa-chevron-left text-white text-lg md:text-xl group-hover:scale-110 transition-transform duration-200"></i>
      </div>

      <div className="swiper-button-next-custom absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-all duration-300 group opacity-0 group-hover:opacity-100">
        <i className="fas fa-chevron-right text-white text-lg md:text-xl group-hover:scale-110 transition-transform duration-200"></i>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-32 h-1 bg-white/30 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-gold to-yellow-400 rounded-full animate-progress"></div>
      </div>
    </section>
  );
}

export default CauroselSwiper;
