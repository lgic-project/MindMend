import Head from 'next/head'
import { Container } from '@mui/material'

import Table from '../../../views/dashboard/Table'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { MOODCATEGORY_ROUTE, MOOD_ROUTE, PROFILE_ROUTE } from 'src/configs/appRoutes'
import NextUILoadingComponent from 'src/layouts/components/loading'
import ErrorAlert from 'src/content/ErrorAlert'
import InfoAlert from 'src/content/InfoAlert'

function Mood() {
  // const column = ['Name','Logo','Created At', 'Updated At'];

  const [data, setData] = useState([])
  const [columns, setColumns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)


  useEffect(() => {

    const GetMoodList = async () => {
      await axios.get(MOOD_ROUTE + "/list").then((res) => {
        // setLoading(true);
        setData(res.data)
        setLoading(false)

        const keys = Object.keys(res.data[0])
        setColumns(keys)


      })
        .catch((res) => {
          setLoading(false)

          setError(res.response)

        })



    }
    GetMoodList()



  }, [])


  return (
    <>
      {/* {error && <ErrorAlert message={error.message} />} */}
      {data !== null && <InfoAlert message={"Mood list displayed successfully"} />}
      <Head>
        <title>Mood - Applications</title>
      </Head>

      <Container maxWidth="lg">

        <Table title="Mood" columnList={columns} data={data} loading={loading} create={'Empty'} ></Table>

      </Container>

    </>
  )
}


export default Mood
