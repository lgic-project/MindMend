// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import TrendingUp from 'mdi-material-ui/TrendingUp'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import CellphoneLink from 'mdi-material-ui/CellphoneLink'
import AccountOutline from 'mdi-material-ui/AccountOutline'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import { Button } from '@mui/material'
import router, { useRouter } from 'next/router'
import { WORKOUT_ROUTE } from 'src/configs/appRoutes'
import axios from 'axios'
import NextUILoadingComponent from 'src/layouts/components/loading'
import React from 'react'

interface DataType {
  logo: string
  title: string
  amount: string
  subtitle: string
  logoWidth: number
  logoHeight: number
}

const depositData = [
  {
    logoWidth: 28,
    logoHeight: 29,
    amount: '10 Minutes',
    subtitle: '5 Exercises',
    title: 'Brisk walking',
    logo: '/images/logos/gumroad.png'
  },
  {
    logoWidth: 38,
    logoHeight: 38,
    amount: '30 minutes',
    title: 'Jogging',
    subtitle: '6 Exercises',
    logo: '/images/logos/mastercard-label.png'
  },
  {
    logoWidth: 20,
    logoHeight: 28,
    amount: '20 minutes',
    title: 'Swimming',
    subtitle: '3 Exercises',
    logo: '/images/logos/stripe.png'
  },
  {
    logoWidth: 34,
    logoHeight: 32,
    amount: '20 minutes',
    title: 'Boxing',
    subtitle: '4 Exercises',
    logo: '/images/logos/american-bank.png'
  },
  {
    logoWidth: 33,
    logoHeight: 22,
    amount: '8 minutes',
    title: 'Simple Breathing Exercises ',
    subtitle: '10 Exercises',
    logo: '/images/logos/citi-bank.png'
  }
]
const StatisticsCard = () => {

  const router = useRouter()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState([])
  const slicedData = data.slice(0, 5) // Extract the first 5 data items


  useEffect(() => {


    const GetWorkoutList = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'))

        const headers = {
          Authorization: `Bearer ${userData.accessToken}` // Include the token in the Authorization header
        }
        const res = await axios.get(WORKOUT_ROUTE + "/active", { headers })
        // setLoading(true);
        console.log(res.data)
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
    if (value == "") {
      console.log(value)

      return (

        <img src="/images/avatars/download.jpeg" alt='workout' width='50' height='50' style={{ borderRadius: '15px' }} />


      )
    }
    else {
      const base64String = value // Base64 encoded string
      const regularString = convertBase64ToString(base64String)

      return (

        <img src={regularString} alt='workout' width='33' height='22' />


      )
    }

  }

  return (

    <Card sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: ['column', 'column', 'row'] }}>
      {
        loading ? (
          <NextUILoadingComponent />
        ) : (
          <Box sx={{ width: '100%' }}>
            <CardHeader
              title='Workout'
              sx={{ pt: 5.5, alignItems: 'center', '& .MuiCardHeader-action': { mt: 0.6 } }}
              action={<Button size='small' onClick={() => router.push("/workout")}>View All</Button>}

              titleTypographyProps={{
                variant: 'h6',
                sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' }
              }}
            />
            <CardContent sx={{ pb: theme => `${theme.spacing(5.5)} !important` }}>
              {slicedData.map((item, index: number) => {
                return (
                  <Box
                    key={item.id}
                    sx={{
                      display: 'flex', alignItems: 'center', padding: '10px', paddingX: '15px', borderRadius: '15px', '&:hover': {
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                      }, mb: index !== slicedData.length - 1 ? 6 : 0
                    }}
                    onClick={() => {
                      const userDataJSON = JSON.stringify(item.id)
                      localStorage.setItem('exerciseId', userDataJSON)
                      router.push(`/workout/workout-detail`)
                    }}
                  >
                    <Box sx={{ minWidth: 38, display: 'flex', justifyContent: 'center' }}>
                      <React.Fragment key={index}>
                        {renderCell(item.encodedImage)}
                      </React.Fragment>                    </Box>
                    <Box
                      sx={{
                        ml: 4,
                        width: '100%',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Box sx={{ marginRight: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.800rem' }}>{item.title}</Typography>
                        <Typography variant='caption'>{item.subtitle} Exercises</Typography>
                      </Box>
                      <Typography fontSize={10} sx={{ fontWeight: 600, color: 'success.main' }}>
                        {item.timer}
                      </Typography>
                    </Box>
                  </Box>
                )
              })}
            </CardContent>
          </Box >
        )
      }
    </Card >

  )
}
export default StatisticsCard

function convertBase64ToString(base64) {
  return atob(base64)
}
