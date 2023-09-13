// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import { CardActions } from '@mui/material'
import { UserIcon } from 'src/layouts/components/UserIcon'
import { MoodIcon } from 'src/layouts/components/MoodIcon'
import { Avatar, Grid, Image } from '@nextui-org/react'
import { Fullscreen } from 'mdi-material-ui'
import {
  Box,
  Button,
} from '@mui/material'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import StarIcon from '@mui/icons-material/Star'
import TimerIcon from '@mui/icons-material/Timer'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { WORKOUT_ROUTE } from 'src/configs/appRoutes'
import { useRouter } from 'next/router'


// Styled component for the triangle shaped background image
const TriangleImg = styled('img')({
  right: 0,
  bottom: 0,
  height: 170,
  position: 'absolute'
})

// Styled component for the trophy image
const TrophyImg = styled('img')({
  right: 36,
  bottom: 20,
  height: 98,
  position: 'absolute'
})

const ExerciseVideo = () => {
  // ** Hook
  const router = useRouter()

  const theme = useTheme()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState([])

  useEffect(() => {


    const GetWorkoutList = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'))
        const id = JSON.parse(localStorage.getItem('exerciseId'))
        const headers = {
          Authorization: `Bearer ${userData.accessToken}` // Include the token in the Authorization header
        }
        const res = await axios.get(WORKOUT_ROUTE + "/" + id, { headers })

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
    if (value == "") {

      return (

        <Image
          src="/images/download.jpeg"
          alt="Default Image"
          style={{ borderRadius: '50px' }}

        />

      )
    }

    // else {
    //   const base64String = value // Base64 encoded string
    //   const regularString = convertBase64ToString(base64String)

    //   return (

    //     <Image
    //       src={regularString}
    //       alt="Default Image"
    //       width="100%"
    //       style={{ borderRadius: '50px' }}

    //     />

    //   )
    // }

  }

  const imageSrc = theme.palette.mode === 'light' ? 'triangle-light.png' : 'triangle-dark.png'

  return (
    <Card sx={{ position: 'relative', borderRadius: '50px' }}>
      {renderCell(data.encodedImage)}

      <CardContent sx={{ paddingX: 25, paddingY: 10, marginBottom: 5 }}>
        <Box
          display={{ xs: 'block', md: 'flex' }}
          alignItems="center"
          justifyContent="space-between"
        >
          <Box
            key="Test"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <Avatar
              squared
              icon={<FitnessCenterIcon />}
            />

            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Box sx={{ marginRight: 2, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex' }}>
                  <Typography sx={{ mr: 0.5, fontWeight: 700, letterSpacing: '0.25px' }}>{data.exerciseCategoryTitle}</Typography>
                </Box>
                <Typography variant='caption' sx={{ lineHeight: 1.5 }}>
                  Exercise
                </Typography>
              </Box>

            </Box>
          </Box>
          <Box
            key="Test"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <Avatar
              squared
              width="30"
              icon={<StarIcon />} />
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Box sx={{ marginRight: 2, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex' }}>
                  <Typography sx={{ mr: 0.5, fontWeight: 700, letterSpacing: '0.25px' }}>{data.difficultyLevel}</Typography>
                </Box>
                <Typography variant='caption' sx={{ lineHeight: 1.5 }}>
                  Difficulty
                </Typography>
              </Box>

            </Box>
          </Box>
          <Box
            key="Test"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <Avatar
              squared
              width="30"
              icon={<TimerIcon />} />

            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Box sx={{ marginRight: 2, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex' }}>
                  <Typography sx={{ mr: 0.5, fontWeight: 700, letterSpacing: '0.25px' }}>{data.timeDuration}</Typography>
                </Box>
                <Typography variant='caption' sx={{ lineHeight: 1.5 }}>
                  Total time
                </Typography>
              </Box>

            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card >
  )
}

export default ExerciseVideo
function convertBase64ToString(base64) {
  return atob(base64)
}
