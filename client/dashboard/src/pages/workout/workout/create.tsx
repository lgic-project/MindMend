import { Grid, Divider, IconButton } from '@mui/material'
import React, { ChangeEvent, useRef, useState } from 'react'
import { Modal, Button, Text, Radio, Textarea, Input, Dropdown } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { PhotoCamera } from '@mui/icons-material'
import axios from 'axios'
import { WORKOUT_ROUTE } from 'src/configs/appRoutes'
import ErrorAlert from 'src/content/ErrorAlert'
import InfoAlert from 'src/content/InfoAlert'
import SuccessAlert from 'src/content/SuccessAlert'

function CreateDiscover() {
  const [visible, setVisible] = React.useState(false)
  const handler = () => setVisible(true)
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')
  const [base64, setBase64] = useState<string | null>(null)
  const router = useRouter()
  const { visible: queryVisible } = router.query
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<Number | null>(null)
  const [selectedValue, setSelectedValue] = useState("Workout Category")
  const [workoutData, setWorkoutData] = useState([])



  const [discoverData, setDiscoverData] = useState<any>({
    exerciseTitle: '',
    difficultyLevelId: '',
    description: '',
    photo: '',
    lastCreatedBy: '',
    status: "",
    timeDuration: '',
    exerciseCatId: null

  })

  const closeHandler = () => {
    router.push({
      pathname: '/workout/workout',
    })
    setVisible(false)
  }
  const GetDoctorCategoryList = async () => {

    const userData = JSON.parse(localStorage.getItem('userData'))

    const headers = {
      Authorization: `Bearer ${userData.accessToken}` // Include the token in the Authorization header
    }
    await axios.get(WORKOUT_ROUTE + "/category", { headers }).then((res) => {
      // setLoading(true);
      setWorkoutData(res.data)




    })
      .catch((res) => {

        console.log(res.response)
      })



  }
  GetDoctorCategoryList()

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

  const handleChange = (event) => {
    const { name, value } = event.target
    setDiscoverData({ ...discoverData, [name]: value })
  }

  const handleImageClick = () => {
    fileInputRef.current.click()
  }

  const handleSubmit = async (event: React.FormEvent) => {

    const userData = JSON.parse(localStorage.getItem('userData'))

    const headers = {
      Authorization: `Bearer ${userData.accessToken}` // Include the token in the Authorization header
    }
    const props = {}


    // event.preventDefault()
    discoverData.photo = base64



    const result = await axios.post(WORKOUT_ROUTE, discoverData, { headers })
      .then((res) => {
        console.log(res.data)
        setData(res.status)
        props.success = true

        router.push(
          {
            pathname: '/workout/workout',
            query: props
          })

      })
      .catch((error) => setError(error.response))


  }

  const handleStatus = (value: string) => {
    setDiscoverData({ ...discoverData, status: value })
  }

  const handleSelectionChange = (keys) => {
    setSelectedValue(keys.currentKey)
    const selectedKey: number = parseInt(keys.currentKey) // Assuming single selection mode
    const selectedItem = workoutData.find((item) => item.id === selectedKey)


    if (selectedItem) {
      console.log(selectedItem.title)
      setDiscoverData({ ...discoverData, workoutCatId: selectedItem.id })
      setSelectedValue(selectedItem.title)
    }
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
            <Text b size={24} style={{ marginLeft: '5px' }}>
              New Workout
            </Text>
          </Text>
        </Modal.Header>
        <Modal.Body>
          <form >
            <Grid container spacing={5}>
              <Grid item xs={12}></Grid>
              <Grid item xs={12}>
                <Input
                  bordered
                  labelPlaceholder="Title"
                  width='100%'
                  value={discoverData.exerciseTitle}
                  color="primary"
                  onChange={handleChange}
                  name="exerciseTitle"
                />
              </Grid>
              {/* <Grid item xs={12} sm={6} >
                <Dropdown>
                  <Dropdown.Button flat color="secondary" name={discoverData.workoutCatId} css={{ tt: "capitalize", width: "100%" }}>
                    {selectedValue}
                  </Dropdown.Button>
                  <Dropdown.Menu
                    aria-label="Single selection actions"
                    color="secondary"
                    disallowEmptySelection
                    selectionMode="single"

                    onSelectionChange={handleSelectionChange}
                  >
                    {workoutData.map((item) => (
                      <Dropdown.Item key={item.id} textValue={item.id}>{item.title}</Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Grid> */}
            </Grid>
            <Grid item xs={6} marginTop={4}>
              <Input
                bordered
                labelPlaceholder="Timer"
                width='100%'
                value={discoverData.timeDuration}
                color="primary"
                onChange={handleChange}
                name="timeDuration"
              />
            </Grid>
            <Grid item xs={12} sm={6} >
              <Dropdown>
                <Dropdown.Button flat color="secondary" name={discoverData.workoutCatId} css={{ tt: "capitalize", width: "100%" }}>
                  {selectedValue}
                </Dropdown.Button>
                <Dropdown.Menu
                  aria-label="Single selection actions"
                  color="secondary"
                  disallowEmptySelection
                  selectionMode="single"

                  onSelectionChange={handleSelectionChange}
                >
                  {workoutData.map((item) => (
                    <Dropdown.Item key={item.id} textValue={item.id}>{item.title}</Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Grid>
            <Grid item xs={12} marginTop={5}>
              <Textarea
                bordered
                labelPlaceholder="Description"
                width='100%'
                color="primary"
                value={discoverData.description}
                onChange={handleChange}
                name="description"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Radio.Group label="Status" defaultValue={discoverData.status} onChange={(value) => handleStatus(value)} name="status" orientation="horizontal">
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
          <Divider sx={{ margin: 0 }} />
          {/* <Button.Group style={{ justifyContent: 'flex-end' }}>
              <Button auto flat color="error" onSubmit={handleSubmit}>
                Cancel
              </Button>
              <Button auto type='submit'>
                Create
              </Button>

            </Button.Group> */}

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
    </div >
  )
}

export default CreateDiscover
