import axios from "axios";
import { useEffect, useState } from "react";

function AboutUs() {
  const [videoUrl, setVideoUrl] = useState(
    "https://www.youtube.com/embed/zFQ64x1lhSU"
  );

  useEffect(() => {
    axios.get(import.meta.env.VITE_API_URL + "/videobanner").then((res) => {
      if (res.data && res.data.url) {
        setVideoUrl(res.data.url);
      }
    });
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-red-900/5 py-20 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-900/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-yellow-400/5 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>

      <div className="container px-4 mx-auto max-w-screen-xl relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-900 to-red-800 rounded-full flex items-center justify-center mr-4 shadow-xl">
              <i className="fas fa-users text-white text-xl"></i>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-2 text-gray-800">
                Who Are We?
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-red-900 to-yellow-400 mx-auto"></div>
            </div>
          </div>
        </div>{" "}
        <div className="flex flex-col gap-16 items-center lg:grid lg:grid-cols-2 lg:gap-20">
          <div className="font-light sm:text-lg text-center lg:text-left">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-store text-white"></i>
                </div>
                <div className="text-2xl font-serif font-bold text-maroon">
                  <span className="text-gold">Collectors</span>Cart
                </div>
              </div>

              <p className="mb-6 text-gray-700 leading-relaxed text-lg">
                Welcome to <span className="font-bold">CollectorsCart</span>,
                your premier destination for rare and unique coins and notes.
                With our extensive collection and expert curation, we strive to
                offer collectors and enthusiasts a wide range of high-quality
                items to enhance their collections.
              </p>

              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                Make sure to check out our YouTube channel, where we share
                insightful videos about coin and note collecting, tips for
                identifying valuable pieces, and updates on the latest additions
                to our inventory.
              </p>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-certificate text-green-600"></i>
                  </div>
                  <div className="font-bold text-gray-800">Certified</div>
                  <div className="text-sm text-gray-600">
                    Expert Authentication
                  </div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-clock text-blue-600"></i>
                  </div>
                  <div className="font-bold text-gray-800">5+ Years</div>
                  <div className="text-sm text-gray-600">
                    Industry Experience
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full mx-auto lg:w-auto flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 to-red-900 rounded-2xl blur opacity-20"></div>
              <div className="relative bg-white p-4 rounded-2xl shadow-xl">
                <iframe
                  src={videoUrl}
                  allow="autoplay; encrypted-media"
                  title="COIN n NOTE Introduction Video"
                  className="w-full h-[280px] lg:w-[500px] lg:h-[315px] rounded-xl"
                />
                <div className="absolute top-6 left-6 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  <i className="fas fa-play mr-1"></i>
                  LIVE
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Additional Info Section */}
        <div className="mt-20 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Why Choose Us?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <i className="fas fa-medal text-white text-xl"></i>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">
                  Premium Quality
                </h4>
                <p className="text-gray-600 text-sm">
                  Every item is carefully authenticated and graded by our expert
                  team
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-900 to-red-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <i className="fas fa-globe text-white text-xl"></i>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">
                  Global Collection
                </h4>
                <p className="text-gray-600 text-sm">
                  Rare pieces sourced from over 50 countries worldwide
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <i className="fas fa-handshake text-white text-xl"></i>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">
                  Trusted Service
                </h4>
                <p className="text-gray-600 text-sm">
                  Thousands of satisfied collectors trust our expertise
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
