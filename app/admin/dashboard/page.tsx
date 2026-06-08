"use client";

import Navbar from "@/components/navbar";
import dataJenisSOP from "@/lib/data/dataJenisSOP";
import dataSiswa from "@/lib/data/dataSiswa";
import dataTest from "@/lib/data/dataTest";
import { getDetailTestById } from "@/lib/function/api";
import { detailTestType } from "@/type/detailTestType";
import { UserType } from "@/type/userType";
import Image from "next/image";
import { useEffect, useState } from "react";

const Page = () => {
  const { siswaList } = dataSiswa();
  const { JenisSOPList } = dataJenisSOP();

  const [pisckSiswa, setPickSiswa] = useState<number>(0);
  const { testUserList, testAllUserList } = dataTest(pisckSiswa);

  const [search, setSearch] = useState("");
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(false);
  const [selectedDetailResult, setSelectedDetailResult] = useState(false);
  const [selectedPeringkat, setSelectedPeringkat] = useState(false);

  const [tesDipilih, setTesDipilih] = useState<number>(0);
  const [namaSOP, setNamaSOP] = useState<string>("");
  const [detailTestData, setDetailTestData] = useState<detailTestType[]>([]);
  const [mahasiswaAktif, setMahasiswaAktif] = useState<UserType | null>(null);

    const groupedData = detailTestData.reduce((acc: any, item) => {
        const category = item.soal_sop_detail.category || "Lainnya";
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {});

    const hitungRataRataMahasiswa = (idMahasiswa: number) => {
      const testMahasiswa = testAllUserList.filter(
        (test) => Number(test.user) === Number(idMahasiswa)
      );
    
      const totalNilai = testMahasiswa.reduce(
        (acc, test) => acc + test.total_nilai,
        0
      );
    
      const totalMaksimal = JenisSOPList.length * 100;
    
      if (totalMaksimal === 0) return 0;
    
      return (totalNilai / totalMaksimal) * 100;
    };
    
    const dataPeringkatMahasiswa = siswaList
      .map((mahasiswa) => {
        const testMahasiswa = testAllUserList.filter(
          (test) => Number(test.user) === Number(mahasiswa.id)
        );
    
        const totalNilai = testMahasiswa.reduce(
          (acc, test) => acc + test.total_nilai,
          0
        );
    
        const rataRata = hitungRataRataMahasiswa(mahasiswa.id);
    
        return {
          id: mahasiswa.id,
          nama_lengkap: mahasiswa.nama_lengkap,
          kelas: mahasiswa.kelas,
          jumlahSOP: testMahasiswa.length,
          totalNilai,
          rataRata,
          status: rataRata > 75 ? "Lulus" : "Tidak Lulus",
        };
      })
      .sort((a, b) => b.rataRata - a.rataRata);

    useEffect(() => {
      if (tesDipilih === 0) return;
    
      const fetch = async () => {
        try {
          const response = await getDetailTestById(tesDipilih);
          if (response.status === 200) {
            setDetailTestData(response.data);
          }
        } catch (error) {
          console.error("Error fetching detail test:", error);
        }
      };
    
      fetch();
    }, [tesDipilih]);

    useEffect(()=>{
        setNamaSOP(detailTestData.length > 0
            ? detailTestData[0].soal_sop_detail.nama_sop
            : "")
    }, [detailTestData])
  

  const filteredMahasiswa = siswaList.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.nama_lengkap.toLowerCase().includes(keyword) ||
      item.kelas.toLowerCase().includes(keyword)
    //   getStatusLulus(item.detail_sop).toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-100">
      {/* NAVBAR */}
      <Navbar></Navbar>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 pb-6 pt-24">
        {/* HEADER */}
        <div className="overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-xl">
          <div className="flex flex-col gap-4 p-5 text-white md:flex-row md:items-center md:justify-between md:p-6">
            <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-lg bg-white/20 px-3 py-2 backdrop-blur">
                  <Image src="/user.png" alt="Logo" width={10} height={10} />
                  <span>Mahasiswa Keperawatan</span>
                </div>
              <h1 className="text-xl font-extrabold tracking-tight">
                Dashboard User
              </h1>
              <p className="max-w-2xl  text-emerald-50">
                Lihat data mahasiswa, jumlah SOP yang sudah diselesaikan, nilai,
                dan status kelulusan.
              </p>
            </div>

            <div className="rounded-lg bg-white/15 p-4 px-7 border-[.5px] border-white text-center backdrop-blur">
              <p className=" text-emerald-50">Total</p>
              <p className="text-3xl font-black">{siswaList.length}</p>
            </div>
          </div>
        </div>

        {/* SEARCH FILTER */}
        <div className="rounded-xl bg-white/90 p-4 shadow-md backdrop-blur border-[.5px] border-green-800">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-black text-gray-800">Data Mahasiswa</h2>
              <p className=" text-gray-500">
                Cari berdasarkan nama, kelas, atau status kelulusan.
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 sm:max-w-sm sm:flex-row">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari mahasiswa..."
                className="w-full rounded-xl border border-gray-400 bg-white px-4 py-3 font-semibold text-gray-700 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />

              <button
                onClick={() => setSelectedPeringkat(true)}
                className="rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 px-5 py-3 font-black text-white shadow-md transition hover:scale-[1.02] flex flex-row"
              >
                <div className="w-[20px] h-[20px] pb-1 flex justify-center items-center">
                  <Image src="/crown.png" alt="Logo" width={12} height={12} />  
                </div>
                <p className="ml-1">Peringkat</p>
              </button>
            </div>
          </div>
        </div>

        {/* LIST CARD MAHASISWA */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredMahasiswa.map((item, index) => {

            return (
              <button
                key={item.id}
                onClick={() => {
                  setMahasiswaAktif(item);
                  setPickSiswa(item.id);
                  setSelectedMahasiswa(true);
                }}
                className="rounded-xl border-[.5px] border-cyan-600 bg-white p-5 text-left shadow-md transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#dfffe7] border-[.5px] border-[#5feaa0] font-black text-green-700 text-[13px]">
                      {index + 1}
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate font-black text-gray-800">
                        {item.nama_lengkap}
                      </h2>
                      <p className=" text-gray-500">
                        Kelas {item.kelas}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-md border-[.5px] px-3 py-1 text-[10px] font-bold ${
                      (parseFloat((((testAllUserList.filter((test) => Number(test.user) === item.id)).reduce((acc, test) => acc + test.total_nilai, 0) /
                      (JenisSOPList.length*100))*100).toFixed(2)) > 75)
                        ? "bg-green-500 text-white"
                        : "bg-[#ff056d] text-white"
                    }`}
                  >
                    {(
                      parseFloat((((testAllUserList.filter((test) => Number(test.user) === item.id)).reduce((acc, test) => acc + test.total_nilai, 0) /
                      (JenisSOPList.length*100))*100).toFixed(2)) > 75
                        ? "Lulus"
                        : "Tidak Lulus"
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-blue-50 p-4">
                    <p className="font-semibold text-gray-500">
                      SOP Selesai
                    </p>
                    <p className="text-2xl font-black text-cyan-700">
                      {testAllUserList.filter((test) => Number(test.user) === item.id).length}
                    </p>
                  </div>

                  <div className="rounded-lg bg-cyan-50 p-4">
                    <p className="font-semibold text-gray-500">
                      Rata-rata
                    </p>
                    <p className="text-2xl font-black text-cyan-700">
                      {/* {rataRata} */}
                      {(
                        ((testAllUserList.filter((test) => Number(test.user) === item.id)).reduce((acc, test) => acc + test.total_nilai, 0) /
                        (JenisSOPList.length*100))*100
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}

          {filteredMahasiswa.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
              <p className="text-lg font-black text-gray-700">
                Data tidak ditemukan
              </p>
              <p className="mt-1  text-gray-500">
                Coba cari dengan nama, kelas, atau status yang berbeda.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* POPUP DETAIL MAHASISWA */}
      {selectedMahasiswa && (
        <>
          <div
            onClick={() => setSelectedMahasiswa(false)}
            className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm"
          />


          <div className="fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[92%] max-w-5xl -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl bg-white shadow-2xl md:flex-row">
            <button onClick={()=>setSelectedMahasiswa(false)} className="absolute top-1 -right-[60px] z-50 w-[45px] h-[45px] rounded-xl border-2 border-white flex justify-center items-center hover:bg-[#cc005f] transition-all duration-100">
              <Image src="/close.png" alt="Logo" width={15} height={15} />
            </button>
            {/* KIRI DETAIL SISWA */}
            <div className="w-full border-b border-gray-100 bg-gradient-to-br from-emerald-600 to-cyan-600 p-5 text-white md:w-[38%] md:border-b-0 md:border-r rounded-s-xl">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 text-2xl font-black backdrop-blur border-[.5px] border-white">
                  {mahasiswaAktif?.nama_lengkap?.charAt(0)}
                </div>

                {/* <button
                  onClick={() => setSelectedMahasiswa(false)}
                  className="rounded-lg bg-white/20 px-3 py-2  font-bold text-white hover:bg-white/30"
                >
                  Tutup
                </button> */}
              </div>

              <h2 className="text-2xl font-black">{mahasiswaAktif?.nama_lengkap}</h2>

              <p className="mt-1 text-emerald-50">
                Mahasiswa kelas {mahasiswaAktif?.kelas}
              </p>

              <div className="mt-6 space-y-3">
                <div className="rounded-xl bg-white/15 p-4 backdrop-blur">
                  <p className=" text-emerald-50">Kelas</p>
                  <p className="text-xl font-black">
                    {mahasiswaAktif?.kelas}
                  </p>
                </div>

                <div className="rounded-xl bg-white/15 p-4 backdrop-blur">
                  <p className=" text-emerald-50">Jumlah SOP Selesai</p>
                  <p className="text-xl font-black">
                    {testUserList.length}
                  </p>
                </div>

                <div className="rounded-xl bg-white/15 p-4 backdrop-blur border-[.5px] border-white">
                  <p className=" text-emerald-50">Rata-rata Nilai</p>
                  <p className="text-xl font-black">
                  {
                    ((testUserList.reduce((acc, test) => acc + test.total_nilai, 0) /
                    (JenisSOPList.length*100))*100).toFixed(2)
                  }  
                  </p>
                </div>

                <div className="rounded-xl bg-white/15 p-4 backdrop-blur border-[.5px] border-white">
                  <p className=" text-emerald-50">Status</p>
                  <p
                    className={`text-xl font-black `}
                  >
                    {(
                      parseFloat(((testUserList.reduce((acc, test) => acc + test.total_nilai, 0) /
                      (JenisSOPList.length*100))*100).toFixed(2)) > 75
                        ? "Lulus"
                        : "Tidak Lulus"
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* KANAN DETAIL SOP */}
            <div className="flex max-h-[55vh] flex-1 flex-col bg-white p-5 md:max-h-[90vh] rounded-e-xl">
              <div className="mb-4">
                <h3 className="text-xl font-black text-gray-800">
                  Detail Nilai SOP
                </h3>
                <p className=" text-gray-500">
                  Daftar SOP tindakan dan nilai mahasiswa.
                </p>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {testUserList.map((sop, index) => {
                  const isNilaiLulus = sop.total_nilai >= 70;

                  return (
                    <button
                      onClick={() => {
                        setTesDipilih(sop.id);
                        setSelectedDetailResult(true);
                      }}
                      key={index}
                      className={`flex items-center w-full justify-between gap-3 rounded-xl border-[.5px] border-green-700 bg-white p-4 ${isNilaiLulus ? "border-green-700 hover:bg-green-100" : "border-red-700 hover:bg-red-100"}  hover:border-2 transition`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 font-black  ${isNilaiLulus ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {index + 1}
                        </div>

                        <div className="min-w-0 flex flex-col items-start">
                          <p className=" text-black font-bold">
                            {sop.sop}
                          </p>
                          <p className=" text-gray-400">
                            Nilai tindakan SOP
                          </p>
                        </div>
                      </div>

                      <div className="text-center">
                        <p
                          className={`text-xl font-black ${
                            isNilaiLulus ? "text-emerald-700" : "text-red-600"
                          }`}
                        >
                          {sop.total_nilai}
                        </p>
                        <p
                          className={`text-xs font-bold ${
                            isNilaiLulus ? "text-emerald-600" : "text-red-600"
                          }`}
                        >
                          {isNilaiLulus ? "Lulus" : "Tidak"}
                        </p>
                      </div>
                    </button>
                  );
                })}

                {testUserList.length === 0 && (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
                    <p className="font-black text-gray-700">
                      Belum ada SOP yang diselesaikan
                    </p>
                    <p className="mt-1  text-gray-500">
                      Nilai SOP mahasiswa ini masih kosong.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      
      
      {/* POPUP DETAIL MAHASISWA */}
      {selectedDetailResult && (
        <>
          <div
            onClick={() => setSelectedDetailResult(false)}
            className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-sm"
          />
          <div className="fixed left-1/2 top-1/2 z-70 flex max-h-[90vh] w-[92%] max-w-5xl -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl bg-white shadow-2xl md:flex-col px-10 py-5">
            <button onClick={()=>setSelectedDetailResult(false)} className="absolute top-1 -right-[60px] z-50 w-[45px] h-[45px] rounded-xl border-2 border-white flex justify-center items-center hover:bg-[#cc005f] transition-all duration-100">
              <Image src="/close.png" alt="Logo" width={15} height={15} />
            </button>
            {tesDipilih === 0 && (
              <p className=" font-semibold text-gray-500">
                Pilih SOP untuk melihat detail nilai
              </p>
            )}
      
            {/* HEADER CARD */}
            <div className="w-full mb-2 flex flex-row justify-between items-center">
              <div>
                <h1 className="text-xl font-black text-gray-800">
                  {namaSOP}
                </h1>
      
                <p className=" text-gray-500">
                  Checklist Penilaian SOP
                </p>
              </div>
      
              <div className="rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 px-5 py-3 text-center text-white shadow-md">
                <p className=" text-emerald-50">Nilai</p>
                <p className="text-2xl font-black">
                    {detailTestData.length > 0
                    ? (
                        (
                          detailTestData.reduce((acc, item) => acc + item.nilai, 0)
                          /
                          (detailTestData.reduce((total, item) => {
                            return total + item.soal_sop_detail.bobot;
                          }, 0))
                        ) * 100).toFixed(0)
                    : 0
                    }
                </p>
              </div>
            </div>
      
            {/* ISI CHECKLIST */}
            <div className="w-full h-[72%] mt-5 lg:h-[77%] overflow-y-auto flex flex-col gap-5 pr-1">
              {Object.entries(groupedData).map(([category, items]: any) => (
                <div
                  key={category}
                  className="w-full bg-white  border-[.5px] border-[#43c5b6] rounded-lg overflow-hidden shrink-0 shadow-md"
                >
                  {/* Header Kategori */}
                  <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-100">
                    <h2 className="font-black text-emerald-700">
                      {category}
                    </h2>
                  </div>
      
                  {/* Header Nilai */}
                  <div className="flex flex-row justify-between bg-gray-50 font-bold text-center border-b border-gray-100 sticky top-0 text-gray-600">
                    <div className="text-left p-3">Soal</div>
                    <div className="text-left p-3">Nilai</div>
                  </div>
      
                  {items.map((item: any, index: number) => (
                    <div
                      key={item.id}
                      className="flex flex-row justify-between border-b border-gray-100 last:border-b-0 items-center hover:bg-emerald-50/30 transition"
                    >
                      <div className="p-3  text-gray-700 leading-6">
                        <span className="font-black mr-2 text-emerald-700">
                          {index + 1}.
                        </span>
                        {item.soal_sop_detail.soal}
                      </div>
      
                      <div className="flex flex-col justify-center items-center gap-2 p-3 lg:flex-row">
                        <p className='opacity-50 mr-5'>bobot : {item.soal_sop_detail.bobot}</p>
                        <div className="flex justify-center">
                          <div
                            className={`px-4 h-9 flex justify-center items-center rounded-lg border font-black transition ${
                              item.nilai === 1
                                ? "bg-red-500 text-white border-red-500 shadow-md"
                                : "bg-white text-gray-500 border-gray-200"
                            }`}
                          >
                            no
                          </div>
                        </div>
      
                        <div className="flex justify-center">
                          <div
                            className={`h-9 px-4 flex justify-center items-center rounded-lg border font-black transition ${
                              item.nilai === item.soal_sop_detail.bobot
                                ? "bg-green-500 text-white border-green-500 shadow-md"
                                : "bg-white text-gray-500 border-gray-200"
                            }`}
                          >
                            yes
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div> 
          </div>
        </>
      )}

      {/* POPUP PERINGKAT MAHASISWA */}
      {selectedPeringkat && (
        <>
          <div
            onClick={() => setSelectedPeringkat(false)}
            className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm"
          />

          <div className="fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[92%] max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl bg-white shadow-2xl">
            <button
              onClick={() => setSelectedPeringkat(false)}
              className="absolute top-1 -right-[60px] z-50 flex h-[45px] w-[45px] items-center justify-center rounded-xl border-2 border-white transition-all duration-100 hover:bg-[#cc005f]"
            >
              <Image src="/close.png" alt="Close" width={15} height={15} />
            </button>

            {/* HEADER */}
            <div className="rounded-t-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-5 px-10 text-white">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight">Peringkat Mahasiswa</h2>
                  <p className="text-emerald-50">
                    Urutan berdasarkan rata-rata nilai seluruh SOP.
                  </p>
                </div>

                <div className="rounded-xl bg-white/15 px-5 py-3 text-center backdrop-blur border-[.5px] border-white">
                  <p className="text-emerald-50">Total Mahasiswa</p>
                  <p className="text-2xl font-black">{dataPeringkatMahasiswa.length}</p>
                </div>
              </div>
            </div>

            {/* ISI */}
            <div className="flex-1 overflow-y-auto p-5">
              <div className="absolute right-0 left-0 top-[114px] h-[30px] bg-white" />
              <div className="mb-4 grid grid-cols-12 absolute right-9 left-5 rounded-t-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-4 py-3 font-bold text-white">
                <div className="col-span-2 text-center sm:col-span-1">Rank</div>
                <div className="col-span-5 sm:col-span-5">Mahasiswa</div>
                <div className="col-span-2 text-center sm:col-span-2">Kelas</div>
                <div className="col-span-3 text-center sm:col-span-2">Nilai</div>
                <div className="hidden text-center sm:col-span-2 sm:block">Status</div>
              </div>

              <div className="space-y-3 mt-[60px] overflow-hidden">
                {dataPeringkatMahasiswa.map((item, index) => {
                  const isTopOne = index === 0;
                  const isTopTwo = index === 1;
                  const isTopThree = index === 2;

                  return (
                    <div
                      key={item.id}
                      className={`grid grid-cols-12 items-center rounded-xl border p-4 shadow-sm transition hover:shadow-md ${
                        isTopOne
                          ? "border-yellow-400 bg-yellow-50"
                          : isTopTwo
                          ? "border-gray-300 bg-gray-50"
                          : isTopThree
                          ? "border-orange-300 bg-orange-50"
                          : "border-cyan-100 bg-white"
                      }`}
                    >
                      <div className="col-span-2 flex justify-center sm:col-span-1">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl font-black ${
                            isTopOne
                              ? "bg-yellow-400 text-white"
                              : isTopTwo
                              ? "bg-gray-400 text-white"
                              : isTopThree
                              ? "bg-orange-400 text-white"
                              : "bg-cyan-100 text-cyan-700"
                          }`}
                        >
                          {index + 1}
                        </div>
                      </div>

                      <div className="col-span-5 min-w-0 sm:col-span-5">
                        <p className="truncate font-black text-gray-800">
                          {item.nama_lengkap}
                        </p>
                        <p className="text-sm text-gray-500">
                          SOP selesai: {item.jumlahSOP}/{JenisSOPList.length}
                        </p>
                      </div>

                      <div className="col-span-2 text-center font-bold text-gray-700 sm:col-span-2">
                        {item.kelas}
                      </div>

                      <div className="col-span-3 text-center sm:col-span-2">
                        <p className="text-lg font-black text-cyan-800">
                          {item.rataRata.toFixed(2)}
                        </p>
                      </div>

                      <div className="hidden text-center sm:col-span-2 sm:block">
                        <span
                          className={`rounded-md px-4 py-2 font-bold text-white ${
                            item.status === "Lulus"
                              ? "bg-green-500"
                              : "bg-[#ff056d]"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {dataPeringkatMahasiswa.length === 0 && (
                  <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
                    <p className="font-black text-gray-700">
                      Data peringkat belum tersedia
                    </p>
                    <p className="mt-1 text-gray-500">
                      Belum ada data mahasiswa atau nilai SOP.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default Page;