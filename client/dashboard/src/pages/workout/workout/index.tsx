import Head from 'next/head'
import { Container } from '@mui/material'

import Table from '../../../views/dashboard/Table'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { WORKOUT_ROUTE } from 'src/configs/appRoutes'
import { CREATE_DISCOVER_ROUTE, CREATE_WORKOUT_ROUTE } from 'src/configs/createRoutes'
import ErrorAlert from 'src/content/ErrorAlert'
import InfoAlert from 'src/content/InfoAlert'
import SuccessAlert from 'src/content/SuccessAlert'
import { useRouter } from 'next/router'

function Discover() {

  const [data, setData] = useState([])
  const [columns, setColumns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()



  useEffect(() => {

    const GetDiscoverList = async () => {

      const userData = JSON.parse(localStorage.getItem('userData'))

      const headers = {
        Authorization: `Bearer ${userData.accessToken}` // Include the token in the Authorization header
      }
      await axios.get(WORKOUT_ROUTE, { headers }).then((res) => {
        // setLoading(true);
        setData(res.data)
        setLoading(false)



        const keys = Object.keys(res.data[0])
        setColumns(keys)


      })
        .catch((res) => {
          setLoading(false)
          setError(res)

        })



    }
    GetDiscoverList()



  }, [])

  return (
    <>
      {error && <ErrorAlert message={error} />}
      {router.query.success === "true" ? (
        <SuccessAlert message={"Workout created successfully"} />
      ) : (
        data !== null && <InfoAlert message={"Workout list displayed successfully"} />
      )}
      <Head>
        <title>Workout - Applications</title>
      </Head>

      <Container maxWidth="lg">

        <Table title="Workout" columnList={columns} data={data} loading={loading} create={CREATE_WORKOUT_ROUTE}></Table>

      </Container>

    </>
  )
}


export default Discover
