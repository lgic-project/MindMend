import Head from 'next/head'
import { Container } from '@mui/material'

import Table from '../../../views/dashboard/Table'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { DISCOVER_ROUTE, DOCTOR_ROUTE } from 'src/configs/appRoutes'
import { CREATE_DISCOVER_ROUTE } from 'src/configs/createRoutes'
import ErrorAlert from 'src/content/ErrorAlert'
import InfoAlert from 'src/content/InfoAlert'
import SuccessAlert from 'src/content/SuccessAlert'

function Discover() {

  const [data, setData] = useState([])
  const [columns, setColumns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)



  useEffect(() => {

    const GetDiscoverList = async () => {
      await axios.get(DISCOVER_ROUTE).then((res) => {
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
      {data !== null && <InfoAlert message={"Discover data displayed"} />}
      <Head>
        <title>Discover - Applications</title>
      </Head>

      <Container maxWidth="lg">

        <Table title="Discover" columnList={columns} data={data} loading={loading} create={CREATE_DISCOVER_ROUTE}></Table>

      </Container>

    </>
  )
}


export default Discover
