import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Navigation from "../components/Navigation";
import "react-toastify/dist/ReactToastify.css";
axios.defaults.withCredentials = true;
let BASE=process.env.REACT_APP_BACK_END_ROOT

const UpdateProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  let product = location.state.data;
  let user = location.state.user;
  //if(!product || !user)navigate('/');
  const [input, setInput] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    age: "",
  });

  const [prevImages, setPrevImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [messaged, setMessage] = useState({ messaged: "" });

  const getphotos = (e) => {
    const files = e.target.files;
    setNewImages((prev) => [...prev, ...files]);
  };

  const getdata = (e) => {
    const { value, name } = e.target;
    setInput(() => {
      return {
        ...input,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    setPrevImages(product.images);
    setInput({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      age: product.age,
    });
  }, []);

  const addData = (e) => {
    e.preventDefault();

    const formdata = new FormData();

    newImages.forEach((item) => {
      formdata.append("productImages", item);
    });

    prevImages.forEach((item) => {
      formdata.append("prevImages", item);
    });

    setMessage({ messaged: "" });

    const { title, description, price, category, age } = input;
    formdata.append("title", title);
    formdata.append("description", description);
    formdata.append("price", price);
    formdata.append("category", category);
    formdata.append("age", age);
    for (var key of formdata.entries()) {
      console.log(key[0] + ", " + key[1]);
    }
    // const { productImages } = files;
    // console.log(title, description, price);
    // const id=prodId;
    // if (title === "") alert("Please enter Title");
    // else if (description === "") alert("Please enter Description");
    // else if (price === "") alert("Please enter Price");
    // else {
    // console.log(formdata)
    try {
      axios
        .put(
          `https://${BASE}/api/products/updateProduct/` + product._id,
          formdata,
          /*title,
            description,
            price,*/
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            toast.success("Product Updated Successfully");
            setTimeout(() => {
              navigate("/");
            }, 500);
          }
        });
    } catch (e) {
      console.log(e);
      setMessage({ messaged: e.response.data.message });
    }
    // }
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
  // {
  //   Array.from(files).map(photo=>{
  //     return{
  //       <span>
  //         <img
  //           src={photo? URL.createObjectURL(photo): null} />
  //       </span>
  //     }
  //   })
  // }

  if (!user) {
    // console.log("hit")
    return (
      <>
        <h1>
          User not Logged In. Please go to <NavLink to="/login">LogIn</NavLink>{" "}
        </h1>
      </>
    );
  }
  const getToday = ()=>{
    const today = new Date();
    return today.toISOString().substr(0, 10);
  }
  return (
    <>
      <Navigation user={user} />
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-4">
        <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
          {/* <h1 className="font-bold text-center text-2xl mb-5">Your Logo</h1> */}
          <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
            <div className="px-5 py-7">
              <div>
                {prevImages &&
                  prevImages.length > 0 &&
                  prevImages.map((image, index) => {
                    return (
                      <div key={image}>
                        <img
                          src={`https://${BASE}/images/products/${image}`}
                          alt={image}
                          height="50"
                          width="50"
                        />
                        <button
                          onClick={() => {
                            setPrevImages((prev) => {
                              const newPrevImages = prev.filter((img) => {
                                return img !== image;
                              });
                              return newPrevImages;
                            });
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}

                {newImages &&
                  newImages.map((image, index) => {
                    return (
                      <div key={image}>
                        <img
                          src={URL.createObjectURL(image)}
                          alt={image}
                          height="50"
                          width="50"
                        />
                        <button
                          onClick={() => {
                            setNewImages((prev) => {
                              const newNewImages = prev.filter((img) => {
                                return img !== image;
                              });
                              return newNewImages;
                            });
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
              </div>
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Upload Photos
              </label>
              <input
                type="file"
                multiple
                name="productImages"
                onChange={getphotos}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                required
              />

              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={input.title}
                onChange={getdata}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={input.description}
                onChange={getdata}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={input.price}
                onChange={getdata}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Category
              </label>
              <select
                name="category"
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                value={input.category}
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
                value={input.age?.substr(0,10)}
                max={getToday()}
                onChange={getdata}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <button
                type="button"
                onClick={addData}
                className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
              >
                <span className="inline-block mr-2">Update Product</span>
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
};

export default UpdateProduct;
