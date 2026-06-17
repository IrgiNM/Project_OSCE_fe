"use client"
import dataSiswa from '@/lib/data/dataSiswa';
import dataTest from '@/lib/data/dataTest';
import { getDetailSop, getDetailTestById, updateDetailTest, updateTest } from '@/lib/function/api';
import { getInitials } from '@/lib/function/initial';
import { getMahasiswaPilihan } from '@/lib/function/token'
import { detailSoalType } from '@/type/detailSoalType';
import { detailTestType } from '@/type/detailTestType';
import { UserType } from '@/type/userType';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { use, useEffect, useState } from 'react'

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
    const [isLoading, setIsLoading] = useState(false)

    const [updateTestId, setUpdateTestId] = useState<number>(0)
    const [updateSoalSOPId, setUpdateSoalSOPId] = useState<number>(0)
    const [updateNilaiId, setUpdateNilaiId] = useState<number>(0)

    const [isFinish, setIsFinish] = useState(false)

    const [countKlik, setCountKlik] = useState<number>(0)

    const [detailTestData, setDetailTestData] = useState<detailTestType[]>([])
    const [detailTestIds, setDetailTestIds] = useState<number[]>([]);
    const [detailSoalData, setDetailSoalData] = useState<detailSoalType[]>([]);
    const [namaSOP, setNamaSOP] = useState<string>("");

    const [dataTestBaru, setDataTestBaru] = useState<{id: number, nilai: number}[]>([]);

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

    useEffect(() => {
        if (idSiswaDipilih === 0) return;
        if (userTests.length === 0) return;
      
        const mahasiswaTerpilih = userTests.find(
          (item) => item.userId === idSiswaDipilih
        );
      
        const testIds = mahasiswaTerpilih?.tests.map((test) => test.id) || [];
      
        setIdTestDipilih(testIds);
      }, [idSiswaDipilih, userTests]);

    useEffect(()=>{
        const idTest = idTestDipilih.length > 0 ? idTestDipilih[0] : 0;
        if(idTest === 0) return;
        setTesDipilih(idTest)
    }, [idTestDipilih])

    useEffect(()=>{
        const testTerpilih = testList.find((item)=>item.id === tesDipilih)
        setNamaSOP(testTerpilih ? testTerpilih.sop : "")
    } ,[tesDipilih, testList])

    useEffect(()=>{
        const fetch = async () => {
            try {
                const response = await getDetailTestById(tesDipilih);
                if(response.status === 200){
                    // // alert('Berhasil mengambil detail test')
                    setDetailTestData(response.data)
                    const ids = response.data.map((item: any) => item.soal_sop);
                    setDetailTestIds(ids);
                }
            } catch (error) {
                // console.error('Error fetching siswa:', error)
            }
        }
        fetch()
    }, [tesDipilih])
    
    useEffect(() => {
      const fetchData = async () => {
        try {
          console.log("id sop :", detailTestIds);
    
          if (!detailTestIds || detailTestIds.length === 0) {
            setDetailSoalData([]);
            return;
          }
    
          const responses = await Promise.all(
            detailTestIds.map(async (id) => {
              const response = await getDetailSop(id);
    
              return {
                id,
                response,
              };
            })
          );
    
          const successIds = responses
            .filter((item) => item.response.status === 200)
            .map((item) => item.id);
    
          const allData: detailSoalType[] = responses
            .filter((item) => item.response.status === 200)
            .flatMap((item) => item.response.data);
    
          setDetailSoalData(allData);
    
          if (successIds.length > 0) {
            // alert(`Berhasil mengambil detail SOP dengan id: ${successIds.join(", ")}`);
          }
        } catch (error) {
          // console.error("Error fetching detail SOP:", error);
        }
      };
    
      fetchData();
    }, [detailTestIds]);

    // useEffect(()=>{
    //     setNamaSOP(detailTestData.length > 0
    //         ? detailTestData[0].soal_sop_detail.nama_sop
    //         : "")
    // }, [detailTestData])

    const handleUpdateTest = async () => {
        if (tesDipilih === 0) {
          // alert("Pilih SOP terlebih dahulu");
          return;
        }
      
        if (detailTestData.length === 0) {
          // alert("Data detail test masih kosong");
          return;
        }
      
        setIsLoading(true);
      
        try {
          const totalNilai = detailTestData.reduce((acc, item) => {
            return acc + item.nilai;
          }, 0);
      
          // const nilaiPersen = Number(
          //   ((totalNilai / (detailTestData.length)) * 100).toFixed(0)
          // );
          const nilaiPersen = Number(
            ((totalNilai / (detailTestData.reduce((total, item) => {
              return total + item.soal_sop_detail.bobot;
            }, 0))) * 100).toFixed(0)
          );
      
          const res = await updateTest(tesDipilih, {
            total_nilai: nilaiPersen,
          });
      
          if (res.status === 200) {
            // // alert("Update test berhasil");
            router.push("/admin");
          }
        } catch (error) {
          // console.error("Error update test:", error);
          // alert("Gagal update test");
        } finally {
          setIsLoading(false);
        }
      };

    const handleUpdate = async (test:number, soal:number, nilai:number) => {
        try {
            console
            const response = await updateDetailTest({
                test: test,
                soal_sop: soal,
                nilai: nilai
            });
            if(response.status === 200){
                // // alert('Berhasil update detail test')
                // router.refresh()
            }
        } catch (error) {
            // console.error('Error updateing siswa:', error)
        }
    }

    const handleUpdate2 = (id: number, nilaiBaru: number) => {
        setDetailTestData((prevData) =>
            prevData.map((item) =>
                item.id === id
                    ? { ...item, nilai: nilaiBaru }
                    : item
            )
        );
    };



    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-100 px-4 py-6">
      
          {/* INFO PESERTA */}
          <div className="w-[90%] flex flex-row justify-between items-center mb-3 rounded-lg bg-white/90  border-[.5px] border-green-800 px-5 py-4 shadow-md backdrop-blur">
            <p className=" font-semibold text-gray-500">Nama Peserta :</p>
            <p className=" font-bold text-gray-800 text-right">
              {mahasiswaDipilih} -{" "}
              <span className="font-black text-emerald-700">
                {kelasDipilih}
              </span>
            </p>
          </div>
      
          {/* CARD UTAMA */}
          <div className="relative w-[90%] h-[580px] bg-white/95 rounded-lg flex flex-col justify-start items-center  border-[.5px] border-green-800 gap-5 px-7 pt-5 shadow-xl backdrop-blur">
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
                    {/* {detailTestData.length > 0
                    ? (
                        (
                          detailTestData.reduce((acc, item) => acc + item.nilai, 0)
                          /
                          (detailTestData.length)
                        ) * 100).toFixed(0)
                    : 0
                    } */}
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
            <div className="w-full h-[72%] lg:h-[77%] overflow-y-auto flex flex-col gap-5 pr-1">
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
      
                  {items.map((item: any, index: number) => {
                  const detailSoalBySop = detailSoalData.filter(
                    (detail) => Number(detail.sop) === Number(item.soal_sop)
                  );

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col border-b border-gray-100 last:border-b-0 hover:bg-emerald-50/30 transition"
                    >
                      <div className="flex flex-row justify-between items-center">
                        <div className="p-3 text-gray-700 leading-6">
                          <span className="font-black mr-2 text-emerald-700">
                            {index + 1}.
                          </span>
                          {item.soal_sop_detail.soal}
                        </div>

                        <div className="flex flex-col justify-center items-center gap-2 p-3 lg:flex-row">
                          {/* <p className="opacity-50 mr-5">
                            bobot : {item.soal_sop_detail.bobot}
                          </p> */}

                          {item.soal_sop_detail.bobot > 0 && (
                            <>
                              <div className="flex justify-center">
                                <button
                                  onClick={() => {
                                    handleUpdate(item.test, item.soal_sop, 0);
                                    handleUpdate2(item.id, 0);
                                  }}
                                  className={`px-4 h-9 rounded-lg border font-black transition ${
                                    item.nilai === 0
                                      ? "bg-red-500 text-white border-red-500 shadow-md"
                                      : "bg-white text-gray-500 border-gray-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                                  }`}
                                >
                                  no
                                </button>
                              </div>

                              <div className="flex justify-center">
                                <button
                                  // onClick={() => {
                                  //   handleUpdate(
                                  //     item.test,
                                  //     item.soal_sop,
                                  //     1
                                  //   );
                                  //   handleUpdate2(item.id, 1);
                                  // }}
                                  onClick={() => {
                                    handleUpdate(
                                      item.test,
                                      item.soal_sop,
                                      item.soal_sop_detail.bobot
                                    );
                                    handleUpdate2(item.id, item.soal_sop_detail.bobot);
                                  }}
                                  className={`h-9 px-4 rounded-lg border font-black transition ${
                                    item.nilai === 1
                                    // item.nilai === item.soal_sop_detail.bobot
                                      ? "bg-green-500 text-white border-green-500 shadow-md"
                                      : "bg-white text-gray-500 border-gray-200 hover:bg-green-50 hover:border-green-300 hover:text-green-600"
                                  }`}
                                >
                                  yes
                                </button>
                              </div>
                            </>
                          )} 

                        </div>
                      </div>

                      {detailSoalBySop.length > 0 && (
                        <div className="mx-3 mb-3 rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
                          {/* <p className="mb-2 text-sm font-black text-emerald-700">
                            Detail Soal:
                          </p> */}

                          <div className="flex flex-col gap-2">
                            {detailSoalBySop.map((detail, detailIndex) => (
                              <div
                                key={detail.id}
                                className="rounded-md bg-white p-3 text-gray-700 shadow-sm border border-gray-100"
                              >
                                {detail.deskripsi_soal}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                </div>
              ))}
            </div>  
      
            {detailTestData.length === 0 && (
              <p className=" font-semibold text-gray-500">
                Belum ada data untuk SOP ini
              </p>
            )}
      
            {/* PILIH SOP */}
            {/* <div className="w-full absolute bottom-0 flex flex-col justify-center items-center p-3">
              <div className="w-full flex flex-row justify-center items-center gap-2 rounded-lg bg-white/90  border-[.5px] border-green-800 p-2 shadow-md">
                {testList
                  .filter((item) => idTestDipilih.includes(item.id))
                  .map((item, index) => (
                    <button
                      onClick={() => {
                        setTesDipilih(item.id);
                        setNamaSOP(item.sop);
                      }}
                      key={index}
                      className={`flex-1 py-3 rounded-lg flex flex-col justify-center items-center font-bold transition ${
                        tesDipilih === item.id
                          ? "bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg opacity-100"
                          : "bg-gray-100 text-gray-600 opacity-70 hover:bg-emerald-50 hover:text-emerald-700 hover:opacity-100"
                      }`}
                    >
                      <p className="font-black ">SOP {index + 1}</p>
                    </button>
                  ))}
              </div>
            </div> */}
          </div>
      
          {/* PILIH MAHASISWA */}
          <div className="w-[90%] mt-3 rounded-lg flex flex-row justify-start items-center  border-[.5px] border-green-800 bg-white/90 gap-3 p-3 overflow-x-auto scrollbar-hidden shadow-md backdrop-blur">
            {listMahasiswa.map((item, index) => (
              <button
                onClick={() => {
                  setIdSiswaDipilih(item.id);
                  setMahasiswaDipilih(item.nama_lengkap);
                  setKelasDipilih(item.kelas);
                  setTesDipilih(0);
                }}
                className={`w-[52px] h-[52px] flex-shrink-0 rounded-lg flex flex-col items-center justify-center shadow-md transition ${
                  mahasiswaDipilih === item.nama_lengkap
                    ? "bg-gradient-to-r from-emerald-600 to-cyan-600 opacity-100 scale-105"
                    : "bg-gray-400 opacity-60 hover:opacity-90"
                }`}
                key={index}
              >
                <p className="font-black text-[15px] text-white">
                  {getInitials(item.nama_lengkap)}
                </p>
              </button>
            ))}
          </div>
      
          {/* BUTTON SELESAI */}
          <button onClick={()=>{setIsFinish(true)}} className="w-[90%] py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-[15px] font-black text-white mt-5 rounded-lg shadow-xl transition hover:scale-[1.01] hover:from-emerald-700 hover:to-cyan-700">
            Selesai Test
          </button>

          {/* MODAL KONFIRMASI */}
            {isFinish && (
              <>
                <div className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm" />
                <div className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-2xl">
                  <div className="mb-5 text-center">
                    <h3 className="text-2xl font-black text-gray-800">
                      Mulai Sesi Test?
                    </h3>
                    <p className="mt-2  text-gray-500">
                      Pastikan data mahasiswa, dosen, dan SOP sudah benar sebelum membuat sesi.
                    </p>
                  </div>
                  <div className="rounded-lg mb-3 bg-green-100  px-5 py-3 text-center">
                      <p className="text-xs font-semibold text-emerald-50 text-green-700">Nilai</p>
                      <p className="text-2xl font-black text-green-700">
                        {/* {detailTestData.length > 0
                        ? (
                            (
                              detailTestData.reduce((acc, item) => acc + item.nilai, 0)
                              /
                              (detailTestData.length)
                            ) * 100).toFixed(0)
                        : 0
                        } */}
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
                    
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={()=>{handleUpdateTest()}}
                      className="rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 p-3 font-black text-white hover:from-emerald-700 hover:to-cyan-700"
                    >
                      {isLoading?'menyimpan...':'Ya, selesaikan test'}
                    </button>
                    
                    <button
                      onClick={()=>{setIsFinish(false)}}
                      className="rounded-lg bg-gray-900 p-3 font-bold text-white hover:bg-black"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </>
            )}
        </div>
      );
}

export default Page