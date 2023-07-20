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
import { useRouter } from 'next/router'
import SuccessAlert from 'src/content/SuccessAlert'

function MoodCategory() {

  const [data, setData] = useState([])
  const [columns, setColumns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const router = useRouter()



  useEffect(() => {


    const GetMoodCategoryList = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'))

        const headers = {
          Authorization: `Bearer ${userData.accessToken}` // Include the token in the Authorization header
        }
        const res = await axios.get(MOODCATEGORY_ROUTE, { headers })

        // setLoading(true);
        setData(res.data)
        setLoading(false)

        const keys = Object.keys(res.data[0])
        console.log(keys)
        setColumns(keys)

      } catch (error) {
        setLoading(false)
        setError(error)
      }



    }
    GetMoodCategoryList()



  }, [])


  return (
    <>
      {error && <ErrorAlert message={error.message} />}
      {router.query.success === "true" ? (
        <SuccessAlert message={"Mood category created successfully"} />
      ) : (
        data !== null && <InfoAlert message={"Mood category displayed successfully"} />
      )}


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
