export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const getMahasiswaPilihan = () => {
  const data = localStorage.getItem("mahasiswa");
  return data ? JSON.parse(data) : [];
};
export const getDosenPilihan = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("dosen");
};
export const getSOPPilihan = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("sop");
};
export const getSesiPilihan = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("sesi");
};

export const setToken = async (token: string) => {
  localStorage.setItem("token", token);
};

export const setMahasiswaPilihan = async (data: number[]) => {
  localStorage.setItem("mahasiswa", JSON.stringify(data));
  alert("Mahasiswa pilihan berhasil disimpan!");
};

export const setDosenPilihan = async (data: number[]) => {
  localStorage.setItem("dosen", JSON.stringify(data));
  alert("Dosen pilihan berhasil disimpan!");
};

export const setSOPPilihan = async (data: string[]) => {
  localStorage.setItem("sop", JSON.stringify(data));
  alert("SOP pilihan berhasil disimpan!");
};

export const setSesiPilihan = async (data: number) => {
  localStorage.setItem("sesi", data.toString());
  alert("Sesi Ujian pilihan berhasil disimpan!");
};

export async function logoutUser() {
    try {
      await localStorage.removeItem('token');
    } catch (error) {
    }
  }