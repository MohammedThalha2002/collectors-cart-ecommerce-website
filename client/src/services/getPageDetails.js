import axios from "axios";

export async function getAnnouncement() {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/announcement`);
    return res.data;
  } catch (err) {
    const error = err?.response?.data?.error?.message || "Something went wrong";
    return null;
  }
}
