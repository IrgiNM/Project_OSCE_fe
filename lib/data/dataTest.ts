import React, { useEffect, useState } from 'react'
import { getTestById, getTestByUser, getTestLast } from '../function/api'
import { TestType, UserTestGroup } from '@/type/testType'

const dataTest = (idUser?: number) => {
    const [testList, setTestList] = useState<TestType[]>([])
    const [testAllUserList, setTestAllUserList] = useState<TestType[]>([])
    const [testUserList, setTestUserList] = useState<TestType[]>([])
    const [userTests, setUserTests] = useState<UserTestGroup[]>([]);
    const [sesiToken, setSesiToken] = useState<string | null>(null);

    const [nim, setNim] = useState<string>("")
    const [namaLengkap, setNamaLengkap] = useState<string>("")
    const [kelas, setKelas] = useState<string>("")
    const [email, setEmail] = useState<string>("")


    useEffect(()=>{
        const fetchSesiToken = async () => {
            try {
                const token = localStorage.getItem("sesi") || "0";
                setSesiToken(token);
            } catch (error) {
                // console.error('Error fetching sesi token:', error);
            }
        }
        fetchSesiToken();
    }, [])
    
    useEffect(()=>{
        const fetchTest = async () => {
            try {
                const response = await getTestLast();
                if(response.status === 200){
                    setTestAllUserList(response.data)
                }
            } catch (error) {
                // console.error('Error fetching Test:', error)
            }
        }
        fetchTest()
    }, [])
    
    useEffect(() => {
        if (!idUser || idUser === 0) {
            setTestUserList([]);
            setNamaLengkap("");
            setNim("");
            setKelas("");
            setEmail("");
            return;
        }
    
        const fetchTest = async () => {
            try {
                // kosongkan dulu biar data lama tidak tampil
                setTestUserList([]);
                setNamaLengkap("");
                setNim("");
                setKelas("");
                setEmail("");
    
                const response = await getTestByUser(idUser);
    
                if (response.status === 200) {
                    setTestUserList(response.data);
                }
            } catch (error) {
                // console.error('Error fetching Test:', error);
            }
        };
    
        fetchTest();
    }, [idUser]);

    useEffect(() => {
        if (testUserList.length === 0) {
            setNamaLengkap("");
            setNim("");
            setKelas("");
            setEmail("");
            return;
        }
    
        setNamaLengkap(testUserList[0].user_detail.nama_lengkap);
        setNim(testUserList[0].user_detail.nim);
        setKelas(testUserList[0].user_detail.kelas);
        setEmail(testUserList[0].user_detail.email);
    }, [testUserList]);
    
    useEffect(()=>{
        if (!sesiToken) return;
        const fetchTest = async () => {
            try {
                const response = await getTestById(Number(sesiToken));
                if(response.status === 200){
                    setTestList(response.data)
                }
            } catch (error) {
                // console.error('Error fetching Test:', error)
            }
        }
        fetchTest()
    }, [sesiToken])

    useEffect(() => {
      if (!testList.length) return;
    
      const grouped: Record<number, TestType[]> = {};
    
      testList.forEach((test) => {
        const userId = test.user;
    
        if (!grouped[userId]) {
          grouped[userId] = [];
        }
    
        grouped[userId].push(test);
      });
    
      const result: UserTestGroup[] = Object.keys(grouped).map((userId) => ({
        userId: Number(userId),
        tests: grouped[Number(userId)],
      }));
    
      setUserTests(result);
    }, [testList]);


    useEffect(()=>{
        // console.error('TestList:', testList)
    }, [testList])

    return {testList,userTests,testAllUserList,testUserList,nim,namaLengkap,kelas,email}
}

export default dataTest