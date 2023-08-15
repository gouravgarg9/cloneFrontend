import Navigation from "../components/Navigation";
import { useLocation, Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
axios.defaults.withCredentials = true;
let BASE=process.env.REACT_APP_BACK_END_ROOT

const UserPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProduct] = useState([]);
  const [number, setNumber] = useState();
  const [password, setPassword] = useState();
  const [ask, setAsk] = useState(false);
  const [designation, setDesignation] = useState();
  let user = location.state.user;
  // console.log(location)
  const setCourse = () => {
    let email = user.email;
    let regNo;
    if (email.includes("CA")) {
      regNo = email.substring(email.length - 21, email.length - 12);
      if (new Date().getMonth() + 1 > 5) {
        let course =
          "MCA " +
          (new Date().getFullYear() - regNo.substring(0, 4) + 1) +
          " year";
        setDesignation(course);
      } else {
        let course =
          "MCA " + (new Date().getFullYear() - regNo.substring(0, 4)) + " year";
        setDesignation(course);
      }
    } else {
      regNo = email.substring(email.length - 20, email.length - 12);
      if (new Date().getMonth() + 1 > 5) {
        let course =
          "B Tech " +
          (new Date().getFullYear() - regNo.substring(0, 4) + 1) +
          " year";
        setDesignation(course);
      } else {
        let course =
          "B Tech " +
          (new Date().getFullYear() - regNo.substring(0, 4)) +
          " year";
        setDesignation(course);
      }
    }
    // console.log(new Date().getFullYear())
    // console.log(new Date().getMonth())
    // console.log(new Date().getDate())
    // console.log(regNo.substring(0,4))
    // console.log(designation)
  };

  const getAllProducts = async () => {
    try {
      const res = await axios.get(
        `https://${BASE}/api/products/getAllProductsByUserId`
      );
      // console.log(res.data.data.products);
      setNumber(res.data.data.products.length);
      setProduct(res.data.data.products);
      //   console.log(products[5].images[0]);
      // console.log(
      //   `https://${BASE}/images/products/${products[5].images[0]}`
      // );
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setCourse();
    getAllProducts();
  }, []);

  const deleteUserFun = async () => {
    try {
      const res = await axios.delete(
        `https://${BASE}/api/users/deleteUser`,
        { data: { password } }
      );
      console.log("hit1");
      if (res.status !== 204) {
        console.log("hit");
        toast.error("Something Went Wrong!!!");
      } else {
        setTimeout(() => {
          navigate("/info");
        }, 4000);
        toast(
          "Your account will be deleted within 15 days along with all your products"
        );
      }
    } catch (e) {
      console.log(e);
    }
  };
  const askConfirmation = () => {
    if (ask) {
      return (
        <>
          <div
            id="deleteModal"
            tabIndex="-1"
            aria-hidden="true"
            className="z-50 absolute top-16 justify-center w-full lg:w-4/12 px-4 mx-auto my-auto"
          >
            <div className="relative p-4 w-full max-w-md h-full md:h-auto">
              <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                {/* <button
                    type="button"
                    className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-toggle="deleteModal"
                  > */}
                {/* <svg
                      aria-hidden="true"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg> */}
                {/* <span className="sr-only">Close modal</span> */}
                {/* </button> */}
                <svg
                  className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <p className="mb-4 text-gray-500 dark:text-gray-300">
                  Are you sure you want to delete this user?
                </p>
                <label className="font-semibold text-sm text-gray-600 pb-1 block">
                  Enter the Password to Confirm
                </label>
                <input
                  type="password"
                  name="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                />
                <div className="flex justify-center items-center space-x-4">
                  <button
                    data-modal-toggle="deleteModal"
                    type="button"
                    onClick={() => {
                      setAsk(false);
                    }}
                    className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 transition ease-in-out delay-150 hover:-translate-y-1"
                  >
                    No, cancel
                  </button>
                  <button
                    type="submit"
                    onClick={deleteUserFun}
                    className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900 transition ease-in-out delay-150 hover:-translate-y-1"
                  >
                    Yes, I'm sure
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
  };

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

  return (
    <>
      {/* component */}
      {/* <link
        rel="stylesheet"
        href="https://demos.creative-tim.com/notus-js/assets/styles/tailwind.css"
      />
      <link
        rel="stylesheet"
        href="https://demos.creative-tim.com/notus-js/assets/vendor/@fortawesome/fontawesome-free/css/all.min.css"
      /> */}
      <Navigation user={user} />

      <section className="pt-16 bg-gray-50 z-0 h-fit">
        
        <div className="w-full top-0 lg:w-4/12 px-4 mx-auto z-0">
        {askConfirmation()}
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-8 bottom-2">
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className="w-full px-4 flex justify-center">
                  <div className="relative">
                    <img
                      alt="..."
                      crossOrigin="anonymous"
                      src={`https://${BASE}/images/users/${user.photo}`}
                      //   src="https://${BASE}/images/users/xyz.png"
                      //   src="https://demos.creative-tim.com/notus-js/assets/img/team-2-800x800.jpg"
                      className="shadow-xl rounded-full h-52 align-middle border-none"
                      //   absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px
                    />
                  </div>
                </div>
                <div className="flex mt-6">
                  <button
                    className="bg-transparent hover:bg-black-500 text-black-700 font-semibold hover:text-black py-1 px-4 m-1 border border-black-500 hover:border-black rounded transition ease-in-out delay-150 hover:-translate-y-1"
                    onClick={() => {
                      navigate("/update-user", { state: { user } });
                    }}
                  >
                    Update User
                  </button>
                  <button
                    className="bg-transparent hover:bg-black-500 text-black-700 font-semibold hover:text-black py-1 px-4 m-1 border border-black-500 hover:border-black rounded transition ease-in-out delay-150 hover:-translate-y-1"
                    onClick={() => {
                      navigate("/update-password", {
                        state: user,
                      });
                    }}
                  >
                    Reset Password
                  </button>
                </div>
                {/* <div className="w-full px-4 text-center mt-10"> */}
                <div className="flex justify-center py-2 lg:pt-4 pt-4">
                  <div className="mr-4 p-3 text-center">
                    <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                      <button
                        className="flex bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-1 px-4 m-1 border border-red-500 hover:border-red-900 rounded transition ease-in-out delay-150 hover:-translate-y-1"
                        onClick={() => {
                          if (!ask) setAsk(true);
                          else setAsk(false);
                        }}
                      >
                        Delete User
                        <svg
                          className="w-6 h-6 text-gray-800 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 18 20"
                        >
                          <path d="M17 4h-4V2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2H1a1 1 0 0 0 0 2h1v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1a1 1 0 1 0 0-2ZM7 2h4v2H7V2Zm1 14a1 1 0 1 1-2 0V8a1 1 0 0 1 2 0v8Zm4 0a1 1 0 0 1-2 0V8a1 1 0 0 1 2 0v8Z" />
                        </svg>
                      </button>
                    </span>
                  </div>
                </div>

                {/* </div> */}
                <div className="w-full px-4 text-center mt-1">
                  <div className="flex justify-center py-4 lg:pt-4 pt-8">
                    <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                        {number}
                      </span>
                      <span className="text-sm text-blueGray-400">
                        Products
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <h3 className="text-xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
                  {user.username}
                </h3>
                <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                  <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400" />
                  MNNIT Allahabad, Prayagraj
                </div>
                <div className="mb-2 text-blueGray-600 mt-6">
                  <i className="fas fa-briefcase mr-2 text-lg text-blueGray-400" />
                  {designation}
                </div>
                {/* <div className="mb-2 text-blueGray-600">
                  <i className="fas fa-university mr-2 text-lg text-blueGray-400" />
                  University of Computer Science
                </div> */}
              </div>
              {/* <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-9/12 px-4">
                    <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                      An artist of considerable range, Jenna the name taken by
                      Melbourne-raised, Brooklyn-based Nick Murphy writes,
                      performs and records all of his own music, giving it a
                      warm, intimate feel with a solid groove structure. An
                      artist of considerable range.
                    </p>
                    <a
                      href="javascript:void(0);"
                      className="font-normal text-pink-500"
                    >
                      Show more
                    </a>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        {/* <footer className="relative  pt-8 pb-6 mt-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center md:justify-between justify-center">
              <div className="w-full md:w-6/12 px-4 mx-auto text-center">
                <div className="text-sm text-blueGray-500 font-semibold py-1">
                  Made with{" "}
                  <a
                    href="https://www.creative-tim.com/product/notus-js"
                    className="text-blueGray-500 hover:text-gray-800"
                    target="_blank"
                  >
                    Notus JS
                  </a>{" "}
                  by{" "}
                  <a
                    href="https://www.creative-tim.com"
                    className="text-blueGray-500 hover:text-blueGray-800"
                    target="_blank"
                  >
                    {" "}
                    Creative Tim
                  </a>
                  .
                </div>
              </div>
            </div>
          </div>
        </footer> */}
      </section>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-20 p-16">
          {products?.map((product) => (
            <div key={product._id}>
              <Link
                to="/show-product"
                state={{
                  data: product,
                  user,
                }}
                style={{opacity: product.active?1:0.4}}
              >
                <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 grid grid-cols-3">
                  <img
                    className="rounded-t-lg h-52 w-auto"
                    //  {`../../../backend/images/products/${product.images[0]}`}
                    //  src={require(`../../../backend/images/products/${product.images[0]}`)}
                    crossOrigin="anonymous"
                    // src={"https://${BASE}/images/products/64940ab0cf981febfb877f12_0.jpg"}
                    src={`https://${BASE}/images/products/${product.images[0]}`}
                    alt=""
                  />
                  <div className="p-5">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {product.title.length>25? product.title.substr(0,20)+"....":product.title}
                    </h5>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                      {product.description.substr(0,40)+"...."}
                    </p>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                      {product.createdAt.substr(0,10)}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
      <ToastContainer />
    </>
  );
};

export default UserPage;
