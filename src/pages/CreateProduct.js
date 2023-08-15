import { useState } from "react";
import axios from "axios";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Navigation from "../components/Navigation";
import "react-toastify/dist/ReactToastify.css";
axios.defaults.withCredentials = true;
let BASE=process.env.REACT_APP_BACK_END_ROOT

const CreateProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state.user;
  //if(!user)navigate('/');

  const [input, setInput] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    age: "",
  });

  const [messaged, setMessage] = useState({ messaged: "" });

  const getdata = (e) => {
    const { value, name } = e.target;
    setInput(() => {
      return {
        ...input,
        [name]: value,
      };
    });
  };

  const getToday = ()=>{
    const today = new Date();
    return today.toISOString().substr(0, 10);
  }

  const addData = (e) => {
    e.preventDefault();
    setMessage({ messaged: "" });
    const { title, description, price, category, age } = input;
    if (title === "") toast.warning("Please enter Title");
    else if (description === "") toast.warning("Please enter Description");
    else if (price === "") toast.warning("Please enter Price");
    else if (price < 0) toast.warning("Please enter valid Price");
    else if (age === "") toast.warning("Please enter Age of product");
    else {
      try {
        axios
          .post(`https://${BASE}/api/products/createProduct`, {
            title,
            description,
            price,
            category,
            age,
          })
          .then((res) => {
            if (res.status === 200) {
              const prod = res.data.data.product;
              toast.success("Product Created");
              navigate("/update-product", {
                state: { data: prod, user },
              });
            }
          });
      } catch (e) {
        console.log(e);
        setMessage({ messaged: e.response.data.message });
      }
    }
  };
  const print = Object.values(messaged);
  const optionsArray = [
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
  if (!user) {
    return (
      <>
        <h1>
          User not Logged In. Please go to <NavLink to="/login">LogIn</NavLink>{" "}
        </h1>
      </>
    );
  } else {
    return (
      <>
        <Navigation user={user} />
        <div className="h-screen bg-gray-100 flex flex-col justify-center sm:py-4">
          <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
            {/* <h1 className="font-bold text-center text-2xl mb-5">Your Logo</h1> */}
            <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200 mt-16">
              <div className="px-5 py-7">
                <label className="font-semibold text-sm text-gray-600 pb-1 block">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  onChange={getdata}
                  className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                />
                <label className="font-semibold text-sm text-gray-600 pb-1 block">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  onChange={getdata}
                  className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                />
                <label className="font-semibold text-sm text-gray-600 pb-1 block">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  onChange={getdata}
                  className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                />
                <label className="font-semibold text-sm text-gray-600 pb-1 block">
                  Category
                </label>
                <select
                  name="category"
                  className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                  onChange={getdata}
                >
                  {optionsArray.map((val) => {
                    return <option value={val}>{val}</option>;
                  })}
                </select>
                <label className="font-semibold text-sm text-gray-600 pb-1 block">
                  Date of Purchase
                </label>
                <input
                  type="date"
                  name="age"
                  onChange={getdata}
                  max={getToday()}
                  className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                />
                <button
                  type="button"
                  onClick={addData}
                  className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
                >
                  <span className="inline-block mr-2">Create Product</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-4 h-4 inline-block"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
                <label className="font-semibold text-sm text-gray-600 py-4 pb-1 block">
                  {print}
                </label>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </>
    );
  }
};
export default CreateProduct;
