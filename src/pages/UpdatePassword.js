import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import axios from "axios";
let BASE=process.env.REACT_APP_BACK_END_ROOT

const UpdatePassword = () => {
  const location = useLocation();
  console.log(location);
  const navigate = useNavigate();
  const [input, setInput] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [messaged, setMessage] = useState({ messaged: "" });

  const getdata = (e) => {
    // console.log(e.target.value);
    const { value, name } = e.target;
    // console.log(value,name)
    setInput(() => {
      return {
        ...input,
        [name]: value,
      };
    });
  };

  const addData = async (e) => {
    e.preventDefault();
    setMessage({ messaged: "" });
    const { currentPassword, newPassword, confirmNewPassword } = input;
    if (currentPassword === "") toast.warning("Please enter Current Password");
    else if (newPassword === "") toast.warning("Please enter New Password");
    else if (newPassword === currentPassword)
      toast.warning("New Password matches with Old Password");
    else if (newPassword.length < 8) toast.warning("New Password is too short");
    else if (confirmNewPassword === "")
      toast.warning("Please confirm New Password");
    else {
      const res = await axios.patch(
        `https://${BASE}/api/users/updatePassword`,
        {
          currentPassword,
          newPassword,
          confirmNewPassword,
          //   token: window.location.search
        }
      );

      if (res.status === 200) navigate("/login");
      else setMessage({ messaged: e.response.data.message });
    }
  };
  const print = Object.values(messaged);
  return (
    <>
      <Navigation user={location.state} />
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-4">
        <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
          {/* <h1 className="font-bold text-center text-2xl mb-5">Your Logo</h1> */}
          <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
            <div className="px-5 py-7">
              {/* <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Email
              </label>
              <input
                type="email"
                name="email"
                onChange={getdata}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              /> */}
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Old Password
              </label>
              <input
                type="password"
                name="currentPassword"
                onChange={getdata}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                onChange={getdata}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmNewPassword"
                onChange={getdata}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <button
                type="button"
                onClick={addData}
                className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
              >
                <span className="inline-block mr-2">Reset Password</span>
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
              {/* <div className="py-5"> */}
                <div className="grid grid-cols-2 gap-1">
                  {/* <div className="text-center sm:text-left whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => {
                        navigate("/forgot-password");
                      }}
                      className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset"
                    >
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
                  {/* <h3 className=" ml-1">LogIn</h3> */}
                  {/* </button> */}
                  {/* </div> */}
                </div>
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default UpdatePassword;
