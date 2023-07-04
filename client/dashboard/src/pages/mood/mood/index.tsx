import Head from 'next/head'
import { Container } from '@mui/material'

import Table from '../../../views/dashboard/Table'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { MOODCATEGORY_ROUTE, MOOD_ROUTE, PROFILE_ROUTE } from 'src/configs/appRoutes'
import NextUILoadingComponent from 'src/layouts/components/loading'
import ErrorAlert from 'src/content/ErrorAlert'
import InfoAlert from 'src/content/InfoAlert'
import authHeader from '../../../configs/authHeader'


function Mood() {
  // const column = ['Name','Logo','Created At', 'Updated At'];

  const [data, setData] = useState([])
  const [columns, setColumns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)



  useEffect(() => {

    const GetMoodList = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'))

        const headers = {
          Authorization: `Bearer ${userData.accessToken}` // Include the token in the Authorization header
        }
        await axios.get(MOOD_ROUTE + "/list", { headers }).then((res) => {
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
      } catch (error) {
        console.log(error)
      }



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
