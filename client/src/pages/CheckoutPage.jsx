import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ScrollToTop from "../components/shared/others/ScrollToTop";
import { QRCode } from "react-qrcode-logo";
import GooglePayLogo from "../assets/icons/google-pay.svg";
import PhonePayLogo from "../assets/icons/phone-pay.svg";
import PaytmLogo from "../assets/icons/paytm.svg";
import BhimLogo from "../assets/icons/bhim.svg";
import { placeOrder } from "../services/placeOrder";
import { useNavigate } from "react-router-dom";
import { emptyCart } from "../hooks/features/CartSlice";
import { showToast } from "../components/shared/others/showToast";
import { toast, ToastContainer } from "react-toastify";

const CheckoutPage = () => {
  const orderItems = useSelector((state) => state.cart.items);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    streetAddress: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [formErrors, setFormErrors] = useState({
    fullName: false,
    phone: false,
    streetAddress: false,
    city: false,
    state: false,
    zipCode: false,
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showTransactionInput, setShowTransactionInput] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(""); // "upi" or "bank"
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt-token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const deliveryDetails = JSON.parse(
      localStorage.getItem("collectorscart-delivery-address")
    );

    setFormData({
      fullName: deliveryDetails?.name || "",
      phone: deliveryDetails?.phone || "",
      streetAddress: deliveryDetails?.address || "",
      apartment: deliveryDetails?.address2 || "",
      city: deliveryDetails?.city || "",
      state: deliveryDetails?.state || "",
      zipCode: deliveryDetails?.pincode || "",
    });
  }, []);

  const subTotalWithoutGST = orderItems.reduce((total, item) => {
    const gst = (item.sellingPrice * item.gst) / 100;
    return total + item.sellingPrice * item.quantity - gst * item.quantity;
  }, 0);

  const totalGst = orderItems.reduce((total, item) => {
    const gst = (item.sellingPrice * item.gst) / 100;
    return total + gst * item.quantity;
  }, 0);

  const subTotal = orderItems.reduce((total, item) => {
    return total + item.sellingPrice * item.quantity;
  }, 0);

  const calculateSubtotal = (price, quantity) => {
    return price * quantity;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const shipping = subTotal >= 2500 ? 0 : 70;

  // Validate form
  useEffect(() => {
    const validateForm = () => {
      const errors = {
        fullName: formData.fullName.trim() === "",
        phone: formData.phone.trim() === "",
        streetAddress: formData.streetAddress.trim() === "",
        city: formData.city.trim() === "",
        state: formData.state.trim() === "",
        zipCode: formData.zipCode.trim() === "",
      };

      setFormErrors(errors);
      setIsFormValid(!Object.values(errors).some((error) => error));
    };

    validateForm();
  }, [formData]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (isFormValid) {
      // Process the order
      const data = {
        name: formData.fullName,
        address: formData.streetAddress,
        address2: formData.apartment,
        city: formData.city,
        state: formData.state,
        pincode: formData.zipCode,
        phone: formData.phone,
      };
      localStorage.setItem(
        "collectorscart-delivery-address",
        JSON.stringify(data)
      );
      setShowPaymentDialog(true);
    }
  };

  const handleProceed = (selectedPaymentMethod) => {
    setPaymentMethod(selectedPaymentMethod);
    setShowPaymentDialog(false);
    setShowTransactionInput(true);
  };

  const handleOnTransactionBackClick = () => {
    setShowTransactionInput(false);
    setShowPaymentDialog(true);
    setPaymentMethod(""); // Reset payment method
  };

  const handleTransactionSubmit = (transactionId) => {
    setShowTransactionInput(false);
    setIsPlacingOrder(true);

    const items = orderItems.map((item, index) => {
      const itemData = {
        id: index,
        productId: item.id,
        quantity: item.quantity,
        price: item.sellingPrice,
      };
      if (item.birthdayDate) {
        itemData.birthdayDate = item.birthdayDate;
      }
      return itemData;
    });

    const address = `${formData.streetAddress} ${
      formData.apartment ? `, ${formData.apartment}` : ""
    }, ${formData.city}, ${formData.state}, ${formData.zipCode}`;

    setTimeout(() => {
      placeOrder(
        items,
        transactionId,
        paymentMethod,
        formData.fullName,
        formData.phone,
        address,
        (orderId) => {
          setIsPlacingOrder(false);
          dispatch(emptyCart());
          showToast(
            toast,
            "success",
            `Order Placed Successfully! Order ID: ${orderId}`
          );
          navigate("/home");
        },
        (error) => {
          setIsPlacingOrder(false);
          showToast(toast, "error", error || "Failed to place order");
        }
      );
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <ScrollToTop />
      {isPlacingOrder && <OrderLoader />}
      {showPaymentDialog && (
        <Paymentdialog
          tempOrderId={`TEMP-${Date.now().toString().slice(-6)}`}
          total={subTotal + shipping}
          handleProceed={handleProceed}
          onDismiss={() => setShowPaymentDialog(false)}
        />
      )}
      {showTransactionInput && (
        <TransactionInput
          paymentMethod={paymentMethod}
          handleOnBackClick={handleOnTransactionBackClick}
          handleTransactionSubmit={handleTransactionSubmit}
        />
      )}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Checkout</h1>
          <p className="mt-2 text-lg text-gray-600">Complete your purchase</p>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg mb-8">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Order Summary
            </h2>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              {orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between pb-4 border-b border-gray-100"
                >
                  {/* image */}
                  <div className="flex-shrink-0 mr-4">
                    <img
                      src={import.meta.env.VITE_IMAGE_URL + item.images[0]}
                      alt={item.name}
                      className="h-16 w-16 object-cover rounded-md"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                    {item.birthdayDate && (
                      <p className="mt-1 text-sm text-gray-500">
                        Date: {item.birthdayDate}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ₹
                      {calculateSubtotal(
                        item.sellingPrice,
                        item.quantity
                      ).toFixed(2)}{" "}
                    </p>
                    <p className="mt-1 text-sm text-gray-700">
                      ₹{item.sellingPrice.toFixed(2)} | GST : {item.gst}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              <div className="text-base font-medium text-gray-900">
                Subtotal
              </div>
              <div className="text-xl font-semibold text-gray-900">
                ₹{subTotalWithoutGST}
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <div className="text-base font-medium text-gray-900">
                GST
                <span className="text-gray-500"> (CGST + SGST)</span>
              </div>
              <div className="text-xl font-semibold text-gray-900">
                ₹{totalGst.toFixed(1)}
              </div>
            </div>
            <div className="mt-3 border-b border-gray-100"></div>
            <div className="mt-6 flex justify-between ">
              <div className="text-base font-medium text-gray-900">
                Shipping
              </div>
              <div className="text-xl font-semibold text-gray-900">
                ₹{shipping}
              </div>
            </div>
            <div className="mt-3 border-b border-gray-100"></div>
            <div className="mt-6 flex justify-between ">
              <div className="text-base font-medium text-gray-900">Total</div>
              <div className="text-xl font-semibold text-gray-900">
                ₹{subTotal + shipping}
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow overflow-hidden rounded-lg"
        >
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Delivery Information
            </h2>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 ${
                      formErrors.fullName && submitAttempted
                        ? "border-red-300 bg-red-50"
                        : "border"
                    }`}
                  />
                  {formErrors.fullName && submitAttempted && (
                    <p className="mt-1 text-sm text-red-600">
                      Full name is required
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 ${
                      formErrors.phone && submitAttempted
                        ? "border-red-300 bg-red-50"
                        : "border"
                    }`}
                  />
                  {formErrors.phone && submitAttempted && (
                    <p className="mt-1 text-sm text-red-600">
                      Phone number is required
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="streetAddress"
                  className="block text-sm font-medium text-gray-700"
                >
                  Street Address <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="streetAddress"
                    id="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 ${
                      formErrors.streetAddress && submitAttempted
                        ? "border-red-300 bg-red-50"
                        : "border"
                    }`}
                  />
                  {formErrors.streetAddress && submitAttempted && (
                    <p className="mt-1 text-sm text-red-600">
                      Street address is required
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="apartment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Apartment / Suite (optional)
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="apartment"
                    id="apartment"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2`}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="city"
                    id="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 ${
                      formErrors.city && submitAttempted
                        ? "border-red-300 bg-red-50"
                        : "border"
                    }`}
                  />
                  {formErrors.city && submitAttempted && (
                    <p className="mt-1 text-sm text-red-600">
                      City is required
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="state"
                    id="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 ${
                      formErrors.state && submitAttempted
                        ? "border-red-300 bg-red-50"
                        : "border"
                    }`}
                  />
                  {formErrors.state && submitAttempted && (
                    <p className="mt-1 text-sm text-red-600">
                      State/Province is required
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="zipCode"
                  className="block text-sm font-medium text-gray-700"
                >
                  PIN / Postal Code <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="zipCode"
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 ${
                      formErrors.zipCode && submitAttempted
                        ? "border-red-300 bg-red-50"
                        : "border"
                    }`}
                  />
                  {formErrors.zipCode && submitAttempted && (
                    <p className="mt-1 text-sm text-red-600">
                      Pin/Postal code is required
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-button text-white ${
                isFormValid
                  ? "bg-gold/90 hover:bg-gold cursor-pointer"
                  : "bg-gold/50 cursor-not-allowed"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 whitespace-nowrap`}
            >
              Confirm Order
            </button>
            {!isFormValid && submitAttempted && (
              <p className="mt-2 text-sm text-center text-gray-500">
                Please fill in all required fields to continue
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

function Paymentdialog({ tempOrderId, total, handleProceed, onDismiss }) {
  const upiId = "9894942686@ptsbi";
  const upiUrl = `upi://pay?pa=${upiId}&pn=CollectorsCart&am=${total}&cu=INR&tn=Order+Payment+${tempOrderId}`;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        {/* close button on top right */}
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <i className="fa-solid fa-xmark text-base"></i>
          </div>
        </button>

        <div className="text-center mb-6">
          <div className="text-2xl font-serif font-bold text-maroon mb-2">
            <span className="text-gold">Collectors</span>Cart
          </div>
          <h3 className="text-xl font-bold text-black">
            Ref ID: {tempOrderId}
          </h3>
          <p className="text-2xl font-bold text-gold mt-2">₹{total}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* UPI Payment Section */}
          <div className="border rounded-lg p-4 flex flex-col items-center justify-between">
            <h4 className="text-lg font-semibold mb-4 text-center">
              UPI Payment
            </h4>
            <div className="flex flex-col items-center">
              <div className="p-2 border mb-4">
                <QRCode value={upiUrl} size={180} />
              </div>
              <p className="mb-4 px-4 py-2 bg-gray-200 rounded-full text-sm">
                {upiId}
              </p>
              <div className="text-center mb-4">
                <p className="text-gray-600 text-sm mb-3">
                  Scan QR code with any UPI app
                </p>
                <div className="flex gap-3 justify-center mb-4">
                  <img
                    src={GooglePayLogo}
                    alt="Google Pay"
                    className="h-8 w-8"
                  />
                  <img src={PhonePayLogo} alt="Phone Pay" className="h-8 w-8" />
                  <img src={PaytmLogo} alt="Paytm" className="h-8 w-8" />
                  <img src={BhimLogo} alt="UPI Pay" className="h-8 w-8" />
                </div>
              </div>
            </div>
            <button
              onClick={() => handleProceed("upi")}
              className="w-full bg-green-600 text-white rounded-lg py-3 px-4 hover:bg-green-700 transition duration-200 font-semibold"
            >
              Paid via UPI
            </button>
          </div>

          {/* Bank Transfer Section */}
          <div className="border rounded-lg p-4 flex flex-col items-center justify-between">
            <h4 className="text-lg font-semibold mb-4 text-center">
              Bank Transfer
            </h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium">Account Name:</span>
                <p className="text-gray-700">CollectorsCart Private Limited</p>
              </div>
              <div>
                <span className="font-medium">Account Number:</span>
                <p className="text-gray-700 font-mono">1234567890123456</p>
              </div>
              <div>
                <span className="font-medium">IFSC Code:</span>
                <p className="text-gray-700 font-mono">HDFC0001234</p>
              </div>
              <div>
                <span className="font-medium">Bank Name:</span>
                <p className="text-gray-700">HDFC Bank</p>
              </div>
              <div>
                <span className="font-medium">Branch:</span>
                <p className="text-gray-700">Chennai Main Branch</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg mt-4">
                <div className="flex items-center mb-2">
                  <i className="fab fa-whatsapp text-green-600 text-lg mr-2"></i>
                  <span className="font-medium text-green-800">
                    WhatsApp Verification:
                  </span>
                </div>
                <p className="text-green-800 text-xs mb-2">
                  After completing the bank transfer, please upload the
                  transaction receipt/screenshot to:
                </p>
                <div className="flex items-center justify-between bg-white p-2 rounded border">
                  <span className="font-mono text-green-700 font-medium">
                    +91 98949 42686
                  </span>
                  <button
                    onClick={() =>
                      window.open(
                        "https://wa.me/919894942686?text=Ref%20ID:%20" +
                          tempOrderId +
                          "%20-%20Bank%20Transfer%20Receipt",
                        "_blank"
                      )
                    }
                    className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                  >
                    <i className="fab fa-whatsapp mr-1"></i>
                    Open WhatsApp
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleProceed("bank")}
              className="w-full bg-blue-600 text-white rounded-lg py-3 px-4 hover:bg-blue-700 transition duration-200 font-semibold mt-4"
            >
              Paid via Bank Transfer
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            After payment, you'll be asked to enter transaction details for
            verification.
          </p>
        </div>
      </div>
    </div>
  );
}

function TransactionInput({
  paymentMethod,
  handleTransactionSubmit,
  handleOnBackClick,
}) {
  const [transactionId, setTransactionId] = useState("");

  const getInputLabel = () => {
    if (paymentMethod === "upi") {
      return "Enter UPI Transaction / Reference ID";
    } else if (paymentMethod === "bank") {
      return "Enter Bank Transaction / Reference ID";
    }
    return "Enter Transaction / Reference ID";
  };

  const getInputPlaceholder = () => {
    if (paymentMethod === "upi") {
      return "Enter UPI Transaction ID (e.g., 123456789012)";
    } else if (paymentMethod === "bank") {
      return "Enter Bank Reference Number";
    }
    return "Enter Transaction ID";
  };

  const getInstructions = () => {
    if (paymentMethod === "upi") {
      return "Please ensure that the UPI payment has been successfully completed and the amount has been deducted from your account. We will verify the UPI transaction ID and process your order.";
    } else if (paymentMethod === "bank") {
      return "Please ensure that the bank transfer has been completed successfully and you have uploaded the transaction receipt to our WhatsApp number (+91 98949 42686). We will verify the bank transaction reference number and process your order.";
    }
    return "Please ensure that the payment has been completed successfully.";
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-40 mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="flex flex-col items-center">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
              {paymentMethod === "upi" ? (
                <i className="fas fa-mobile-alt text-gold text-2xl"></i>
              ) : paymentMethod === "bank" ? (
                <i className="fas fa-university text-gold text-2xl"></i>
              ) : (
                <i className="fas fa-credit-card text-gold text-2xl"></i>
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {getInputLabel()}
            </h3>
            <span className="text-red-500 text-sm">*Required</span>
          </div>

          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder={getInputPlaceholder()}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
          />

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-blue-800 text-sm text-center">
              <i className="fas fa-info-circle mr-2"></i>
              {getInstructions()}
            </p>
          </div>

          <div className="flex justify-between w-full gap-4">
            <button
              onClick={handleOnBackClick}
              className="flex-1 bg-gray-300 text-gray-700 rounded-lg py-3 px-4 hover:bg-gray-400 transition duration-200 font-semibold"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back
            </button>
            <button
              onClick={() => handleTransactionSubmit(transactionId)}
              disabled={!transactionId.trim()}
              className={`flex-1 bg-gold text-white rounded-lg py-3 px-4 hover:bg-gold/90 transition duration-200 font-semibold
                ${
                  !transactionId.trim() ? "cursor-not-allowed opacity-50" : ""
                }`}
            >
              <i className="fas fa-check mr-2"></i>
              Complete Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderLoader() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-[60] flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-sm mx-auto shadow-2xl">
        <div className="text-center">
          {/* Animated logo/icon */}
          <div className="w-20 h-20 bg-gradient-to-r from-gold to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <i className="fas fa-shopping-cart text-white text-2xl"></i>
          </div>

          {/* Loading spinner */}
          <div className="relative mb-6">
            <div className="w-12 h-12 border-4 border-gray-200 rounded-full mx-auto">
              <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>

          {/* Loading text */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Processing Your Order
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Please wait while we confirm your order...
          </p>

          {/* Progress dots */}
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-gold rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-gold rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-gold rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
