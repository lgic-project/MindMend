import Head from 'next/head'
import { Container } from '@mui/material'

import Table from '../../../views/dashboard/Table'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { DOCTOR_ROUTE, EXERCISE_LEVEL_ROUTE, MOODCATEGORY_ROUTE } from 'src/configs/appRoutes'
import { CREATE_EXERCISE_LEVEL_ROUTE } from 'src/configs/createRoutes'
import ErrorAlert from 'src/content/ErrorAlert'
import InfoAlert from 'src/content/InfoAlert'
import { useRouter } from 'next/router'
import SuccessAlert from 'src/content/SuccessAlert'

function ExerciseLevel() {
  // const column = ['Name','Description','Phone','Working hour','working day','Experience','last_Created At','last_creaed By','Image', 'last_Updated At'];

  const [data, setData] = useState([])
  const [columns, setColumns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()



  useEffect(() => {

    const GetExerciseLevelList = async () => {

      const userData = JSON.parse(localStorage.getItem('userData'))

      const headers = {
        Authorization: `Bearer ${userData.accessToken}` // Include the token in the Authorization header
      }
      await axios.get(EXERCISE_LEVEL_ROUTE, { headers }).then((res) => {
        // setLoading(true);
        setData(res.data)
        if (data == null) {
          setLoading(true)
        }
        console.log(res)
        setLoading(false)

        const keys = Object.keys(res.data[0])
        setColumns(keys)



      })
        .catch((res) => {
          setLoading(false)

          setError(res.response)
        })



    }
    GetExerciseLevelList()



  }, [])

  return (
    <>
      {error && <ErrorAlert message={error} />}
      {router.query.success === "true" ? (
        <SuccessAlert message={"Exercise data created successfully"} />
      ) : (
        data !== null && <InfoAlert message={"Exercise list displayed successfully"} />
      )}
      <Head>
        <title>Exercise level - Applications</title>
      </Head>

      <Container maxWidth="lg">

        <Table title="Exercise level" columnList={columns} data={data} loading={loading} create={CREATE_EXERCISE_LEVEL_ROUTE}></Table>

      </Container>

    </>
  )
}


export default ExerciseLevel
