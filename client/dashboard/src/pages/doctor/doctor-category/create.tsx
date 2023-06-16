import { Grid, CardContent, Divider } from '@mui/material'
import React, { useRef, useState } from 'react'
import { Modal, Button, Text, Radio, Input } from "@nextui-org/react"
import { useRouter } from 'next/router'
import { DOCTORCATEGORY_ROUTE } from 'src/configs/appRoutes'
import axios from 'axios'



function CreateDoctorCategory() {

  const [visible, setVisible] = React.useState(false)
  const handler = () => setVisible(true)


  const router = useRouter()
  const { visible: queryVisible } = router.query
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<Number | null>(null)

  const [doctorCategoryData, setDoctorCategoryData] = useState<any>({
    categoryTitle: '',
    status: '',
    lastCreatedBy: 1
  })



  const closeHandler = () => {
    router.push(
      {
        pathname: '/doctor/doctor-category',
      })
    setVisible(false)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setDoctorCategoryData({ ...doctorCategoryData, [name]: value })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    // event.preventDefault()

    const doctorCategory = JSON.stringify(doctorCategoryData)
    const customConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    console.log(doctorCategory)

    const result = await axios.post(DOCTORCATEGORY_ROUTE, doctorCategory, customConfig)
      .then((res) => setData(res.status))
      .catch((error) => setError(error.response))

    console.log(result)
  }

  const fileInputRef = useRef(null)

  const handleStatus = (value: string) => {
    setDoctorCategoryData({ ...doctorCategoryData, status: value })
  }


  return (
    <div>
      {error || data !== 200 && <ErrorAlert message={error} />}
      {data === 200 && <SuccessAlert message={"Doctor category data created successfully"} />}
      <Modal
        closeButton
        blur
        width='30%'
        aria-labelledby="modal-title"
        open={queryVisible || visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Create
            <Text b size={18} style={{ marginLeft: "5px" }}>
              New Doctor Category
            </Text>
          </Text>
        </Modal.Header>
        <Modal.Body>
          <form >
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12}>


                </Grid>
                <Grid item xs={12}>
                  <Input
                    bordered
                    labelPlaceholder="Title" width='100%'
                    value={doctorCategoryData.categoryTitle}
                    color="primary"
                    onChange={handleChange}
                    name="categoryTitle" />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Radio.Group label="Status" defaultValue={doctorCategoryData.status} onChange={(value) => handleStatus(value)} name="status" orientation="horizontal">
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

export default CreateDoctorCategory
