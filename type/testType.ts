import { UserType } from "./userType";

export type TestType = {
    id: number;
    user: number;
    sesi: number;
    sop: string;
    total_nilai: number;
    created_at: string;
    user_detail: UserType;
}

export type UserTestGroup = {
  userId: number;
  tests: TestType[];
};