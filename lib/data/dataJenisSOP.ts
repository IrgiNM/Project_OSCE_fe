import React, { useEffect, useState } from 'react'
import { getAllJenisSop } from '../function/api'
import { JenisSOPType } from '@/type/jenisSOPType'

const dataJenisSOP = () => {
  
    const [JenisSOPList, setJenisSOPList] = useState<JenisSOPType[]>([])
    
    useEffect(()=>{
        const fetchSoalSOP = async () => {
            try {
                const response = await getAllJenisSop();
                if(response.status === 200){
                    setJenisSOPList(response.data)
                }
            } catch (error) {
                console.error('Error fetching SoalSOP:', error)
            }
        }
        fetchSoalSOP()
    }, [])

    // useEffect(()=>{
    //     console.error('JenisSOPList:', JenisSOPList)
    // }, [JenisSOPList])

    return {
      JenisSOPList,
    }
}

export default dataJenisSOP