import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import SignIn from "./pages/auth/SignIn";
import NoPage from "./pages/NoPage";
import Orders from "./pages/Orders";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import SubCategories from "./pages/SubCategories";
import Contacts from "./pages/Contacts";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import CheckoutPage from "./pages/CheckoutPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/collections" element={<ProductsPage />} />
        <Route
          path="/collections/category/:categoryId"
          element={<ProductsPage />}
        />
        <Route
          path="/collections/category/:categoryId/subcategory/:subcategoryId"
          element={<ProductsPage />}
        />
        <Route
          path="/collections/search/:searchQuery"
          element={<ProductsPage />}
        />
        <Route
          path="/collections/subcategories/:categoryId"
          element={<SubCategories />}
        />
        <Route
          path="/collections/:productId"
          element={<ProductDetailsPage />}
        />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/contact" element={<Contacts />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
