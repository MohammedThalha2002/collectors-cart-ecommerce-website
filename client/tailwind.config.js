/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "blue-bg": "#141945",
        "grey-l": "#ADADAD",
        "yellow-t": "#D0A920",
        gold: "#C5A572",
        maroon: "#8B0000",
        ivory: "#FFFFF0",
      },
      fontFamily: {
        mont: ["Montserrat", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        righteous: ["Righteous", "sans-serif"],
        brim: ["Brim", "sans-serif"],
        billy: ["Billy", "sans-serif"],
        vogue: ["Vogue", "sans-serif"],
        cosi_times: ["Cosi times", "sans-serif"],
        cerilions: ["Cerilions", "sans-serif"],
        ageya: ["Ageya", "sans-serif"],
        grand_slang: ["Grand Slang", "sans-serif"],
        dahlia: ["Dahlia", "sans-serif"],
        morgenwalsh: ["Morgenwalsh", "sans-serif"],
        voyage_regualar: ["Voyage Regualar", "sans-serif"],
        moresby: ["Moresby", "sans-serif"],
      },
      gridTemplateColumns: {
        // Complex site-specific row configuration
        desktop: "[first] 15% [line2] 85%",
        mobile: "[first] 100%",
      },
      screens: {
        Xmobile: "500px",

        tablet: "768px",

        mid: "900px",

        laptop: "1024px",

        desktop: "1280px",
      },
    },
  },
  plugins: [],
};
