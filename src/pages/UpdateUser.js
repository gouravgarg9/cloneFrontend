import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Navigation from "../components/Navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
axios.defaults.withCredentials = true;
let BASE=process.env.REACT_APP_BACK_END_ROOT

const UpdateUser = () => {
  const navigate = useNavigate();
  const [loading, setloading] = useState(true);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState();
  const [messaged, setMessage] = useState({ messaged: "" });
  const [showPhoto,setShowPhoto] = useState();
  const [input, setInput] = useState({username: ""});

  const getUser = async () => {
    try {
      const res = await axios.get(`https://${BASE}/api/users/checkLoggedIn`);
      if (res.status === 200) {
        setUser(res.data.data.user);
        setShowPhoto(`https://${BASE}/images/users/${res.data.data.user.photo || 'xyz.png'}`);
      }
    } catch (e) {
      console.log(e);
      navigate("/info");
    }
    setloading(false);
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

  const getphotos = (e) => {
    const files = e.target.files;
    setPhoto(files[0]);
    setRemovePhoto(false);
    setShowPhoto(URL.createObjectURL(files[0]));
  };
  const addData = (e) => {
    e.preventDefault();
    const formdata = new FormData();

    if(photo) formdata.append("userImage", photo);
    formdata.append("removePhoto", removePhoto);

    setMessage({ messaged: "" });

    const { username } = input;
    formdata.append("username", username);
    sendData(formdata);
  };

const sendData=(formdata)=>{
  try {
    axios
      .patch(
        `https://${BASE}/api/users/updateMe/`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          toast.success("User Updated Successfully");
          setTimeout(() => {
            navigate("/user", {
              state: {
                user: res.data.data.user,
              },
            });
          },500);
        }
      });
  } catch (e) {
    console.log(e);
    setMessage({ messaged: e.response.data.message });
  }
}
  const removePhotoFun=(e)=>{
    e.preventDefault();
    setRemovePhoto(true);
    setShowPhoto();
  }
  const print = Object.values(messaged);

  useEffect(() => {
    getUser();
  }, []);

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

  return (
    <>
      <Navigation user={user} />
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-4">
        <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md mt-10">
          {/* <h1 className="font-bold text-center text-2xl mb-5">Your Logo</h1> */}
          <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
            <div className="w-full px-4 flex justify-center">
              <div className="relative">
                
                <img
                  alt="..."
                  crossOrigin="anonymous"
                  src={showPhoto || `https://${BASE}/images/users/xyz.png`}
                  //   src=
                  //   src="https://demos.creative-tim.com/notus-js/assets/img/team-2-800x800.jpg"
                  className="shadow-xl rounded-full h-52 align-middle border-none"
                  //   absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px
                />
              </div>
              <div>
              <button className="rounded-full border-2" onClick={removePhotoFun}>✕</button>
              </div>
            </div>
            <div className="px-5 py-7">
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Upload Photo
              </label>
              <input
                type="file"
                name="userImage"
                onChange={getphotos}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />

              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Username
              </label>
              <input
                type="text"
                name="username"
                defaultValue={user.username}
                onChange={getdata}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />

              <button
                type="button"
                onClick={addData}
                className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
              >
                <span className="inline-block mr-2">Update User</span>
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

export default UpdateUser;
