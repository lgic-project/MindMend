import Head from 'next/head'
import { Container } from '@mui/material'

import Table from '../../views/dashboard/Table'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { MOODCATEGORY_ROUTE, PROFILE_ROUTE, ROLE_PERMISSION_ROUTE } from 'src/configs/appRoutes'
import NextUILoadingComponent from 'src/layouts/components/loading'
import { CREATE_MOOD_CATEGORY_ROUTE, CREATE_ROLE_PERMISSION_ROUTE } from 'src/configs/createRoutes'
import ErrorAlert from 'src/content/ErrorAlert'
import InfoAlert from 'src/content/InfoAlert'
import { useRouter } from 'next/router'
import SuccessAlert from 'src/content/SuccessAlert'

function RolePermission() {

  const [data, setData] = useState([])
  const columns = ["id", "roleName", "api", "lastCreatedDate", "lastUpdatedBy"]
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()


  useEffect(() => {


    const GetRolePermissionList = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'))

        const headers = {
          Authorization: `Bearer ${userData.accessToken}` // Include the token in the Authorization header
        }
        const res = await axios.get(ROLE_PERMISSION_ROUTE, { headers })

        // setLoading(true);
        setData(res.data)
        setLoading(false)

      } catch (error) {
        setLoading(false)
        setError(error)
      }



    }
    GetRolePermissionList()



  }, [])


  return (
    <>
      {error && <ErrorAlert message={error.message} />}
      {router.query.success === "true" ? (
        <SuccessAlert message={"Role permission data created successfully"} />
      ) : (
        data !== null && <InfoAlert message={"Role permission list displayed successfully"} />
      )}      <Head>
        <title>Role Permission - Applications</title>
      </Head>

      <Container maxWidth="lg">

        <Table title="Role Permission" columnList={columns} data={data} loading={loading} create={CREATE_ROLE_PERMISSION_ROUTE}></Table>

      </Container>

    </>
  )
}


export default RolePermission
