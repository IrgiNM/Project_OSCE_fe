"use client";
import Navbar from '@/components/navbar';
import dataDosen from '@/lib/data/dataDosen';
import dataSiswa from '@/lib/data/dataSiswa';
import dataSOP from '@/lib/data/dataSOP';
import { createDetailTest, createSesiUjian, getListSopByName, getTestById, uploadTest } from '@/lib/function/api';
import { getToken, logoutUser, setDosenPilihan, setMahasiswaPilihan, setSesiPilihan, setSOPPilihan } from '@/lib/function/token';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Page = () => {
    const router = useRouter();
    const {siswaList} = dataSiswa();
    const {dosenList} = dataDosen();
    const {soalSOPJenisList} = dataSOP();
    const [siswaDipilih , setSiswaDipilih] = useState<number[]>([])
    const [dosenDipilih , setDosenDipilih] = useState<number[]>([])
    const [SOPDipilih , setSOPDipilih] = useState<string[]>([])
    const [isSiswaDipilihDetail, setIsSiswaDipilihDetail] = useState(false)
    const [isDosenDipilihDetail, setIsDosenDipilihDetail] = useState(false)
    const [isSOPDipilihDetail, setIsSOPDipilihDetail] = useState(false)
    const [isMulai, setIsMulai] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isPilih, setIsPilih] = useState('mahasiswa')

    const [searchMahasiswa, setSearchMahasiswa] = useState("");
    const [searchDosen, setSearchDosen] = useState("");
    const [searchSOP, setSearchSOP] = useState("");

    const filteredSiswaList = siswaList.filter((item) =>
      item.nama_lengkap?.toLowerCase().includes(searchMahasiswa.toLowerCase()) ||
      item.nim?.toLowerCase().includes(searchMahasiswa.toLowerCase()) ||
      item.kelas?.toLowerCase().includes(searchMahasiswa.toLowerCase())
    );
    
    const filteredDosenList = dosenList.filter((item) =>
      item.nama_lengkap?.toLowerCase().includes(searchDosen.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchDosen.toLowerCase())
    );
    
    const filteredSOPList = soalSOPJenisList.filter((item) =>
      item.toLowerCase().includes(searchSOP.toLowerCase())
    );

    useEffect(()=>{
      const token = getToken()
      if (!token) {
        router.push("/");
      }
    }, [])

    const handleCreateDetailSOP = async () => {
      try {
        const SOPToken: string[] = JSON.parse(
          localStorage.getItem("sop") || "[]"
        );
    
        const sesiToken = localStorage.getItem("sesi") || "0";
    
        // 1. ambil SOP id
        const sopResponses = await Promise.all(
            SOPToken.map((nama_sop) => getListSopByName(nama_sop))
        );
        // console.error("SOPToken =", SOPToken);
        // console.error("sopResponses =", sopResponses);
        
        sopResponses.forEach((res, index) => {
            // console.error(`SOP Response ${index}:`, res.data);
        });
        
        const sopIds = sopResponses
        .filter((res) => res?.status === 200)
        .flatMap((res: any) =>
            res.data.map((soal: any) => soal.id)
        );
        
        // console.error("sopIds =", sopIds);
    
        // 2. ambil test id berdasarkan sesi
        const testRes = await getTestById(Number(sesiToken));
    
        const testIds =
          testRes?.status === 200
            ? testRes.data.map((t: any) => t.id)
            : [];
    
        // 3. create detail test secara berurutan
        const detailRequests = [];

        for (const testId of testIds) {
          for (const sopId of sopIds) {
            detailRequests.push(
              createDetailTest({
                test: testId,
                soal_sop: sopId,
                nilai: 0,
              })
            );
          }
        }

        await Promise.all(detailRequests);
    
        // console.error("Detail SOP created successfully");
    
      } catch (error) {
        // console.error("Error create detail SOP:", error);
      }
    };

    const handleSubmit = async () => {
      setIsLoading(true);
    
      try {
        // 1. create sesi
        const res = await createSesiUjian();
        const sesiId = res.data.id;
    
        // 2. simpan pilihan ke localStorage / state
        setMahasiswaPilihan(siswaDipilih);
        setDosenPilihan(dosenDipilih);
        setSOPPilihan(SOPDipilih);
        setSesiPilihan(sesiId);
    
        const mahasiswaToken: number[] = JSON.parse(
          localStorage.getItem("mahasiswa") || "[]"
        );
    
        const SOPToken: string[] = JSON.parse(
          localStorage.getItem("sop") || "[]"
        );
    
        // ambil id dosen yang sedang login
        const idDosen = Number(localStorage.getItem("id_dosen"));
    
        if (!idDosen) {
          // alert("ID dosen tidak ditemukan. Silakan login ulang.");
          return;
        }
    
        // 3. generate semua request
        const requests = SOPToken.flatMap((nama_sop: string) => {
          const mahasiswaReq = mahasiswaToken.map((id: number) =>
            uploadTest({
              sesi: sesiId,
              user: id,
              sop: nama_sop,
              total_nilai: 0,
            })
          );
    
          // dosen hanya 1, dari user login
          const dosenReq = uploadTest({
            sesi: sesiId,
            user: idDosen,
            sop: nama_sop,
            total_nilai: 0,
          });
    
          return [...mahasiswaReq, dosenReq];
        });
    
        // 4. execute all
        await Promise.all(requests);
    
        console.log("Upload success");
    
        await handleCreateDetailSOP();
    
        router.push("/admin/testPage");
      } catch (error) {
        // console.error("Error uploading test:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const selectedSiswa = siswaList.filter((item) =>
        siswaDipilih.includes(item.id)
      );
      
      const selectedDosen = dosenList.filter((item) =>
        dosenDipilih.includes(item.id)
      );
      
      const selectedSOP = soalSOPJenisList.filter((item) =>
        SOPDipilih.includes(item)
      );
      
      const tabMenus = [
        {
          key: "mahasiswa",
          label: "Mahasiswa",
          total: siswaDipilih.length,
        },
        // {
        //   key: "dosen",
        //   label: "Dosen",
        //   total: dosenDipilih.length,
        // },
        {
          key: "sop",
          label: "SOP",
          total: SOPDipilih.length,
        },
      ];


    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-100 px-4 py-6">

          {/* NAVBAR */}
          <Navbar></Navbar>

          <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      
            {/* HEADER */}
            <div className="overflow-hidden mt-[60px] rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-xl">
              <div className="flex flex-col gap-4 p-6 text-white md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-lg bg-white/20 px-3 py-2 backdrop-blur">
                    <Image src="/doctor.png" alt="Logo" width={12} height={12} />
                    <span>OSCE Nursing Session</span>
                  </div>
                  <h1 className="text-xl font-extrabold tracking-tight">
                    Buat Sesi Ujian Keperawatan
                  </h1>
                  <p className="max-w-2xl  text-emerald-50">
                    Pilih mahasiswa, dosen penguji, dan SOP tindakan keperawatan untuk memulai sesi OSCE.
                  </p>
                </div>
      
                <div className="rounded-lg bg-white/15 p-4 border-[.5px] border-white text-center backdrop-blur">
                  <p className=" text-emerald-50">Total Pilihan</p>
                  <p className="text-3xl font-black">
                    {siswaDipilih.length + dosenDipilih.length + SOPDipilih.length}
                  </p>
                </div>
              </div>
            </div>
      
            {/* SUMMARY CARDS
            <div className="flex flex-row gap-4 md:grid-cols-3">
              <div className="rounded-xl flex-1 border border-emerald-100 bg-white p-5 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className=" font-medium text-gray-500">Mahasiswa</p>
                    <p className="text-3xl font-black text-emerald-700">
                      {siswaDipilih.length}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border-[.5px] border-emerald-500 bg-emerald-100 text-2xl">
                    <Image src="/user-active.png" alt="Logo" width={15} height={15} />
                  </div>
                </div>
              </div>
      
              {/* <div className="rounded-xl border border-cyan-100 bg-white p-5 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className=" font-medium text-gray-500">Dosen Penguji</p>
                    <p className="text-3xl font-black text-cyan-700">
                      {dosenDipilih.length}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border-[.5px] border-cyan-500 bg-cyan-100 text-2xl">
                    <Image src="/dosen-active.png" alt="Logo" width={15} height={15} />
                  </div>
                </div>
              </div>
      
              <div className="rounded-xl flex-1 border border-blue-100 bg-white p-5 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className=" font-medium text-gray-500">SOP Tindakan</p>
                    <p className="text-3xl font-black text-blue-700">
                      {SOPDipilih.length}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border-[.5px] border-blue-500 bg-blue-100 text-2xl">
                    <Image src="/doctor-active.png" alt="Logo" width={15} height={15} />
                  </div>
                </div>
              </div>
            </div> */}
      
            {/* TAB MENU */}
            <div className="rounded-xl border border-green-600 bg-white/80 p-3 shadow-lg backdrop-blur">
            <div className="grid grid-cols-2 gap-3">
              {tabMenus.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setIsPilih(tab.key)}
                  className={`
                    rounded-xl px-3 py-5 font-bold transition-all duration-200
                    ${
                      isPilih === tab.key
                        ? "bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg"
                        : "bg-[#ddf0f7] text-gray-600 hover:bg-[#cbe1e9] hover:text-emerald-700"
                    }
                  `}
                >
                  <div className="flex min-h-[95px] flex-col items-center justify-center gap-2">
                    {tab.key === "mahasiswa" && (
                      <Image
                        src={isPilih === tab.key ? "/user.png" : "/user-active.png"}
                        alt="Logo"
                        width={16}
                        height={16}
                      />
                    )}

                    {tab.key === "dosen" && (
                      <Image
                        src={isPilih === tab.key ? "/dosen.png" : "/dosen-active.png"}
                        alt="Logo"
                        width={16}
                        height={16}
                      />
                    )}

                    {tab.key === "sop" && (
                      <Image
                        src={isPilih === tab.key ? "/doctor.png" : "/doctor-active.png"}
                        alt="Logo"
                        width={16}
                        height={16}
                      />
                    )}

                    <span
                      className={`
                        text-sm
                        ${
                          isPilih === tab.key
                            ? "text-white"
                            : tab.key === "mahasiswa"
                            ? "text-green-800"
                            : tab.key === "dosen"
                            ? "text-cyan-800"
                            : "text-blue-800"
                        }
                      `}
                    >
                      {tab.label}
                    </span>

                    <span
                      className={`
                        flex min-w-[76px] items-center justify-center rounded-full px-3 py-1 text-xs
                        ${
                          isPilih === tab.key
                            ? "bg-white/20 text-white"
                            : "bg-white text-gray-500"
                        }
                      `}
                    >
                      {tab.total}
                      <span className="hidden lg:inline">&nbsp;dipilih</span>
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
      
            {/* MAHASISWA */}
            {isPilih === "mahasiswa" && (
              <div className="rounded-xl border border-green-600 bg-white p-6 px-7 shadow-xl">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-black text-gray-800">
                      Pilih Mahasiswa
                    </h2>
                    <p className=" text-gray-500">
                      Mahasiswa yang dipilih akan masuk ke sesi ujian.
                    </p>
                  </div>
      
                  <button
                    onClick={() => setIsSiswaDipilihDetail(true)}
                    className="rounded-lg bg-emerald-100 px-4 py-2  font-bold border-[.5px] border-[#5feaa0] text-emerald-700 hover:bg-emerald-200"
                  >
                    Lihat {siswaDipilih.length}
                  </button>
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    value={searchMahasiswa}
                    onChange={(e) => setSearchMahasiswa(e.target.value)}
                    placeholder="Cari nama, NIM, atau kelas mahasiswa..."
                    className="w-full rounded-xl border border-emerald-200 bg-emerald-50/50 px-4 py-3 font-semibold text-gray-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  />
                </div>
      
                <div className="h-[430px] space-y-3 overflow-auto pr-1">
                  {filteredSiswaList.map((item, index) => {
                    const isSelected = siswaDipilih.includes(item.id);
      
                    return (
                      <button
                        onClick={() => {
                          if (isSelected) {
                            setSiswaDipilih([]);
                          } else {
                            setSiswaDipilih([item.id]);
                          }
                        }}
                        key={index}
                        className={`
                          flex w-full items-center justify-between rounded-xl border px-4 py-4 transition-all
                          ${
                            isSelected
                              ? "border-green-500 bg-emerald-50 shadow-sm"
                              : "border-gray-100 bg-white hover:border-green-700 hover:bg-emerald-50/40"
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`
                              flex h-11 w-11 items-center justify-center rounded-xl font-black
                              ${
                                isSelected
                                  ? "bg-emerald-600 text-white"
                                  : "bg-gray-100 text-gray-500"
                              }
                            `}
                          >
                            {isSelected ? "✓" : "M"}
                          </div>
      
                          <div className='flex flex-col items-start'>
                            <p className="font-bold text-gray-800">
                              {item.nama_lengkap}
                            </p>
                            <p className="text-xs text-gray-500">
                              Kelas : {item.kelas}
                            </p>
                          </div>
                        </div>
      
                        <button
                          onClick={() => {
                            if (isSelected) {
                              setSiswaDipilih([]);
                            } else {
                              setSiswaDipilih([item.id]);
                            }
                          }}
                          className={`
                            rounded-lg px-4 py-2  font-bold text-white transition
                            ${
                              isSelected
                                ? "bg-[#ff186d] hover:bg-[#ff75a7]"
                                : "bg-emerald-600 hover:bg-emerald-700"
                            }
                          `}
                        >
                          {isSelected ? "Batal" : "Pilih"}
                        </button>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
      
            {/* DOSEN */}
            {isPilih === "dosen" && (
              <div className="rounded-xl border border-cyan-100 bg-white p-5 shadow-xl">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-black text-gray-800">
                      Pilih Dosen Penguji
                    </h2>
                    <p className=" text-gray-500">
                      Dosen akan dimasukkan sebagai penguji dalam sesi OSCE.
                    </p>
                  </div>
      
                  <button
                    onClick={() => setIsDosenDipilihDetail(true)}
                    className="rounded-lg bg-cyan-100 px-4 py-2  font-bold text-cyan-700 hover:bg-cyan-200"
                  >
                    Lihat {dosenDipilih.length}
                  </button>
                </div>
      
                <div className="h-[430px] space-y-3 overflow-auto pr-1">
                  {dosenList.map((item, index) => {
                    const isSelected = dosenDipilih.includes(item.id);
      
                    return (
                      <div
                        key={index}
                        className={`
                          flex w-full items-center justify-between rounded-xl border px-4 py-4 transition-all
                          ${
                            isSelected
                              ? "border-cyan-300 bg-cyan-50 shadow-sm"
                              : "border-gray-100 bg-white hover:border-cyan-200 hover:bg-cyan-50/40"
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`
                              flex h-11 w-11 items-center justify-center rounded-xl font-black
                              ${
                                isSelected
                                  ? "bg-cyan-600 text-white"
                                  : "bg-gray-100 text-gray-500"
                              }
                            `}
                          >
                            {isSelected ? "✓" : "D"}
                          </div>
      
                          <div>
                            <p className="font-bold text-gray-800">
                              {item.nama_lengkap}
                            </p>
                            <p className="text-xs text-gray-500">
                              Penguji keterampilan keperawatan
                            </p>
                          </div>
                        </div>
      
                        <button
                          onClick={() => {
                            if (isSelected) {
                              setDosenDipilih(
                                dosenDipilih.filter((id) => id !== item.id)
                              );
                            } else {
                              setDosenDipilih([...dosenDipilih, item.id]);
                            }
                          }}
                          className={`
                            rounded-lg px-4 py-2  font-bold text-white transition
                            ${
                              isSelected
                                ? "bg-[#ff186d] hover:bg-[#ff75a7]"
                                : "bg-cyan-600 hover:bg-cyan-700"
                            }
                          `}
                        >
                          {isSelected ? "Batal" : "Pilih"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
      
            {/* SOP */}
            {isPilih === "sop" && (
              <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-xl">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-black text-gray-800">
                      Pilih SOP Tindakan
                    </h2>
                    <p className=" text-gray-500">
                      Pilih tindakan keperawatan yang akan diujikan.
                    </p>
                  </div>
      
                  <button
                    onClick={() => setIsSOPDipilihDetail(true)}
                    className="rounded-lg bg-blue-100 px-4 py-2 border-[.5px] border-[#50b0e8] font-bold text-blue-700 hover:bg-blue-200"
                  >
                    Lihat {SOPDipilih.length}
                  </button>
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    value={searchSOP}
                    onChange={(e) => setSearchSOP(e.target.value)}
                    placeholder="Cari nama SOP tindakan..."
                    className="w-full rounded-xl border border-blue-200 bg-blue-50/50 px-4 py-3 font-semibold text-gray-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>
      
                <div className="h-[430px] space-y-3 overflow-auto pr-1">
                  {filteredSOPList.map((item, index) => {
                    const isSelected = SOPDipilih.includes(item);
      
                    return (
                      <button
                        onClick={() => {
                          if (isSelected) {
                            setSOPDipilih([]);
                          } else {
                            setSOPDipilih([item]);
                          }
                        }}
                        key={index}
                        className={`
                          flex w-full items-center justify-between rounded-xl border px-4 py-4 transition-all
                          ${
                            isSelected
                              ? "border-blue-300 bg-blue-50 shadow-sm"
                              : "border-gray-100 bg-white hover:border-[#1584c5] hover:bg-blue-50/40"
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`
                              flex h-11 w-11 items-center justify-center rounded-xl text-lg font-black
                              ${
                                isSelected
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-500"
                              }
                            `}
                          >
                            {isSelected ? (
                                <p>✓</p>
                            ):(
                                <Image src="/doctor-active.png" alt="Logo" width={15} height={15} />
                            )}
                          </div>
      
                          <div className='flex flex-col items-start'>
                            <p className="font-bold text-gray-800">{item}</p>
                            <p className="text-xs text-gray-500">
                              Standar operasional tindakan keperawatan
                            </p>
                          </div>
                        </div>
      
                        <button
                          onClick={() => {
                            if (isSelected) {
                              setSOPDipilih([]);
                            } else {
                              setSOPDipilih([item]);
                            }
                          }}
                          className={`
                            rounded-lg px-4 py-2  font-bold text-white transition
                            ${
                              isSelected
                                ? "bg-[#ff186d] hover:bg-[#ff75a7]"
                                : "bg-blue-600 hover:bg-blue-700"
                            }
                          `}
                        >
                          {isSelected ? "Batal" : "Pilih"}
                        </button>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
      
            {/* BUTTON BUAT SESI */}
            <button
              onClick={() => setIsMulai(true)}
              disabled={siswaDipilih.length === 0 || SOPDipilih.length === 0}
              className={`rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 p-4 text-base font-black text-white shadow-xl transition hover:scale-[1.01] hover:from-emerald-700 hover:to-cyan-700 ${(siswaDipilih.length === 0 || SOPDipilih.length === 0)&&'opacity-30'}`}
            >
              + Buat Sesi Test Keperawatan
            </button>
      
            {/* MODAL DETAIL MAHASISWA */}
            {isSiswaDipilihDetail && (
              <>
                <div className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm" />
                <div className="fixed left-1/2 top-1/2 z-50 flex h-[520px] w-[92%] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl bg-white p-5 shadow-2xl">
                  <h3 className="text-xl font-black text-gray-800">
                    Mahasiswa Dipilih
                  </h3>
                  <p className="mb-4  text-gray-500">
                    Total {selectedSiswa.length} mahasiswa
                  </p>
      
                  <div className="flex-1 space-y-2 overflow-auto pb-4">
                    {selectedSiswa.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 font-semibold text-gray-700"
                      >
                        {item.nama_lengkap}
                      </div>
                    ))}
                  </div>
      
                  <button
                    onClick={() => setIsSiswaDipilihDetail(false)}
                    className="rounded-xl bg-gray-900 p-3 font-bold text-white"
                  >
                    Tutup
                  </button>
                </div>
              </>
            )}
      
            {/* MODAL DETAIL DOSEN */}
            {isDosenDipilihDetail && (
              <>
                <div className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm" />
                <div className="fixed left-1/2 top-1/2 z-50 flex h-[520px] w-[92%] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl bg-white p-5 shadow-2xl">
                  <h3 className="text-xl font-black text-gray-800">
                    Dosen Dipilih
                  </h3>
                  <p className="mb-4  text-gray-500">
                    Total {selectedDosen.length} dosen
                  </p>
      
                  <div className="flex-1 space-y-2 overflow-auto pb-4">
                    {selectedDosen.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-cyan-100 bg-cyan-50 px-4 py-3 font-semibold text-gray-700"
                      >
                        {item.nama_lengkap}
                      </div>
                    ))}
                  </div>
      
                  <button
                    onClick={() => setIsDosenDipilihDetail(false)}
                    className="rounded-xl bg-gray-900 p-3 font-bold text-white"
                  >
                    Tutup
                  </button>
                </div>
              </>
            )}
      
            {/* MODAL DETAIL SOP */}
            {isSOPDipilihDetail && (
              <>
                <div className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm" />
                <div className="fixed left-1/2 top-1/2 z-50 flex h-[520px] w-[92%] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl bg-white p-5 shadow-2xl">
                  <h3 className="text-xl font-black text-gray-800">
                    SOP Dipilih
                  </h3>
                  <p className="mb-4  text-gray-500">
                    Total {selectedSOP.length} SOP tindakan
                  </p>
      
                  <div className="flex-1 space-y-2 overflow-auto pb-4">
                    {selectedSOP.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 font-semibold text-gray-700"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
      
                  <button
                    onClick={() => setIsSOPDipilihDetail(false)}
                    className="rounded-xl bg-gray-900 p-3 font-bold text-white"
                  >
                    Tutup
                  </button>
                </div>
              </>
            )}
      
            {/* MODAL KONFIRMASI */}
            {isMulai && (
              <>
                <div className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm" />
                <div className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-2xl">
                  <div className="mb-5 text-center">
                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-green-100 text-3xl">
                        <Image src="/doctor-b.png" alt="Logo" width={25} height={25} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-800">
                      Mulai Sesi Test?
                    </h3>
                    <p className="mt-2  text-gray-500">
                      Pastikan data mahasiswa, dosen, dan SOP sudah benar sebelum membuat sesi.
                    </p>
                  </div>
      
                  <div className="mb-5 flex flex-row gap-3">
                    <div className="rounded-xl flex-1 border border-emerald-100 bg-emerald-50 p-4 text-center">
                      <p className="text-xs font-semibold text-gray-500">
                        Mahasiswa
                      </p>
                      <p className="text-2xl font-black text-emerald-700">
                        {siswaDipilih.length}
                      </p>
                    </div>
      
                    {/* <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-4 text-center">
                      <p className="text-xs font-semibold text-gray-500">
                        Dosen
                      </p>
                      <p className="text-2xl font-black text-cyan-700">
                        {dosenDipilih.length}
                      </p>
                    </div> */}
      
                    <div className="rounded-xl flex-1 border border-blue-100 bg-blue-50 p-4 text-center">
                      <p className="text-xs font-semibold text-gray-500">
                        SOP
                      </p>
                      <p className="text-2xl font-black text-blue-700">
                        {SOPDipilih.length}
                      </p>
                    </div>
                  </div>
      
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleSubmit()}
                      disabled={isLoading}
                      className="rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 p-3 font-black text-white hover:from-emerald-700 hover:to-cyan-700"
                    >
                      {isLoading ? "Membuat Sesi..." : "Ya, Buat Sesi Sekarang"}
                    </button>
      
                    <button
                      onClick={() => setIsMulai(false)}
                      className="rounded-xl bg-gray-900 p-3 font-bold text-white hover:bg-black"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </>
            )}

            
          </div>
        </div>
      );
}

export default Page