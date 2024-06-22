import React, { useEffect, useState } from 'react'

function read() {

    const[data,setData]=useState([])
    const readData=()=>{
        const res=axios.get("https://6675e56ba8d2b4d072f1d5b1.mockapi.io/data")
        setData(res.data)
    }

    useEffect(()=>{
        readData()
    },[])
  return (
    <>
    <div>
    <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
    </div>
    </>
  )
}

export default read