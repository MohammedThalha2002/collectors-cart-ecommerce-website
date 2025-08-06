import { useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { showToast } from "../../components/shared/others/showToast";
import authImg from "../../assets/auth-img/2.jpg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passVisible, setPassVisible] = useState(false);
  // refs
  const eyeRef = useRef();
  const passwordRef = useRef();

  const navigate = useNavigate();

  function changePasswordVisibility() {
    if (passVisible == false) {
      eyeRef.current.className = "fa-regular fa-eye";
      passwordRef.current.type = "text";
    } else {
      eyeRef.current.className = "fa-regular fa-eye-slash";
      passwordRef.current.type = "password";
    }
    setPassVisible(!passVisible);
  }

  async function formSubmit(e) {
    e.preventDefault();
    const data = {
      name: name,
      email: email,
      phone: phone,
      password: password,
    };
    await axios
      .post(import.meta.env.VITE_URL + "/auth/user/signup", data)
      .then((res) => {
        localStorage.setItem("jwt-token", res.data.jwt);
        navigate("/");
      })
      .catch((err) => {
        const error = err.response.data.errors.message;
        showToast(toast, "error", error);
      });
  }

  return (
    <section className="h-screen w-screen overflow-hidden">
      <ToastContainer />
      <section className="flex flex-col md:flex-row h-screen items-center">
        <div
          className="w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-2/5 h-screen px-6 lg:px-16 xl:px-12
    flex items-center justify-center"
        >
          <div className="w-full h-100">
            <h1
              className="text-4xl text-center text-gold"
              style={{ fontFamily: '"Brim"' }}
            >
              Hola, coleccionista!
            </h1>
            <h1
              className="text-3xl md:text-4xl mt-12 text-center text-gold font-bold tracking-wide"
              style={{ fontFamily: '"Cerilions"' }}
            >
              Create an account
            </h1>
            <form className="mt-6" onSubmit={formSubmit}>
              <div
                className="mt-4 relative"
                style={{ fontFamily: '"Montserrat"' }}
              >
                <label className="block text-gray-500">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 rounded-lg text-black bg-gray-200 mt-2 border focus:border-gold/50 focus:bg-white focus:outline-none"
                  required
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div
                className="mt-4 relative"
                style={{ fontFamily: '"Montserrat"' }}
              >
                <label className="block text-gray-500">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  className="w-full px-4 py-2 rounded-lg text-black bg-gray-200 mt-2 border focus:border-gold/50 focus:bg-white focus:outline-none"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div
                className="mt-4 relative"
                style={{ fontFamily: '"Montserrat"' }}
              >
                <label className="block text-gray-500">Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  className="w-full px-4 py-2 rounded-lg text-black bg-gray-200 mt-2 border focus:border-gold/50 focus:bg-white focus:outline-none"
                  required
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div
                className="mt-4 relative"
                style={{ fontFamily: '"Montserrat"' }}
              >
                <label className="block text-gray-500">Password</label>
                <input
                  ref={passwordRef}
                  type="password"
                  placeholder="Enter Password"
                  minLength={6}
                  className="w-full px-4 py-2 rounded-lg text-black bg-gray-200 mt-2 border focus:border-gold/50 focus:bg-white focus:outline-none pr-12"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="absolute top-1/2 right-3 text-xl">
                  <i
                    ref={eyeRef}
                    className="fa-regular fa-eye-slash"
                    onClick={changePasswordVisibility}
                  />
                </div>
              </div>
              <label className="flex items-center space-x-2 mt-4">
                <input
                  type="checkbox"
                  required
                  className="form-checkbox h-4 w-4"
                />
                <span
                  className="text-gray-500"
                  style={{ fontFamily: '"Montserrat"' }}
                >
                  I agree to the{" "}
                  <span className="text-gold">Terms and Conditions</span>
                </span>
              </label>
              <button
                type="submit"
                className="w-full block bg-gold hover:bg-gold/80 focus:bg-gold/80 text-white rounded-lg
          px-4 py-3 mt-6"
                style={{ fontFamily: '"Montserrat"' }}
              >
                Sign Up
              </button>
            </form>
            <hr className="my-6 border-gray-300 w-full" />
            <p
              className="mt-8 text-gray-500 text-center"
              style={{ fontFamily: '"Montserrat"' }}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-gold hover:text-gold/95 font-semibold"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
        <div className="bg-gold hidden lg:block w-full md:w-1/2 xl:w-3/5 h-screen">
          <img
            src={authImg}
            className="w-full h-full object-cover bg-black opacity-80"
          />
        </div>
      </section>
    </section>
  );
}

export default SignIn;
