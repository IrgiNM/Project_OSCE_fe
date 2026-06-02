"use client"
import dataSiswa from '@/lib/data/dataSiswa';
import dataTest from '@/lib/data/dataTest';
import { getDetailTestById, updateDetailTest } from '@/lib/function/api';
import { getInitials } from '@/lib/function/initial';
import { getMahasiswaPilihan } from '@/lib/function/token'
import { detailTestType } from '@/type/detailTestType';
import { UserType } from '@/type/userType';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Page = () => {
    const router = useRouter();
    const [tokenMahasiswa, setTokenMahasiswa] = useState<number[]>([])
    const [listMahasiswa, setListMahasiswa] = useState<UserType[]>([])
    const [mahasiswaDipilih, setMahasiswaDipilih] = useState<string>('')
    const [kelasDipilih, setKelasDipilih] = useState<string>('')
    const [idSiswaDipilih, setIdSiswaDipilih] = useState<number>(0)
    const [idTestDipilih, setIdTestDipilih] = useState<number[]>([])
    const [tesDipilih, setTesDipilih] = useState<number>(0)
    const {siswaList} = dataSiswa();
    const {userTests,testList} = dataTest();

    const [updateTestId, setUpdateTestId] = useState<number>(0)
    const [updateSoalSOPId, setUpdateSoalSOPId] = useState<number>(0)
    const [updateNilaiId, setUpdateNilaiId] = useState<number>(0)

    const [countKlik, setCountKlik] = useState<number>(0)

    const [detailTestData, setDetailTestData] = useState<detailTestType[]>([])
    const [namaSOP, setNamaSOP] = useState<string>("");

    const groupedData = detailTestData.reduce((acc: any, item) => {
        const category = item.soal_sop_detail.category || "Lainnya";
    
        if (!acc[category]) {
            acc[category] = [];
        }
    
        acc[category].push(item);
    
        return acc;
    }, {});

    useEffect(()=>{
        const mahasiswaList = getMahasiswaPilihan();
        setTokenMahasiswa(mahasiswaList)
    }, [])
    
    useEffect(()=>{
        setListMahasiswa(siswaList.filter((item)=>tokenMahasiswa.includes(item.id)))
    }, [tokenMahasiswa, siswaList])
    
    useEffect(() => {
        if (listMahasiswa.length === 0) return;
    
        setMahasiswaDipilih(listMahasiswa[0].nama_lengkap);
        setKelasDipilih(listMahasiswa[0].kelas);
        setIdSiswaDipilih(listMahasiswa[0].id);
    }, [listMahasiswa]);

    useEffect(()=>{
        if(idSiswaDipilih === 0) return;
        const mahasiswaTerpilih = userTests.find((item)=>item.userId === idSiswaDipilih)
        setIdTestDipilih(mahasiswaTerpilih?.tests.map(test => test.id) || [])
    }, [idSiswaDipilih])

    useEffect(()=>{
        console.error('idTestDipilih:', idTestDipilih)
    }, [idTestDipilih])

    useEffect(()=>{
        const fetch = async () => {
            try {
                const response = await getDetailTestById(tesDipilih);
                if(response.status === 200){
                    // alert('Berhasil mengambil detail test')
                    setDetailTestData(response.data)
                }
            } catch (error) {
                console.error('Error fetching siswa:', error)
            }
        }
        fetch()
    }, [tesDipilih, countKlik])

    useEffect(()=>{
        setNamaSOP(detailTestData.length > 0
            ? detailTestData[0].soal_sop_detail.nama_sop
            : "")
    }, [detailTestData])

    const handleUpdate = async (test:number, soal:number, nilai:number) => {
        try {
            console
            const response = await updateDetailTest({
                test: test,
                soal_sop: soal,
                nilai: nilai
            });
            if(response.status === 200){
                // alert('Berhasil update detail test')
                // router.refresh()
            }
        } catch (error) {
            console.error('Error updateing siswa:', error)
        }
    }

    



     return (
        <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-100">
            <div className='w-[90%] flex flex-row justify-between items-center mb-2 px-3'>
                <p>Nama Peserta : </p>
                <p>{mahasiswaDipilih} - <span className='font-bold'>{kelasDipilih}</span></p>
            </div>
            <div className="relative w-[90%] h-[580px] bg-white rounded-lg flex flex-col justify-start items-center border border-black gap-5 px-5 pt-5 shadow-lg">
                {tesDipilih === 0 && (
                    <p className='text-gray-500'>Pilih SOP untuk melihat detail nilai</p>
                )}
                <div className="w-full mb-2">
                    <h1 className="text-2xl font-bold text-gray-800">
                        {namaSOP}
                    </h1>

                    <p className="text-sm text-gray-500">
                        Checklist Penilaian SOP
                    </p>
                </div>
                <div className="w-full h-[70%] overflow-y-auto flex flex-col gap-5">
                    {Object.entries(groupedData).map(([category, items]: any) => (
                        <div
                            key={category}
                            className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden shrink-0"
                        >
                            {/* Header Kategori */}
                            <div className="bg-blue-50 px-4 py-3 border-b">
                                <h2 className="font-bold text-blue-700">
                                    {category}
                                </h2>
                            </div>

                            {/* Header Nilai */}
                            <div className="flex flex-row justify-between bg-gray-100 font-semibold text-center border-b sticky top-0">
                                <div className="text-left p-3">Soal</div>
                                <div className="text-left p-3">Nilai</div>
                            </div>

                            {items.map((item: any, index: number) => (
                                <div
                                    key={item.id}
                                    className="flex flex-row justify-between border-b last:border-b-0 items-center"
                                >
                                    <div className="p-3 text-sm">
                                        <span className="font-semibold mr-2">
                                            {index + 1}.
                                        </span>
                                        {item.soal_sop_detail.soal}
                                    </div>

                                    <div className='flex flex-col justify-center items-center gap-2 p-3 lg:flex-row'>

                                        <div className="flex justify-center">
                                            <button
                                                onClick={()=>{
                                                    handleUpdate(item.test, item.soal_sop, 1)
                                                    setCountKlik(countKlik + 1)
                                                }}
                                                className={`w-8 h-8 rounded-full border ${
                                                    item.nilai === 1
                                                        ? "bg-red-500 text-white border-red-500"
                                                        : "bg-white"
                                                }`}
                                            >
                                                1
                                            </button>
                                        </div>

                                        <div className="flex justify-center">
                                            <button
                                                onClick={()=>{
                                                    handleUpdate(item.test, item.soal_sop, 2)
                                                    setCountKlik(countKlik + 1)
                                                }}
                                                className={`w-8 h-8 rounded-full border ${
                                                    item.nilai === 2
                                                        ? "bg-yellow-500 text-white border-yellow-500"
                                                        : "bg-white"
                                                }`}
                                            >
                                                2
                                            </button>
                                        </div>

                                        <div className="flex justify-center">
                                            <button
                                                onClick={()=>{
                                                    handleUpdate(item.test, item.soal_sop, 3)
                                                    setCountKlik(countKlik + 1)
                                                }}
                                                className={`w-8 h-8 rounded-full border ${
                                                    item.nilai === 3
                                                        ? "bg-green-500 text-white border-green-500"
                                                        : "bg-white"
                                                }`}
                                            >
                                                3
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                {detailTestData.length === 0 && (
                    <p className='text-gray-500'>Belum ada data untuk SOP ini</p>
                )}
                <div className='w-full absolute bottom-0 flex flex-col justify-center items-center p-3'>
                    <div className='w-full flex flex-row justify-center items-center gap-2'>
                        {(testList.filter((item)=>idTestDipilih.includes(item.id))).map((item,index) => (
                            <button onClick={()=>{setTesDipilih(item.id)}} key={index} className={`flex-1 py-2 bg-blue-500 rounded-lg flex flex-col justify-center items-center ${tesDipilih === item.id ? "opacity-100" : "opacity-50"}`}>
                                <p className='font-bold text-white'>SOP {index + 1}</p>
                                <p className='text-white'>Nilai : {item.total_nilai}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="w-[90%] mt-2 rounded-lg flex flex-row justify-start items-center border border-black gap-2 p-3 overflow-x-auto scrollbar-hidden">
                {listMahasiswa.map((item,index) => (
                    <button onClick={()=>{
                        setIdSiswaDipilih(item.id)
                        setMahasiswaDipilih(item.nama_lengkap)
                        setKelasDipilih(item.kelas)
                        setTesDipilih(0)
                    }} className={`w-[50px] h-[50px] flex-shrink-0 bg-blue-500 rounded-full flex flex-col items-center justify-center ${mahasiswaDipilih === item.nama_lengkap ? "opacity-100" : "opacity-50"}`} key={index}>
                        <p className='font-bold text-[15px] text-white'>{getInitials(item.nama_lengkap)}</p>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Page