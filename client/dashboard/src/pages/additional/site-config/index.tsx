import Head from 'next/head'
import { Container } from '@mui/material'

import axios from 'axios'
import { useState, useEffect } from 'react'
import Table from '../../../views/dashboard/Table'

import { SITECONFIG_ROUTE } from 'src/configs/appRoutes'
import { CREATE_SITE_CONFIG_ROUTE } from 'src/configs/createRoutes'
import ErrorAlert from 'src/content/ErrorAlert'
import InfoAlert from 'src/content/InfoAlert'

function SiteConfig() {

  const [data, setData] = useState([])
  const [columns, setColumns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)


  useEffect(() => {

    const GetSiteConfigList = async () => {
      await axios.get(SITECONFIG_ROUTE).then((res) => {
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
    GetSiteConfigList()



  }, [])

  return (
    <>
      {error && <ErrorAlert message={error} />}
      {data !== null && <InfoAlert message={"Site config displayed successfully"} />}
      <Head>
        <title>SiteConfig - Applications</title>
      </Head>

      <Container maxWidth="lg">

        <Table title="SiteConfig" columnList={columns} data={data} loading={loading} create={CREATE_SITE_CONFIG_ROUTE}></Table>

      </Container>

    </>
  )
}


export default SiteConfig
