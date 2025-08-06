import React, {  useState } from "react";
import { showToast } from "./services/showToast";
import { ToastContainer, toast } from "react-toastify";

function Login({ setloggedIn }) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (user == "sanjay@coinnnote" && password == "@coinNnote") {
      localStorage.setItem("admin", true);
      setloggedIn(true)
    } else {
      // console.log("error");
      showToast(toast, "error", "Incorrect credentials");
    }
  }

  return (
    <section className="h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0">
      <ToastContainer />
      <div className="md:w-1/3 max-w-sm">
        <img
          src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
          alt="Sample image"
        />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="md:w-1/3 w-full">
          <input
            className="text-sm w-60 px-4 py-2 border border-solid border-gray-300 rounded"
            type="text"
            placeholder="Username"
            onChange={(e) => setUser(e.target.value)}
          />
          <input
            className="text-sm w-60 px-4 py-2 border border-solid border-gray-300 rounded mt-4"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="mt-4 flex justify-between font-semibold text-sm">
            <label className="flex text-slate-500 hover:text-slate-600 cursor-pointer">
              <input className="mr-1" type="checkbox" />
              <span>Remember Me</span>
            </label>
          </div>
          <div className="text-center md:text-left">
            <button
              className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider"
              type="submit"
            >
              Login
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default Login;
