"use client";

import Navbar from "@/components/navbar";
import dataDosen from "@/lib/data/dataDosen";
import dataSiswa from "@/lib/data/dataSiswa";
import { getUserMe } from "@/lib/function/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type DetailSOP = {
  nama_sop: string;
  nilai: number;
};

type Mahasiswa = {
  id: number;
  nama: string;
  kelas: string;
  detail_sop: DetailSOP[];
};

const Page = () => {
  const router = useRouter();
  const {dosenList} = dataDosen()
  const [search, setSearch] = useState("");
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<Mahasiswa | null>(
    null
  );

  // DATA DUMMY
  // Nanti bagian ini bisa kamu ganti dengan data dari API
  const mahasiswaData: Mahasiswa[] = [
    {
      id: 1,
      nama: "Aulia Putri",
      kelas: "2A",
      detail_sop: [
        { nama_sop: "Pemeriksaan TTV", nilai: 85 },
        { nama_sop: "Pemasangan Infus", nilai: 75 },
        { nama_sop: "Perawatan Luka", nilai: 90 },
        { nama_sop: "Injeksi IM", nilai: 80 },
      ],
    },
    {
      id: 2,
      nama: "Rizky Ramadhan",
      kelas: "2B",
      detail_sop: [
        { nama_sop: "Pemeriksaan TTV", nilai: 60 },
        { nama_sop: "Pemasangan Infus", nilai: 65 },
        { nama_sop: "Perawatan Luka", nilai: 70 },
      ],
    },
    {
      id: 3,
      nama: "Siti Nurhaliza",
      kelas: "2C",
      detail_sop: [
        { nama_sop: "Pemeriksaan TTV", nilai: 88 },
        { nama_sop: "Pemasangan Infus", nilai: 92 },
        { nama_sop: "Perawatan Luka", nilai: 86 },
        { nama_sop: "Injeksi IM", nilai: 90 },
        { nama_sop: "Kateterisasi", nilai: 84 },
      ],
    },
    {
      id: 4,
      nama: "Dimas Pratama",
      kelas: "2D",
      detail_sop: [
        { nama_sop: "Pemeriksaan TTV", nilai: 50 },
        { nama_sop: "Pemasangan Infus", nilai: 55 },
      ],
    },
  ];

  const getRataRata = (detailSop: DetailSOP[]) => {
    if (detailSop.length === 0) return 0;

    const total = detailSop.reduce((acc, item) => acc + item.nilai, 0);
    return Math.round(total / detailSop.length);
  };

  const getStatusLulus = (detailSop: DetailSOP[]) => {
    const rataRata = getRataRata(detailSop);
    return rataRata >= 70 ? "Lulus" : "Tidak Lulus";
  };

  const filteredMahasiswa = dosenList.filter((item) => {
    const keyword = search.toLowerCase();
  
    const nama = item.nama_lengkap || "";
    const kelas = item.kelas || "";
  
    return (
      nama.toLowerCase().includes(keyword) ||
      kelas.toLowerCase().includes(keyword)
    );
  });

  useEffect(()=>{
    const fetch = async () => {
      const res = await getUserMe();
      if(res.status === 200){
        if(res.data.is_staff === false){
          router.push('/user/')
        }
      }
    }
    fetch();
  }, [])

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
                  <span>Dosen Keperawatan</span>
                </div>
              <h1 className="text-xl font-extrabold tracking-tight">
                Dashboard Dosen
              </h1>
              <p className="max-w-2xl  text-emerald-50">
                Lihat data dosen yang ada di keperawatan disini
              </p>
            </div>

            <div className="rounded-lg bg-white/15 p-4 px-7 border-[.5px] border-white text-center backdrop-blur">
              <p className=" text-emerald-50">Total</p>
              <p className="text-3xl font-black">{dosenList.length}</p>
            </div>
          </div>
        </div>

        {/* SEARCH FILTER */}
        <div className="rounded-xl bg-white/90 p-4 shadow-md backdrop-blur border-[.5px] border-green-800">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-black text-gray-800">Data Dosen</h2>
              <p className=" text-gray-500">
                Cari berdasarkan nama
              </p>
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari mahasiswa..."
              className="w-full rounded-xl border border-gray-400 bg-white px-4 py-3  font-semibold text-gray-700 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 sm:max-w-sm"
            />
          </div>
        </div>

        {/* LIST CARD MAHASISWA */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredMahasiswa.map((item, index) => {
            // const rataRata = getRataRata(item.detail_sop);
            // const status = getStatusLulus(item.detail_sop);
            const isLulus = status === "Lulus";

            return (
              <button
                key={item.id}
                onClick={() => {}}
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
                    </div>
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
            onClick={() => setSelectedMahasiswa(null)}
            className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm"
          />

          <div className="fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[92%] max-w-5xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl bg-white shadow-2xl md:flex-row">
            {/* KIRI DETAIL SISWA */}
            <div className="w-full border-b border-gray-100 bg-gradient-to-br from-emerald-600 to-cyan-600 p-5 text-white md:w-[38%] md:border-b-0 md:border-r">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 text-2xl font-black backdrop-blur">
                  {selectedMahasiswa.nama.charAt(0)}
                </div>

                <button
                  onClick={() => setSelectedMahasiswa(null)}
                  className="rounded-lg bg-white/20 px-3 py-2  font-bold text-white hover:bg-white/30"
                >
                  Tutup
                </button>
              </div>

              <h2 className="text-2xl font-black">{selectedMahasiswa.nama}</h2>

              <p className="mt-1 text-emerald-50">
                Mahasiswa kelas {selectedMahasiswa.kelas}
              </p>

              <div className="mt-6 space-y-3">
                <div className="rounded-xl bg-white/15 p-4 backdrop-blur">
                  <p className=" text-emerald-50">Kelas</p>
                  <p className="text-xl font-black">
                    {selectedMahasiswa.kelas}
                  </p>
                </div>

                <div className="rounded-xl bg-white/15 p-4 backdrop-blur">
                  <p className=" text-emerald-50">Jumlah SOP Selesai</p>
                  <p className="text-xl font-black">
                    {selectedMahasiswa.detail_sop.length}
                  </p>
                </div>

                <div className="rounded-xl bg-white/15 p-4 backdrop-blur">
                  <p className=" text-emerald-50">Rata-rata Nilai</p>
                  <p className="text-xl font-black">
                    {getRataRata(selectedMahasiswa.detail_sop)}
                  </p>
                </div>

                <div className="rounded-xl bg-white/15 p-4 backdrop-blur">
                  <p className=" text-emerald-50">Status</p>
                  <p
                    className={`text-xl font-black ${
                      getStatusLulus(selectedMahasiswa.detail_sop) === "Lulus"
                        ? "text-white"
                        : "text-red-100"
                    }`}
                  >
                    {getStatusLulus(selectedMahasiswa.detail_sop)}
                  </p>
                </div>
              </div>
            </div>

            {/* KANAN DETAIL SOP */}
            <div className="flex max-h-[55vh] flex-1 flex-col bg-white p-5 md:max-h-[90vh]">
              <div className="mb-4">
                <h3 className="text-xl font-black text-gray-800">
                  Detail Nilai SOP
                </h3>
                <p className=" text-gray-500">
                  Daftar SOP tindakan dan nilai mahasiswa.
                </p>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {selectedMahasiswa.detail_sop.map((sop, index) => {
                  const isNilaiLulus = sop.nilai >= 70;

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 font-black text-blue-700">
                          {index + 1}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-black text-gray-800">
                            {sop.nama_sop}
                          </p>
                          <p className="text-xs text-gray-500">
                            Nilai tindakan SOP
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p
                          className={`text-2xl font-black ${
                            isNilaiLulus ? "text-emerald-700" : "text-red-600"
                          }`}
                        >
                          {sop.nilai}
                        </p>
                        <p
                          className={`text-xs font-bold ${
                            isNilaiLulus ? "text-emerald-600" : "text-red-600"
                          }`}
                        >
                          {isNilaiLulus ? "Lulus" : "Tidak"}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {selectedMahasiswa.detail_sop.length === 0 && (
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
    </div>
  );
};

export default Page;