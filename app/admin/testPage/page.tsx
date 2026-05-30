"use client"
import dataSiswa from '@/lib/data/dataSiswa';
import { getInitials } from '@/lib/function/initial';
import { getMahasiswaPilihan } from '@/lib/function/token'
import { UserType } from '@/type/userType';
import React, { useEffect, useState } from 'react'

const Page = () => {
    const [tokenMahasiswa, setTokenMahasiswa] = useState<number[]>([])
    const [listMahasiswa, setListMahasiswa] = useState<UserType[]>([])
    const [mahasiswaDipilih, setMahasiswaDipilih] = useState<string>('')
    const [kelasDipilih, setKelasDipilih] = useState<string>('')
    const {siswaList} = dataSiswa();

    useEffect(()=>{
        const mahasiswaList = getMahasiswaPilihan();
        setTokenMahasiswa(mahasiswaList)
    }, [])
    
    useEffect(()=>{
        setListMahasiswa(siswaList.filter((item)=>tokenMahasiswa.includes(item.id)))
    }, [tokenMahasiswa, siswaList])
    
    useEffect(()=>{
        setMahasiswaDipilih(listMahasiswa[0]?.nama_lengkap)
        setKelasDipilih(listMahasiswa[0]?.kelas)
    }, [listMahasiswa])
    



     return (
        <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-100">
            <div className='w-[90%] flex flex-row justify-between items-center mb-2 px-3'>
                <p>Nama Peserta : </p>
                <p>{mahasiswaDipilih} - <span className='font-bold'>{kelasDipilih}</span></p>
            </div>
            <div className="w-[90%] h-[580px] bg-white rounded-lg flex flex-col justify-center items-center border border-black gap-5 px-10 shadow-lg">
                <p className="text-[30px] font-bold">Login</p>
            </div>
            <div className="w-[90%] mt-2 rounded-lg flex flex-row justify-start items-center border border-black gap-2 p-3 overflow-x-auto scrollbar-hidden">
                {listMahasiswa.map((item,index) => (
                    <button onClick={()=>{
                        setMahasiswaDipilih(item.nama_lengkap)
                        setKelasDipilih(item.kelas)
                    }} className={`w-[50px] h-[50px] flex-shrink-0 bg-blue-500 rounded-full flex flex-col items-center justify-center ${mahasiswaDipilih === item.nama_lengkap ? "opacity-100" : "opacity-50"}`} key={index}>
                        <p className='font-bold text-[15px] text-white'>{getInitials(item.nama_lengkap)}</p>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Page