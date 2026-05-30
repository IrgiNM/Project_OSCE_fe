import { UserType } from '@/type/userType'
import React, { useEffect, useState } from 'react'
import { getAllUserSiswa } from '../function/api'

const dataSiswa = () => {

    const [siswaList, setSiswaList] = useState<UserType[]>([])

    useEffect(()=>{
        const fetchSiswa = async () => {
            try {
                const response = await getAllUserSiswa();
                if(response.status === 200){
                    setSiswaList(response.data)
                }
            } catch (error) {
                console.error('Error fetching siswa:', error)
            }
        }
        fetchSiswa()
    }, [])


    useEffect(()=>{
        console.error('siswaList:', siswaList)
    }, [siswaList])

    return {siswaList}
}

export default dataSiswa