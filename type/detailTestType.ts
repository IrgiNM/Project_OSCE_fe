import { SoalSOPType } from "./soalSOPType";

export type createTestType = {
    test: number;
    soal_sop: number;
    nilai: number;
}

export type detailTestType = {
    id: number;
    test: number;
    soal_sop: number;
    nilai: number;
    soal_sop_detail: SoalSOPType;
}