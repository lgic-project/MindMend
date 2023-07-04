import { Button as Button1, Grid, FormControl, InputLabel, TextField, CardActions, CardContent, Divider, ButtonProps, Typography, styled, IconButton } from '@mui/material'
import Box from '@mui/material/Box'
import React, { ChangeEvent, ElementType, useRef, useState } from 'react'
import { Modal, Button, Text, Radio, Textarea, Input } from "@nextui-org/react"
import { useRouter } from 'next/router'
import { Select, MenuItem } from '@mui/material'
import { Label } from 'mdi-material-ui'
import { PhotoCamera } from '@mui/icons-material'
import axios from 'axios'
import { MOODCATEGORY_ROUTE } from 'src/configs/appRoutes'
import error from 'next/error'
import ErrorAlert from 'src/content/ErrorAlert'

function CreateMoodCategory() {

  const [visible, setVisible] = React.useState(false)
  const handler = () => setVisible(true)
  const [selectedValue, setSelectedValue] = useState('option1')
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')

  const [base64, setBase64] = useState<string | null>(null)


  const router = useRouter()
  const { visible: queryVisible } = router.query

  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<Number | null>(null)


  const closeHandler = () => {
    router.push(
      {
        pathname: '/mood/mood-category',

        // Example props
      })
    setVisible(false)
  }
  const user = {
    name: 'Catherine Pike',
    avatar: '/static/images/avatars/1.jpg'
  }

  const [moodCategoryData, setMoodCategoryData] = useState<any>({
    name: '',
    status: '',
    logo: ''
  })


  const handleChange = (event) => {
    const { name, value } = event.target
    setMoodCategoryData({ ...moodCategoryData, [name]: value })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    // event.preventDefault()
    const props = {}

    moodCategoryData.logo = base64

    const userData = JSON.parse(localStorage.getItem('userData'))

    const headers = {
      Authorization: `Bearer ${userData.accessToken}` // Include the token in the Authorization header
    }

    const result = await axios.post(MOODCATEGORY_ROUTE, moodCategoryData, { headers })
      .then((res) => {
        setData(res.status)
        props.success = true
      })
      .catch((error) => setError(error.response))

    router.push(
      {
        pathname: '/mood/mood-category',
        query: props
      })
    setVisible(false)
  }

  const handleStatus = (value: string) => {
    setMoodCategoryData({ ...moodCategoryData, status: value })
  }



  const [selectedImage, setSelectedImage] = useState(null)

  const fileInputRef = useRef(null)


  const handleUpload = () => {
    if (selectedImage) {
      // Implement your image upload logic here
      // You can use libraries like axios to make API requests to your server
      console.log('Selected Image:', selectedImage)
    }
  }

  const handleImageChange = async (file: ChangeEvent) => {
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      const base64 = await toBase64(files[0] as File)

      setBase64(base64 as string)
    }
  }

  const toBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()

      fileReader.readAsDataURL(file)

      fileReader.onload = () => {
        setImgSrc(fileReader.result as string)
        resolve(fileReader.result)
      }

      fileReader.onerror = (error) => {
        reject(error)
      }
    })
  }

  const handleImageClick = () => {
    fileInputRef.current.click()
  }


  return (
    <div>
      {error || data !== 200 && <ErrorAlert message={error} />}
      <Modal
        closeButton
        blur
        width='30%'
        aria-labelledby="modal-title"
        open={queryVisible || visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text id="modal-title" size={24}>
            Create
            <Text b size={24} style={{ marginLeft: "5px" }}>
              New Mood Category
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
                    labelPlaceholder="Name" width='100%'
                    value={moodCategoryData.name}
                    color="primary"
                    onChange={handleChange}
                    name="name" />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Radio.Group label="Status" defaultValue={moodCategoryData.status} onChange={(value) => handleStatus(value)} name="status" orientation="horizontal">
                    <Radio value="1" size="sm" isSquared>
                      Active
                    </Radio>
                    <Radio value="0" size="sm" isSquared>
                      Inactive
                    </Radio>

                  </Radio.Group>
                </Grid>
                <Grid marginTop={5} marginX={10}>

                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img width={100} src={imgSrc} alt="Angular" onClick={handleImageClick} style={{ borderRadius: '5%' }} />
                    <IconButton
                      onClick={handleImageClick}
                      style={{ position: 'absolute', right: 0, bottom: 0 }}
                    >
                      <PhotoCamera />
                    </IconButton>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
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
