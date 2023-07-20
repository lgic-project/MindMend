// ** MUI Imports
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"

// ** Icons Imports
import MenuUp from 'mdi-material-ui/MenuUp'
import DotsVertical from 'mdi-material-ui/DotsVertical'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import { Card, Col, Grid, Text } from '@nextui-org/react'
import { light } from '@mui/material/styles/createPalette'
import { useTheme } from '@mui/material/styles'
import NextUILoadingComponent from 'src/layouts/components/loading'
import { DOCTOR_ROUTE } from 'src/configs/appRoutes'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import React from 'react'
import { Button } from '@mui/material'

interface DataType {
  title: string
  imgSrc: string
  amount: string
  subtitle: string
  progress: number
  color: ThemeColor
  imgHeight: number
}

const data: DataType[] = [
  {
    progress: 75,
    imgHeight: 20,
    title: 'Zipcar',
    color: 'primary',
    amount: '$24,895.65',
    subtitle: 'Vuejs, React & HTML',
    imgSrc: '/images/cards/logo-zipcar.png'
  },
  {
    progress: 50,
    color: 'info',
    imgHeight: 27,
    title: 'Bitbank',
    amount: '$8,650.20',
    subtitle: 'Sketch, Figma & XD',
    imgSrc: '/images/cards/logo-bitbank.png'
  },
  {
    progress: 20,
    imgHeight: 20,
    title: 'Aviato',
    color: 'secondary',
    amount: '$1,245.80',
    subtitle: 'HTML & Angular',
    imgSrc: '/images/cards/logo-aviato.png'
  }
]

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
}

const TotalEarning = () => {
  const theme = useTheme()


  const router = useRouter()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState([])
  const slicedData = data.slice(0, 3)

  useEffect(() => {


    const GetWorkoutList = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'))

        const headers = {
          Authorization: `Bearer ${userData.accessToken}` // Include the token in the Authorization header
        }
        const res = await axios.get(DOCTOR_ROUTE + "/active/rating", { headers })
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

    return (

      <Card.Image
        src={regularString}
        objectFit="cover"
        width="100%"
        height={280}
        alt="Card image background"
      />

    )
  }

  return (

    <Card style={{ backgroundColor: theme.palette.background.paper }}>
      <CardHeader
        title='Top Rated Doctors'
        titleTypographyProps={{ sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' } }}
        action={<Button size='small' onClick={() => router.push("/doctor")}>View All</Button>}

      />
      <CardContent sx={{ pt: theme => `${theme.spacing(2.25)} !important` }} >
        {
          loading ? (
            <NextUILoadingComponent />
          ) : (
            <Carousel responsive={responsive}>
              {slicedData.map((item: DataType, index: number) => {

                return (

                  <Grid xs={12} key={item.id} sm={11} onClick={() => router.push("/doctor/doctor-detail")}>
                    <Card>
                      <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
                        <Col>

                          <Text h4 color="white">
                            {item.doctorName}
                          </Text>
                        </Col>
                      </Card.Header>
                      <React.Fragment key={index}>
                        {renderCell(item.encodedImage)}
                      </React.Fragment>                       </Card>
                  </Grid>
                )
              })}

            </Carousel>
          )}
      </CardContent>
    </Card>
  )
}

export default TotalEarning

function convertBase64ToString(base64) {
  return atob(base64)
}
