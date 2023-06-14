import { Grid, CardContent, Divider } from '@mui/material'
import React, { useRef, useState } from 'react'
import { Modal, Button, Text, Radio, Input } from "@nextui-org/react"
import { useRouter } from 'next/router'
import { EXERCISE_LEVEL_ROUTE } from 'src/configs/appRoutes'
import axios from 'axios'



function CreateExerciseLevel() {

  const [visible, setVisible] = React.useState(false)
  const handler = () => setVisible(true)


  const router = useRouter()
  const { visible: queryVisible } = router.query

  const [exerciseLevel, setExerciseLevel] = useState<any>({
    title: '',
    status: '',
    lastCreatedBy: 1,
    lastUpdatedBy: 1
  })



  const closeHandler = () => {
    router.push(
      {
        pathname: '/additional/exercise-level',
      })
    setVisible(false)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setExerciseLevel({ ...exerciseLevel, [name]: value })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    // event.preventDefault()

    const difficultyLevel = JSON.stringify(exerciseLevel)
    const customConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const result = await axios.post(EXERCISE_LEVEL_ROUTE, difficultyLevel, customConfig)
      .then((res) => console.log(res))
      .catch((error) => console.log(error))

    console.log(result)
  }

  const handleStatus = (value: string) => {
    setExerciseLevel({ ...exerciseLevel, status: value })
  }

  const fileInputRef = useRef(null)



  return (
    <div>

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
              New Exercise level
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
                    value={exerciseLevel.title}
                    labelPlaceholder="Title" width='100%'
                    onChange={handleChange}
                    name="title"
                    color="primary" />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Radio.Group label="Status" defaultValue={exerciseLevel.status} onChange={(value) => handleStatus(value)} name="status" orientation="horizontal">
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

export default CreateExerciseLevel
