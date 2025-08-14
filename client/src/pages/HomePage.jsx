import React, { useState, useEffect } from "react";
import NavBar from "../components/shared/navbar/NavBar";
import CauroselSwiper from "../components/CauroselSwiper";
import CategoryPreviews from "../components/CategoryPreviews";
import AbourOurCollection from "../components/AbourOurCollection";
import Footer from "../components/shared/Footer";
import FeaturedCollectables from "../components/FeaturedCollectables";
import NewsLetter from "../components/NewsLetter";
import AboutUs from "../components/AboutUs";
import { getAnnouncement } from "../services/getPageDetails";
import AnnouncementBanner from "../components/AnnouncementBanner";
import ScrollToTop from "../components/shared/others/ScrollToTop";
import SearchSection from "../components/SearchSection";
import { ToastContainer } from "react-toastify";

const HomePage = () => {
  const [announcement, setAnnouncement] = useState(null);

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  async function fetchAnnouncement() {
    const res = await getAnnouncement();
    if (res.content != null) {
      setAnnouncement(res);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <ScrollToTop />
      <ToastContainer />
      <NavBar />
      {announcement && <AnnouncementBanner content={announcement.content} />}
      <main>
        <CauroselSwiper />
        <SearchSection />
        <CategoryPreviews />
        <FeaturedCollectables />
        <AboutUs />
        <AbourOurCollection />
        <NewsLetter />
      </main>
      <Footer />
    </div>
  );
};
export default HomePage;
