import React, { useState } from "react";
import { toast } from "react-toastify";
import { changePassword } from "../../services/profileService";
import { showToast } from "../shared/others/showToast";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    if (!formData.currentPassword) {
      showToast(toast, "error", "Current password is required");
      return false;
    }

    if (!formData.newPassword) {
      showToast(toast, "error", "New password is required");
      return false;
    }

    if (formData.newPassword.length < 6) {
      showToast(
        toast,
        "error",
        "New password must be at least 6 characters long"
      );
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showToast(toast, "error", "New passwords do not match");
      return false;
    }

    if (formData.currentPassword === formData.newPassword) {
      showToast(
        toast,
        "error",
        "New password must be different from current password"
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      showToast(toast, "success", "Password changed successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      showToast(
        toast,
        "error",
        error.error?.message || "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: "", color: "" };

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength, text: "Weak", color: "text-red-500" };
    if (strength <= 4)
      return { strength, text: "Medium", color: "text-yellow-500" };
    return { strength, text: "Strong", color: "text-green-500" };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Change Password
          </h2>
          <p className="text-gray-600">
            Update your account password for better security
          </p>
        </div>
        <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
          <i className="fas fa-lock text-white text-2xl"></i>
        </div>
      </div>

      {/* Security Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
          <i className="fas fa-shield-alt text-blue-600 mr-2"></i>
          Password Security Tips
        </h3>
        <ul className="text-blue-700 space-y-2 text-sm">
          <li className="flex items-start">
            <i className="fas fa-check text-blue-600 mr-2 mt-0.5"></i>
            Use at least 8 characters
          </li>
          <li className="flex items-start">
            <i className="fas fa-check text-blue-600 mr-2 mt-0.5"></i>
            Include uppercase and lowercase letters
          </li>
          <li className="flex items-start">
            <i className="fas fa-check text-blue-600 mr-2 mt-0.5"></i>
            Add numbers and special characters
          </li>
          <li className="flex items-start">
            <i className="fas fa-check text-blue-600 mr-2 mt-0.5"></i>
            Avoid common words or personal information
          </li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
          {/* Current Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password *
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors"
                placeholder="Enter your current password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <i
                  className={`fas ${
                    showPasswords.current ? "fa-eye-slash" : "fa-eye"
                  }`}
                ></i>
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password *
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-colors"
                placeholder="Enter your new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <i
                  className={`fas ${
                    showPasswords.new ? "fa-eye-slash" : "fa-eye"
                  }`}
                ></i>
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">
                    Password Strength:
                  </span>
                  <span
                    className={`text-xs font-medium ${passwordStrength.color}`}
                  >
                    {passwordStrength.text}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength.strength <= 2
                        ? "bg-red-500"
                        : passwordStrength.strength <= 4
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{
                      width: `${(passwordStrength.strength / 6) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password *
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  formData.confirmPassword &&
                  formData.newPassword !== formData.confirmPassword
                    ? "border-red-300 focus:ring-red-500/50 focus:border-red-500"
                    : "border-gray-300 focus:ring-green-500/50 focus:border-green-500"
                }`}
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <i
                  className={`fas ${
                    showPasswords.confirm ? "fa-eye-slash" : "fa-eye"
                  }`}
                ></i>
              </button>
            </div>

            {/* Password Match Indicator */}
            {formData.confirmPassword && (
              <div className="mt-2 flex items-center">
                <i
                  className={`fas text-sm mr-2 ${
                    formData.newPassword === formData.confirmPassword
                      ? "fa-check-circle text-green-500"
                      : "fa-times-circle text-red-500"
                  }`}
                ></i>
                <span
                  className={`text-xs ${
                    formData.newPassword === formData.confirmPassword
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formData.newPassword === formData.confirmPassword
                    ? "Passwords match"
                    : "Passwords do not match"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Changing Password...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <i className="fas fa-key mr-2"></i>
                Change Password
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
              });
              setShowPasswords({
                current: false,
                new: false,
                confirm: false,
              });
            }}
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

export default ChangePassword;
