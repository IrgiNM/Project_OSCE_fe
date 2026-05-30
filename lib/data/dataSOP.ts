import React, { useEffect, useState } from 'react'
import { getAllSop } from '../function/api'
import { SoalSOPType } from '@/type/soalSOPType'

const dataSOP = () => {

    const [soalSOPList, setSoalSOPList] = useState<SoalSOPType[]>([])
    const [soalSOPJenisList, setSoalSOPJenisList] = useState<string[]>([])
  
    useEffect(()=>{
        const fetchSoalSOP = async () => {
            try {
                const response = await getAllSop();
                if(response.status === 200){
                    setSoalSOPList(response.data)
                }
            } catch (error) {
                console.error('Error fetching SoalSOP:', error)
            }
        }
        fetchSoalSOP()
    }, [])
    
    useEffect(()=>{
      const uniqueData = [...new Set(
          soalSOPList.map((item)=>item.nama_sop)
      )]
      setSoalSOPJenisList(uniqueData)
    }, [soalSOPList])


    useEffect(()=>{
        console.error('SoalSOPList:', soalSOPList)
    }, [soalSOPList])

    return {
      soalSOPList,
      soalSOPJenisList
    }
}

export default dataSOP