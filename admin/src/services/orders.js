import axios from "axios";
import { showToast } from "./showToast";
import { toast } from "react-toastify";

const limit = 10;

export function getOrders(setData, setTotalPage, currentPage) {
  const offset = limit * (currentPage - 1);

  axios
    .get(
      import.meta.env.VITE_API_URL + `/orders?offset=${offset}&limit=${limit}`
    )
    .then((res) => {
      // console.log(res.data);
      const totalPage = Math.ceil(res.data.meta.total / limit);
      setTotalPage(totalPage);
      setData(res.data.data);
    })
    .catch((err) => {
      // console.log(err);
      const error = err.response.data;
      showToast(toast, "error", error);
    });
}

export function updateOrderStatus(id, Status) {
  const data = {
    Status: Status,
  };
  axios
    .post(import.meta.env.VITE_API_URL + `/updateOrder/${id}`, data)
    .then((res) => {
      // console.log(res.data);
      showToast(toast, "success", "Updated Successfully");
    })
    .catch((err) => {
      // console.log(err);
      const error = err.response.data;
      showToast(toast, "error", error);
    });
}
