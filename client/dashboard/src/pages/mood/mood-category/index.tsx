import Head from 'next/head'
import { Container } from '@mui/material'

import Table from '../../../views/dashboard/Table'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { MOODCATEGORY_ROUTE, PROFILE_ROUTE } from 'src/configs/appRoutes'
import NextUILoadingComponent from 'src/layouts/components/loading'
import { CREATE_MOOD_CATEGORY_ROUTE } from 'src/configs/createRoutes'
import ErrorAlert from 'src/content/ErrorAlert'
import InfoAlert from 'src/content/InfoAlert'

function MoodCategory() {
  // const column = ['Name','Logo','Created At', 'Updated At'];

  const [data, setData] = useState([])
  const [columns, setColumns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)


  useEffect(() => {

    const GetMoodCategoryList = async () => {
      await axios.get(MOODCATEGORY_ROUTE).then((res) => {
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
    GetMoodCategoryList()



  }, [])


  return (
    <>
      {error && <ErrorAlert message={error} />}
      {data !== null && <InfoAlert message={"Mood category displayed successfully"} />}
      <Head>
        <title>Mood Category - Applications</title>
      </Head>

      <Container maxWidth="lg">

        <Table title="Mood Category" columnList={columns} data={data} loading={loading} create={CREATE_MOOD_CATEGORY_ROUTE}></Table>

      </Container>

    </>
  )
}


export default MoodCategory
