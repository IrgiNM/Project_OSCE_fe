"use client"
import React, { useEffect, useState } from 'react'
import { getAllSesiUjian } from '../function/api'
import { SesiUjianType } from '@/type/SesiUjianType'

const dataSesiUjian = () => {
    const [sesiList, setSesiList] = useState<SesiUjianType[]>([])
  
    useEffect(()=>{
        const fetchSesi = async () => {
            try {
                const response = await getAllSesiUjian();
                if(response.status === 200){
                    setSesiList(response.data)
                }
            } catch (error) {
                // console.error('Error fetching Sesi:', error)
            }
        }
        fetchSesi()
    }, [])


    useEffect(()=>{
        // console.error('SesiList:', sesiList)
    }, [sesiList])

    return {sesiList}
}

export default dataSesiUjian