"use client";
import dataDosen from '@/lib/data/dataDosen';
import dataSiswa from '@/lib/data/dataSiswa';
import dataSOP from '@/lib/data/dataSOP';
import { createDetailTest, createSesiUjian, getListSopByName, getTestById, uploadTest } from '@/lib/function/api';
import { getToken, setDosenPilihan, setMahasiswaPilihan, setSesiPilihan, setSOPPilihan } from '@/lib/function/token';
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
    const [isPilih, setIsPilih] = useState('mahasiswa')

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
        console.error("SOPToken =", SOPToken);
        console.error("sopResponses =", sopResponses);
        
        sopResponses.forEach((res, index) => {
            console.error(`SOP Response ${index}:`, res.data);
        });
        
        const sopIds = sopResponses
        .filter((res) => res?.status === 200)
        .flatMap((res: any) =>
            res.data.map((soal: any) => soal.id)
        );
        
        console.error("sopIds =", sopIds);
    
        // 2. ambil test id berdasarkan sesi
        const testRes = await getTestById(Number(sesiToken));
    
        const testIds =
          testRes?.status === 200
            ? testRes.data.map((t: any) => t.id)
            : [];
    
        // 3. generate detail test
        const requests = testIds.flatMap((testId: number) =>
            sopIds.map((sopId: number) => {
                // console.error("testId =", testId);
                // console.error("sopId =", sopId);
              const payload = {
                test: testId,
                soal_sop: sopId,
                nilai: 0,
              };
            //   console.error("Payload yang dikirim:", payload);
              return createDetailTest(payload);
            })
          );
    
        // 4. execute semua
        await Promise.all(requests);
    
        console.error("Detail SOP created successfully");
    
      } catch (error) {
        console.error("Error create detail SOP:", error);
      }
    };

    const handleSubmit = async () => {
      try {
        // 1. create sesi
        const res = await createSesiUjian();
        const sesiId = res.data.id;
    
        // 2. simpan pilihan ke localStorage
        setMahasiswaPilihan(siswaDipilih);
        setDosenPilihan(dosenDipilih);
        setSOPPilihan(SOPDipilih);
        setSesiPilihan(sesiId);
        const mahasiswaToken: number[] = JSON.parse(
          localStorage.getItem("mahasiswa") || "[]"
        );
        const dosenToken: number[] = JSON.parse(
          localStorage.getItem("dosen") || "[]"
        );
        const SOPToken: string[] = JSON.parse(
          localStorage.getItem("sop") || "[]"
        );
    
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
          const dosenReq = dosenToken.map((id: number) =>
            uploadTest({
              sesi: sesiId,
              user: id,
              sop: nama_sop,
              total_nilai: 0,
            })
          );
          return [...mahasiswaReq, ...dosenReq];
        });
    
        // 4. execute all
        await Promise.all(requests);
        console.log("Upload success");
        await handleCreateDetailSOP();
        router.push("/admin/testPage");
      } catch (error) {
        console.error("Error uploading test:", error);
      }
    };


  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-100">
        <p className='text-[25px] font-bold mb-0'>Create Session Test</p>
        <p className='mb-5 mt-0'>silahkan pilih mahasiswa yang mau ditest</p>

        <div className='w-[90%] bg-white rounded-lg flex flex-row justify-between items-center gap-1 p-3 shadow-lg overflow-auto scrollbar-hidden border-1 border-gray-500 mb-2'>
            <button onClick={()=>{setIsPilih('mahasiswa')}} className={`${isPilih === 'mahasiswa'?'bg-black':'bg-gray-500'} flex-1 p-3 bottom-2 rounded-md text-white font-bold`}>Mahasiswa</button>
            <button onClick={()=>{setIsPilih('dosen')}} className={`${isPilih === 'dosen'?'bg-black':'bg-gray-500'} flex-1 p-3 bottom-2 rounded-md text-white font-bold`}>Dosen</button>
            <button onClick={()=>{setIsPilih('sop')}} className={`${isPilih === 'sop'?'bg-black':'bg-gray-500'} flex-1 p-3 bottom-2 rounded-md text-white font-bold`}>SOP</button>
        </div>

        {isPilih === 'mahasiswa' && (
            <>
                <div className="w-[90%] bg-white rounded-lg flex flex-row justify-between items-center gap-1 p-3 shadow-lg overflow-auto scrollbar-hidden border-1 border-gray-500 mb-2">
                    <p>Total Mahasiswa dipilih</p>
                    <div className='flex flex-row gap-2 items-center'>
                        <p>{siswaDipilih.length}</p>
                        <button onClick={()=>{setIsSiswaDipilihDetail(true)}} className='bg-black px-3 p-2 rounded-md text-white'>lihat</button>
                    </div>
                </div>

                <div className="w-[90%] h-[400px] bg-white rounded-lg flex flex-col justify-start items-center gap-1 p-3 shadow-lg overflow-auto scrollbar-hidden border-1 border-gray-500">
                {siswaList.map((item, index) => {
                    const isSelected = siswaDipilih.includes(item.id);
                    return (
                        <div
                            key={index}
                            className="w-full flex justify-between items-center border border-gray-400 rounded-md px-4 py-3"
                        >
                            <div className="flex items-center gap-3">
                                {isSelected && (
                                    <div className='w-[10px] h-[10px] bg-green-500 rounded-full'/>
                                )}
                                <p>{item.nama_lengkap}</p>
                            </div>
                            <button
                                onClick={() => {
                                    if (isSelected) {
                                        setSiswaDipilih(
                                            siswaDipilih.filter(
                                                (id) => id !== item.id
                                            )
                                        );
                                    } else {
                                        setSiswaDipilih([
                                            ...siswaDipilih,
                                            item.id
                                        ]);
                                    }
                                }}
                                className={`
                                    px-4 py-2 rounded-md text-white
                                    ${isSelected ? "bg-red-500" : "bg-blue-500"}
                                `}
                            >
                                {isSelected ? "Batal" : "Pilih"}
                            </button>
                        </div>
                    )
                    })}
                </div>
            </>
        )}
        
        
        {isPilih === 'dosen' && (
            <>
                <div className="w-[90%] bg-white rounded-lg flex flex-row justify-between items-center gap-1 p-3 shadow-lg overflow-auto scrollbar-hidden border-1 border-gray-500 mb-2">
                    <p>Total Dosen dipilih</p>
                    <div className='flex flex-row gap-2 items-center'>
                        <p>{dosenDipilih.length}</p>
                        <button onClick={()=>{setIsDosenDipilihDetail(true)}} className='bg-black px-3 p-2 rounded-md text-white'>lihat</button>
                    </div>
                </div>

                <div className="w-[90%] h-[400px] bg-white rounded-lg flex flex-col justify-start items-center gap-1 p-3 shadow-lg overflow-auto scrollbar-hidden border-1 border-gray-500">
                {dosenList.map((item, index) => {
                    const isSelected = dosenDipilih.includes(item.id);
                    return (
                        <div
                            key={index}
                            className="w-full flex justify-between items-center border border-gray-400 rounded-md px-4 py-3"
                        >
                            <div className="flex items-center gap-3">
                                {isSelected && (
                                    <div className='w-[10px] h-[10px] bg-green-500 rounded-full'/>
                                )}
                                <p>{item.nama_lengkap}</p>
                            </div>
                            <button
                                onClick={() => {
                                    if (isSelected) {
                                        setDosenDipilih(
                                            dosenDipilih.filter(
                                                (id) => id !== item.id
                                            )
                                        );
                                    } else {
                                        setDosenDipilih([
                                            ...dosenDipilih,
                                            item.id
                                        ]);
                                    }
                                }}
                                className={`
                                    px-4 py-2 rounded-md text-white
                                    ${isSelected ? "bg-red-500" : "bg-blue-500"}
                                `}
                            >
                                {isSelected ? "Batal" : "Pilih"}
                            </button>
                        </div>
                    )
                    })}
                </div>
            </>
        )}
        
        
        {isPilih === 'sop' && (
            <>
                <div className="w-[90%] bg-white rounded-lg flex flex-row justify-between items-center gap-1 p-3 shadow-lg overflow-auto scrollbar-hidden border-1 border-gray-500 mb-2">
                    <p>Total SOP dipilih</p>
                    <div className='flex flex-row gap-2 items-center'>
                        <p>{SOPDipilih.length}</p>
                        <button onClick={()=>{setIsSOPDipilihDetail(true)}} className='bg-black px-3 p-2 rounded-md text-white'>lihat</button>
                    </div>
                </div>

                <div className="w-[90%] h-[400px] bg-white rounded-lg flex flex-col justify-start items-center gap-1 p-3 shadow-lg overflow-auto scrollbar-hidden border-1 border-gray-500">
                {soalSOPJenisList.map((item, index) => {
                    const isSelected = SOPDipilih.includes(item);
                    return (
                        <div
                            key={index}
                            className="w-full flex justify-between items-center border border-gray-400 rounded-md px-4 py-3"
                        >
                            <div className="flex items-center gap-3">
                                {isSelected && (
                                    <div className='w-[10px] h-[10px] bg-green-500 rounded-full'/>
                                )}
                                <p>{item}</p>
                            </div>
                            <button
                                onClick={() => {
                                    if (isSelected) {
                                        setSOPDipilih(
                                            SOPDipilih.filter(
                                                (nama) => nama !== item
                                            )
                                        );
                                    } else {
                                        setSOPDipilih([
                                            ...SOPDipilih,
                                            item
                                        ]);
                                    }
                                }}
                                className={`
                                    px-4 py-2 rounded-md text-white
                                    ${isSelected ? "bg-red-500" : "bg-blue-500"}
                                `}
                            >
                                {isSelected ? "Batal" : "Pilih"}
                            </button>
                        </div>
                    )
                    })}
                </div>
            </>
        )}
        

        <button onClick={()=>{setIsMulai(true)}} className='bg-black w-[90%] mt-3 p-3 bottom-2 rounded-md text-white font-bold'>Buat Sesi Test</button>

        {isSiswaDipilihDetail && (
            <>
                <div className='fixed top-0 bottom-0 right-0 left-0 bg-black opacity-80'/>
                <div className="fixed w-[90%] h-[500px] bg-white rounded-lg flex flex-col justify-start items-center gap-1 p-3 shadow-lg overflow-auto scrollbar-hidden border-1 border-gray-500 mt-2">
                    <div className='w-full flex flex-col justify-between items-center px-4 py-3 overflow-auto scrollbar-hidden gap-2 pb-[100px]'>
                        {siswaList
                            .filter((item) => siswaDipilih.includes(item.id))
                            .map((item, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="w-full flex justify-between items-center border border-gray-400 rounded-md px-4 py-3"
                                    >
                                        <p>{item.nama_lengkap}</p>
                                    </div>
                                );
                            })
                        }
                    </div>
                    <button onClick={()=>{setIsSiswaDipilihDetail(false)}} className='bg-black w-[95%] p-3 bottom-2 rounded-md text-white absolute '>Tutup</button>
                </div>
            </>
        )}
        
        {isDosenDipilihDetail && (
            <>
                <div className='fixed top-0 bottom-0 right-0 left-0 bg-black opacity-80'/>
                <div className="fixed w-[90%] h-[500px] bg-white rounded-lg flex flex-col justify-start items-center gap-1 p-3 shadow-lg overflow-auto scrollbar-hidden border-1 border-gray-500 mt-2">
                    <div className='w-full flex flex-col justify-between items-center px-4 py-3 overflow-auto scrollbar-hidden gap-2 pb-[100px]'>
                        {dosenList
                            .filter((item) => dosenDipilih.includes(item.id))
                            .map((item, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="w-full flex justify-between items-center border border-gray-400 rounded-md px-4 py-3"
                                    >
                                        <p>{item.nama_lengkap}</p>
                                    </div>
                                );
                            })
                        }
                    </div>
                    <button onClick={()=>{setIsDosenDipilihDetail(false)}} className='bg-black w-[95%] p-3 bottom-2 rounded-md text-white absolute '>Tutup</button>
                </div>
            </>
        )}
        
        {isSOPDipilihDetail && (
            <>
                <div className='fixed top-0 bottom-0 right-0 left-0 bg-black opacity-80'/>
                <div className="fixed w-[90%] h-[500px] bg-white rounded-lg flex flex-col justify-start items-center gap-1 p-3 shadow-lg overflow-auto scrollbar-hidden border-1 border-gray-500 mt-2">
                    <div className='w-full flex flex-col justify-between items-center px-4 py-3 overflow-auto scrollbar-hidden gap-2 pb-[100px]'>
                        {soalSOPJenisList
                            .filter((item) => SOPDipilih.includes(item))
                            .map((item, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="w-full flex justify-between items-center border border-gray-400 rounded-md px-4 py-3"
                                    >
                                        <p>{item}</p>
                                    </div>
                                );
                            })
                        }
                    </div>
                    <button onClick={()=>{setIsSOPDipilihDetail(false)}} className='bg-black w-[95%] p-3 bottom-2 rounded-md text-white absolute '>Tutup</button>
                </div>
            </>
        )}
        
        {isMulai && (
            <>
                <div className='fixed top-0 bottom-0 right-0 left-0 bg-black opacity-80'/>
                <div className="fixed w-[90%]  bg-white rounded-lg flex flex-col justify-between items-center gap-1 p-3 shadow-lg overflow-auto scrollbar-hidden border-1 border-gray-500 mt-2">
                    <p>apakah yakin anda mau mulai buat sesi test ?</p>
                    <div className='w-full flex flex-row justify-center items-center gap-2 mb-3'>
                        <div className='flex flex-1 flex-col items-center justify-center gap-1 border-1  border-gray-300 p-3'>
                            <p>Mahasiswa</p>
                            <p>{siswaDipilih.length}</p>
                        </div>
                        <div className='flex flex-1 flex-col items-center justify-center gap-1 border-1  border-gray-300 p-3'>
                            <p>Dosen</p>
                            <p>{dosenDipilih.length}</p>
                        </div>
                        <div className='flex flex-1 flex-col items-center justify-center gap-1 border-1  border-gray-300 p-3'>
                            <p>SOP</p>
                            <p>{SOPDipilih.length}</p>
                        </div>
                    </div>
                    <div className='w-full flex flex-col gap-1'>
                        <button onClick={()=>{handleSubmit()}} className='bg-blue-500 w-full p-3 bottom-2 rounded-md text-white'>Mulai</button>
                        <button onClick={()=>{setIsMulai(false)}} className='bg-black w-full p-3 bottom-2 rounded-md text-white'>Tutup</button>
                    </div>
                </div>
            </>
        )}

        
    </div>
  )
}

export default Page