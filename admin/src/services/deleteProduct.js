import axios from "axios";

export async function deleteProduct(id) {
  await axios
    .delete(import.meta.env.VITE_API_URL + `/currencies/${id}`)
    .then((response) => {
      // console.log("Deleted successfully", response.data);
    })
    .catch((error) => {
      // console.error("Error in deleting the product", error.message);
    });
}
