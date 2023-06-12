import Head from 'next/head';
import { Container } from '@mui/material';

import Table from '../../views/dashboard/Table'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { MOODCATEGORY_ROUTE, MOOD_ROUTE, SITECONFIG_ROUTE } from 'src/configs/appRoutes'

function SiteConfig() {

  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{

    const GetSiteConfigList = async ()=>{
       await axios.get(SITECONFIG_ROUTE).then((res)=>{
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
    GetSiteConfigList();



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
