import axios from "axios";

const limit = 10;

export function getAllCurrenciesAndNotes(setData, setTotalPage, currentPage) {
  const offset = limit * (currentPage - 1);

  axios
    .get(
      import.meta.env.VITE_API_URL + `/products?offset=${offset}&limit=${limit}`
    )
    .then((res) => {
      const totalPage = Math.ceil(res.data.meta.total / limit);
      setTotalPage(totalPage);
      setData(res.data.data);
    })
    .catch((err) => {
      const error = err.response.data.error.message;
      console.log(error);
    });
}

export async function getProducts(currentPage, filters, limit) {
  const offset = limit * (currentPage - 1);

  // Construct the query parameters based on filters
  const queryParams = {
    offset: offset,
    limit: limit,
    ...filters,
  };

  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`, {
      params: queryParams,
    });
    return res.data;
  } catch (err) {
    const error = err?.response?.data?.error?.message || "Something went wrong";
    console.log(error);
    return [];
  }
}

export async function getAllSubCategories() {
  try {
    const res = await axios.get(
      import.meta.env.VITE_API_URL + `/subcategories`
    );
    return res.data;
  } catch (err) {
    const error = err.response.data.error.message;
    console.log(error);
    return [];
  }
}

// get subcategories by category id
export async function getSubCategoriesByCategoryId(categoryId) {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/subcategories/${categoryId}`
    );
    return res.data;
  } catch (err) {
    const error = err.response.data.error.message;
    console.log(error);
    return [];
  }
}

export function getTypes(setData, type, setTotalPage, currentPage) {
  if (type) {
    const offset = limit * (currentPage - 1);

    axios
      .get(
        import.meta.env.VITE_API_URL +
          `/products?type=${type}&offset=${offset}&limit=${limit}`
      )
      .then((res) => {
        const totalPage = Math.ceil(res.data.meta.total / limit);
        setTotalPage(totalPage);
        setData(res.data.data);
      })
      .catch((err) => {
        const error = err.response.data.error.message;
        console.log(error);
      });
  }
}

export function getCountries(setData, country, setTotalPage, currentPage) {
  if (country) {
    const offset = limit * (currentPage - 1);

    axios
      .get(
        import.meta.env.VITE_API_URL +
          `/products?country=${country}&offset=${offset}&limit=${limit}`
      )
      .then((res) => {
        // console.log(res.data);
        const totalPage = Math.ceil(res.data.meta.total / limit);
        setTotalPage(totalPage);
        setData(res.data.data);
      })
      .catch((err) => {
        const error = err.response.data.error.message;
        console.log(error);
      });
  }
}

export async function getDealOfTheDay() {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/products?isDealOfTheDay=true&limit=1`
    );
    return res.data.data[0];
  } catch (err) {
    const error = err?.response?.data?.error?.message || "Something went wrong";
    console.log(error);
    return null;
  }
}

// best seller
export async function getBestSeller(limit) {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/products?bestSeller=true&limit=${limit}`
    );
    return res.data.data;
  } catch (err) {
    const error = err?.response?.data?.error?.message || "Something went wrong";
    console.log(error);
    return null;
  }
}

// get new arrival
export async function getNewArrival() {
  try {
    const res = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/products?bestSeller=false&dealOftheDay=false&limit=1`
    );
    return res.data.data[0];
  } catch (err) {
    const error = err?.response?.data?.error?.message || "Something went wrong";
    console.log(error);
    return null;
  }
}
