import React, { useState, useEffect } from "react";
import MenuBar from "./components/MenuBar";
import Content from "./components/Content";
import Entry from "./components/Entry";
import { useSelector } from "react-redux";
import AddProduct from "./components/Entries/AddProduct";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Orders from "./components/Orders";

function App() {
  const type = useSelector((state) => state.product.contentType);
  const [orders, setOrders] = useState(false);
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <ToastContainer />
      <div className="basis-[5%] bg-white">
        <MenuBar setOrders={setOrders} />
      </div>
      {!orders ? (
        <>
          <div className="basis-[15%] bg-slate-100">
            <Content />
          </div>
          <div className="basis-[80%] bg-slate-200">
            {type != "Deal of the day" ? <Entry /> : <AddProduct />}
          </div>
        </>
      ) : (
        <Orders />
      )}
    </div>
  );
}

export default App;
