import Head from 'next/head'
import { Container } from '@mui/material'

import axios from 'axios'
import { useState, useEffect } from 'react'
import Table from '../../../views/dashboard/Table'

import { SITECONFIG_ROUTE } from 'src/configs/appRoutes'
import { CREATE_SITE_CONFIG_ROUTE } from 'src/configs/createRoutes'
import ErrorAlert from 'src/content/ErrorAlert'
import InfoAlert from 'src/content/InfoAlert'
import SuccessAlert from 'src/content/SuccessAlert'
import { useRouter } from 'next/router'

function SiteConfig() {

  const [data, setData] = useState([])
  const [columns, setColumns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()


  useEffect(() => {

    const GetSiteConfigList = async () => {
      const userData = JSON.parse(localStorage.getItem('userData'))

      const headers = {
        Authorization: `Bearer ${userData.accessToken}` // Include the token in the Authorization header
      }
      await axios.get(SITECONFIG_ROUTE, { headers }).then((res) => {
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
      {router.query.success === "true" ? (
        <SuccessAlert message={"Site config data created successfully"} />
      ) : (
        data !== null && <InfoAlert message={"site config list displayed successfully"} />
      )}

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
