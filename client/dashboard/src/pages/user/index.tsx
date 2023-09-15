import Head from 'next/head'
import { Container } from '@mui/material'

import Table from '../../views/dashboard/Table'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { DOCTOR_ROUTE, USER_ROUTE } from 'src/configs/appRoutes'
import { CREATE_DOCTOR_ROUTE } from 'src/configs/createRoutes'
import ErrorAlert from 'src/content/ErrorAlert'
import InfoAlert from 'src/content/InfoAlert'
import { useRouter } from 'next/router'
import SuccessAlert from 'src/content/SuccessAlert'

function User() {
  // const column = ['Name','Description','Phone','Working hour','working day','Experience','last_Created At','last_creaed By','Image', 'last_Updated At'];

  const [data, setData] = useState([])
  const [columns, setColumns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()


  useEffect(() => {

    const GetDoctorList = async () => {
      const userData = JSON.parse(localStorage.getItem('userData'))

      const headers = {
        Authorization: `Bearer ${userData.accessToken}` // Include the token in the Authorization header
      }
      await axios.get(USER_ROUTE, { headers }).then((res) => {
        // setLoading(true);
        console.log(res.data)
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
    GetDoctorList()



  }, [])

  return (
    <>
      {error && <ErrorAlert message={error} />}
      {router.query.success === "true" ? (
        <SuccessAlert message={"User list created successfully"} />
      ) : (
        data !== null && <InfoAlert message={"User list displayed successfully"} />
      )}
      <Head>
        <title>User - Applications</title>
      </Head>

      <Container maxWidth="lg">

        <Table title="User" columnList={columns} data={data} loading={loading} create={CREATE_DOCTOR_ROUTE}></Table>

      </Container>

    </>
  )
}


export default User
