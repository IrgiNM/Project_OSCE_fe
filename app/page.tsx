"use client";

import { login } from "@/lib/function/api";
import { getToken, setToken } from "@/lib/function/token";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await login({
        email,
        password
      });
      if (res.status === 200) {
        console.log(res.data);
        setEmail('');
        setPassword('');
        alert("Login berhasil!");
        setToken(res.data.token);
        if (res.data.user.is_staff === true){
          router.push("/admin");
        }
      }
    } catch (error: any) {
      console.log(error.response?.data);
      alert(
        error.response?.data?.message ||
        "Terjadi kesalahan"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100">
      <div className="w-[500px] h-[500px] bg-white rounded-lg flex flex-col justify-center items-center border border-black gap-5 px-10 shadow-lg">
        
        <p className="text-[30px] font-bold">Login</p>

        <div className="w-full flex flex-col gap-2">
          <label className="font-semibold">Email</label>
          <input
            type="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-400 rounded-md px-4 py-3 outline-none focus:border-black"
          />
        </div>

        <div className="w-full flex flex-col gap-2">
          <label className="font-semibold">Password</label>
          <input
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-400 rounded-md px-4 py-3 outline-none focus:border-black"
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-black text-white py-3 rounded-md font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {isLoading ? "Loading..." : "Login"}
        </button>

      </div>
    </div>
  );
}