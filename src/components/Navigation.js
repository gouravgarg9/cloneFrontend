import { Link } from "react-router-dom";
import { socket } from "./../socket";
import React, { useEffect, useState } from "react";
import Home from "../pages/Home";

const Navigation = (props) => {
  const [gotUser, setgotUser] = useState(false);
  const [notification, setNotification] = useState(false);
  const [search, setSearch] = useState();
  const [toggleCross, setToggleCross] = useState(false);
  // console.log(search);

  const message1Handler = (msg) => {
    if (msg.senderId == props.user._id) return;
    socket.emit("recieve", {
      chatId: msg.chatId,
      senderId: msg.senderId,
      recieverId: props.user._id,
    });
    setNotification(true);
    //let src = 'https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_700KB.mp3';
    //let src='http://commondatastorage.googleapis.com/codeskulptor-assets/jump.ogg'
    let src ="http://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a";
      // "http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/alien_shoot.wav";
    let audio = new Audio(src);
    audio.play();
    setTimeout(() => {
      setNotification(false);
    }, 2000);
  };

  useEffect(() => {
    if (props.user) {
      let user = props.user;
      socket.emit("join", user._id);
      socket.on("message1", message1Handler);
    }
  }, [gotUser]);

  if (props.user) {
    if (!gotUser) setgotUser(true);
    return (
      <>
        <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <Link
              to="/"
              state={{ user: props.user }}
              className="flex items-center"
            >
              {/* <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="h-8 mr-3"
                alt="Flowbite Logo"
              /> */}
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                Collegesy
              </span>
            </Link>
            <div className="flex space-x-2 md:order-2 m-2">
              <button
                type="button"
                className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                <Link
                  to="/create-product"
                  state={{
                    user: props.user,
                  }}
                >
                  Sell
                </Link>
              </button>

              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <Link
                  to="/all-chat-list"
                  state={{
                    user: props.user,
                  }}
                >
                  {notification ? <span>🔔</span> : <>Chats</>}
                </Link>
              </button>

              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <Link
                  to="/user"
                  state={{
                    user: props.user,
                  }}
                >
                  {props.user.username}
                </Link>
              </button>

              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <Link to="/logout">Log Out</Link>
              </button>
            </div>
            <div
              className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
              id="navbar-sticky"
            >
              <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                {/* <li>
                  <Link
                    to="/"
                    state={{
                      user: props.user,
                    }}
                    className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                    aria-current="page"
                  >
                    Home
                  </Link>
                </li> */}
                <li>
                  <form className="flex items-center">
                    {/* <label htmlFor="simple-search" className="sr-only">
                      Search
                    </label> */}
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 18 20"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="simple-search"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        onChange={(e) => {
                          setSearch(e.target.value);
                        }}
                        // onChange={(e)=>{search=e.target.value}}
                        placeholder="Search products..."
                        defaultValue={search}
                      />
                      {toggleCross ? (
                        <button
                          className="absolute z-1 inset-y-0 right-1 flex items-center pl-3"
                          onClick={(e) => {
                            e.preventDefault();
                            setToggleCross(false);
                            setSearch("")
                            // console.log(search)
                            props.getSearch("");
                          }}
                        >
                          <svg
                            className="w-5 h-5 text-gray-800 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                          >
                            <path
                              stroke="currentColor"
                              strokelinecap="round"
                              strokelinejoin="round"
                              strokeWidth="1"
                              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                          </svg>
                        </button>
                      ) : (
                        <></>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      onClick={(e) => {
                        e.preventDefault();
                        setToggleCross(true);
                        props.getSearch(search);
                      }}
                    >
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                      </svg>
                      <span className="sr-only">Search</span>
                    </button>
                  </form>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </>
    );
  } else {
    return (
      <>
        <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <Link to="/" className="flex items-center">
              {/* <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="h-8 mr-3"
                alt="Flowbite Logo"
              /> */}
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                Collegesy
              </span>
            </Link>
            <div className="flex space-x-2 md:order-2 m-2">
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <Link to="/login">Log In</Link>
              </button>
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <Link to="/signup">Sign Up</Link>
              </button>
            </div>
          </div>
        </nav>
      </>
    );
  }
};

export default Navigation;
