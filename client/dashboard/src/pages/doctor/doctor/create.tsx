import { Button as Button1, Grid, FormControl, InputLabel, TextField, CardActions, CardContent, Divider, ButtonProps, Typography, styled, IconButton, SelectChangeEvent } from '@mui/material'
import Box from '@mui/material/Box'
import React, { ChangeEvent, ElementType, useRef, useState } from 'react'
import { Modal, Button, Text, Radio, Textarea, Input, Dropdown } from "@nextui-org/react"
import { useRouter } from 'next/router'
import { Select, MenuItem } from '@mui/material'
import { Label } from 'mdi-material-ui'
import { PhotoCamera } from '@mui/icons-material'
import { DOCTORCATEGORY_ROUTE, DOCTOR_ROUTE } from 'src/configs/appRoutes'
import axios from 'axios'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'
import itLocale from 'i18n-iso-countries/langs/it.json'
import error from 'next/error'
import ErrorAlert from 'src/content/ErrorAlert'
import SuccessAlert from 'src/content/SuccessAlert'



countries.registerLocale(enLocale)
countries.registerLocale(itLocale)

const countryObj = countries.getNames("en", { select: "official" })
const countryArr = Object.entries(countryObj).map(([key, value]) => {
  return {
    label: value,
    value: key
  }
})



function CreateDoctor() {

  const [visible, setVisible] = React.useState(false)
  const handler = () => setVisible(true)
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')

  const [base64, setBase64] = useState<string | null>(null)


  const router = useRouter()
  const { visible: queryVisible } = router.query
  const [error, setError] = useState<Error | null>(null)
  // const [data, setData] = useState<Number | null>(null)

  const [selectedCountry, setSelectedCountry] = useState<string[]>("")


  const selectCountryHandler = (event: SelectChangeEvent<string[]>) => {
    setSelectedCountry(event.target.value as string[])
  }



  const closeHandler = () => {
    router.push(
      {
        pathname: '/doctor/doctor',
        // Example props
      })
    setVisible(false)
  }
  const user = {
    name: 'Catherine Pike',
    avatar: '/static/images/avatars/1.jpg'
  }



  const [selectedImage, setSelectedImage] = useState(null)

  const fileInputRef = useRef(null)
  const [data, setData] = useState([])

  const handleUpload = () => {
    if (selectedImage) {
      // Implement your image upload logic here
      // You can use libraries like axios to make API requests to your server
      console.log('Selected Image:', selectedImage)
    }
  }

  const [doctorData, setDoctorData] = useState<any>({
    description: '',
    doctorCategoryId: null,
    doctorName: '',
    experience: '',
    image: '',
    lastUpdatedBy: 1,
    phone: '',
    status: '',
    workingDay: '',
    workingHours: null,
    country: "",
    state: "",
    zipCode: "",
    city: "",
    street: "",
  })

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

  const handleChange = (event) => {
    const { name, value } = event.target
    setDoctorData({ ...doctorData, [name]: value })
  }
  const userData = JSON.parse(localStorage.getItem('userData'))

  const headers = {
    Authorization: `Bearer ${userData.accessToken}` // Include the token in the Authorization header
  }

  const GetDoctorCategoryList = async () => {
    await axios.get(DOCTORCATEGORY_ROUTE + "/active", { headers }).then((res) => {
      // setLoading(true);
      setData(res.data)




    })
      .catch((res) => {

        console.log(res.response)
      })



  }
  GetDoctorCategoryList()

  const handleSubmit = async (event: React.FormEvent) => {
    // event.preventDefault()
    const props = {}

    doctorData.image = base64
    const userData = JSON.parse(localStorage.getItem('userData'))

    const headers = {
      Authorization: `Bearer ${userData.accessToken}` // Include the token in the Authorization header
    }

    const result = await axios.post(DOCTOR_ROUTE, doctorData, { headers })
      .then((res) => {
        setData(res.status)
        props.success = true

      })
      .catch((error) => setError(error.response))
    router.push(
      {
        pathname: '/doctor/doctor',
        query: props
      })
    console.log(result)
  }

  const handleStatus = (value: string) => {
    setDoctorData({ ...doctorData, status: value })
  }

  const [selected, setSelected] = React.useState(new Set(["Doctor category"]))

  const [selectedValue, setSelectedValue] = useState("Doctor category")
  const [selectedCountryValue, setSelectedCountryValue] = useState("Country")



  const handleSelectionChange = (keys) => {
    setSelected(keys.currentKey)
    const selectedKey: number = parseInt(keys.currentKey) // Assuming single selection mode
    const selectedItem = data.find((item) => item.id === selectedKey)


    if (selectedItem) {
      setDoctorData({ ...doctorData, doctorCategoryId: selectedItem.id })
      setSelectedValue(selectedItem.categoryTitle)
    }
  }

  const handleCountryChange = (keys) => {
    setSelectedCountryValue(keys.currentKey)
    const selectedItem = countryArr.find((item) => item.label === selectedCountryValue)
    setDoctorData({ ...doctorData, country: selectedItem.label })
    setSelectedCountryValue(selectedItem.label)
  }

  return (
    <div>
      {error || data !== 200 && <ErrorAlert message={error} />}
      <Modal
        closeButton
        blur
        width='60%'
        aria-labelledby="modal-title"
        open={queryVisible || visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text id="modal-title" size={24}>
            Create
            <Text b size={24} style={{ marginLeft: "5px" }}>
              New Doctor
            </Text>
          </Text>
        </Modal.Header>
        <Modal.Body>
          <form >
            <CardContent>
              <Grid container spacing={10}>
                <Grid item xs={12}>


                </Grid>
                <Grid item xs={12} sm={6} paddingBottom={-20}>
                  <Input
                    bordered
                    labelPlaceholder="Doctor Name" width='100%'
                    value={doctorData.doctorName}
                    color="primary"
                    onChange={handleChange}
                    name="doctorName" />
                </Grid>
                <Grid paddingLeft={24} >

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
                <Grid item xs={12} sm={6}>
                  <Input
                    bordered
                    labelPlaceholder="Experience" width='100%'
                    value={doctorData.experience}
                    color="primary"
                    onChange={handleChange}
                    name="experience" />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Input
                    bordered
                    labelPlaceholder="Phone No" width='100%'
                    value={doctorData.phone}
                    color="primary"
                    onChange={handleChange}
                    name="phone" />
                </Grid>
                <Grid item xs={12} sm={6} >
                  <Input
                    bordered
                    labelPlaceholder="Working Days" width='100%'
                    value={doctorData.workingDay}
                    color="primary"
                    onChange={handleChange}
                    name="workingDay" />
                </Grid>

                <Grid item xs={12} sm={6} >
                  <Input
                    bordered
                    labelPlaceholder="Working hour" width='100%'
                    value={doctorData.workingHours}
                    color="primary"
                    onChange={handleChange}
                    name="workingHours" />
                </Grid>
                <Grid item xs={12} sm={6}  >
                  <Radio.Group label="Status" defaultValue={doctorData.status} onChange={(value) => handleStatus(value)} name="status" orientation="horizontal">
                    <Radio value="1" size="sm" isSquared>
                      Active
                    </Radio>
                    <Radio value="0" size="sm" isSquared>
                      Inactive
                    </Radio>

                  </Radio.Group>
                </Grid>
                <Grid item xs={12} paddingTop={20} sm={6} >
                  <Textarea
                    bordered
                    value={doctorData.description}
                    color="primary"
                    onChange={handleChange}
                    name="description" width='100%'
                    labelPlaceholder="Description"
                  />           </Grid>
                <Grid item xs={12} sm={6} >
                  <Dropdown>
                    <Dropdown.Button flat color="secondary" name={doctorData.doctorCategoryId} css={{ tt: "capitalize", width: "100%" }}>
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
                        <Dropdown.Item key={item.id} textValue={item.id}>{item.categoryTitle}</Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Dropdown>
                    <Dropdown.Button flat color="secondary" defaultValue={doctorData.country} name={doctorData.country} css={{ tt: "capitalize", width: "100%" }}>
                      {selectedCountryValue}
                    </Dropdown.Button>
                    <Dropdown.Menu
                      aria-label="Single selection actions"
                      color="secondary"
                      disallowEmptySelection
                      selectionMode="single"
                      onSelectionChange={handleCountryChange}
                    >
                      {!!countryArr?.length && countryArr.map(({ label, value }) => (
                        <Dropdown.Item key={label} textValue={value}>{label}</Dropdown.Item>
                      )
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </Grid>
                <Grid item xs={12} sm={6} >
                  <Input
                    bordered
                    labelPlaceholder="State" width='100%'
                    value={doctorData.state}
                    color="primary"
                    onChange={handleChange}
                    name="state" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Input
                    bordered
                    labelPlaceholder="City" width='100%'
                    value={doctorData.city}
                    color="primary"
                    onChange={handleChange}
                    name="city" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Input
                    bordered
                    labelPlaceholder="Zipcode" width='100%'
                    value={doctorData.zipCode}
                    color="primary"
                    onChange={handleChange}
                    name="zipCode" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Input
                    bordered
                    labelPlaceholder="Street" width='100%'
                    value={doctorData.street}
                    color="primary"
                    onChange={handleChange}
                    name="street" />
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

export default CreateDoctor
