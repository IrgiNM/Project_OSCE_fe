"use client";

import { getUserMe } from "@/lib/function/api";
import { logoutUser } from "@/lib/function/token";
import { get } from "http";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Navbar = () => {
  const router = useRouter();

  const [selectedProfile, setSelectedProfile] = useState(false);
  const [namaDosen, setNamaDosen] = useState("");
  const [emailDosen, setEmailDosen] = useState("");
  const [openMenu, setOpenMenu] = useState(false);

  // Dummy data dulu
  // Nanti bisa diganti dari API getMe()

  useEffect(()=>{
    const fetch = async () => {
      const res = await getUserMe();
      if(res.status === 200){
        setNamaDosen(res.data.nama_lengkap);
        setEmailDosen(res.data.email);
        localStorage.setItem("nama_lengkap", res.data.nama_lengkap);
        localStorage.setItem("id_dosen", res.data.id);
      }
    }
    fetch();
  }, [])

  const profileDosen = {
    nama_lengkap: "Nama Lengkap Dosen",
    email: "dosen@gmail.com",
  };

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-30 border-b border-white/60 bg-white/80 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
          {/* LOGO */}
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600">
              <Image src="/doctor.png" alt="Logo" width={20} height={20} />
            </div>
  
            <div className="min-w-0">
              <h1 className="truncate font-black text-gray-800">
                SIPOSCE App
              </h1>
              <p className="hidden text-xs text-gray-500 sm:block">
                Admin Panel
              </p>
            </div>
          </div>
  
          {/* MENU KANAN */}
          <div className="relative flex items-center gap-2">
            {/* MENU DESKTOP */}
            <div className="hidden items-center gap-2 md:flex">
              <button
                onClick={() => router.push("/admin/dosen")}
                className="rounded-lg px-3 py-2 text-xs font-bold text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
              >
                Dosen
              </button>
  
              <button
                onClick={() => router.push("/admin/dashboard")}
                className="rounded-lg px-3 py-2 text-xs font-bold text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
              >
                Mahasiswa
              </button>
  
              <button
                onClick={() => router.push("/admin")}
                className="rounded-lg px-3 py-2 text-xs font-bold text-gray-600 hover:bg-cyan-50 hover:text-cyan-700"
              >
                Test
              </button>
  
              <button
                onClick={() => {
                  logoutUser();
                  router.push("/");
                }}
                className="rounded-lg bg-[#ff186d] px-7 py-2 text-xs font-bold text-white hover:bg-[#ff75a7]"
              >
                Logout
              </button>
  
              <button
                onClick={() => setSelectedProfile(true)}
                className="rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:scale-[1.02]"
              >
                Profile
              </button>
            </div>
  
            {/* TOMBOL TITIK 3 MOBILE */}
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-2xl font-black text-gray-700 shadow-sm hover:bg-gray-50 md:hidden"
            >
              ⋮
            </button>
  
            {/* DROPDOWN MOBILE */}
            {openMenu && (
              <div className="absolute right-0 top-12 z-50 w-44 overflow-hidden rounded-xl border border-cyan-700 bg-white shadow-xl md:hidden">
                <button
                  onClick={() => {
                    setOpenMenu(false);
                    router.push("/admin/dosen");
                  }}
                  className="block w-full px-4 py-3 text-left text-sm font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  Dosen
                </button>
  
                <button
                  onClick={() => {
                    setOpenMenu(false);
                    router.push("/admin/dashboard");
                  }}
                  className="block w-full px-4 py-3 text-left text-sm font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  Mahasiswa
                </button>
  
                <button
                  onClick={() => {
                    setOpenMenu(false);
                    router.push("/admin");
                  }}
                  className="block w-full px-4 py-3 text-left text-sm font-bold text-gray-700 hover:bg-cyan-50 hover:text-cyan-700"
                >
                  Test
                </button>
  
                <button
                  onClick={() => {
                    setOpenMenu(false);
                    setSelectedProfile(true);
                  }}
                  className="block w-full px-4 py-3 text-left text-sm font-bold text-gray-700 hover:bg-cyan-50 hover:text-cyan-700"
                >
                  Profile
                </button>
  
                <button
                  onClick={() => {
                    setOpenMenu(false);
                    logoutUser();
                    router.push("/");
                  }}
                  className="block w-full bg-[#ff186d] px-4 py-3 text-left text-sm font-bold text-white hover:bg-[#ff75a7]"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
  
      {/* POPUP PROFILE DOSEN */}
      {selectedProfile && (
        <>
          <div
            onClick={() => setSelectedProfile(false)}
            className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm"
          />
  
          <div className="fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[92%] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded-xl bg-white shadow-2xl md:flex-row md:overflow-visible">
            <button
              onClick={() => setSelectedProfile(false)}
              className="absolute right-3 top-3 z-50 hidden md:flex lg:flex h-[40px] w-[40px] items-center justify-center rounded-xl bg-white shadow-md transition-all duration-100 hover:bg-[#cc005f] md:-right-[60px] md:top-1 md:h-[45px] md:w-[45px] md:border-2 md:border-white md:bg-transparent"
            >
              <Image src="/close.png" alt="Close" width={15} height={15} />
            </button>
  
            {/* KIRI */}
            <div className="w-full rounded-t-xl border-b border-gray-100 bg-gradient-to-br from-emerald-600 to-cyan-600 p-6 text-white md:w-[38%] md:rounded-l-xl md:rounded-tr-none md:border-b-0 md:border-r md:p-10">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl border-[.5px] border-white bg-white/20 text-2xl font-black uppercase backdrop-blur">
                {namaDosen ? namaDosen.charAt(0) : "D"}
              </div>
  
              <h2 className="text-xl font-black">Profile Dosen</h2>
  
              <p className="mt-1 text-sm text-emerald-50 md:text-base">
                Informasi akun dosen yang sedang login.
              </p>
  
              <div className="mt-6 rounded-xl border-[.5px] border-white bg-white/15 p-4 backdrop-blur">
                <p className="text-sm text-emerald-50">Role</p>
                <p className="text-lg font-black">Dosen</p>
              </div>
            </div>
  
            {/* KANAN */}
            <div className="flex flex-1 flex-col rounded-b-xl bg-white p-6 md:rounded-r-xl md:rounded-bl-none md:p-10">
              <div className="mb-5 pr-10 md:pr-0">
                <h3 className="text-lg font-black text-gray-800">
                  Detail Profile
                </h3>
                <p className="text-sm text-gray-500 md:text-base">
                  Data nama lengkap dosen dan email.
                </p>
              </div>
  
              <div className="space-y-4">
                <div className="rounded-xl border-[.5px] border-cyan-600 bg-white p-4 shadow-md">
                  <p className="font-semibold text-gray-500">
                    Nama Lengkap Dosen
                  </p>
                  <p className="mt-1 break-words text-sm font-black text-gray-800 md:text-base">
                    {namaDosen || "-"}
                  </p>
                </div>
  
                <div className="rounded-xl border-[.5px] border-cyan-600 bg-white p-4 shadow-md">
                  <p className="font-semibold text-gray-500">Email</p>
                  <p className="mt-1 break-words text-sm font-black text-gray-800 md:text-base">
                    {emailDosen || "-"}
                  </p>
                </div>
              </div>
  
              <div className="mt-6 flex justify-end md:hidden">
                <button
                  onClick={() => setSelectedProfile(false)}
                  className="rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 px-6 py-3 font-black text-white shadow-md transition hover:scale-[1.02]"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;