import { Grid, CardContent, Divider } from '@mui/material'
import React, { useRef, useState } from 'react'
import { Modal, Button, Text, Radio, Input } from "@nextui-org/react"
import { useRouter } from 'next/router'
import { SITECONFIG_ROUTE } from 'src/configs/appRoutes'
import axios from 'axios'
import exerciseLevel from '../exercise-level'
import error from 'next/error'
import ErrorAlert from 'src/content/ErrorAlert'
import SuccessAlert from 'src/content/SuccessAlert'


function CreateSiteConfig() {

  const [visible, setVisible] = React.useState(false)
  const handler = () => setVisible(true)

  const router = useRouter()
  const { visible: queryVisible } = router.query
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<Number | null>(null)

  const [siteConfig, setSiteConfig] = useState<any>({
    name: '',
    status: '',
    userId: 1,
    siteKey: '',
    siteValue: '',
  })



  const closeHandler = () => {
    router.push(
      {
        pathname: '/additional/site-config',
      })
    setVisible(false)
  }



  const handleChange = (event) => {
    const { name, value } = event.target
    setSiteConfig({ ...siteConfig, [name]: value })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    // event.preventDefault()
    const props = {}

    const userData = JSON.parse(localStorage.getItem('userData'))

    const headers = {
      Authorization: `Bearer ${userData.accessToken}` // Include the token in the Authorization header
    }


    const result = await axios.post(SITECONFIG_ROUTE, siteConfig, { headers })
      .then((res) => {
        setData(res.status)
        props.success = true
      })
      .catch((error) => setError(error.response))

    router.push(
      {
        pathname: '/additional/site-config',
        query: props
      })
  }

  const handleStatus = (value: string) => {
    setSiteConfig({ ...siteConfig, status: value })
  }




  return (
    <div>
      {error || data !== 200 && <ErrorAlert message={error} />}
      <Modal
        closeButton
        blur
        width='50%'
        aria-labelledby="modal-title"
        open={queryVisible || visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text id="modal-title" size={24}>
            Create
            <Text b size={24} style={{ marginLeft: "5px" }}>
              New Site config
            </Text>
          </Text>
        </Modal.Header>
        <Modal.Body>
          <form >
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12}>


                </Grid>
                <Grid item xs={12} sm={6}>
                  <Input
                    bordered
                    labelPlaceholder="Name" width='100%'
                    color="primary"
                    onChange={handleChange}
                    name="name"
                    value={siteConfig.name} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Input
                    bordered
                    labelPlaceholder="Site key" width='100%'
                    color="primary"
                    onChange={handleChange}
                    name="siteKey"
                    value={siteConfig.siteKey} />
                </Grid>
                <Grid item xs={12} sm={6} marginTop={5}>
                  <Input
                    bordered
                    labelPlaceholder="Site value" width='100%'
                    color="primary"
                    onChange={handleChange}
                    name="siteValue"
                    value={siteConfig.siteValue} />
                </Grid>


                <Grid item xs={12} sm={6} marginTop={1} paddingLeft={7}>
                  <Radio.Group label="Status" defaultValue={siteConfig.status} onChange={(value) => handleStatus(value)} name="status" orientation="horizontal">
                    <Radio value="1" size="sm" isSquared>
                      Active
                    </Radio>
                    <Radio value="0" size="sm" isSquared>
                      Inactive
                    </Radio>

                  </Radio.Group>
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

export default CreateSiteConfig
