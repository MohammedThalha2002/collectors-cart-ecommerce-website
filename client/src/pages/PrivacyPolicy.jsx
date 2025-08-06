import React from "react";
import NavBar from "../components/shared/navbar/NavBar";
import Footer from "../components/shared/Footer";
import ScrollToTop from "../components/shared/others/ScrollToTop";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">
    <ScrollToTop />
    <NavBar />
    <main className="flex-grow container mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gold mb-6">Privacy Policy</h1>
        <p className="mb-4">
          CollectorsCart is committed to protecting your privacy. This Privacy
          Policy explains how we collect, use, and safeguard your information
          when you use our website and services.
        </p>
        <h2 className="text-xl font-semibold text-gold mt-6 mb-2">
          Information We Collect
        </h2>
        <ul className="list-disc ml-6 mb-4">
          <li>
            Personal information such as name, email, phone, and address when
            you register or place an order.
          </li>
          <li>Order and payment details for processing your purchases.</li>
          <li>Usage data and cookies to improve your experience.</li>
        </ul>
        <h2 className="text-xl font-semibold text-gold mt-6 mb-2">
          How We Use Your Information
        </h2>
        <ul className="list-disc ml-6 mb-4">
          <li>To process orders and deliver products.</li>
          <li>To communicate with you about your account or orders.</li>
          <li>To improve our website and services.</li>
          <li>To comply with legal obligations.</li>
        </ul>
        <h2 className="text-xl font-semibold text-gold mt-6 mb-2">
          Sharing Your Information
        </h2>
        <p className="mb-4">
          We do not sell your personal information. We may share data with
          trusted partners for order fulfillment, payment processing, or legal
          compliance.
        </p>
        <h2 className="text-xl font-semibold text-gold mt-6 mb-2">
          Your Rights
        </h2>
        <p className="mb-4">
          You may access, update, or delete your personal information by
          contacting us. For any privacy concerns, please reach out via our
          contact page.
        </p>
        <h2 className="text-xl font-semibold text-gold mt-6 mb-2">Updates</h2>
        <p>
          We may update this policy from time to time. Changes will be posted on
          this page.
        </p>
      </div>
    </main>
    <Footer />
  </div>
);

export default PrivacyPolicy;
