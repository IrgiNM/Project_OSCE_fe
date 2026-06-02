import axios from "axios";
import { getToken } from "./token";
import { registerType } from "@/type/registerType";
import { loginType } from "@/type/loginType";
import { uploadTestType } from "@/type/uploadTestType";
import { createTestType } from "@/type/detailTestType";
import { UpdateDetailTestType } from "@/type/updateDetailTestType";

export const BASEURL = process.env.NEXT_PUBLIC_API_URL + "/";

export const api = axios.create({
  baseURL: BASEURL,
  withCredentials: true,
  timeout: 60000,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// AUTH
export const login = (data: loginType) =>
    axios.post(
      BASEURL + "api/login/",
      data
    );
export const register = (data: registerType) => api.post("api/user/create/", data);
export const getAllUserSiswa = () => api.get("api/user/list/mahasiswa/");
export const getAllUserDosen = () => api.get("api/user/list/dosen/");

// SESI
export const createSesiUjian = () => api.post("api/sesi/create/");
export const getAllSesiUjian = () => api.get("api/sesi/list/");

// SOP
export const getAllSop = () => api.get("api/soal-sop/list/");
export const getListSopByName = (data: string) => api.get(`api/soal-sop/list/${data}/`);

// TEST
export const uploadTest = (data: uploadTestType) => api.post("api/test/create/", data);
export const getTestById = (data: number) => api.get(`api/test/list/${data}/`);

// DETAIL TEST
export const createDetailTest = (data: createTestType) => api.post("api/detail-test/create/", data);   
export const getDetailTestById = (data: number) => api.get(`api/detail-test/list/${data}/`);
export const updateDetailTest = (data: UpdateDetailTestType) => api.patch(`api/detail-test/update/`, data);
