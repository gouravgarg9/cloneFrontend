import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";
import Navigation from "../components/Navigation";
import { Link } from "react-router-dom";
axios.defaults.withCredentials = true;
let BASE = process.env.REACT_APP_BACK_END_ROOT;

const getAppxDate = (date) => {
  let time = Math.floor(
    (Date.now() - Date.parse(date)) / (1000 * 60 * 60 * 24)
  );
  if (time === 0) return "today";
  if (time === 1) return "yesterday";
  if (time < 31) return `${time} days ago`;
  time = Math.floor(time / 30);
  if (time < 12) return `${time} months ago`;
  return `${Math.floor(time / 12)} years and ${time % 12} months ago`;
};

const Home = () => {
  const [loading, setloading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [page, setpage] = useState(1);
  const [products, setproducts] = useState([]);
  const [categorylist, setcategoryList] = useState([]);
  const [sortValue, setsortValue] = useState();
  const [price, setPrice] = useState(100000);
  const [age, setAge] = useState(24);
  const [filter, setFilter] = useState(false);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState();
  // console.log(search);
  const navigate = useNavigate();
  const categories = [
    "Books",
    "Mobiles",
    "Electronics",
    "Accessories",
    "Vehicle",
    "Health & Fitness",
    "Furniture",
    "Calculator",
    "Stationary",
    "Others",
  ];

  const getUser = async () => {
    try {
      const res = await axios.get(`https://${BASE}/api/users/checkLoggedIn`);
      if (res.status === 200) {
        setUser(res.data.data.user);
      }
    } catch (e) {
      console.log(e);
      navigate("/info");
      setUser(null);
    }
    setloading(false);
  };

  const getAllProducts = async (page = 1) => {
    try {
      setloading(true);
      const fetchURL = `https://${BASE}/api/products/getAllProducts?page=${page}&limit=12&sort=${
        sortValue ? sortValue : "-createdAt"
      }`;
      const res = await axios.get(fetchURL);
      if (page !== 1)
        setproducts((prev) => [...prev, ...res.data.data.products]);
      else setproducts(res.data.data.products);
      setHasNextPage(res.data.data.hasNextPage);
      setloading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 2 >
      document.documentElement.scrollHeight
    )
      setpage((prev) => prev + 1);
  };

  const sortProducts = (e) => {
    const x = e.target.value;
    console.log(x);
    if (x !== sortValue) {
      setsortValue(() => x);
    }
  };

  useEffect(() => {
    getUser();
    window.addEventListener("scroll", handleScroll);
  }, []);
  // console.log(user)
  useEffect(() => {
    if (user) getAllProducts();
  }, [user]);

  useEffect(() => {
    if (sortValue !== undefined) {
      getAllProducts();
      setpage(() => 1);
    }
  }, [sortValue]);

  useEffect(() => {
    if (page > 1 && hasNextPage === true) {
      getAllProducts(page);
    }
  }, [page]);

  const handleFilterchange = (e) => {
    // console.log(e.target.value);
    const { value, checked } = e.target;
    if (checked) {
      setcategoryList([...categorylist, value]);
    } else {
      setcategoryList(categorylist.filter((e) => e !== value));
    }
  };
  // console.log(categorylist);
  const handleFilter = () => {
    // console.log(e);
    setFilter(false);
  };
  const handleReset = () => {
    setFilter(false);
    setPrice(100000);
    setAge(24);
    setcategoryList([]);
  };
  const showFilters = () => {
    // console.log(filter)
    if (filter) {
      // console.log(filter)
      return (
        <>
          <div className="z-10 p-2 w-96 mt-2 bg-white rounded-lg shadow dark:bg-gray-700 absolute">
            <div id="dropdown" className="p-2 flex justify-between">
              <div>
                <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white font-bold">
                  Category
                </h6>
                <ul
                  className="space-y-2 text-sm"
                  aria-labelledby="dropdownDefault"
                >
                  {categories.map((category, i) => {
                    if (categorylist.includes(category))
                      return (
                        <li className="flex items-center" key={i}>
                          <input
                            type="checkbox"
                            name="category"
                            checked
                            value={category}
                            onChange={(e) => handleFilterchange(e)}
                            // defaultValue=""
                            className="list w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          />
                          <label
                            htmlFor="apple"
                            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                          >
                            {category}
                          </label>
                        </li>
                      );
                    else
                      return (
                        <li className="flex items-center" key={i}>
                          <input
                            type="checkbox"
                            name="category"
                            value={category}
                            onChange={(e) => handleFilterchange(e)}
                            // defaultValue=""
                            className="list w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          />
                          <label
                            htmlFor="apple"
                            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                          >
                            {category}
                          </label>
                        </li>
                      );
                  })}
                </ul>
              </div>
              <div className=" w-40">
                <div className="flex justify-between">
                  <label
                    htmlFor="steps-range"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white font-bold"
                  >
                    Price
                  </label>
                  <label
                    htmlFor="steps-range"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    ₹{price}
                  </label>
                </div>
                <input
                  id="steps-range"
                  type="range"
                  min={0}
                  max={100000}
                  onChange={(e) => setPrice(e.target.value)}
                  defaultValue={price}
                  step="50"
                  className="w-40 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-black"
                />
                <div className="flex justify-between">
                  <label
                    htmlFor="steps-range"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white font-bold"
                  >
                    Age
                  </label>
                  <label
                    htmlFor="steps-range"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {age} months
                  </label>
                </div>
                <input
                  id="steps-range"
                  type="range"
                  min={0}
                  max={240}
                  onChange={(e) => setAge(e.target.value)}
                  defaultValue={age}
                  step="1"
                  className="w-40 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-black"
                />
              </div>
            </div>
            <div className=" p-2 bg-white mb-2 flex dark:bg-gray-700">
              <button
                type="button"
                onClick={handleReset}
                className="text-black bg-slate-200 hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-black-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 hover:text-white hover:bg-slate-500 mt-2 mx-1"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleFilter}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 mt-2 mx-1"
              >
                Show Results
              </button>
            </div>
          </div>
        </>
      );
    } else {
      return;
    }
  };

  const onLoad = () => {
    if (loading) {
      return (
        <>
          <h1>
            ...loading <ClipLoader color="#000000" />
          </h1>
          <ToastContainer />
        </>
      );
    }
  };

  const getAge = (purDate) => {
    const d2 = new Date();
    const d1 = new Date(purDate || Date.now());
    let months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  };
  const getSearch = (data) => {
    setSearch(data.toLowerCase());
  };
  return (
    <>
      <Navigation user={user} getSearch={getSearch} />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="flex fixed z-10 top-24">
        <label htmlFor="sort"></label>
        <select
          name="sort"
          id="sort"
          defaultValue="-createdAt"
          className="text-black bg-white font-semibold rounded-lg shadow dark:bg-gray-900 text-white mx-2"
          onChange={(e) => {
            sortProducts(e);
          }}
        >
          {/* <div className="text-black"> */}
          <option value="price">Price ↑</option>
          <option value="-price">Price ↓</option>
          <option value="-createdAt">Recent ↓</option>
          <option value="createdAt">Recent ↑</option>
          {/* </div> */}
        </select>
        <div>
          <button
            id="dropdownDefault"
            onClick={() => {
              filter ? setFilter(false) : setFilter(true);
            }}
            data-dropdown-toggle="dropdown"
            className="text-black bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center mx-2 bg-white rounded-lg shadow dark:bg-gray-900 text-white"
            type="button"
          >
            <h3 className="text-black dark: text-white">Filter</h3>
            <svg
              className="w-[18px] h-[18px] text-gray-800 dark:text-white ml-1 pt-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 18"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.2"
                d="m2.133 2.6 5.856 6.9L8 14l4 3 .011-7.5 5.856-6.9a1 1 0 0 0-.804-1.6H2.937a1 1 0 0 0-.804 1.6Z"
              />
            </svg>
          </button>
          {showFilters()}
        </div>
      </div>
      <br />
        {/* <div className="grid md:grid-cols-3 grid-cols-3 gap-y-10 space-around space-between"> */}
        {/* <div className=" m-auto grid grid-cols-3 gap-10"> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-20 p-16">
          {products?.map((product) => {
            if (
              (categorylist.includes(product.category) ||
                categorylist.length === 0) &&
              (product.price <= price || price === 100000) &&
              (getAge(product.age) <= age || age === 240) &&
              (!search ||
                product.title.toLowerCase().includes(search) ||
                product.description.toLowerCase().includes(search) ||
                product.category.toLowerCase().includes(search))
            )
              return (
                <div key={product._id} className="rounded-lg">
                  <Link
                    to="./show-product"
                    state={{
                      data: product,
                      user: user,
                    }}
                  >
                    <div className=" max-w-sm bg-white border border-gray-200 rounded-2xl shadow dark:bg-gray-800 dark:border-gray-700">
                      <div className="m-auto p-auto h-72">
                        <img
                          className="p-8 rounded-t-lg w-auto"
                          src={`https://${BASE}/images/products/${product.images[0]}`}
                          alt="product image"
                        />
                      </div>
                      <div className="px-5 pb-5">
                        <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        {product.title.length>25? product.title.substr(0,20)+"....":product.title}
                        </h5>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                          {`${getAppxDate(product.createdAt)}`}
                        </p>
                        {/* <div className="flex items-center mt-2.5 mb-5">
                        <svg
                          className="w-4 h-4 text-yellow-300 mr-1"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 22 20"
                        >
                          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                        <svg
                          className="w-4 h-4 text-yellow-300 mr-1"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 22 20"
                        >
                          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                        <svg
                          className="w-4 h-4 text-yellow-300 mr-1"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 22 20"
                        >
                          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                        <svg
                          className="w-4 h-4 text-yellow-300 mr-1"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 22 20"
                        >
                          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                        <svg
                          className="w-4 h-4 text-gray-200 dark:text-gray-600"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 22 20"
                        >
                          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">
                          5.0
                        </span>
                      </div> */}
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            ₹ {product.price}
                          </span>
                          {/* <a
                            href="#"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          >
                            Add to cart
                          </a> */}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
          })}
        </div>
      {onLoad()};
    </>
  );
};

export default Home;
