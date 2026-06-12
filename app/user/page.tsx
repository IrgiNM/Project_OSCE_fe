"use client";

import { getTestByUser, getUserMe } from "@/lib/function/api";
import { TestType } from "@/type/testType";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  const [testUserList, setTestUserList] = useState<TestType[]>([])

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [nim, setNim] = useState("");
  const [kelas, setKelas] = useState("");
  const [id, setId] = useState(0);

  const user = {
    nama: "Nama Mahasiswa",
    kelas: "2A",
    nim: "123456789",
    email: "mahasiswa@email.com",
  };

  const dataSOP = [
    {
      nama_sop: "Pemeriksaan Tanda-Tanda Vital",
      nilai: 90,
    },
    {
      nama_sop: "Pemasangan Infus",
      nilai: 85,
    },
    {
      nama_sop: "Perawatan Luka",
      nilai: 78,
    },
    {
      nama_sop: "Pemberian Obat",
      nilai: 60,
    },
  ];

  useEffect(()=>{
    const fetch = async () => {
      const res = await getUserMe();
      if(res.status === 200){
        setId(res.data.id);
        setNama(res.data.nama_lengkap);
        setEmail(res.data.email);
        setNim(res.data.nim);
        setKelas(res.data.kelas);
      }
    }
    fetch();
  }, [])

  useEffect(()=>{
    const fetch = async () => {
      const res = await getTestByUser(id);
      if(res.status === 200){
        setTestUserList(res.data);
      }
    }
    fetch();
  }, [id])

  useEffect(()=>{
    // console.error('testUserList:', testUserList[0])
  }, [testUserList])

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-100 px-4 py-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">

        {/* HEADER */}
        <div className="overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-xl">
        <div className="flex flex-col gap-4 p-5 text-white md:flex-row md:items-center md:justify-between md:p-6">
            <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-lg bg-white/20 px-3 py-2 backdrop-blur">
                <Image src="/user.png" alt="Logo" width={12} height={12} />
                <span>Mahasiswa Keperawatan</span>
            </div>

            <h1 className="text-lg font-extrabold tracking-tight md:text-xl">
                Dashboard User
            </h1>

            <p className="mt-1 max-w-2xl text-emerald-50">
                Lihat data mahasiswa, seluruh nilai SOP tindakan keperawatan,
                dan status kelulusan.
            </p>
            </div>

            <div className="rounded-lg border border-white/40 bg-white/15 px-7 py-4 text-center backdrop-blur">
            <p className="text-emerald-50">Total SOP</p>
            <p className="text-3xl font-black">{dataSOP.length}</p>
            </div>
        </div>
        </div>

        {/* DATA MAHASISWA */}
        <div className="rounded-xl border-[.5px] border-green-700 bg-white/90 p-7 shadow-xl backdrop-blur">
        <h2 className="mb-4 flex flex-col text-[15px] font-black text-gray-800 sm:flex-row sm:items-center">
          Identitas Mahasiswa
          <span className="mt-1 text-[12px] font-light text-gray-500 sm:ml-2 sm:mt-0">
            informasi data diri mahasiswa yang sedang login
          </span>
        </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-green-600 bg-green-50 p-4">
              <p className="font-semibold text-gray-500">Nama</p>
              <p className="text-[15px] font-semibold text-gray-800">
                {nama}
              </p>
            </div>

            <div className="rounded-xl border border-green-600 bg-green-50 p-4">
              <p className="font-semibold text-gray-500">Kelas</p>
              <p className="text-[15px] font-semibold text-gray-800">
                {kelas}
              </p>
            </div>

            <div className="rounded-xl border border-cyan-600 bg-cyan-50 p-4">
              <p className="font-semibold text-gray-500">NIM</p>
              <p className="text-[15px] font-semibold text-gray-800">
                {nim}
              </p>
            </div>

            <div className="rounded-xl border border-gray-600 bg-gray-50 p-4">
              <p className="font-semibold text-gray-500">Email</p>
              <p className="text-[15px] font-semibold text-gray-800">
                {email}
              </p>
            </div>
          </div>
        </div>

        {/* NILAI SOP */}
        <div className="rounded-xl border-[.5px] border-green-700 bg-white/90 p-7 shadow-xl backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-gray-800">
                Nilai SOP
              </h2>
              <p className="text-sm text-gray-500">
                Daftar keseluruhan SOP dan nilai akhir.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-emerald-100">
            <div className="grid grid-cols-[1fr_100px] bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700">
              <p>Nama SOP</p>
              <p className="text-center">Nilai</p>
            </div>

            {testUserList.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_100px] items-center border-t border-gray-100 px-4 py-4 hover:bg-emerald-50/40"
              >
                <div>
                  <p className="font-bold text-gray-500">
                    SOP {index + 1}
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    {item.sop}
                  </p>
                </div>

                <div className="flex justify-center">
                  <div
                    className={`rounded-xl px-4 py-2 text-xl font-black ${
                      item.total_nilai >= 80
                        ? "bg-green-50 text-green-700"
                        : item.total_nilai >= 70
                        ? "bg-yellow-50 text-[#e37200]"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {item.total_nilai}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="rounded-xl bg-red-600 p-4 text-base font-black text-white shadow-xl transition hover:scale-[1.01] hover:bg-black"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Page;