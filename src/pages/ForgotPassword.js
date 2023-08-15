import {useState} from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import Navigation from "../components/Navigation";
import 'react-toastify/dist/ReactToastify.css';
let BASE=process.env.REACT_APP_BACK_END_ROOT

// import { useLocation } from 'react-router-dom';

const ForgotPassword = () => {

    // const location = useLocation();
    const [input,setInput]=useState({
        email:"",
    })
    const [messaged,setMessage]=useState({messaged:""});

    const getdata=(e)=>{
        const {value,name}=e.target;
        setInput(()=>{
          return{
            ...input,
            [name]:value
          }
        })
      }
    
      const addData=async(e)=>{
        e.preventDefault();
        setMessage({messaged:""});
        const {email}=input
        if(email==="") toast.warning("Please enter Email")
        // else if(!email.includes("@mnnit.ac.in")) toast.warning("Please enter valid Email")
        else{
          try{
             await axios.post(`https://${BASE}/api/users/forgotPassword`,{
              email,
            }).then((res)=>{
              toast.success(res.data.message);
              console.log(res.data.message)
              setMessage({messaged: res.data.message})
            })
          } catch(e){
            console.log(e);
            setMessage({messaged: e.response.data.message})
          }
        }
      }


        const print=Object.values(messaged);

  return (
    <>
    <Navigation/>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-4">
        <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md mt-16">
          {/* <h1 className="font-bold text-center text-2xl mb-5">Your Logo</h1> */}
          <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
            <div className="px-5 py-7">
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Enter E-mail for Reset Link
              </label>
              <input
                type="email"
                name="email"
                // defaultValue={location.state.email}
                onChange={getdata}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <button
                type="button"
                onClick={addData}
                className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
              >
                <span className="inline-block mr-2">Send Mail</span>
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
      <ToastContainer/>
    </>
  )
}

export default ForgotPassword
