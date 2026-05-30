"use client"
import dataSesiUjian from '@/lib/data/dataSesiUjian'
import { uploadTest } from '@/lib/function/api';
import { setSesiPilihan } from '@/lib/function/token';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const Page = () => {
    const router = useRouter();
    const {sesiList} = dataSesiUjian();
    const [isMulai, setIsMulai] = useState(false);
    const [item, setItem] = useState(0)

    const handleSubmit = async () => {
        try {
          // simpan sesi ke localStorage (pastikan ini benar fungsi kamu)
          setSesiPilihan(item);
          const sesiToken = localStorage.getItem("sesi");
          const mahasiswaToken = JSON.parse(
            localStorage.getItem("mahasiswa") || "[]"
          );
          const dosenToken = JSON.parse(
            localStorage.getItem("dosen") || "[]"
          );
      
          const requestsMahasiswa = mahasiswaToken.map((id: number) =>
            uploadTest({
              sesi: Number(sesiToken),
              user: id,
              total_nilai: 0,
            })
          );
      
          const requestsDosen = dosenToken.map((id: number) =>
            uploadTest({
              sesi: Number(sesiToken),
              user: id,
              total_nilai: 0,
            })
          );

          await Promise.all([
            ...requestsMahasiswa,
            ...requestsDosen,
          ]);
          console.log("Upload success");
          router.push("/admin/testPage");
        } catch (error) {
          console.error("Error uploading test:", error);
        }
      };


  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-100">
        <p className='text-[25px] font-bold mb-0'>List Session Test</p>
        <p className='mb-5 mt-0'>ini adalah daftar sesi yang sudah dibuat</p>
        <div className='w-[90%] h-[500px] bg-amber-200 flex flex-col justify-start items-center gap-1 mb-2 overflow-auto'>
            {sesiList.map((item,index) => (
                <div key={index} className='w-full bg-white rounded-lg flex flex-row justify-between items-center border border-black gap-5 p-5 shadow-lg mb-2'>
                    <div className='flex flex-col items-start'>
                        <p className='text-[20px] font-bold'>{item.nama_sesi}</p>
                        <p className='text-[15px]'>{item.created_at.split("T")[0]}</p>
                    </div>
                    <button onClick={()=>{
                        setItem(item.id);
                        setIsMulai(true);
                    }} className='px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-300 hover:text-blue-950'>Mulai Test</button>
                </div>
            ))}
        </div>

        {isMulai && (
            <>
                <div className='fixed top-0 bottom-0 right-0 left-0 bg-black opacity-80'/>
                <div className="fixed w-[90%]  bg-white rounded-lg flex flex-col justify-between items-center gap-1 p-3 shadow-lg overflow-auto scrollbar-hidden border-1 border-gray-500 mt-2">
                    <p>apakah yakin anda mau mulai buat sesi test ?</p>
                    <div className='w-full flex flex-col gap-1'>
                        <button onClick={()=>{
                            handleSubmit()
                        }} className='bg-blue-500 w-full p-3 bottom-2 rounded-md text-white'>Mulai</button>
                        <button onClick={()=>{setIsMulai(false)}} className='bg-black w-full p-3 bottom-2 rounded-md text-white'>Tutup</button>
                    </div>
                </div>
            </>
        )}
    </div>
  )
}

export default Page