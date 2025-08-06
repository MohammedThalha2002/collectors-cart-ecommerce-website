import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/shared/navbar/NavBar";
import Footer from "../components/shared/Footer";
import ScrollToTop from "../components/shared/others/ScrollToTop";
import { toast, ToastContainer } from "react-toastify";
import ProfileOverview from "../components/profile/ProfileOverview";
import EditProfile from "../components/profile/EditProfile";
import ChangePassword from "../components/profile/ChangePassword";
import MyOrders from "../components/profile/MyOrders";
import MyWishlist from "../components/profile/MyWishlist";
import { getUserProfile } from "../services/profileService";
import { showToast } from "../components/shared/others/showToast";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const tabs = [
    { id: "overview", label: "Overview", icon: "fas fa-user" },
    { id: "edit", label: "Edit Profile", icon: "fas fa-edit" },
    { id: "password", label: "Change Password", icon: "fas fa-lock" },
    { id: "orders", label: "My Orders", icon: "fas fa-shopping-bag" },
    { id: "wishlist", label: "My Wishlist", icon: "fas fa-heart" },
  ];

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("jwt-token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchUserProfile();
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const profileData = await getUserProfile();
      setUserProfile(profileData);
    } catch (error) {
      console.error("Error fetching profile:", error);
      showToast(
        toast,
        "error",
        error.error?.message || "Failed to load profile"
      );
      if (error.status === 401) {
        localStorage.removeItem("jwt-token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedProfile) => {
    setUserProfile(updatedProfile);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold/30 border-t-gold mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <ProfileOverview userProfile={userProfile} />;
      case "edit":
        return (
          <EditProfile
            userProfile={userProfile}
            onProfileUpdate={handleProfileUpdate}
          />
        );
      case "password":
        return <ChangePassword />;
      case "orders":
        return <MyOrders />;
      case "wishlist":
        return <MyWishlist />;
      default:
        return <ProfileOverview userProfile={userProfile} />;
    }
  };

  return (
    <div className="min-h-screen bg-ivory text-gray-800 font-sans">
      <ScrollToTop />
      <ToastContainer />
      <NavBar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gold/20 via-ivory to-maroon/10 py-16 shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="inline-block mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-gold to-gold/80 rounded-full flex items-center justify-center shadow-lg">
                <i className="fas fa-user text-white text-2xl"></i>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              My Profile
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Manage your account, view orders, and personalize your collecting
              experience
            </p>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-4">
                <div className="bg-gradient-to-r from-gold/10 to-maroon/10 p-6 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <i className="fas fa-user text-white"></i>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-gray-800 truncate text-sm">
                        {userProfile?.email || "User"}
                      </h3>
                      <p className="text-sm text-gray-600">Premium Member</p>
                    </div>
                  </div>
                </div>

                <nav className="p-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 mb-1 ${
                        activeTab === tab.id
                          ? "bg-gold text-white shadow-md"
                          : "text-gray-700 hover:bg-gold/5 hover:text-gold"
                      }`}
                    >
                      <i className={`${tab.icon} mr-3 text-sm`}></i>
                      <span className="font-medium">{tab.label}</span>
                      {activeTab === tab.id && (
                        <i className="fas fa-chevron-right ml-auto"></i>
                      )}
                    </button>
                  ))}
                </nav>

                {/* Quick Actions */}
                <div className="p-4 border-t border-gray-100">
                  <button
                    onClick={() => navigate("/collections")}
                    className="w-full text-white bg-gradient-to-r from-maroon to-maroon/90 py-2 px-4 rounded-lg font-medium transition-all duration-300 hover:shadow-lg text-sm"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProfilePage;
