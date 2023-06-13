import Head from 'next/head';
import { Container } from '@mui/material';

import Table from '../../../views/dashboard/Table'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { DOCTOR_ROUTE, EXERCISE_LEVEL_ROUTE, MOODCATEGORY_ROUTE } from 'src/configs/appRoutes'
import { CREATE_EXERCISE_LEVEL_ROUTE } from 'src/configs/createRoutes'

function ExerciseLevel() {
  // const column = ['Name','Description','Phone','Working hour','working day','Experience','last_Created At','last_creaed By','Image', 'last_Updated At'];

  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{

    const GetExerciseLevelList = async ()=>{
       await axios.get(EXERCISE_LEVEL_ROUTE).then((res)=>{
        // setLoading(true);
        setData(res.data);
        if (data ==null) {
          setLoading(true);
        }
        setLoading(false);

        const keys = Object.keys(res.data[0]);
        setColumns(keys);



      })
      .catch((res)=>{
        setLoading(false);

        console.log(res.response.data)
      })



    }
    GetExerciseLevelList();



  },[])

  return (
    <>
      <Head>
        <title>Exercise level - Applications</title>
      </Head>

      <Container maxWidth="lg">

          <Table title ="Exercise level" columnList={columns} data={data} loading={loading} create={CREATE_EXERCISE_LEVEL_ROUTE}></Table>

      </Container>

    </>
  );
}


export default ExerciseLevel;
