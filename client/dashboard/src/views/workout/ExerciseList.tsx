// ** React Imports
import { ReactNode, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { Avatar } from '@nextui-org/react'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import ChevronUp from 'mdi-material-ui/ChevronUp'
import ChevronDown from 'mdi-material-ui/ChevronDown'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import TimerIcon from '@mui/icons-material/Timer'
import BoltIcon from '@mui/icons-material/Bolt'
import { useRouter } from 'next/router'


// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import axios from 'axios'
import { WORKOUT_ROUTE } from 'src/configs/appRoutes'

interface DataType {
  title: string
  sales: string
  trend: ReactNode
  trendDir: string
  subtitle: string
  avatarText: string
  trendNumber: string
  avatarColor: ThemeColor
}



const ExerciseList = () => {

  const router = useRouter()


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
        const res = await axios.get(WORKOUT_ROUTE, { headers })

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

        // <Image
        //   src="/images/avatars/download.jpeg"
        //   alt="Default Image"
        //   style={{ borderRadius: '50px' }}

        // />
        <Avatar
          squared
          size="xl"
          src="/images/avatars/download.jpeg" />

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


  return (
    <Card sx={{ borderRadius: '40px' }}>
      <CardHeader
        title='Exercises'
        titleTypographyProps={{ sx: { lineHeight: '1.2 !important', letterSpacing: '0.31px !important' } }}

      />
      <CardContent sx={{ pt: theme => `${theme.spacing(2)} !important` }}>
        {data.map((item, index: number) => {
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                ...(index !== data.length - 1 ? { mb: 5.875 } : {})
              }}
              onClick={() => {
                window.location.reload()
                const userDataJSON = JSON.stringify(item.id)
                localStorage.setItem('exerciseId', userDataJSON)
                router.push(`/workout/workout-detail`)



              }}
            >
              {renderCell(item.encodedImage)}

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
                    <Typography sx={{ mr: 0.5, fontWeight: 600, letterSpacing: '0.25px' }}>{item.title}</Typography>

                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {/* <Avatar
                      squared
                      size="xs"
                      icon={<TimerIcon />} /> */}

                    <TimerIcon sx={{ width: 18 }} />
                    <Typography variant='caption' sx={{ lineHeight: 2 }}>
                      {item.timeDuration}
                    </Typography>
                    <BoltIcon />
                    <Typography variant='caption' sx={{ lineHeight: 2 }}>
                      {item.exerciseCategoryTitle}
                    </Typography>
                  </Box>

                </Box>

              </Box>
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default ExerciseList
