import React, { useEffect, useState } from "react";
import Login from "./Login";
import App from "./App";

function RouterJunction() {
  const [isloggedIn, setloggedIn] = useState(false);
  useEffect(() => {
    const admin = localStorage.getItem("admin");
    // console.log(admin);
    if (admin) setloggedIn(true);
  }, []);

  return <>{isloggedIn ? <App /> : <Login setloggedIn={setloggedIn} />}</>;
}

export default RouterJunction;
