import React, { useState } from "react";
import { showToast } from "./shared/others/showToast";
import { toast } from "react-toastify";
import axios from "axios";

function NewsLetter() {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    axios
      .post(import.meta.env.VITE_API_URL + "/subscribe", { email })
      .then((res) => {
        showToast(toast, "success", "Subscribed successfully!");
      })
      .catch((error) => {
        showToast(
          toast,
          "error",
          error?.response?.data?.message || "Subscription failed"
        );
      });

    setEmail("");
  };

  return (
    <section className="py-20 bg-gradient-to-br from-red-900 via-red-800 to-red-700 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-6"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 shadow-xl">
              <i className="fas fa-envelope text-yellow-400 text-xl"></i>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-2">
                Join Our Collector's Circle
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-white mx-auto"></div>
            </div>
          </div>

          <p className="mb-10 opacity-90 text-lg leading-relaxed max-w-2xl mx-auto">
            Subscribe to our exclusive newsletter for first access to rare
            finds, expert market insights, authentication tips, and special
            collector discounts.
          </p>

          {/* Enhanced Subscription Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl max-w-2xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 rounded-xl focus:outline-none text-gray-800 border-2 border-transparent focus:border-yellow-400 transition-all duration-200 text-lg shadow-lg"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <i className="fas fa-envelope text-gray-400"></i>
                </div>
              </div>
              <button
                onClick={handleSubscribe}
                disabled={!email.trim()}
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 rounded-xl whitespace-nowrap cursor-pointer font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <i className="fas fa-paper-plane mr-2"></i>
                Subscribe Now
              </button>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-star text-yellow-400"></i>
              </div>
              <h4 className="font-bold mb-2">Exclusive Access</h4>
              <p className="text-sm opacity-90">
                First look at rare acquisitions and private collections
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-brain text-yellow-400"></i>
              </div>
              <h4 className="font-bold mb-2">Expert Insights</h4>
              <p className="text-sm opacity-90">
                Market trends and authentication tips from professionals
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-percentage text-yellow-400"></i>
              </div>
              <h4 className="font-bold mb-2">Special Offers</h4>
              <p className="text-sm opacity-90">
                Subscriber-only discounts and early bird pricing
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-6 text-sm opacity-75">
            <div className="flex items-center">
              <i className="fas fa-shield-alt text-yellow-400 mr-2"></i>
              <span>Privacy Protected</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-times-circle text-yellow-400 mr-2"></i>
              <span>Unsubscribe Anytime</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-users text-yellow-400 mr-2"></i>
              <span>10K+ Subscribers</span>
            </div>
          </div>

          <p className="mt-6 text-sm opacity-75 max-w-lg mx-auto">
            By subscribing, you agree to our Privacy Policy and consent to
            receive updates from our company. No spam, just valuable insights.
          </p>
        </div>
      </div>
    </section>
  );
}

export default NewsLetter;
