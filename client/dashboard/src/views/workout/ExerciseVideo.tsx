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
  const theme = useTheme()

  const imageSrc = theme.palette.mode === 'light' ? 'triangle-light.png' : 'triangle-dark.png'

  return (
    <Card sx={{ position: 'relative', borderRadius: '50px' }}>

      <Image
        src="https://github.com/nextui-org/nextui/blob/next/apps/docs/public/nextui-banner.jpeg?raw=true"
        alt="Default Image"
        width="100%"
        style={{ borderRadius: '50px' }}

      />
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
                  <Typography sx={{ mr: 0.5, fontWeight: 700, letterSpacing: '0.25px' }}>Stretching</Typography>
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
                  <Typography sx={{ mr: 0.5, fontWeight: 700, letterSpacing: '0.25px' }}>Hard</Typography>
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
                  <Typography sx={{ mr: 0.5, fontWeight: 700, letterSpacing: '0.25px' }}>45sec</Typography>
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
