import { UserType } from '@/type/userType'
import React, { useEffect, useState } from 'react'
import { getAllUserDosen } from '../function/api'

const dataDosen = () => {

    const [dosenList, setDosenList] = useState<UserType[]>([])

    useEffect(()=>{
        const fetchDosen = async () => {
            try {
                const response = await getAllUserDosen();
                if(response.status === 200){
                    setDosenList(response.data)
                }
            } catch (error) {
                console.error('Error fetching Dosen:', error)
            }
        }
        fetchDosen()
    }, [])


    useEffect(()=>{
        console.error('DosenList:', dosenList)
    }, [dosenList])

    return {dosenList}
}

export default dataDosen