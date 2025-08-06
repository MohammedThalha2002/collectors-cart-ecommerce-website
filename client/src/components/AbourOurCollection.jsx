import aboutUsCover from "../assets/images/about-us-cover.jpg";

function AbourOurCollection() {
  return (
    <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-yellow-400/5 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-900/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mr-4 shadow-xl">
              <i className="fas fa-archive text-white text-xl"></i>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-2 text-gray-800">
                About Our Collection
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-red-900 mx-auto"></div>
            </div>
          </div>
        </div>{" "}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-900 to-red-800 rounded-full flex items-center justify-center mr-4">
                <i className="fas fa-history text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Our Legacy</h3>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed text-lg">
              For over{" "}
              <span className="font-semibold text-yellow-600">3 years</span>, we
              have been dedicated to preserving history through our meticulously
              curated collection of rare and valuable artifacts. Each item in
              our inventory has been carefully authenticated by industry-leading
              experts and comes with detailed provenance documentation.
            </p>

            <p className="text-gray-700 mb-8 leading-relaxed text-lg">
              Our commitment to authenticity and preservation has made us the
              trusted source for collectors, museums, and investors worldwide.
              We pride ourselves on offering only the finest specimens with
              verified histories and exceptional condition.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white mr-3">
                    <i className="fas fa-certificate"></i>
                  </div>
                  <h4 className="font-bold text-gray-800">
                    Expert Authentication
                  </h4>
                </div>
                <p className="text-sm text-gray-600">
                  Every item professionally verified and graded
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <h4 className="font-bold text-gray-800">
                    Secure Transactions
                  </h4>
                </div>
                <p className="text-sm text-gray-600">
                  100% secure payments with buyer protection
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white mr-3">
                    <i className="fas fa-shipping-fast"></i>
                  </div>
                  <h4 className="font-bold text-gray-800">Premium Shipping</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Insured delivery available across India
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white mr-3">
                    <i className="fas fa-user-tie"></i>
                  </div>
                  <h4 className="font-bold text-gray-800">
                    Expert Consultation
                  </h4>
                </div>
                <p className="text-sm text-gray-600">
                  Personal guidance from numismatic experts
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 to-red-900 rounded-2xl blur opacity-20"></div>
            <div className="relative">
              <img
                src={aboutUsCover}
                alt="Our Premium Collection Showcase"
                className="w-full h-auto rounded-2xl shadow-2xl border border-gray-200"
              />

              {/* Enhanced Stats Card */}
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-2xl border border-gray-100">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mr-2">
                        <i className="fas fa-calendar text-white text-xs"></i>
                      </div>
                      <div className="text-3xl font-bold text-yellow-600">
                        3+
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                      Years of Excellence
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-900 to-red-800 rounded-full flex items-center justify-center mr-2">
                        <i className="fas fa-gem text-white text-xs"></i>
                      </div>
                      <div className="text-3xl font-bold text-red-900">5K+</div>
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                      Premium Items
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <i className="fas fa-star text-yellow-400 mr-1"></i>
                    <span className="font-semibold">
                      Trusted by 10,000+ Collectors
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AbourOurCollection;
