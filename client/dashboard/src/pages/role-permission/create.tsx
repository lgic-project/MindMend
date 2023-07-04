import { Grid, CardContent, Divider } from '@mui/material'
import React, { useState } from 'react'
import { Modal, Button, Text, Dropdown, Input } from "@nextui-org/react"
import { useRouter } from 'next/router'
import axios from 'axios'
import ErrorAlert from 'src/content/ErrorAlert'
import SuccessAlert from 'src/content/SuccessAlert'
import { API_ROUTE, ROLE_PERMISSION_ROUTE, ROLE_ROUTE } from 'src/configs/appRoutes'


function CreateMoodCategory() {

  const [visible, setVisible] = React.useState(false)
  const [selectedValue, setSelectedValue] = useState('Role')
  const [selectedApiValue, setSelectedApiValue] = useState('Api')
  const [selectedApiMethod, setSelectedApiMethod] = useState('')



  const router = useRouter()
  const { visible: queryVisible } = router.query

  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState([])
  const [apiData, setApiData] = useState([])

  const userData = JSON.parse(localStorage.getItem('userData'))

  const headers = {
    Authorization: `Bearer ${userData.accessToken}` // Include the token in the Authorization header
  }



  const closeHandler = () => {
    router.push(
      {
        pathname: '/role-permission',
      })
    setVisible(false)
  }

  const [rolePermissionData, setRolePermissionData] = useState<any>({
    roleId: '',
    roleName: '',
    apiId: '',
    createdBy: '',
  })

  const handleSubmit = async (event: React.FormEvent) => {
    // event.preventDefault()
    const props = {}
    try {

      const res = await axios.post(ROLE_PERMISSION_ROUTE, rolePermissionData, { headers }).then(() => props.success = true)
      console.log(res)
      router.push(
        {
          pathname: '/role-permission',
        })
      setVisible(false)
    } catch (error) {
      setError(error)
    }
  }

  const GetRoleList = async () => {
    await axios.get(ROLE_ROUTE, { headers }).then((res) => {
      // setLoading(true);
      setData(res.data)

    })
      .catch((res) => {

        console.log(res.response)
      })



  }
  GetRoleList()

  const GetApiList = async () => {
    await axios.get(API_ROUTE, { headers }).then((res) => {
      // setLoading(true);
      setApiData(res.data)




    })
      .catch((res) => {

        console.log(res.response)
      })



  }
  GetApiList()

  const [selected, setSelected] = React.useState(new Set(["Role"]))
  const [apiSelected, setApiSelected] = React.useState(new Set(["Api"]))


  const handleSelectionChange = (keys) => {
    setSelected(keys.currentKey)
    const selectedKey: number = parseInt(keys.currentKey) // Assuming single selection mode
    const selectedItem = data.find((item) => item.id === selectedKey)


    if (selectedItem) {
      setRolePermissionData({ ...rolePermissionData, roleId: selectedItem.id })
      setRolePermissionData({ ...rolePermissionData, roleName: selectedItem.roleName })

      setSelectedValue(selectedItem.roleName)
    }
  }

  const handleApiSelectionChange = (keys) => {
    setSelected(keys.currentKey)
    const selectedKey: number = parseInt(keys.currentKey) // Assuming single selection mode
    const selectedItem = apiData.find((item) => item.id === selectedKey)


    if (selectedItem) {
      setRolePermissionData({ ...rolePermissionData, apiId: selectedItem.id })
      setSelectedApiValue(selectedItem.apiPath)
      setSelectedApiMethod(selectedItem.method)
    }
  }

  return (
    <div>
      {error || data !== 200 && <ErrorAlert message={error} />}
      <Modal
        closeButton
        blur
        width='40%'
        aria-labelledby="modal-title"
        open={queryVisible || visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text id="modal-title" size={24}>
            Assign
            <Text b size={24} style={{ marginLeft: "5px" }}>
              New Role Permission
            </Text>
          </Text>
        </Modal.Header>
        <Modal.Body>
          <form >
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12}>


                </Grid>
                <Grid item xs={12} sm={5} >
                  <Dropdown>
                    <Dropdown.Button flat color="secondary" name={rolePermissionData.roleId} css={{ tt: "capitalize", width: "100%" }}>
                      {selectedValue}
                    </Dropdown.Button>
                    <Dropdown.Menu
                      aria-label="Single selection actions"
                      color="secondary"
                      disallowEmptySelection
                      selectionMode="single"

                      onSelectionChange={handleSelectionChange}
                    >
                      {data.map((item) => (
                        <Dropdown.Item key={item.id} textValue={item.id}>{item.roleName}</Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Grid>
                <Grid item xs={12} sm={7} >
                  <Dropdown >
                    <Dropdown.Button flat color="secondary" name={rolePermissionData.apiId} css={{ tt: "capitalize", width: "100%" }}>
                      {selectedApiValue}
                    </Dropdown.Button>
                    <Dropdown.Menu
                      aria-label="Single selection actions"
                      color="secondary"
                      disallowEmptySelection
                      selectionMode="single"
                      css={{ $$dropdownMenuWidth: "380px" }}
                      onSelectionChange={handleApiSelectionChange}
                    >
                      {apiData.map((item) => (
                        <Dropdown.Item key={item.id} textValue={item.id}>{item.apiPath} - {item.method}</Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Grid>
                <Grid item xs={12} marginTop={5}>
                  <Input
                    bordered
                    labelPlaceholder="Api Method" width='100%'
                    style={{ color: 'black' }}
                    value={selectedApiMethod}
                    color="primary"
                    disabled
                    name="method" />
                </Grid>


              </Grid>
            </CardContent>
            <Divider sx={{ margin: 0 }} />


          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onPress={closeHandler}>
            Cancel
          </Button>
          <Button auto onPress={handleSubmit}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  )
}

export default CreateMoodCategory
