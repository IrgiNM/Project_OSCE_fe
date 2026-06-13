"use client";

import { login } from "@/lib/function/api";
import { getToken, setToken } from "@/lib/function/token";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = getToken();

    if (token) {
      router.push("/admin");
    }
  }, [router]);

  const handleLogin = async () => {
    if (!email || !password) {
      // alert("Email dan password wajib diisi!");
      return;
    }

    setIsLoading(true);

    try {
      const res = await login({
        email,
        password,
      });

      if (res.status === 200) {
        console.log(res.data);

        setEmail("");
        setPassword("");

        setToken(res.data.token);

        // // alert("Login berhasil!");

        if (res.data.user.is_staff === true) {
          router.push("/admin");
        } else {
          router.push("/user");
        }
      }
    } catch (error: any) {
      console.log(error.response?.data);

      // // alert(
      //   error.response?.data?.message ||
      //     error.response?.data?.detail ||
      //     "Terjadi kesalahan"
      // );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-100 px-4 py-6">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-2xl bg-white shadow-2xl md:grid-cols-2">
          
          {/* LEFT SIDE */}
          <div className="relative hidden min-h-[560px] flex-col justify-between bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white md:flex">
            <div>
              <div className="mb-6 inline-flex items-center gap-3 rounded-xl bg-white/20 px-5 py-3 text-sm font-semibold backdrop-blur border-[.5px] border-white">
                {/* <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white p-1 shadow-md">
                  <Image
                    src="/polindra-logo.png"
                    alt="Logo Kampus"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div> */}
                {/* <div className="h-8 w-[1px] bg-white/30" /> */}
                <div className="flex items-center gap-2">
                  <Image src="/doctor.png" alt="Logo OSCE" width={18} height={18} />
                  <span>SIPOSCE</span>
                </div>
              </div>

              <div className="flex w-30 h-30 items-center justify-center rounded-lg p-1">
                  <Image
                    src="/polindra-logo.png"
                    alt="Logo Kampus"
                    width={82}
                    height={82}
                    className="object-contain"
                  />
                </div>

              <div className="max-w-xl">
                <p className="mb-3 inline-flex rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-bold text-emerald-50 backdrop-blur">
                  Politeknik Negeri Indramayu
                </p>

                <h1 className="text-3xl font-black leading-tight tracking-tight">
                  Sistem Penilaian Objective Structured Clinical Examination
                </h1>

                <p className="mt-4 text-sm font-bold uppercase tracking-wide text-cyan-50">
                  Jurusan Kesehatan · Program Studi D3 Keperawatan
                </p>

                <p className="mt-5 max-w-md text-sm leading-7 text-emerald-50">
                  Silakan login untuk mengelola sesi ujian, mahasiswa, dosen
                  penguji, SOP tindakan keperawatan, hasil penilaian, dan rekap
                  nilai OSCE secara terstruktur.
                </p>

                
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-white/15 flex flex-row items-center p-4 backdrop-blur">
                <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                  <Image src="/user.png" alt="Mahasiswa" width={18} height={18} />
                </div>
                <p className="text-xs font-semibold text-emerald-50">
                  Mahasiswa
                </p>
              </div>

              <div className="rounded-xl bg-white/15 flex flex-row items-center p-4 backdrop-blur">
                <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                  <Image src="/dosen.png" alt="Dosen" width={18} height={18} />
                </div>
                <p className="text-xs font-semibold text-emerald-50">
                  Dosen
                </p>
              </div>

              <div className="rounded-xl bg-white/15 flex flex-row items-center p-4 backdrop-blur">
                <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                  <Image src="/doctor.png" alt="SOP" width={18} height={18} />
                </div>
                <p className="text-xs font-semibold text-emerald-50">
                  SOP
                </p>
              </div>
            </div>

            <div className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-white/10" />
            <div className="absolute -top-20 -left-20 h-56 w-56 rounded-full bg-white/10" />
          </div>

          {/* RIGHT SIDE */}
          <div className="flex min-h-[560px] items-center justify-center p-6 sm:p-10">
            <div className="w-full max-w-md">
              
              {/* MOBILE HEADER */}
              <div className="mb-6 flex flex-col items-center text-center md:hidden">
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
                  <Image src="/doctor-b.png" alt="Logo" width={28} height={28} />
                </div>

                <h1 className="text-2xl font-black text-gray-800">
                  OSCE Nursing
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Login untuk masuk ke sistem ujian.
                </p>
              </div>

              <div className="mb-8 hidden md:block">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
                  <Image src="/doctor-b.png" alt="Logo" width={25} height={25} />
                </div>

                <h2 className="text-2xl font-black text-gray-800">
                  Login Akun
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Masukkan email dan password untuk melanjutkan.
                </p>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">
                    Email
                  </label>

                  <input
                    type="email"
                    placeholder="Masukkan email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm font-medium text-gray-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">
                    Password
                  </label>

                  <input
                    type="password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleLogin();
                      }
                    }}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm font-medium text-gray-700 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                  />
                </div>

                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="mt-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 p-4 text-base font-black text-white shadow-xl transition hover:scale-[1.01] hover:from-emerald-700 hover:to-cyan-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                >
                  {isLoading ? "Memproses..." : "Login"}
                </button>
              </div>

              <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-center">
                <p className="text-xs font-medium text-gray-500">
                  Sistem OSCE Keperawatan
                </p>
                <p className="mt-1 text-sm font-bold text-emerald-700">
                  Manajemen sesi ujian lebih mudah dan terstruktur
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}