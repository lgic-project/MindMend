import Head from 'next/head';
import { Container } from '@mui/material';

import Table from '../../../views/dashboard/Table'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { DOCTORCATEGORY_ROUTE, DOCTOR_ROUTE } from 'src/configs/appRoutes'

function DoctorCategory() {
  // const column = ['Name','Description','Phone','Working hour','working day','Experience','last_Created At','last_creaed By','Image', 'last_Updated At'];

  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{

    const GetDoctorCategoryList = async ()=>{
       await axios.get(DOCTORCATEGORY_ROUTE).then((res)=>{
        // setLoading(true);
        setData(res.data);
        setLoading(false);

        const keys = Object.keys(res.data[0]);
        setColumns(keys);


      })
      .catch((res)=>{
        setLoading(false);

        console.log(res.response.data)
      })



    }
    GetDoctorCategoryList();



  },[])

  return (
    <>
      <Head>
        <title>Doctor Category - Applications</title>
      </Head>

      <Container maxWidth="lg">

          <Table title ="Doctor Category" columnList={columns} data={data} loading={loading}></Table>

      </Container>

    </>
  );
}


export default DoctorCategory;
