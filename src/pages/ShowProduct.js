import { useNavigate, useLocation, NavLink, Link } from "react-router-dom";
import Navigation from "../components/Navigation";
import { useEffect, useState } from "react";
import Carousel from "react-elastic-carousel";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
let BASE=process.env.REACT_APP_BACK_END_ROOT

const ShowProduct = () => {
  const [photo, setPhoto] = useState();
  const location = useLocation();
  const navigate = useNavigate();
  let product = location.state.data;
  let user = location.state.user;

  //if(!user || !product)navigate('/');

  useEffect(() => {
    setPhoto(product.images[0]);
  }, []);

  if (!user) {
    return (
      <>
        <h1>
          User not Logged In. Please go to <NavLink to="/login">LogIn</NavLink>{" "}
        </h1>
      </>
    );
  }
  const openChat = async () => {
    try {
      const res = await axios.get(
      `https://${BASE}/api/chats/getChatByProductId/` + product._id
      );
      navigate("/chat", {
        state: { user: user, chat: res.data.data.chat },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleReactive = async()=>{
    try {
      const res = await axios.put(
        `https://${BASE}/api/products/reactivateProduct/` + product._id
      );
      if (res.status === 200) {
        setTimeout(() => {
          navigate("/user",{
            state: { user: user},
          });
        }, 2000);
        toast.success("Product Listed");
      }
    } catch (e) {
      console.log(e.response.data.message);
    }
  }
  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `https://${BASE}/api/products/deleteProduct/` + product._id
      );
      if (res.status === 200) {
        setTimeout(() => {
          navigate("/user",{
            state: { user: user},
          });
        }, 500);
        toast.success("Product Deleted");
      }
    } catch (e) {
      console.log(e.response.data.message);
    }
  };

  const displayUpdate = () => {
    if (user._id != product.sellerId)return;
    if(product.sold)return;
    if(!product.active) return(
      <div className="inline-block align-bottom">
        <button
              className="bg-yellow-300 opacity-75 hover:opacity-100 text-yellow-900 hover:text-gray-900 rounded-full px-10 py-2 font-semibold"
              onClick={handleReactive}
            >
              <i className="mdi mdi-delete -ml-2 mr-2" /> Reactivate
            </button>
      </div>
    )
      return (
        <>
          <div className="inline-block align-bottom">
            <button className="bg-yellow-300 opacity-75 hover:opacity-100 text-yellow-900 hover:text-gray-900 rounded-full px-10 py-2 font-semibold">
              <Link
                to="/update-product"
                state={{
                  data: product,
                  user: user,
                }}
              >
                <i className="mdi mdi-wrench -ml-2 mr-2" /> Update
              </Link>
            </button>
            <button
              className="bg-yellow-300 opacity-75 hover:opacity-100 text-yellow-900 hover:text-gray-900 rounded-full px-10 py-2 font-semibold"
              onClick={handleDelete}
            >
              <i className="mdi mdi-delete -ml-2 mr-2" /> Delete
            </button>
          </div>
        </>
      );
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

  const displayChat = () => {
    if (user._id === product.sellerId) {
      return (
        <>
          <div className="inline-block align-bottom">
            <button className="bg-yellow-300 opacity-75 hover:opacity-100 text-yellow-900 hover:text-gray-900 rounded-full px-10 py-2 font-semibold">
              <Link
                to="/chat-list"
                state={{
                  data: product,
                  user: user,
                }}
              >
                <i className="mdi mdi-chat -ml-2 mr-2" /> Chat
              </Link>
            </button>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="inline-block align-bottom">
            <button
              className="bg-yellow-300 opacity-75 hover:opacity-100 text-yellow-900 hover:text-gray-900 rounded-full px-10 py-2 font-semibold"
              onClick={openChat}
            >
              <i className="mdi mdi-chat -ml-2 mr-2" /> Chat
            </button>
          </div>
        </>
      );
    }
  };
  return (
    <>
      <Navigation user={user} />
      <style
        dangerouslySetInnerHTML={{
          __html:
            "@import url(https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/5.3.45/css/materialdesignicons.min.css);",
        }}
      />
      <div className="min-w-screen min-h-screen bg-yellow-300 flex items-center p-5 lg:p-10 overflow-hidden relative">
        <div className="w-full max-w-6xl rounded bg-white shadow-xl p-10 lg:p-20 mx-auto text-gray-800 relative md:text-left">
          <div className="md:flex items-center -mx-10">
            <div className="w-full md:w-1/2 px-10 mb-10 md:mb-0">
              <div className="relative">
                <img
                  crossOrigin="anonymous"
                  src={
                    { photo }
                      ? `https://${BASE}/images/products/${photo}`
                      : ""
                  }
                  className="w-full h-96 border-4 rounded-lg relative z-10"
                  alt="productImage"
                />
                <div className="border-4 border-yellow-200 absolute top-10 bottom-10 left-10 right-10 z-0" />
              </div>
              <div className="flex">
                <Carousel itemsToShow={3}>
                  {
                    // let arr=product.images
                    product.images?.map((image) => (
                      <img
                        crossOrigin="anonymous"
                        src={`https://${BASE}/images/products/${image}`}
                        className="flex-initial w-16 m-2 border-2 cursor-pointer rounded relative z-10"
                        alt="productImage"
                        cursor="pointer"
                        key={image}
                        onClick={() => setPhoto(image)}
                      />
                    ))
                  }
                </Carousel>
              </div>
            </div>
            <div className="w-full md:w-1/2 px-10">
              <div className="mb-10">
                <h1 className="font-bold uppercase text-2xl mb-5">
                  {product.title}
                </h1>
                <p className="text-sm">{product.description}</p>
              </div>
              <div>
                <div className="inline-block align-bottom mr-5">
                  <span className="text-xl leading-none align-baseline">₹</span>
                  <span className="font-bold text-2xl leading-none align-baseline">
                    {product.price}
                  </span>
                </div>
                {/* <div className="inline-block align-bottom">
                  <button className="bg-yellow-300 opacity-75 hover:opacity-100 text-yellow-900 hover:text-gray-900 rounded-full px-10 py-2 font-semibold">
                    <i className="mdi mdi-cart -ml-2 mr-2" /><Link to="/update-product" 
          state={product}> BUY NOW </ Link>
                  </button>
                </div> */}
              </div>
              {displayChat()}
              {displayUpdate()}
              <div>
                <div className="mb-10">
                  <p className="text-sm">{`${product.interestedViews} interested views`}</p>
                  <p className="text-sm">{`${getAge(
                    product.age
                  )} months old`}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* BUY ME A BEER AND HELP SUPPORT OPEN-SOURCE RESOURCES */}
      <div className="flex items-end justify-end fixed bottom-0 right-0 mb-4 mr-4 z-10">
        {/* <div>
          <a
            title="Buy me a beer"
            href="https://www.buymeacoffee.com/scottwindon"
            target="_blank"
            className="block w-16 h-16 rounded-full transition-all shadow hover:shadow-lg transform hover:scale-110 hover:rotate-12"
          >
            <img
              className="object-cover object-center w-full h-full rounded-full"
              src="https://i.pinimg.com/originals/60/fd/e8/60fde811b6be57094e0abc69d9c2622a.jpg"
              alt=""
            />
          </a>
        </div> */}
      </div>
      <ToastContainer />
    </>
  );
};

export default ShowProduct;
