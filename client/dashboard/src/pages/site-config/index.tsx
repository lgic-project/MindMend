import Head from 'next/head';
import { Container } from '@mui/material';

import Table from '../../views/dashboard/Table'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { MOODCATEGORY_ROUTE, MOOD_ROUTE } from 'src/configs/appRoutes'

function SiteConfig() {
  // const column = ['Name','Logo','Created At', 'Updated At'];

  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{

    const GetMoodCategoryList = async ()=>{
       await axios.get(MOOD_ROUTE).then((res)=>{
        // setLoading(true);
        setData(res.data);
        setLoading(false);

        const keys = Object.keys(res.data[0]);
        setColumns(keys);


      });



    }
    GetMoodCategoryList();



  },[])

  return (
    <>
      <Head>
        <title>SiteConfig - Applications</title>
      </Head>

      <Container maxWidth="lg">

          <Table title ="SiteConfig" columnList={columns} data={data} loading={loading}></Table>

      </Container>

    </>
  );
}


export default SiteConfig;
