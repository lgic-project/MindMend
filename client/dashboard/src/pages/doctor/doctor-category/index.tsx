import Head from 'next/head'
import { Container } from '@mui/material'

import Table from '../../../views/dashboard/Table'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { DOCTORCATEGORY_ROUTE, DOCTOR_ROUTE } from 'src/configs/appRoutes'
import { CREATE_DOCTOR_CATEGORY_ROUTE } from 'src/configs/createRoutes'
import ErrorAlert from 'src/content/ErrorAlert'
import InfoAlert from 'src/content/InfoAlert'

function DoctorCategory() {
  // const column = ['Name','Description','Phone','Working hour','working day','Experience','last_Created At','last_creaed By','Image', 'last_Updated At'];

  const [data, setData] = useState([])
  const [columns, setColumns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)


  useEffect(() => {

    const GetDoctorCategoryList = async () => {
      await axios.get(DOCTORCATEGORY_ROUTE).then((res) => {
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
    GetDoctorCategoryList()



  }, [])

  return (
    <>
      {error && <ErrorAlert message={error} />}
      {data !== null && <InfoAlert message={"Doctor list displayed successfully"} />}
      <Head>
        <title>Doctor Category - Applications</title>
      </Head>

      <Container maxWidth="lg">

        <Table title="Doctor Category" columnList={columns} data={data} loading={loading} create={CREATE_DOCTOR_CATEGORY_ROUTE}></Table>

      </Container>

    </>
  )
}


export default DoctorCategory
