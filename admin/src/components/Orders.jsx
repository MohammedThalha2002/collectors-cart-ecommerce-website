import React, { useState } from "react";
import { useEffect } from "react";
import { getOrders, updateOrderStatus } from "../services/orders";
import ResponsivePagination from "react-responsive-pagination";

function Orders() {
  const [data, setData] = useState([]);
  const [totalPage, setTotalPage] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getOrders(setData, setTotalPage, currentPage);
  }, []);

  function pageChanging(val) {
    setCurrentPage(val);
    getOrders(setData, setTotalPage, val);
  }

  async function getValues() {
    getOrders(setData, setTotalPage, currentPage);
  }

  return (
    <div className="basis-[95%] bg-slate-800 p-4">
      <h2 className="text-2xl font-semibold text-white mb-4">Orders</h2>
      <div className="overflow-x-auto h-[90vh] pb-4 relative">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Payment ID</th>
              <th>Status</th>
              <th>Total</th>
              <th>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {data.map((val, i) => (
              <TableContents key={i} data={val} />
            ))}
          </tbody>
        </table>
        <div className="absolute bottom-0 left-1/2">
          <ResponsivePagination
            current={currentPage}
            total={totalPage}
            onPageChange={(val) => pageChanging(val)}
          />
        </div>
      </div>
    </div>
  );
}

function TableContents({ data }) {
  const [status, setStatus] = useState(data.Status);
  const [changeStatus, setChangeStatus] = useState(false);

  return (
    <tr>
      <th>
        <label>
          <input type="checkbox" className="checkbox" />
        </label>
      </th>
      <td>
        <h3>#{data.orderID}</h3>
      </td>
      <td>
        <h3>{data.Date}</h3>
      </td>
      <td>
        {data.Customer}
        <br />
        <span className="badge badge-ghost badge-sm">{data.Email}</span>
        <br />
        <span className="badge badge-ghost badge-sm">{data.Phone}</span>
      </td>
      <td>
        <h3>#{data.PaymentID}</h3>
      </td>
      <th>
        <select
          className="select select-warning w-full max-w-xs"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setChangeStatus(e.target.value !== data.Status);
          }}
        >
          <option disabled>select one</option>
          <option value="Pending">Pending</option>
          <option value="Order Accepted">Order Accepted</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </th>
      <td>{data.Total}</td>
      <td>
        <a
          href={data.Invoice}
          download="Invoice"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="btn btn-success btn-xs">Download</button>
        </a>
      </td>
      {changeStatus ? (
        <td>
          <button
            className="btn btn-success btn-xs"
            onClick={() => {
              updateOrderStatus(data.id, status);
              setChangeStatus(false);
            }}
          >
            Update
          </button>
        </td>
      ) : (
        <></>
      )}
    </tr>
  );
}

export default Orders;
