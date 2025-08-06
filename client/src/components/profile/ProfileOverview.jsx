import React from "react";

const ProfileOverview = ({ userProfile }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Profile Overview
          </h2>
          <p className="text-gray-600">Your account information and details</p>
        </div>
        <div className="w-20 h-20 bg-gradient-to-br from-gold to-gold/80 rounded-full flex items-center justify-center shadow-lg">
          <i className="fas fa-user text-white text-2xl"></i>
        </div>
      </div>

      <div className="">
        {/* Personal Information */}
        <div className="bg-gradient-to-br from-gold/5 to-maroon/5 rounded-xl p-6 border border-gold/20">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <i className="fas fa-user-circle text-gold mr-3"></i>
            Personal Information
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Full Name:</span>
              <span className="text-gray-800 font-semibold">
                {userProfile?.name || "Not specified"}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Email:</span>
              <span className="text-gray-800 font-semibold">
                {userProfile?.email}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Phone:</span>
              <span className="text-gray-800 font-semibold">
                {userProfile?.phone || "Not specified"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Created */}
      <div className="mt-8 text-center">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-gray-600">
            <i className="fas fa-calendar-alt text-gold mr-2"></i>
            Member since {formatDate(userProfile?.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
