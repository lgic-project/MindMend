import { Box, InputAdornment, Tab, TextField } from "@mui/material"
import { Magnify } from "mdi-material-ui"
import ApexChartWrapper from "src/@core/styles/libs/react-apexcharts"
import { Card, Grid, Text, Link, Avatar, Button } from "@nextui-org/react"
import BookmarkIcon from '@mui/icons-material/Bookmark'
import StarIcon from '@mui/icons-material/Star'
import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import NextUILoadingComponent from "src/layouts/components/loading"
import { DOCTOR_ROUTE } from "src/configs/appRoutes"
import axios from "axios"

const VISIBLE_FIELDS: string[] = ['doctorCategoryName', 'doctorName', 'rating']


const DoctorList = () => {
  const [filterText, setFilterText] = React.useState('')
  const router = useRouter()

  const handleGridClick = () => {
    // Perform any necessary logic or data manipulation before navigating
    // For example, you can pass additional data to the next page using query parameters or state

    // Navigate to the desired link
    router.push('/doctor/doctor-detail')
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
        const res = await axios.get(DOCTOR_ROUTE + "/active", { headers })
        // setLoading(true);
        setData(res.data)
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

    if (value == null) {
      return (

        <Card.Image
          src="/images/download(1).jpeg"
          width="100%"
          height="100%"
          objectFit="cover"
          alt="Workout"
        />

      )
    }
    else {
      return (

        <Avatar
          src={regularString}
          color="primary"
          style={{ width: 100, height: 100 }}
          bordered
        />

      )
    }
  }

  const filteredData = React.useMemo(() => {
    if (!filterText) {
      return data
    }

    return data.filter((row) =>
      VISIBLE_FIELDS.some((field) => {
        String(row[field]).toLowerCase().includes(filterText.toLowerCase())
      }
      )
    )
  }, [filterText])

  return (
    <ApexChartWrapper>
      <Grid.Container spacing={12} marginTop={4}>

        <Grid item xs={12} md={12}>
          <Box paddingX={10} sx={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between'
          }} >
            <Tab label='Doctors' value="doctor" sx={{ fontSize: 18, color: 'black', fontWeight: 'bold' }} />

            <TextField
              label="Search Doctor"
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
            <Grid item xs={12} md={12} style={{ marginTop: 26 }} onClick={handleGridClick}>
              <Grid.Container spacing={6} gap={1} marginTop={4}>
                {data.map((item: DataType, index: number) => {

                  return (
                    // eslint-disable-next-line react/jsx-key
                    <Grid item xs={6} key={item.id} md={3}>
                      <Card css={{ p: "$6", mw: "400px" }}>
                        <Card.Header style={{ marginLeft: -31 }} >
                          <BookmarkIcon sx={{
                            transform: 'rotate(270deg)', fontSize: 70, color: '#FDEFD8', marginTop: -30
                          }} />
                          <Box sx={{
                            position: 'absolute',
                            top: '17%',
                            left: '1%',
                            display: 'flex',
                            gap: 1
                          }}>
                            <StarIcon
                              sx={{
                                fontSize: 15,
                                color: '#F5A524'

                              }}
                            />
                            <Text h5 css={{ color: "$accents8", marginTop: -2, color: '#F5A524' }}>{item.rating}</Text>

                          </Box>


                          <Grid.Container>
                            <Grid xs={12} justify="center">
                              <React.Fragment key={index}>
                                {renderCell(item.encodedImage)}
                              </React.Fragment>
                            </Grid>
                            <Grid xs={12} justify="center">
                              < Text h4 css={{ lineHeight: "$xs" }}>
                                {item.doctorName}
                              </Text>
                            </Grid>
                            <Grid xs={12} justify="center">
                              <Text css={{ color: "$accents8", fontSize: '$sm', marginTop: -8 }}>{item.experience} Experience</Text>
                            </Grid>
                          </Grid.Container>
                        </Card.Header>
                        <Card.Body css={{ px: "$xl", marginTop: -25 }}>
                          <Button style={{ color: '#0072F5', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.5 }} disabled>{item.doctorCategoryName}</Button>
                        </Card.Body>

                      </Card>
                    </Grid>

                  )
                })}
              </Grid.Container>
            </Grid>
          )}

      </Grid.Container >

    </ApexChartWrapper >
  )
}

export default DoctorList
function convertBase64ToString(base64) {
  return atob(base64)
}
