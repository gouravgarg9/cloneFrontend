import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Navigation from "../components/Navigation";
import ClipLoader from "react-spinners/ClipLoader";
import "react-toastify/dist/ReactToastify.css";
axios.defaults.withCredentials = true;
let BASE=process.env.REACT_APP_BACK_END_ROOT

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const location = useLocation();
  const [input, setInput] = useState({
    email: "",
    username: "",
    password: "",
    passwordconfirm: "",
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

  const addData = async(e) => {
    e.preventDefault();
    setMessage({ messaged: "" });
    const { email, username, password, passwordConfirm } = input;
    if (email === "") toast.warning("Please enter Email");
    //else if (!email.includes("@mnnit.ac.in")) toast.warning("Please enter valid Email");
    else if (username === "") toast.warning("Please enter Username");
    else if (password === "") toast.warning("Please enter Password");
    else if (password.length < 8)
      toast.warning("Password length shoul be greater than 5");
    else if (passwordConfirm === "")
      toast.warning("Please confirm your Password");
    else if (passwordConfirm !== password)
      toast.warning("Confirm Password doesn't match");
    else {
      try {
        setloading(true)
        await axios
          .post(`https://${BASE}/api/users/signup`, {
            email,
            username,
            password,
            passwordConfirm,
          })
          .then((res) => {
            if (res.status === 404 || res.status === 200) {
              toast.success("User Registered Successfully");
              setTimeout(() => {
                navigate("/askotp");
              }, 1000);
            }
          });
      } catch (e) {
        // console.log(e);
        setloading(false)
        setMessage({ messaged: e.response.data.message });
      }
    }
  };
  const print = Object.values(messaged);
  // if (loading) {
  //   return (
  //     <>
  //       <h1>
  //         ...loading <ClipLoader color="#000000" />
  //       </h1>
  //     </>
  //   );
  // }

  return (
    <>
      <Navigation user={location.state?.user} />
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-4">
        <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
          {/* <h1 className="font-bold text-center text-2xl mb-5">Your Logo</h1> */}
          <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
            <div className="px-5 py-7">
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                // value={input.email}
                onChange={getdata}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Username
              </label>
              <input
                type="text"
                name="username"
                // value={input.username}
                onChange={getdata}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Password
              </label>
              <input
                type="password"
                name="password"
                // value={input.password}
                onChange={getdata}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Confirm Password
              </label>
              <input
                type="password"
                name="passwordConfirm"
                // value={input.passwordconfirm}
                onChange={getdata}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <button
                type="button"
                onClick={addData}
                className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
              >
                <span className="inline-block mr-2">SignUp</span>
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
                {(loading ? <ClipLoader size={15} color="#ffffff" />:<></>)}
              </button>
              <label className="font-semibold text-sm text-gray-600 py-4 pb-1 block">
                {print}
              </label>
            </div>
            {/* <div className="py-5">
              <div className="grid grid-cols-2 gap-1">
                <div className="text-center sm:text-left whitespace-nowrap">
                  <button className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-4 h-4 inline-block align-text-top"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="inline-block ml-1">Forgot Password</span>
                  </button>
                </div> */}
            {/* <div className="text-center sm:text-center  whitespace-nowrap"> */}
            {/* <button className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-4 h-4 inline-block align-text-bottom	"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg> */}
            {/* <h3 className=" ml-1">Already have an Account?</h3> */}
            {/* <h3 className=" ml-1">SignUp</h3> */}
            {/* </button> */}
            {/* </div> */}
            {/* </div>
            </div> */}
          </div>
          <div className="text-center sm:text-center whitespace-nowrap">
            <h1>
              Already have an Account? <NavLink to="/login">LogIn</NavLink>
            </h1>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default SignUp;
