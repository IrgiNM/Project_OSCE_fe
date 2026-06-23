"use client";

import Navbar from "@/components/navbar";
import dataJenisSOP from "@/lib/data/dataJenisSOP";
import dataSiswa from "@/lib/data/dataSiswa";
import dataTest from "@/lib/data/dataTest";
import { deleteTest, getDetailSop, getDetailTestById, getUserMe } from "@/lib/function/api";
import { detailSoalType } from "@/type/detailSoalType";
import { detailTestType } from "@/type/detailTestType";
import { UserType } from "@/type/userType";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx-js-style";

const Page = () => {
  const router = useRouter();
  const { siswaList } = dataSiswa();
  const { JenisSOPList } = dataJenisSOP();

  const [pisckSiswa, setPickSiswa] = useState<number>(0);
  const { testUserList, testAllUserList } = dataTest(pisckSiswa);

  const [isLoading, setIsLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(false);
  const [selectedDetailResult, setSelectedDetailResult] = useState(false);
  const [selectedPeringkat, setSelectedPeringkat] = useState(false);

  const [tesDipilih, setTesDipilih] = useState<number>(0);
  const [namaSOP, setNamaSOP] = useState<string>("");
  const [detailTestData, setDetailTestData] = useState<detailTestType[]>([]);
  const [detailTestIds, setDetailTestIds] = useState<number[]>([]);
  const [detailSoalData, setDetailSoalData] = useState<detailSoalType[]>([]);
  const [mahasiswaAktif, setMahasiswaAktif] = useState<UserType | null>(null);
  const [sopAktif, setSopAktif] = useState<any>(null);

  const [selectedDeleteTest, setSelectedDeleteTest] = useState(false);
  const [testDeleteAktif, setTestDeleteAktif] = useState<any>(null);

  const dataDosenSOP = [
    {
      sop: [
        "KETERAMPILAN PEMERIKSAAN TANDA-TANDA VITAL",
        "PEMERIKSAAN TTV",
        "TTV",
        "TANDA TANDA VITAL",
        "TANDA-TANDA VITAL",
      ],
      dosen: "Hj. Winani, S.Kep., Ns., M.Kep.",
    },
    {
      sop: [
        "KETERAMPILAN PEREKAMAN EKG",
        "PEREKAMAN EKG",
        "EKG",
        "EKG 12 SADAPAN",
      ],
      dosen: "Ns. Niken Wulan Hasti Murti, S.Kep., M.Kep.",
    },
    {
      sop: [
        "KETERAMPILAN PERAWATAN PAYUDARA",
        "PERAWATAN PAYUDARA",
        "PAYUDARA",
      ],
      dosen: "Evi Supriatun, S.Kep., Ns., M.Kep.",
    },
    {
      sop: [
        "KETERAMPILAN PENGUKURAN ANTROPOMETRI",
        "PEMERIKSAAN ANTROPOMETRI",
        "PENGUKURAN ANTROPOMETRI",
        "ANTROPOMETRI",
      ],
      dosen: "Nurohmat, SKM, M.H.",
    },
    {
      sop: [
        "KETERAMPILAN PERILAKU KEKERASAN STRATEGI PELAKSANAAN 1 P",
        "STRATEGI PELAKSANAAN 1 PERILAKU KEKERASAN",
        "PERILAKU KEKERASAN",
        "SP 1 PK",
        "SP1 PK",
      ],
      dosen: "Wenny Nugrahati Carsita, S.Kep., Ns., M.Kep",
    },
    {
      sop: [
        "KETERAMPILAN LATIHAN RENTANG GERAK",
        "LATIHAN RENTANG GERAK",
        "RANGE OF MOTION",
        "ROM",
      ],
      dosen: "Hasim Asyari, S.KM., M.Kes.",
    },
    {
      sop: [
        "KETERAMPILAN PENGHISAPAN JALAN NAPAS",
        "PENGHISAPAN JALAN NAPAS",
        "PENGHISAPAN JALAN NAFAS",
        "SUCTION",
      ],
      dosen: "Berlian Kusuma Dewi, S.Kep., Ns., MS.",
    },
    {
      sop: [
        "HALUSINASI STRATEGI PELAKSANAAN 1 P",
        "STRATEGI PELAKSANAAN 1 HALUSINASI",
        "SP 1 HALUSINASI",
        "SP1 HALUSINASI",
        "HALUSINASI",
      ],
      dosen: "Mira Wahyu Kusumawati, S.Kep., Ns., M.Kep",
    },
    {
      sop: [
        "KETERAMPILAN PERAWATAN LUKA",
        "PERAWATAN LUKA",
        "LUKA",
      ],
      dosen: "Dr. H. Priyanto, M.Kes.",
    },
    {
      sop: [
        "KETERAMPILAN PEMASANGAN KATETER URINE PASIEN LAKI-LAKI",
        "PEMASANGAN KATETER URINE PRIA",
        "PEMASANGAN KATETER URINE LAKI LAKI",
        "KATETER URINE PRIA",
        "KATETER URINE LAKI LAKI",
        "KATETER URIN PRIA",
        "KATETER URIN LAKI LAKI",
      ],
      dosen: "H. Bachtiar Efendi, S.Kep., Ns., M.H.",
    },
    {
      sop: [
        "KETERAMPILAN PEMERIKSAAN LEOPOLD",
        "PEMERIKSAAN LEOPOLD",
        "LEOPOLD",
      ],
      dosen: "Nengsih Yulianingsih, S.Kep., Ns., M.PH",
    },
    {
      sop: [
        "KETERAMPILAN LATIHAN BATUK EFEKTIF",
        "LATIHAN BATUK EFEKTIF",
        "BATUK EFEKTIF",
      ],
      dosen: "Dr. Indra Ruswandi, S.Kep., Ns., M.PH",
    },
    {
      sop: [
        "KETERAMPILAN RESUSITASI JANTUNG PARU PADA PASIEN DEWASA",
        "RESUSITASI JANTUNG PARU PADA PASIEN DEWASA",
        "RESUSITASI JANTUNG PARU",
        "RJP DEWASA",
        "RJP",
      ],
      dosen: "Sally Yustinawati S., S.Kep., Ns., M.Kep.",
    },
    {
      sop: [
        "KETERAMPILAN PERAWATAN TALI PUSAT",
        "PERAWATAN TALI PUSAT",
        "TALI PUSAT",
      ],
      dosen: "Ike Puspitaningrum, S.Kep., Ns., M.Kep.",
    },
  ];
  
  const normalizeText = (text: string) => {
    return String(text || "")
      .toLowerCase()
      .replace(/-/g, " ")
      .replace(/[^\w\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };
  
  const getIndexSOP = (namaSOP?: string) => {
    const sopNormal = normalizeText(namaSOP || "");
  
    return dataDosenSOP.findIndex((item) =>
      item.sop.some((nama) => {
        const targetNormal = normalizeText(nama);
  
        return (
          sopNormal === targetNormal ||
          sopNormal.includes(targetNormal) ||
          targetNormal.includes(sopNormal)
        );
      })
    );
  };
  
  const getNamaDosenBySOP = (namaSOP?: string) => {
    const indexSOP = getIndexSOP(namaSOP);
  
    if (indexSOP === -1) return "-";
  
    return dataDosenSOP[indexSOP].dosen;
  };
  
  const getTestByUrutanSOP = (listTest: any[], indexSOP: number) => {
    return listTest
      .filter((test) => getIndexSOP(test.sop) === indexSOP)
      .sort((a, b) => Number(b.id) - Number(a.id))[0];
  };
  
  const getNamaSheetUnik = (workbook: any, namaSheet: string) => {
    let cleanName = String(namaSheet || "Sheet")
      .replace(/[\\/:*?"<>|]/g, "")
      .slice(0, 31);
  
    if (!cleanName) cleanName = "Sheet";
  
    let finalName = cleanName;
    let counter = 1;
  
    while (workbook.SheetNames.includes(finalName)) {
      const suffix = `_${counter}`;
      finalName = `${cleanName.slice(0, 31 - suffix.length)}${suffix}`;
      counter++;
    }
  
    return finalName;
  };
  
  const handleCetakExcel = () => {
    setIsLoading(true);
  
    try {
      if (siswaList.length === 0) {
        alert("Data siswa masih kosong");
        return;
      }
  
      const dataExcel = siswaList.map((siswa, index) => {
        const testMahasiswa = testAllUserList.filter(
          (test) =>
            Number(test.user) === Number(siswa.id) &&
            test.user_detail?.is_staff !== true
        );
  
        const testMahasiswaSesuaiUrutan = dataDosenSOP
          .map((_, sopIndex) => getTestByUrutanSOP(testMahasiswa, sopIndex))
          .filter(Boolean) as any[];
  
        const row: any = {
          No: index + 1,
          "Nama Siswa": siswa.nama_lengkap,
          NIM: siswa.nim || "-",
          Kelas: siswa.kelas || "-",
        };
  
        dataDosenSOP.forEach((_, sopIndex) => {
          const testSOP = getTestByUrutanSOP(testMahasiswa, sopIndex);
  
          row[`SOP ${sopIndex + 1}`] = testSOP?.total_nilai ?? "-";
        });
  
        const totalNilai = testMahasiswaSesuaiUrutan.reduce((acc, test) => {
          return acc + Number(test.total_nilai || 0);
        }, 0);
  
        const jumlahSOPDinilai = testMahasiswaSesuaiUrutan.length;
  
        const rataRataNilai =
          jumlahSOPDinilai > 0
            ? Number((totalNilai / jumlahSOPDinilai).toFixed(2))
            : 0;
  
        const tanggalTest = [...testMahasiswaSesuaiUrutan].sort(
          (a, b) => Number(b.id) - Number(a.id)
        )[0]?.created_at;
  
        row["Rata-rata Nilai"] = rataRataNilai;
        row["Status"] = rataRataNilai > 75 ? "Lulus" : "Tidak Lulus";
        row["Tanggal Test"] = tanggalTest
          ? new Date(tanggalTest).toLocaleDateString("id-ID")
          : "-";
  
        return row;
      });
  
      const dataDaftarSOP = dataDosenSOP.map((item, index) => ({
        "Kode SOP": `SOP ${index + 1}`,
        "Nama SOP": item.sop[0],
        "Dosen Penguji": item.dosen,
      }));
  
      const workbook = XLSX.utils.book_new();
  
      const worksheetNilai = XLSX.utils.json_to_sheet(dataExcel);
      const worksheetDaftarSOP = XLSX.utils.json_to_sheet(dataDaftarSOP);
  
      worksheetNilai["!cols"] = [
        { wch: 6 },
        { wch: 32 },
        { wch: 18 },
        { wch: 12 },
        ...Array.from({ length: 14 }).map(() => ({ wch: 10 })),
        { wch: 18 },
        { wch: 16 },
        { wch: 18 },
      ];
  
      worksheetDaftarSOP["!cols"] = [
        { wch: 14 },
        { wch: 75 },
        { wch: 45 },
      ];
  
      const headerStyle = {
        font: {
          name: "Arial",
          bold: true,
          color: { rgb: "FFFFFF" },
        },
        fill: {
          fgColor: { rgb: "0F766E" },
        },
        alignment: {
          horizontal: "center",
          vertical: "center",
          wrapText: true,
        },
        border: {
          top: { style: "thin", color: { rgb: "0F766E" } },
          bottom: { style: "thin", color: { rgb: "0F766E" } },
          left: { style: "thin", color: { rgb: "0F766E" } },
          right: { style: "thin", color: { rgb: "0F766E" } },
        },
      };
  
      const bodyStyle = {
        font: {
          name: "Arial",
          color: { rgb: "111827" },
        },
        alignment: {
          vertical: "center",
          wrapText: true,
        },
        border: {
          top: { style: "thin", color: { rgb: "D9E2EC" } },
          bottom: { style: "thin", color: { rgb: "D9E2EC" } },
          left: { style: "thin", color: { rgb: "D9E2EC" } },
          right: { style: "thin", color: { rgb: "D9E2EC" } },
        },
      };
  
      const centerBodyStyle = {
        ...bodyStyle,
        alignment: {
          horizontal: "center",
          vertical: "center",
          wrapText: true,
        },
      };
  
      const greenScoreStyle = {
        ...centerBodyStyle,
        font: {
          name: "Arial",
          bold: true,
          color: { rgb: "047857" },
        },
      };
  
      const emptyScoreStyle = {
        ...centerBodyStyle,
        font: {
          name: "Arial",
          bold: true,
          color: { rgb: "9CA3AF" },
        },
        fill: {
          fgColor: { rgb: "F3F4F6" },
        },
      };
  
      const getStatusStyle = (status: string) => ({
        ...centerBodyStyle,
        font: {
          name: "Arial",
          bold: true,
          color: {
            rgb: status === "Lulus" ? "047857" : "DC2626",
          },
        },
        fill: {
          fgColor: {
            rgb: status === "Lulus" ? "DCFCE7" : "FEE2E2",
          },
        },
      });
  
      const applyStyleToSheet = (worksheet: any, type: "rekap" | "daftar") => {
        const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:A1");
  
        for (let row = range.s.r; row <= range.e.r; row++) {
          for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            const cell = worksheet[cellAddress];
  
            if (!cell) continue;
  
            if (row === 0) {
              cell.s = headerStyle;
              continue;
            }
  
            const isKolomSOP = type === "rekap" && col >= 4 && col <= 17;
            const isKolomRataRata = type === "rekap" && col === 18;
            const isKolomStatus = type === "rekap" && col === 19;
  
            if (isKolomSOP) {
              cell.s = cell.v === "-" ? emptyScoreStyle : greenScoreStyle;
            } else if (isKolomRataRata) {
              cell.s = greenScoreStyle;
            } else if (isKolomStatus) {
              cell.s = getStatusStyle(cell.v);
            } else {
              cell.s = col === 0 || col >= 2 ? centerBodyStyle : bodyStyle;
            }
          }
        }
  
        worksheet["!rows"] = Array.from({ length: range.e.r + 1 }).map(
          (_, index) => ({
            hpt: index === 0 ? 28 : 24,
          })
        );
  
        worksheet["!autofilter"] = {
          ref: worksheet["!ref"],
        };
      };
  
      applyStyleToSheet(worksheetNilai, "rekap");
      applyStyleToSheet(worksheetDaftarSOP, "daftar");
  
      XLSX.utils.book_append_sheet(workbook, worksheetNilai, "Rekap Nilai");
      XLSX.utils.book_append_sheet(workbook, worksheetDaftarSOP, "Daftar SOP");
  
      XLSX.writeFile(workbook, "rekap_nilai_sop_mahasiswa.xlsx");
    } catch (error) {
      console.error("Gagal mencetak Excel:", error);
      alert("Gagal mencetak Excel");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCetakExcelPerSiswa = async () => {
    setIsLoading(true);
  
    try {
      if (!mahasiswaAktif) {
        alert("Data mahasiswa belum dipilih");
        return;
      }
  
      if (testUserList.length === 0) {
        alert("Mahasiswa ini belum memiliki data SOP");
        return;
      }
  
      const workbook = XLSX.utils.book_new();
  
      const testUserListSesuaiUrutan = dataDosenSOP
        .map((_, sopIndex) => getTestByUrutanSOP(testUserList, sopIndex))
        .filter(Boolean) as any[];
  
      const listSOPUntukCetak =
        testUserListSesuaiUrutan.length > 0
          ? testUserListSesuaiUrutan
          : [...testUserList].sort((a, b) => Number(a.id) - Number(b.id));
  
      for (const sop of listSOPUntukCetak) {
        const response = await getDetailTestById(sop.id);
  
        if (response.status !== 200) continue;
  
        const detailData: detailTestType[] = response.data;
  
        const detailIds = detailData.map((item: any) => item.soal_sop);
  
        const responsesDetailSoal = await Promise.all(
          detailIds.map(async (id: number) => {
            const res = await getDetailSop(id);
  
            return {
              id,
              response: res,
            };
          })
        );
  
        const detailSoalSemua: detailSoalType[] = responsesDetailSoal
          .filter((item) => item.response.status === 200)
          .flatMap((item) => item.response.data);
  
        const totalNilaiBobot = detailData.reduce((total, item) => {
          return total + Number(item.soal_sop_detail?.bobot || 0);
        }, 0);
  
        const totalNilaiDidapat = detailData.reduce((acc, item) => {
          return acc + Number(item.nilai || 0);
        }, 0);
  
        const totalNilai =
          totalNilaiBobot > 0
            ? Number(((totalNilaiDidapat / totalNilaiBobot) * 100).toFixed(0))
            : 0;
  
        const nomorSOP = getIndexSOP(sop.sop) + 1;
        const namaDosen = getNamaDosenBySOP(sop.sop);
  
        const worksheetData: any[][] = [
          ["DETAIL NILAI SOP MAHASISWA"],
          [],
          ["Nama Siswa", mahasiswaAktif.nama_lengkap || "-"],
          ["NIM", mahasiswaAktif.nim || "-"],
          ["Kelas", mahasiswaAktif.kelas || "-"],
          ["Kode SOP", nomorSOP > 0 ? `SOP ${nomorSOP}` : "-"],
          ["Nama SOP", sop.sop || "-"],
          ["Total Nilai", totalNilai],
          ["Nama Dosen", namaDosen],
          [],
          ["No", "Soal SOP", "Bobot", "Nilai yang Didapat"],
        ];
  
        detailData.forEach((item, index) => {
          worksheetData.push([
            index + 1,
            item.soal_sop_detail?.soal || "-",
            item.soal_sop_detail?.bobot || 0,
            item.nilai ?? 0,
          ]);
  
          const detailSoalBySop = detailSoalSemua.filter(
            (detail) => Number(detail.sop) === Number(item.soal_sop)
          );
  
          detailSoalBySop.forEach((detail) => {
            worksheetData.push([
              "",
              `• ${detail.deskripsi_soal || "-"}`,
              "",
              "",
            ]);
          });
        });
  
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
        worksheet["!cols"] = [
          { wch: 8 },
          { wch: 80 },
          { wch: 12 },
          { wch: 22 },
        ];
  
        worksheet["!merges"] = [
          {
            s: { r: 0, c: 0 },
            e: { r: 0, c: 3 },
          },
        ];
  
        const baseBorder = {
          top: { style: "thin", color: { rgb: "D9E2EC" } },
          bottom: { style: "thin", color: { rgb: "D9E2EC" } },
          left: { style: "thin", color: { rgb: "D9E2EC" } },
          right: { style: "thin", color: { rgb: "D9E2EC" } },
        };
  
        const greenBorder = {
          top: { style: "thin", color: { rgb: "A7F3D0" } },
          bottom: { style: "thin", color: { rgb: "A7F3D0" } },
          left: { style: "thin", color: { rgb: "A7F3D0" } },
          right: { style: "thin", color: { rgb: "A7F3D0" } },
        };
  
        const baseStyle = {
          font: {
            name: "Arial",
            sz: 11,
          },
          alignment: {
            vertical: "center",
            wrapText: true,
          },
          border: baseBorder,
        };
  
        const centerStyle = {
          ...baseStyle,
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true,
          },
        };
  
        const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:D1");
  
        for (let row = range.s.r; row <= range.e.r; row++) {
          for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
  
            if (!worksheet[cellAddress]) continue;
  
            worksheet[cellAddress].s = baseStyle;
          }
        }
  
        worksheet["A1"].s = {
          font: {
            name: "Arial",
            sz: 16,
            bold: true,
            color: { rgb: "FFFFFF" },
          },
          fill: {
            fgColor: { rgb: "059669" },
          },
          alignment: {
            horizontal: "center",
            vertical: "center",
          },
        };
  
        for (let row = 2; row <= 8; row++) {
          const labelCell = `A${row + 1}`;
          const valueCell = `B${row + 1}`;
  
          if (worksheet[labelCell]) {
            worksheet[labelCell].s = {
              font: {
                name: "Arial",
                bold: true,
                color: { rgb: "064E3B" },
              },
              fill: {
                fgColor: { rgb: "D1FAE5" },
              },
              alignment: {
                vertical: "center",
                wrapText: true,
              },
              border: greenBorder,
            };
          }
  
          if (worksheet[valueCell]) {
            worksheet[valueCell].s = {
              font: {
                name: "Arial",
                bold: true,
                color: { rgb: "111827" },
              },
              alignment: {
                vertical: "center",
                wrapText: true,
              },
              border: greenBorder,
            };
          }
        }
  
        const tableHeaderRow = 11;
  
        ["A", "B", "C", "D"].forEach((col) => {
          const cell = `${col}${tableHeaderRow}`;
  
          if (worksheet[cell]) {
            worksheet[cell].s = {
              font: {
                name: "Arial",
                bold: true,
                color: { rgb: "FFFFFF" },
              },
              fill: {
                fgColor: { rgb: "0F766E" },
              },
              alignment: {
                horizontal: "center",
                vertical: "center",
                wrapText: true,
              },
              border: {
                top: { style: "thin", color: { rgb: "0F766E" } },
                bottom: { style: "thin", color: { rgb: "0F766E" } },
                left: { style: "thin", color: { rgb: "0F766E" } },
                right: { style: "thin", color: { rgb: "0F766E" } },
              },
            };
          }
        });
  
        for (let row = tableHeaderRow + 1; row <= range.e.r + 1; row++) {
          const noCell = worksheet[`A${row}`];
          const soalCell = worksheet[`B${row}`];
          const bobotCell = worksheet[`C${row}`];
          const nilaiCell = worksheet[`D${row}`];
  
          const isDetailSoal = noCell && noCell.v === "";
  
          if (isDetailSoal) {
            ["A", "B", "C", "D"].forEach((col) => {
              const cell = worksheet[`${col}${row}`];
  
              if (!cell) return;
  
              cell.s = {
                font: {
                  name: "Arial",
                  italic: true,
                  color: { rgb: "374151" },
                },
                fill: {
                  fgColor: { rgb: "ECFDF5" },
                },
                alignment: {
                  vertical: "center",
                  wrapText: true,
                },
                border: {
                  top: { style: "thin", color: { rgb: "D1FAE5" } },
                  bottom: { style: "thin", color: { rgb: "D1FAE5" } },
                  left: { style: "thin", color: { rgb: "D1FAE5" } },
                  right: { style: "thin", color: { rgb: "D1FAE5" } },
                },
              };
            });
  
            continue;
          }
  
          if (noCell) {
            noCell.s = {
              ...centerStyle,
              font: {
                name: "Arial",
                bold: true,
              },
            };
          }
  
          if (soalCell) {
            soalCell.s = {
              ...baseStyle,
              font: {
                name: "Arial",
                color: { rgb: "111827" },
              },
            };
          }
  
          if (bobotCell) {
            bobotCell.s = {
              ...centerStyle,
              font: {
                name: "Arial",
                bold: true,
              },
            };
          }
  
          if (nilaiCell) {
            nilaiCell.s = {
              ...centerStyle,
              font: {
                name: "Arial",
                bold: true,
                color: {
                  rgb: Number(nilaiCell.v) > 1 ? "047857" : "DC2626",
                },
              },
            };
          }
        }
  
        worksheet["!rows"] = worksheetData.map((_, index) => {
          if (index === 0) return { hpt: 28 };
          if (index >= 2 && index <= 8) return { hpt: 22 };
          if (index === 10) return { hpt: 24 };
  
          return { hpt: 35 };
        });
  
        const namaSheet =
          nomorSOP > 0
            ? `SOP ${nomorSOP}`
            : String(sop.sop || "SOP")
                .replace(/[\\/:*?"<>|]/g, "")
                .slice(0, 31);
  
        XLSX.utils.book_append_sheet(
          workbook,
          worksheet,
          getNamaSheetUnik(workbook, namaSheet)
        );
      }
  
      const namaFile = `detail_nilai_${mahasiswaAktif.nama_lengkap || "mahasiswa"}`
        .replace(/[\\/:*?"<>|]/g, "")
        .replace(/\s+/g, "_")
        .toLowerCase();
  
      XLSX.writeFile(workbook, `${namaFile}.xlsx`);
    } catch (error) {
      console.error("Gagal cetak Excel per siswa:", error);
      alert("Gagal mencetak Excel per siswa");
    } finally {
      setIsLoading(false);
    }
  };
  
 

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
    
      const totalMaksimal = 7 * 100;
    
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
      
              const ids = response.data.map((item: any) => item.soal_sop);
              setDetailTestIds(ids);
            }
          } catch (error) {
            // console.error("Error fetching detail test:", error);
          }
        };
      
        fetch();
      }, [tesDipilih]);

      useEffect(() => {
        const fetchData = async () => {
          try {
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
      
            const allData: detailSoalType[] = responses
              .filter((item) => item.response.status === 200)
              .flatMap((item) => item.response.data);
      
            setDetailSoalData(allData);
          } catch (error) {
            // console.error("Error fetching detail SOP:", error);
          }
        };
      
        fetchData();
      }, [detailTestIds]);

    useEffect(()=>{
        setNamaSOP(detailTestData.length > 0
            ? detailTestData[0].soal_sop_detail.nama_sop
            : "")
    }, [detailTestData])

    useEffect(()=>{
      const fetch = async () => {
        const res = await getUserMe();
        if(res.status === 200){
          if(res.data.is_staff === false){
            router.push('/user')
          }
        }
      }
      fetch();
    }, [])
  

  const filteredMahasiswa = siswaList.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.nama_lengkap.toLowerCase().includes(keyword) ||
      item.kelas.toLowerCase().includes(keyword)
    //   getStatusLulus(item.detail_sop).toLowerCase().includes(keyword)
    );
  });

  const singkatNamaSOP = (nama: string) => {
    if (!nama) return "-";
  
    return nama
      .replace("Pemeriksaan", "Pem.")
      .replace("Pemasangan", "Pasang")
      .replace("Pengukuran", "Ukur")
      .replace("Tanda-Tanda Vital", "TTV")
      .replace("Tanda tanda vital", "TTV")
      .replace("Tekanan Darah", "TD")
      .replace("Darah", "Drh")
      .replace("Perawatan", "Rawat")
      .replace("Luka", "Luka")
      .replace("Injeksi", "Inj.")
      .replace("Intramuskular", "IM")
      .replace("Intravena", "IV")
      .replace("Subkutan", "SC")
      .replace("Oral", "Oral");
  };

  // const handleCetakExcel = () => {
  //   setIsLoading(true);
  
  //   try {
  //     if (siswaList.length === 0) {
  //       alert("Data siswa masih kosong");
  //       return;
  //     }
  
  //     const daftarSOP = Array.from(
  //       new Set(
  //         testAllUserList
  //           .filter((test) => test.user_detail?.is_staff !== true)
  //           .map((test) => test.sop)
  //       )
  //     ).slice(0, 14);
  
  //     const dataExcel = siswaList.map((siswa, index) => {
  //       const testMahasiswa = testAllUserList
  //         .filter(
  //           (test) =>
  //             Number(test.user) === Number(siswa.id) &&
  //             test.user_detail?.is_staff !== true
  //         )
  //         .sort((a, b) => Number(a.id) - Number(b.id));
  
  //       const row: any = {
  //         No: index + 1,
  //         "Nama Siswa": siswa.nama_lengkap,
  //         NIM: siswa.nim || "-",
  //         Kelas: siswa.kelas || "-",
  //       };
  
  //       daftarSOP.forEach((namaSOP, sopIndex) => {
  //         const testSOP = testMahasiswa.find(
  //           (test) => String(test.sop) === String(namaSOP)
  //         );
  
  //         row[`SOP ${sopIndex + 1}`] = testSOP?.total_nilai ?? "-";
  //       });
  
  //       for (let i = daftarSOP.length; i < 14; i++) {
  //         row[`SOP ${i + 1}`] = "-";
  //       }
  
  //       const totalNilai = testMahasiswa.reduce((acc, test) => {
  //         return acc + Number(test.total_nilai || 0);
  //       }, 0);
  
  //       const jumlahSOPDinilai = testMahasiswa.length;
  
  //       const rataRataNilai =
  //         jumlahSOPDinilai > 0
  //           ? Number((totalNilai / jumlahSOPDinilai).toFixed(2))
  //           : 0;
  
  //       const tanggalTest = testMahasiswa[0]?.created_at;
  
  //       row["Rata-rata Nilai"] = rataRataNilai;
  //       row["Status"] = rataRataNilai > 75 ? "Lulus" : "Tidak Lulus";
  //       row["Tanggal Test"] = tanggalTest
  //         ? new Date(tanggalTest).toLocaleDateString("id-ID")
  //         : "-";
  
  //       return row;
  //     });
  
  //     const dataDaftarSOP = Array.from({ length: 14 }).map((_, index) => ({
  //       "Kode SOP": `SOP ${index + 1}`,
  //       "Nama SOP": daftarSOP[index] || "-",
  //     }));
  
  //     const workbook = XLSX.utils.book_new();
  
  //     const worksheetNilai = XLSX.utils.json_to_sheet(dataExcel);
  //     const worksheetDaftarSOP = XLSX.utils.json_to_sheet(dataDaftarSOP);
  
  //     worksheetNilai["!cols"] = [
  //       { wch: 6 },
  //       { wch: 32 },
  //       { wch: 18 },
  //       { wch: 12 },
  //       ...Array.from({ length: 14 }).map(() => ({ wch: 10 })),
  //       { wch: 18 },
  //       { wch: 16 },
  //       { wch: 18 },
  //     ];
  
  //     worksheetDaftarSOP["!cols"] = [
  //       { wch: 14 },
  //       { wch: 70 },
  //     ];
  
  //     const headerStyle = {
  //       font: {
  //         name: "Arial",
  //         bold: true,
  //         color: { rgb: "FFFFFF" },
  //       },
  //       fill: {
  //         fgColor: { rgb: "0F766E" },
  //       },
  //       alignment: {
  //         horizontal: "center",
  //         vertical: "center",
  //         wrapText: true,
  //       },
  //       border: {
  //         top: { style: "thin", color: { rgb: "0F766E" } },
  //         bottom: { style: "thin", color: { rgb: "0F766E" } },
  //         left: { style: "thin", color: { rgb: "0F766E" } },
  //         right: { style: "thin", color: { rgb: "0F766E" } },
  //       },
  //     };
  
  //     const bodyStyle = {
  //       font: {
  //         name: "Arial",
  //         color: { rgb: "111827" },
  //       },
  //       alignment: {
  //         vertical: "center",
  //         wrapText: true,
  //       },
  //       border: {
  //         top: { style: "thin", color: { rgb: "D9E2EC" } },
  //         bottom: { style: "thin", color: { rgb: "D9E2EC" } },
  //         left: { style: "thin", color: { rgb: "D9E2EC" } },
  //         right: { style: "thin", color: { rgb: "D9E2EC" } },
  //       },
  //     };
  
  //     const centerBodyStyle = {
  //       ...bodyStyle,
  //       alignment: {
  //         horizontal: "center",
  //         vertical: "center",
  //         wrapText: true,
  //       },
  //     };
  
  //     const greenScoreStyle = {
  //       ...centerBodyStyle,
  //       font: {
  //         name: "Arial",
  //         bold: true,
  //         color: { rgb: "047857" },
  //       },
  //     };
  
  //     const emptyScoreStyle = {
  //       ...centerBodyStyle,
  //       font: {
  //         name: "Arial",
  //         bold: true,
  //         color: { rgb: "9CA3AF" },
  //       },
  //       fill: {
  //         fgColor: { rgb: "F3F4F6" },
  //       },
  //     };
  
  //     const getStatusStyle = (status: string) => ({
  //       ...centerBodyStyle,
  //       font: {
  //         name: "Arial",
  //         bold: true,
  //         color: {
  //           rgb: status === "Lulus" ? "047857" : "DC2626",
  //         },
  //       },
  //       fill: {
  //         fgColor: {
  //           rgb: status === "Lulus" ? "DCFCE7" : "FEE2E2",
  //         },
  //       },
  //     });
  
  //     const applyStyleToSheet = (worksheet: any, type: "rekap" | "daftar") => {
  //       const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:A1");
  
  //       for (let row = range.s.r; row <= range.e.r; row++) {
  //         for (let col = range.s.c; col <= range.e.c; col++) {
  //           const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
  //           const cell = worksheet[cellAddress];
  
  //           if (!cell) continue;
  
  //           if (row === 0) {
  //             cell.s = headerStyle;
  //             continue;
  //           }
  
  //           const isKolomSOP = type === "rekap" && col >= 4 && col <= 17;
  //           const isKolomRataRata = type === "rekap" && col === 18;
  //           const isKolomStatus = type === "rekap" && col === 19;
  
  //           if (isKolomSOP) {
  //             cell.s = cell.v === "-" ? emptyScoreStyle : greenScoreStyle;
  //           } else if (isKolomRataRata) {
  //             cell.s = greenScoreStyle;
  //           } else if (isKolomStatus) {
  //             cell.s = getStatusStyle(cell.v);
  //           } else {
  //             cell.s = col === 0 || col >= 2 ? centerBodyStyle : bodyStyle;
  //           }
  //         }
  //       }
  
  //       worksheet["!rows"] = Array.from({ length: range.e.r + 1 }).map(
  //         (_, index) => ({
  //           hpt: index === 0 ? 28 : 24,
  //         })
  //       );
  
  //       worksheet["!autofilter"] = {
  //         ref: worksheet["!ref"],
  //       };
  //     };
  
  //     applyStyleToSheet(worksheetNilai, "rekap");
  //     applyStyleToSheet(worksheetDaftarSOP, "daftar");
  
  //     XLSX.utils.book_append_sheet(workbook, worksheetNilai, "Rekap Nilai");
  //     XLSX.utils.book_append_sheet(workbook, worksheetDaftarSOP, "Daftar SOP");
  
  //     XLSX.writeFile(workbook, "rekap_nilai_sop_mahasiswa.xlsx");
  //   } catch (error) {
  //     // console.error("Gagal mencetak Excel:", error);
  //     // alert("Gagal mencetak Excel");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleCetakExcelPerSiswa = async () => {
  //   setIsLoading(true);
  
  //   try {
  //     if (!mahasiswaAktif) {
  //       alert("Data mahasiswa belum dipilih");
  //       return;
  //     }
  
  //     if (testUserList.length === 0) {
  //       alert("Mahasiswa ini belum memiliki data SOP");
  //       return;
  //     }
  
  //     const workbook = XLSX.utils.book_new();
  
  //     for (const sop of testUserList) {
  //       const response = await getDetailTestById(sop.id);
  
  //       if (response.status !== 200) continue;
  
  //       const detailData: detailTestType[] = response.data;
  
  //       const detailIds = detailData.map((item: any) => item.soal_sop);
  
  //       const responsesDetailSoal = await Promise.all(
  //         detailIds.map(async (id: number) => {
  //           const res = await getDetailSop(id);
  
  //           return {
  //             id,
  //             response: res,
  //           };
  //         })
  //       );
  
  //       const detailSoalSemua: detailSoalType[] = responsesDetailSoal
  //         .filter((item) => item.response.status === 200)
  //         .flatMap((item) => item.response.data);
  
  //       const totalNilaiBobot = detailData.reduce((total, item) => {
  //         return total + Number(item.soal_sop_detail?.bobot || 0);
  //       }, 0);
  
  //       const totalNilaiDidapat = detailData.reduce((acc, item) => {
  //         return acc + Number(item.nilai || 0);
  //       }, 0);
  
  //       const totalNilai =
  //         totalNilaiBobot > 0
  //           ? Number(((totalNilaiDidapat / totalNilaiBobot) * 100).toFixed(0))
  //           : 0;
  
  //       const namaDosen =
  //         testAllUserList.find(
  //           (test) =>
  //             Number(test.sesi) === Number(sop.sesi) &&
  //             test.user_detail?.is_staff === true
  //         )?.user_detail?.nama_lengkap || "Unknown";
  
  //       const worksheetData: any[][] = [
  //         ["DETAIL NILAI SOP MAHASISWA"],
  //         [],
  //         ["Nama Siswa", mahasiswaAktif.nama_lengkap || "-"],
  //         ["NIM", mahasiswaAktif.nim || "-"],
  //         ["Kelas", mahasiswaAktif.kelas || "-"],
  //         ["Nama SOP", sop.sop || "-"],
  //         ["Total Nilai", totalNilai],
  //         ["Nama Dosen", namaDosen],
  //         [],
  //         ["No", "Soal SOP", "Bobot", "Nilai yang Didapat"],
  //       ];
  
  //       detailData.forEach((item, index) => {
  //         worksheetData.push([
  //           index + 1,
  //           item.soal_sop_detail?.soal || "-",
  //           item.soal_sop_detail?.bobot || 0,
  //           item.nilai ?? 0,
  //         ]);
  
  //         const detailSoalBySop = detailSoalSemua.filter(
  //           (detail) => Number(detail.sop) === Number(item.soal_sop)
  //         );
  
  //         detailSoalBySop.forEach((detail) => {
  //           worksheetData.push([
  //             "",
  //             `• ${detail.deskripsi_soal || "-"}`,
  //             "",
  //             "",
  //           ]);
  //         });
  //       });
  
  //       const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
  //       worksheet["!cols"] = [
  //         { wch: 8 },
  //         { wch: 80 },
  //         { wch: 12 },
  //         { wch: 22 },
  //       ];
  
  //       worksheet["!merges"] = [
  //         {
  //           s: { r: 0, c: 0 },
  //           e: { r: 0, c: 3 },
  //         },
  //       ];
  
  //       const baseBorder = {
  //         top: { style: "thin", color: { rgb: "D9E2EC" } },
  //         bottom: { style: "thin", color: { rgb: "D9E2EC" } },
  //         left: { style: "thin", color: { rgb: "D9E2EC" } },
  //         right: { style: "thin", color: { rgb: "D9E2EC" } },
  //       };
  
  //       const greenBorder = {
  //         top: { style: "thin", color: { rgb: "A7F3D0" } },
  //         bottom: { style: "thin", color: { rgb: "A7F3D0" } },
  //         left: { style: "thin", color: { rgb: "A7F3D0" } },
  //         right: { style: "thin", color: { rgb: "A7F3D0" } },
  //       };
  
  //       const baseStyle = {
  //         font: {
  //           name: "Arial",
  //           sz: 11,
  //         },
  //         alignment: {
  //           vertical: "center",
  //           wrapText: true,
  //         },
  //         border: baseBorder,
  //       };
  
  //       const centerStyle = {
  //         ...baseStyle,
  //         alignment: {
  //           horizontal: "center",
  //           vertical: "center",
  //           wrapText: true,
  //         },
  //       };
  
  //       const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:D1");
  
  //       for (let row = range.s.r; row <= range.e.r; row++) {
  //         for (let col = range.s.c; col <= range.e.c; col++) {
  //           const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
  
  //           if (!worksheet[cellAddress]) continue;
  
  //           worksheet[cellAddress].s = baseStyle;
  //         }
  //       }
  
  //       worksheet["A1"].s = {
  //         font: {
  //           name: "Arial",
  //           sz: 16,
  //           bold: true,
  //           color: { rgb: "FFFFFF" },
  //         },
  //         fill: {
  //           fgColor: { rgb: "059669" },
  //         },
  //         alignment: {
  //           horizontal: "center",
  //           vertical: "center",
  //         },
  //       };
  
  //       for (let row = 2; row <= 7; row++) {
  //         const labelCell = `A${row + 1}`;
  //         const valueCell = `B${row + 1}`;
  
  //         if (worksheet[labelCell]) {
  //           worksheet[labelCell].s = {
  //             font: {
  //               name: "Arial",
  //               bold: true,
  //               color: { rgb: "064E3B" },
  //             },
  //             fill: {
  //               fgColor: { rgb: "D1FAE5" },
  //             },
  //             alignment: {
  //               vertical: "center",
  //               wrapText: true,
  //             },
  //             border: greenBorder,
  //           };
  //         }
  
  //         if (worksheet[valueCell]) {
  //           worksheet[valueCell].s = {
  //             font: {
  //               name: "Arial",
  //               bold: true,
  //               color: { rgb: "111827" },
  //             },
  //             alignment: {
  //               vertical: "center",
  //               wrapText: true,
  //             },
  //             border: greenBorder,
  //           };
  //         }
  //       }
  
  //       const tableHeaderRow = 10;
  
  //       ["A", "B", "C", "D"].forEach((col) => {
  //         const cell = `${col}${tableHeaderRow}`;
  
  //         if (worksheet[cell]) {
  //           worksheet[cell].s = {
  //             font: {
  //               name: "Arial",
  //               bold: true,
  //               color: { rgb: "FFFFFF" },
  //             },
  //             fill: {
  //               fgColor: { rgb: "0F766E" },
  //             },
  //             alignment: {
  //               horizontal: "center",
  //               vertical: "center",
  //               wrapText: true,
  //             },
  //             border: {
  //               top: { style: "thin", color: { rgb: "0F766E" } },
  //               bottom: { style: "thin", color: { rgb: "0F766E" } },
  //               left: { style: "thin", color: { rgb: "0F766E" } },
  //               right: { style: "thin", color: { rgb: "0F766E" } },
  //             },
  //           };
  //         }
  //       });
  
  //       for (let row = tableHeaderRow + 1; row <= range.e.r + 1; row++) {
  //         const noCell = worksheet[`A${row}`];
  //         const soalCell = worksheet[`B${row}`];
  //         const bobotCell = worksheet[`C${row}`];
  //         const nilaiCell = worksheet[`D${row}`];
  
  //         const isDetailSoal = noCell && noCell.v === "";
  
  //         if (isDetailSoal) {
  //           ["A", "B", "C", "D"].forEach((col) => {
  //             const cell = worksheet[`${col}${row}`];
  
  //             if (!cell) return;
  
  //             cell.s = {
  //               font: {
  //                 name: "Arial",
  //                 italic: true,
  //                 color: { rgb: "374151" },
  //               },
  //               fill: {
  //                 fgColor: { rgb: "ECFDF5" },
  //               },
  //               alignment: {
  //                 vertical: "center",
  //                 wrapText: true,
  //               },
  //               border: {
  //                 top: { style: "thin", color: { rgb: "D1FAE5" } },
  //                 bottom: { style: "thin", color: { rgb: "D1FAE5" } },
  //                 left: { style: "thin", color: { rgb: "D1FAE5" } },
  //                 right: { style: "thin", color: { rgb: "D1FAE5" } },
  //               },
  //             };
  //           });
  
  //           continue;
  //         }
  
  //         if (noCell) {
  //           noCell.s = {
  //             ...centerStyle,
  //             font: {
  //               name: "Arial",
  //               bold: true,
  //             },
  //           };
  //         }
  
  //         if (soalCell) {
  //           soalCell.s = {
  //             ...baseStyle,
  //             font: {
  //               name: "Arial",
  //               color: { rgb: "111827" },
  //             },
  //           };
  //         }
  
  //         if (bobotCell) {
  //           bobotCell.s = {
  //             ...centerStyle,
  //             font: {
  //               name: "Arial",
  //               bold: true,
  //             },
  //           };
  //         }
  
  //         if (nilaiCell) {
  //           nilaiCell.s = {
  //             ...centerStyle,
  //             font: {
  //               name: "Arial",
  //               bold: true,
  //               color: {
  //                 rgb: Number(nilaiCell.v) > 1 ? "047857" : "DC2626",
  //               },
  //             },
  //           };
  //         }
  //       }
  
  //       worksheet["!rows"] = worksheetData.map((_, index) => {
  //         if (index === 0) return { hpt: 28 };
  //         if (index >= 2 && index <= 7) return { hpt: 22 };
  //         if (index === 9) return { hpt: 24 };
  
  //         return { hpt: 35 };
  //       });
  
  //       const namaSheet = String(sop.sop || "SOP")
  //         .replace(/[\\/:*?"<>|]/g, "")
  //         .slice(0, 31);
  
  //       XLSX.utils.book_append_sheet(
  //         workbook,
  //         worksheet,
  //         namaSheet || `SOP ${sop.id}`
  //       );
  //     }
  
  //     const namaFile = `detail_nilai_${mahasiswaAktif.nama_lengkap || "mahasiswa"}`
  //       .replace(/[\\/:*?"<>|]/g, "")
  //       .replace(/\s+/g, "_")
  //       .toLowerCase();
  
  //     XLSX.writeFile(workbook, `${namaFile}.xlsx`);
  //   } catch (error) {
  //     console.error("Gagal cetak Excel per siswa:", error);
  //     alert("Gagal mencetak Excel per siswa");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleDeleteTest = async (id: number) => {
    setIsLoading(true);
  
    try {
      const res = await deleteTest(id);
  
      if (res.status === 204) {
        alert("Data test berhasil dihapus");
  
        setSelectedDeleteTest(false);
        setTestDeleteAktif(null);
        setSelectedDetailResult(false);
      }
    } catch (error) {
      alert("Gagal menghapus data test");
    } finally {
      setIsLoading(false);
    }
  };

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

            <div className="flex w-full flex-col gap-2 sm:max-w-xl sm:flex-row">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari mahasiswa..."
                className="w-full rounded-xl border border-gray-400 bg-white px-4 py-3 font-semibold text-gray-700 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />

              <button
                onClick={() => setSelectedPeringkat(true)}
                className="rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 px-5 py-3 font-black text-white shadow-md transition hover:scale-[1.02] flex flex-row justify-center"
              >
                <div className="w-[20px] h-[20px] pb-1 flex justify-center items-center">
                  <Image src="/crown.png" alt="Logo" width={12} height={12} />  
                </div>
                <p className="ml-1">Peringkat</p>
              </button>
              <button
                onClick={handleCetakExcel}
                disabled={isLoading===true}
                className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-3 font-black text-white shadow-md transition hover:scale-[1.02] flex flex-row items-center justify-center w-full active:from-green-100 active:to-green-100 active:text-green-700"
              >
                <p>{isLoading ? 'mengunduh...' : 'Cetak Excel'}</p>
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
                      ((testAllUserList.filter((test) => Number(test.user) === item.id)).length*100))*100).toFixed(2)) > 75)
                        ? "bg-green-500 text-white"
                        : "bg-[#ff056d] text-white"
                    }`}
                  >
                    {(
                      parseFloat((((testAllUserList.filter((test) => Number(test.user) === item.id)).reduce((acc, test) => acc + test.total_nilai, 0) /
                      ((testAllUserList.filter((test) => Number(test.user) === item.id)).length*100))*100).toFixed(2)) > 75
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
                      {(() => {
                        const data = testAllUserList.filter(
                          (test) => Number(test.user) === Number(item.id)
                        );

                        return data.length > 0
                          ? (
                              data.reduce((acc, test) => acc + Number(test.total_nilai || 0), 0) /
                              data.length
                            ).toFixed(2)
                          : "0.00";
                      })()}
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
            <div className="w-full border-b border-gray-100 bg-gradient-to-br from-emerald-600 to-cyan-600 p-5 text-white md:w-[38%] md:border-b-0 md:border-r rounded-t-xl md:rounded-s-xl lg:rounded-s-xl md:rounded-e-[0px] lg:rounded-e-[0px]">
              <div className="mb-5 flex items-center justify-end md:justify-between lg:justify-between">
                <div className="md:flex lg:flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 text-2xl font-black backdrop-blur border-[.5px] border-white hidden">
                  {mahasiswaAktif?.nama_lengkap?.charAt(0)}
                </div>

                <button
                  onClick={() => setSelectedMahasiswa(false)}
                  className="rounded-lg bg-white/20 px-3 py-2  font-bold text-white hover:bg-white/30 md:hidden lg:hidden"
                >
                  Tutup
                </button>
              </div>

              <h2 className="text-2xl font-black">{mahasiswaAktif?.nama_lengkap}</h2>

              <p className="mt-1 text-emerald-50">
                Mahasiswa kelas {mahasiswaAktif?.kelas}
              </p>

              <div className="mt-6 space-y-3">
                <div className="rounded-xl bg-white/15 p-4 backdrop-blur hidden md:flex lg:flex flex-col">
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
                    testUserList.length > 0
                      ? (
                          (testUserList.reduce((acc, test) => acc + Number(test.total_nilai || 0), 0) /
                            (testUserList.length * 100)) *
                          100
                        ).toFixed(2)
                      : "0.00"
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
                      (testUserList.length*100))*100).toFixed(2)) > 75
                        ? "Lulus"
                        : "Tidak Lulus"
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* KANAN DETAIL SOP */}
            <div className="flex max-h-[55vh] flex-1 flex-col bg-white p-5 md:max-h-[90vh] rounded-b-xl md:rounded-e-xl lg:rounded-e-xl h-[50px] lg:h-[600px] bg-blue-500">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-black text-gray-800">
                Detail Nilai SOP
              </h3>
              <p className=" text-gray-500">
                Daftar SOP tindakan dan nilai mahasiswa.
              </p>
            </div>

            <button
              onClick={handleCetakExcelPerSiswa}
              disabled={isLoading===true}
              className={`rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-3 font-black text-white shadow-md transition hover:scale-[1.02] active:from-green-100 active:to-green-100 active:text-green-700 ${isLoading ? 'cursor-not-allowed opacity-70' : ''}`}
            >
              {isLoading ? 'mengunduh...' : 'Cetak Excel'}
            </button>
          </div>

              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {testUserList.map((sop, index) => {
                  const isNilaiLulus = sop.total_nilai >= 70;

                  return (
                    <button
                      onClick={() => {
                        setTesDipilih(sop.id);
                        setSopAktif(sop);
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
                          <p className=" text-black text-left font-bold">
                            {sop.sop}
                          </p>
                          <p className=" text-gray-400">
                          Dosen : {getNamaDosenBySOP(sop.sop)}
                          {/* Dosen : {
                            testAllUserList.find(
                              (test) =>
                                Number(test.sesi) === Number(sop.sesi) &&
                                test.user_detail?.is_staff === true
                            )?.user_detail?.nama_lengkap || "Unknown"
                          } */}
                        </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
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

                        {/* <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTestDeleteAktif(sop);
                            setSelectedDeleteTest(true);
                          }}
                          className="rounded-lg bg-red-500 p-3 text-xs font-black text-white shadow-md transition hover:bg-red-700 active:scale-95"
                        >
                          <Image src="/trash.png" alt="Logo" width={13} height={13} />
                        </button> */}
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
                            <p className="opacity-50 mr-5">
                              bobot : {item.soal_sop_detail.bobot}
                            </p>

                            {item.soal_sop_detail.bobot > 0 && (
                              <>
                                <div className="flex justify-center">
                                  <div
                                    className={`px-4 h-9 flex justify-center items-center rounded-lg border font-black transition ${
                                      item.nilai === 0
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
                              </>
                            )}
                          </div>
                        </div>

                        {detailSoalBySop.length > 0 && (
                          <div className="mx-3 mb-3 rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
                            <div className="flex flex-col gap-2">
                              {detailSoalBySop.map((detail) => (
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
              className="absolute lg:top-1 lg:-right-[60px] md:top-1 md:-right-[60px] right-3 top-3 z-50 flex h-[45px] w-[45px] items-center justify-center rounded-xl border-2 border-white transition-all duration-100 hover:bg-[#cc005f]"
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
              <div className="absolute right-0 left-0 lg:top-[114px] md:top-[114px] top-[169px] h-[30px] bg-white" />
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
                          SOP selesai: {item.jumlahSOP}/7
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


      {/* POPUP HAPUS TEST SOP */}
      {selectedDeleteTest && (
        <>
          <div
            onClick={() => {
              setSelectedDeleteTest(false);
              setTestDeleteAktif(null);
            }}
            className="fixed inset-0 z-[80] bg-slate-950/70 backdrop-blur-sm"
          />

          <div className="fixed left-1/2 top-1/2 z-[90] w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-xl font-black text-red-600">
                !
              </div>

              <div>
                <h2 className="text-xl font-black text-gray-800">
                  Hapus Test SOP?
                </h2>
                <p className="text-sm text-gray-500">
                  Data nilai test SOP ini akan dihapus.
                </p>
              </div>
            </div>

            <div className="mb-5 rounded-xl border border-red-100 bg-red-50 p-4">
              <p className="text-sm font-semibold text-gray-500">Nama SOP</p>
              <p className="font-black text-gray-800">
                {testDeleteAktif?.sop || "-"}
              </p>

              <p className="mt-3 text-sm font-semibold text-gray-500">Nilai</p>
              <p className="font-black text-red-600">
                {testDeleteAktif?.total_nilai ?? 0}
              </p>
            </div>

            <p className="mb-5 text-sm text-gray-500">
              Apakah kamu yakin ingin menghapus test SOP ini?
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedDeleteTest(false);
                  setTestDeleteAktif(null);
                }}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 font-black text-gray-700 transition hover:bg-gray-100"
              >
                Tidak
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  if (testDeleteAktif?.id) {
                    handleDeleteTest(testDeleteAktif.id);
                  }
                }}
                className="w-full rounded-xl bg-red-600 px-4 py-3 font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default Page;