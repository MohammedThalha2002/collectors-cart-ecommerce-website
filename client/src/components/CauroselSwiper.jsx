import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
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

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    const dealOfTheDayRes = await getDealOfTheDay();
    setDealOfTheDay(dealOfTheDayRes);
    const bestSellerRes = await getBestSeller(1);
    setBestSeller(bestSellerRes[0]);
    const newArrivalRes = await getNewArrival();
    setNewArrival(newArrivalRes);
  }

  return (
    <section className="relative">
      <Swiper
        modules={[Pagination, Autoplay, Navigation]}
        pagination={{ clickable: true }}
        navigation
        autoplay={{ delay: 5000 }}
        loop
        className="h-[500px] md:h-[600px]"
        style={{
          "--swiper-navigation-color": "#ffffff",
          "--swiper-pagination-color": "#ffffff",
          "--swiper-navigation-size": "20px",
          "--swiper-pagination-size": "10px",
        }}
      >
        <SwiperSlide>
          <div className="relative h-full w-full overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('${
                  import.meta.env.VITE_IMAGE_URL + dealOfTheDay?.images[0]
                }')`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent"></div>
            </div>
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-6 md:px-12">
                <div className="max-w-lg">
                  <span className="inline-block px-3 py-1 mb-4 bg-gold text-white text-xs font-semibold rounded-lg whitespace-nowrap">
                    Deal of the Day
                  </span>
                  <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
                    {dealOfTheDay?.name}
                  </h1>
                  <p className="text-white/90 mb-6">
                    {dealOfTheDay?.description}
                  </p>
                  <button
                    onClick={() => navigate(`/collections/${dealOfTheDay?.id}`)}
                    className="px-6 py-3 bg-gold text-white hover:bg-gold/90 transition-colors rounded-lg whitespace-nowrap cursor-pointer"
                  >
                    View Collection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative h-full w-full overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('${
                  import.meta.env.VITE_IMAGE_URL + bestSeller?.images[0]
                }')`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent"></div>
            </div>
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-6 md:px-12">
                <div className="max-w-lg">
                  <span className="inline-block px-3 py-1 mb-4 bg-gold text-white text-xs font-semibold rounded-lg whitespace-nowrap">
                    Best Seller
                  </span>
                  <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
                    {bestSeller?.name}
                  </h1>
                  <p className="text-white/90 mb-6">
                    {bestSeller?.description}
                  </p>
                  <button
                    onClick={() => navigate(`/collections/${bestSeller?.id}`)}
                    className="px-6 py-3 bg-gold text-white hover:bg-gold/90 transition-colors rounded-lg whitespace-nowrap cursor-pointer"
                  >
                    Explore Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative h-full w-full overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('${
                  import.meta.env.VITE_IMAGE_URL + newArrival?.images[0]
                }')`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent"></div>
            </div>
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-6 md:px-12">
                <div className="max-w-lg">
                  <span className="inline-block px-3 py-1 mb-4 bg-gold text-white text-xs font-semibold rounded-lg whitespace-nowrap">
                    New Arrival
                  </span>
                  <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
                    {newArrival?.name}
                  </h1>
                  <p className="text-white/90 mb-6">
                    {newArrival?.description}
                  </p>
                  <button
                    onClick={() => navigate(`/collections/${newArrival?.id}`)}
                    className="px-6 py-3 bg-gold text-white hover:bg-gold/90 transition-colors rounded-lg whitespace-nowrap cursor-pointer"
                  >
                    Discover More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
}

export default CauroselSwiper;
