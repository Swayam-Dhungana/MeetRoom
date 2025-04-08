"use client";

import { MdAlternateEmail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { IoMdKey } from "react-icons/io";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { BsApple } from "react-icons/bs";
import { FaXTwitter } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authUser";

const SignUp = () => {
  const router = useRouter();
  const signup = useAuthStore((state) => state.signup);
  const loading = useAuthStore((state) => state.loading); 
  const [showPassword, setShowPassword] = useState(true);
  const [creds, setCreds] = useState({
    username: "",
    email: "",
    password: "",
    confirmPass: "",
  });

  useEffect(() => {
    fetch("http://localhost:3000/user/valid-user", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((json) => {
        if(json.success){
          router.push('/')
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      })
  }, []);
  const isDisabled = creds.password !== creds.confirmPass || creds.password === "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDisabled) return;
    
    await signup({ username: creds.username, email: creds.email, password: creds.password });
    setCreds({ username: "", email: "", password: "", confirmPass: "" });
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-[90%] max-w-sm md:max-w-md lg:max-w-md p-5 bg-gray-900 flex-col flex items-center gap-3 rounded-xl shadow-slate-500 shadow-lg">
        <img src="/logo.png" alt="logo" className="w-12 md:w-16" />
        <h1 className="text-lg md:text-xl font-semibold">Create a new Account</h1>

        <div className="w-full flex items-center gap-2 bg-gray-800 p-2 rounded-xl">
          <FaUser />
          <input
            type="text"
            name="username"
            value={creds.username}
            onChange={handleChange}
            placeholder="Username"
            className="bg-transparent border-0 w-full outline-none text-sm md:text-base"
          />
        </div>

        <div className="w-full flex items-center gap-2 bg-gray-800 p-2 rounded-xl">
          <MdAlternateEmail />
          <input
            type="email"
            value={creds.email}
            name="email"
            onChange={handleChange}
            placeholder="Email address"
            className="bg-transparent border-0 w-full outline-none text-sm md:text-base"
          />
        </div>

        <div className="w-full flex flex-col gap-3">
          <div className="w-full flex items-center gap-2 bg-gray-800 p-2 rounded-xl relative">
            <IoMdKey />
            <input
              type={showPassword ? "password" : "text"}
              placeholder="New Password"
              onChange={handleChange}
              name="password"
              value={creds.password}
              className="bg-transparent border-0 w-full outline-none text-sm md:text-base"
            />
            {showPassword ? (
              <FaRegEyeSlash className="absolute right-5 cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
            ) : (
              <FaRegEye className="absolute right-5 cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
            )}
          </div>

          <div className="w-full flex items-center gap-2 bg-gray-800 p-2 rounded-xl relative">
            <IoMdKey />
            <input
              type={showPassword ? "password" : "text"}
              name="confirmPass"
              value={creds.confirmPass}
              onChange={handleChange}
              placeholder="Retype New Password"
              className="bg-transparent border-0 w-full outline-none text-sm md:text-base"
            />
            {showPassword ? (
              <FaRegEyeSlash className="absolute right-5 cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
            ) : (
              <FaRegEye className="absolute right-5 cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
            )}
          </div>
        </div>

        <button
          className={`w-full p-2 rounded-xl mt-3 text-sm md:text-base ${
            isDisabled ? "bg-gray-700 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
          }`}
          disabled={isDisabled || loading}
          onClick={handleSubmit}
        >
          {loading ? "Signing Up ..." : "Sign Up"}
        </button>

        <p className="text-xs md:text-sm text-blue-500 text-center cursor-pointer" onClick={() => router.push("/login")}>
          Already have an account?
        </p>

        <div className="relative w-full flex items-center justify-center py-1">
          <div className="w-2/5 h-[2px] bg-gray-800"></div>
          <h3 className="font-lora text-xs md:text-sm px-4 text-gray-500">Or</h3>
          <div className="w-2/5 h-[2px] bg-gray-800"></div>
        </div>

        <div className="w-full flex items-center justify-evenly md:justify-between gap-2">
          <div className="p-2 md:px-6 lg:px-10 bg-slate-700 cursor-pointer rounded-xl hover:bg-slate-800">
            <BsApple className="text-lg md:text-xl" />
          </div>
          <div className="p-1 md:px-6 lg:px-10 bg-slate-700 cursor-pointer rounded-xl hover:bg-slate-800">
            <img src="/google-icon.png" alt="google-icon" className="w-6 md:w-8" />
          </div>
          <div className="p-2 md:px-6 lg:px-10 bg-slate-700 cursor-pointer rounded-xl hover:bg-slate-800">
            <FaXTwitter className="text-lg md:text-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
