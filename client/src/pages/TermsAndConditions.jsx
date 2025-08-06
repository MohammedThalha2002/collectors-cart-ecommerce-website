import React from "react";
import NavBar from "../components/shared/navbar/NavBar";
import Footer from "../components/shared/Footer";
import ScrollToTop from "../components/shared/others/ScrollToTop";

const TermsAndConditions = () => (
  <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">
    <ScrollToTop />
    <NavBar />
    <main className="flex-grow container mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gold mb-6">
          Terms & Conditions
        </h1>
        <h2 className="text-xl font-semibold text-gold mt-6 mb-2">
          Acceptance of Terms
        </h2>
        <p className="mb-4">
          By using CollectorsCart, you agree to these Terms & Conditions. Please
          read them carefully before using our website or services.
        </p>
        <h2 className="text-xl font-semibold text-gold mt-6 mb-2">
          Use of Service
        </h2>
        <ul className="list-disc ml-6 mb-4">
          <li>
            You must provide accurate information when registering or placing
            orders.
          </li>
          <li>Do not use our site for unlawful activities.</li>
          <li>
            We reserve the right to refuse service or cancel orders at our
            discretion.
          </li>
        </ul>
        <h2 className="text-xl font-semibold text-gold mt-6 mb-2">
          Orders & Payments
        </h2>
        <ul className="list-disc ml-6 mb-4">
          <li>All orders are subject to availability and confirmation.</li>
          <li>Prices and product details may change without notice.</li>
          <li>Payment must be completed before shipping.</li>
        </ul>
        <h2 className="text-xl font-semibold text-gold mt-6 mb-2">
          Returns & Refunds
        </h2>
        <p className="mb-4">
          Please refer to our Shipping & Returns policy for details on returns,
          exchanges, and refunds.
        </p>
        <h2 className="text-xl font-semibold text-gold mt-6 mb-2">
          Limitation of Liability
        </h2>
        <p className="mb-4">
          We are not liable for indirect or consequential damages. Our liability
          is limited to the value of the products purchased.
        </p>
        <h2 className="text-xl font-semibold text-gold mt-6 mb-2">
          Changes to Terms
        </h2>
        <p>
          We may update these Terms & Conditions at any time. Continued use of
          the site means you accept the changes.
        </p>
      </div>
    </main>
    <Footer />
  </div>
);

export default TermsAndConditions;
