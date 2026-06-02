import React, { useEffect, useState } from 'react'
import { getTestById } from '../function/api'
import { TestType, UserTestGroup } from '@/type/testType'

const dataTest = () => {
    const [testList, setTestList] = useState<TestType[]>([])
    const [userTests, setUserTests] = useState<UserTestGroup[]>([]);
    const [sesiToken, setSesiToken] = useState<string | null>(null);

    useEffect(()=>{
        const fetchSesiToken = async () => {
            try {
                const token = localStorage.getItem("sesi") || "0";
                setSesiToken(token);
            } catch (error) {
                console.error('Error fetching sesi token:', error);
            }
        }
        fetchSesiToken();
    }, [])
    
    useEffect(()=>{
        if (!sesiToken) return;
        const fetchTest = async () => {
            try {
                const response = await getTestById(Number(sesiToken));
                if(response.status === 200){
                    setTestList(response.data)
                }
            } catch (error) {
                console.error('Error fetching Test:', error)
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
        console.error('TestList:', testList)
    }, [testList])

    return {testList,userTests}
}

export default dataTest