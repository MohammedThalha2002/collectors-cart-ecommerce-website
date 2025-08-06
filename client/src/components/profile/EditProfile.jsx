import React, { useState } from "react";
import { toast } from "react-toastify";
import { updateUserProfile } from "../../services/profileService";
import { showToast } from "../shared/others/showToast";

const EditProfile = ({ userProfile, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    name: userProfile?.name || "",
    phone: userProfile?.phone || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await updateUserProfile(formData);
      onProfileUpdate(response.user);
      showToast(toast, "success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast(
        toast,
        "error",
        error.error?.message || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Edit Profile
          </h2>
          <p className="text-gray-600">Update your personal information</p>
        </div>
        <div className="w-20 h-20 bg-gradient-to-br from-gold to-gold/80 rounded-full flex items-center justify-center shadow-lg">
          <i className="fas fa-edit text-white text-2xl"></i>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information Section */}
        <div className="bg-gradient-to-br from-gold/5 to-maroon/5 rounded-xl p-6 border border-gold/20">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <i className="fas fa-user text-gold mr-3"></i>
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors"
                placeholder="Enter your phone number"
              />
            </div>
          </div>
        </div>

        {/* Email Information (Read-only) */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <i className="fas fa-envelope text-gray-600 mr-3"></i>
            Email Information
          </h3>
          <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <p className="text-gray-800 font-semibold">
                {userProfile?.email}
              </p>
            </div>
            <div className="flex items-center text-green-600">
              <i className="fas fa-check-circle mr-2"></i>
              <span className="text-sm font-medium">Verified</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            <i className="fas fa-info-circle mr-1"></i>
            Email address cannot be changed. Contact support if you need to
            update your email.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-gold to-gold/90 hover:from-gold/90 hover:to-gold text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Updating...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <i className="fas fa-save mr-2"></i>
                Update Profile
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              setFormData({
                name: userProfile?.name || "",
                phone: userProfile?.phone || "",
              })
            }
            className="flex-1 sm:flex-none bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-4 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            <i className="fas fa-undo mr-2"></i>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
