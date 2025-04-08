"use client";

import { MdAlternateEmail } from "react-icons/md";
import { FaFingerprint } from "react-icons/fa";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { BsApple } from "react-icons/bs";
import { FaXTwitter } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authUser";
import toast from "react-hot-toast";
const Login = () => {
  const {  setLoading, loading } = useAuthStore();
  const router = useRouter();
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
  
  const [creds, setcreds] = useState({  email: "", password: "" });
  const handleSubmit = async (e: any) => {
    setLoading(true);
   try{
      const response=await fetch('http://localhost:3000/auth/login',{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: creds.email, password:creds.password}),
        credentials:'include'
      })
      const json=await response.json()
      setLoading(false)
      if(json.success){
        console.log(json)
        router.push('/')
        toast.success(json.msg)
      }else{
        toast.error(json.msg || json.error.issues[0].message)
      }
   }catch{
     setLoading(false)
     setcreds({email:'', password:''})
      toast.error('Error Logging In')
   }
  };
  const handleChange = (e: any) => {
    setcreds({ ...creds, [e.target.name]: e.target.value });
  };
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const togglePasswordView = () => setShowPassword(!showPassword);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-[90%] max-w-sm md:max-w-md lg:max-w-md p-5 bg-gray-900 flex-col flex items-center gap-3 rounded-xl shadow-slate-500 shadow-lg">
        <img src="/logo.png" alt="logo" className="w-12 md:w-16" />
        <h1 className="text-lg md:text-xl font-semibold">Welcome Back</h1>

        <div className="w-full flex flex-col gap-3">
          <div className="w-full flex items-center gap-2 bg-gray-800 p-2 rounded-xl">
            <MdAlternateEmail />
            <input
              type="email"
              placeholder="Email address"
              name="email"
              value={creds.email}
              onChange={handleChange}
              className="bg-transparent border-0 w-full outline-none text-sm md:text-base"
            />
          </div>

          <div className="w-full flex items-center gap-2 bg-gray-800 p-2 rounded-xl relative">
            <FaFingerprint />
            <input
              name="password"
              value={creds.password}
              onChange={handleChange}
              type={showPassword ? "password" : "text"}
              placeholder="Password"
              className="bg-transparent border-0 w-full outline-none text-sm md:text-base"
            />
            {showPassword ? (
              <FaRegEyeSlash
                className="absolute right-5 cursor-pointer"
                onClick={togglePasswordView}
              />
            ) : (
              <FaRegEye
                className="absolute right-5 cursor-pointer"
                onClick={togglePasswordView}
              />
            )}
          </div>
        </div>

        <button
          className="w-full p-2 bg-blue-500 rounded-xl hover:cursor-pointer mt-3 hover:bg-blue-600 text-sm md:text-base"
          onClick={handleSubmit}
        >
          {!loading?'Login':'Loggin In'}
        </button>
        <p className="text-xs md:text-sm text-gray-500 text-center hover:cursor-pointer">
          Don't have an account?{" "}
          <span
            className="text-white"
            onClick={() => {
              router.push("/signup");
            }}
          >
            Sign up
          </span>
        </p>
        <p className="text-xs md:text-sm text-blue-500 text-center hover:cursor-pointer">
          Forgot Password?
        </p>

        <div className="relative w-full flex items-center justify-center py-1">
          <div className="w-2/5 h-[2px] bg-gray-800"></div>
          <h3 className="font-lora text-xs md:text-sm px-4 text-gray-500">
            Or
          </h3>
          <div className="w-2/5 h-[2px] bg-gray-800"></div>
        </div>

        <div className="w-full flex items-center justify-evenly md:justify-between gap-2">
          <div className="p-2 md:px-6 lg:px-10 bg-slate-700 cursor-pointer rounded-xl hover:bg-slate-800">
            <BsApple className="text-lg md:text-xl" />
          </div>
          <div className="p-1 md:px-6 lg:px-10 bg-slate-700 cursor-pointer rounded-xl hover:bg-slate-800">
            <img
              src="/google-icon.png"
              alt="google-icon"
              className="w-6 md:w-8"
            />
          </div>
          <div className="p-2 md:px-6 lg:px-10 bg-slate-700 cursor-pointer rounded-xl hover:bg-slate-800">
            <FaXTwitter className="text-lg md:text-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
