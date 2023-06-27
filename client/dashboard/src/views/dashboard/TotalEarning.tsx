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

  return (

    <Card style={{ backgroundColor: theme.palette.background.paper }}>
      <CardHeader
        title='Top Rated Doctors'
        titleTypographyProps={{ sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' } }}

      />
      <CardContent sx={{ pt: theme => `${theme.spacing(2.25)} !important` }} >

        <Carousel responsive={responsive}>
          <Grid xs={12} sm={11}>
            <Card>
              <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
                <Col>

                  <Text h4 color="white">
                    Stream the Acme event
                  </Text>
                </Col>
              </Card.Header>
              <Card.Image
                src="/images/avatars/1.png"
                objectFit="cover"
                width="100%"
                height={280}
                alt="Card image background"
              />
            </Card>
          </Grid>
          <Grid xs={12} sm={11}>
            <Card>
              <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
                <Col>

                  <Text h4 color="white">
                    Stream the Acme event
                  </Text>
                </Col>
              </Card.Header>
              <Card.Image
                src="https://nextui.org/images/card-example-4.jpeg"
                objectFit="cover"
                width="100%"
                height={280}
                alt="Card image background"
              />
            </Card>
          </Grid>
          <Grid xs={12} sm={11}>
            <Card>
              <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
                <Col>

                  <Text h4 color="white">
                    Stream the Acme event
                  </Text>
                </Col>
              </Card.Header>
              <Card.Image
                src="/images/avatars/1.png"
                objectFit="cover"
                width="100%"
                height={280}
                alt="Card image background"
              />
            </Card>
          </Grid>
          <Grid xs={12} sm={11}>
            <Card>
              <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
                <Col>

                  <Text h4 color="white">
                    Stream the Acme event
                  </Text>
                </Col>
              </Card.Header>
              <Card.Image
                src="https://nextui.org/images/card-example-4.jpeg"
                objectFit="cover"
                width="100%"
                height={280}
                alt="Card image background"
              />
            </Card>
          </Grid>
        </Carousel>
      </CardContent>
    </Card>
  )
}

export default TotalEarning
