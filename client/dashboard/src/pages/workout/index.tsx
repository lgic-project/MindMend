import { Box, InputAdornment, Tab, TextField } from "@mui/material"
import { Magnify } from "mdi-material-ui"
import ApexChartWrapper from "src/@core/styles/libs/react-apexcharts"
import { Card, Grid, Text, Link, Avatar, Button, Row, Col } from "@nextui-org/react"
import BookmarkIcon from '@mui/icons-material/Bookmark'
import StarIcon from '@mui/icons-material/Star'
import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import axios from "axios"
import { DOCTOR_ROUTE, WORKOUT_ROUTE } from "src/configs/appRoutes"
import NextUILoadingComponent from "src/layouts/components/loading"

const VISIBLE_FIELDS: string[] = ['title', 'workoutCategoryTitle', 'timer']


const WorkoutList = () => {
  const [filterText, setFilterText] = React.useState('')
  const router = useRouter()

  const handleGridClick = () => {

    router.push('/workout/workout-detail')
  }
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState([])


  useEffect(() => {


    const GetWorkoutList = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'))

        const headers = {
          Authorization: `Bearer ${userData.accessToken}` // Include the token in the Authorization header
        }
        const res = await axios.get(WORKOUT_ROUTE + "/active", { headers })
        // setLoading(true);
        setData(res.data)
        console.log(res.data)
        setLoading(false)


      } catch (error) {
        setLoading(false)
        setError(error)
      }



    }
    GetWorkoutList()



  }, [])

  const renderCell = (value) => {
    const base64String = value // Base64 encoded string
    const regularString = convertBase64ToString(base64String)

    if (value == null || value == "") {
      return (

        <Card.Image
          src="/images/download.jpeg"
          width="100%"
          height="100%"
          objectFit="cover"
          alt="Workout"
        />

      )
    }
    else {
      return (

        <Card.Image
          src={regularString}
          width="100%"
          height="100%"
          objectFit="cover"
          alt="exercise"
        />

      )
    }
  }

  const filteredData = React.useMemo(() => {
    if (!filterText) {
      return data
    }

    return data.filter((row: RowData) =>
      VISIBLE_FIELDS.some((field) =>
        String(row[field]).toLowerCase().includes(filterText.toLowerCase())
      )
    )
  }, [filterText])

  return (
    <ApexChartWrapper>
      <Grid.Container spacing={12} marginTop={4}>

        <Grid item xs={12} md={12} >
          <Box paddingX={10} sx={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between'
          }} >
            <Tab label='Workout' value="doctor" sx={{ fontSize: 18, color: 'black', fontWeight: 'bold' }} />

            <TextField
              label="Search Workout"
              variant="outlined"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Magnify fontSize='small' />
                  </InputAdornment>
                )
              }}
            />
          </Box>
        </Grid>
        {
          loading ? (
            <NextUILoadingComponent />
          ) : (
            <Grid item xs={12} md={12} style={{ marginTop: 26 }} >
              <Grid.Container spacing={3} gap={1}>

                {data.map((item: DataType, index: number) => {

                  return (
                    <Grid item key={item.id} xs={6} md={3} onClick={() => {
                      const userDataJSON = JSON.stringify(item.id)
                      localStorage.setItem('exerciseId', userDataJSON)
                      router.push(`/workout/workout-detail`)
                    }}>
                      <Card css={{ w: "100%", h: "350px" }} >
                        <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
                          <Col>
                            <Text size={12} weight="bold" transform="uppercase" color="#ffffffAA">
                              New
                            </Text>
                            <Text h3 color="black">
                              {item.title}
                            </Text>
                          </Col>
                        </Card.Header>
                        <Card.Body css={{ p: 0 }}>
                          <React.Fragment key={index}>
                            {renderCell(item.encodedImage)}
                          </React.Fragment>
                        </Card.Body>
                        <Card.Footer
                          isBlurred
                          css={{
                            position: "absolute",
                            bgBlur: "#ffffff66",
                            borderTop: "$borderWeights$light solid rgba(255, 255, 255, 0.2)",
                            bottom: 0,
                            zIndex: 1,
                          }}
                        >
                          <Row>
                            <Col>
                              <Text color="#000" size={15} style={{ marginTop: -2 }} weight='bold'>
                                {item.workoutCategoryTitle}
                              </Text>
                              <Text color="#000" size={12}>
                                {item.timer}
                              </Text>
                            </Col>
                            <Col>
                              <Row justify="flex-end">
                                <Button flat auto rounded color="secondary">
                                  <Text
                                    css={{ color: "inherit" }}
                                    size={12}
                                    weight="bold"
                                    transform="uppercase"
                                  >
                                    {item.cals} cals
                                  </Text>
                                </Button>
                              </Row>
                            </Col>
                          </Row>
                        </Card.Footer>
                      </Card>
                    </Grid>
                  )
                })
                }

              </Grid.Container>
            </Grid>
          )}

      </Grid.Container >

    </ApexChartWrapper >
  )
}

export default WorkoutList

function convertBase64ToString(base64) {
  return atob(base64)
}
