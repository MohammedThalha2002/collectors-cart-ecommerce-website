import { useRef, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { showToast } from "../../components/shared/others/showToast";
import { Link } from "react-router-dom";
import authImg from "../../assets/auth-img/1.jpg";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
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
      email: email,
      password: password,
    };
    await axios
      .post(import.meta.env.VITE_URL + "/auth/user/login", data)
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
    <section className="h-screen w-screen overflow-hidden flex justify-center items-center">
      <ToastContainer />
      <section className="flex flex-col md:flex-row h-screen items-center">
        <div className="bg-gray-950 hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
          <img src={authImg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="w-full md:max-w-md md:mx-0 xl:w-1/3 h-screen lg:mx-auto px-6 flex items-center justify-center">
          <div className="w-full">
            <h1
              className="text-4xl text-gold text-center"
              style={{ fontFamily: '"Brim"' }}
            >
              Bienvenido de nuevo
            </h1>
            <h1
              className="text-2xl md:text-3xl mt-12 text-center text-gold font-bold tracking-wide"
              style={{ fontFamily: '"Cerilions"' }}
            >
              Log in to your account
            </h1>
            <form className="mt-6" onSubmit={formSubmit}>
              <div style={{ fontFamily: '"Montserrat"' }}>
                <label className="block text-gray-600">Email Address</label>
                <input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email Address"
                  className="w-full px-4 py-3 rounded-lg bg-gray-200 text-black mt-2 border focus:border-gold/50 focus:bg-white focus:outline-none"
                  autoFocus=""
                  autoComplete=""
                  required
                />
              </div>
              <div
                className="mt-4 relative"
                style={{ fontFamily: '"Montserrat"' }}
              >
                <label className="block text-gray-600">Password</label>
                <input
                  ref={passwordRef}
                  type="password"
                  placeholder="Enter Password"
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  className="w-full px-4 py-3 rounded-lg text-black bg-gray-200 mt-2 border focus:border-gold/50 focus:bg-white focus:outline-none pr-12"
                  required=""
                />
                <div className="absolute top-1/2 right-3 text-xl">
                  <i
                    ref={eyeRef}
                    className="fa-regular fa-eye-slash"
                    onClick={changePasswordVisibility}
                  />
                </div>
              </div>
              <div
                className="text-right mt-2"
                style={{ fontFamily: '"Montserrat"' }}
              ></div>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox h-4 w-4" />
                <span
                  className="text-gray-500"
                  style={{ fontFamily: '"Montserrat"' }}
                >
                  Remember Me
                </span>
              </label>
              <button
                type="submit"
                className="w-full block bg-gold hover:bg-gold/80 focus:bg-gold/80 text-white rounded-lg
          px-4 py-3 mt-6"
                style={{ fontFamily: '"Montserrat"' }}
              >
                Log In
              </button>
            </form>
            <hr className="my-6 border-gray-300 w-full" />
            <p
              className="mt-8 text-gray-500 text-center"
              style={{ fontFamily: '"Montserrat"' }}
            >
              Need an account?{" "}
              <Link
                to="/signin"
                className="text-gold hover:text-gold/80 font-semibold"
              >
                Sign Up
              </Link>
            </p>
            <p className="text-sm text-center text-gray-500 mt-12">
              © 2023 COINNNOTES - All Rights Reserved.
            </p>
          </div>
        </div>
      </section>
    </section>
  );
}

export default Login;
