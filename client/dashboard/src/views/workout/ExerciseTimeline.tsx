// ** React Imports
import { ReactNode } from 'react'
import { ReactNode, useEffect, useState } from 'react'


// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { Avatar } from '@nextui-org/react'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent'

// ** Icons Imports
import ChevronUp from 'mdi-material-ui/ChevronUp'
import ChevronDown from 'mdi-material-ui/ChevronDown'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import TimerIcon from '@mui/icons-material/Timer'
import BoltIcon from '@mui/icons-material/Bolt'


// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import { useRouter } from 'next/router'
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

const data: DataType[] = [
  {
    sales: '894k',
    trendDir: 'up',
    subtitle: 'USA',
    title: '$8,656k',
    avatarText: 'US',
    trendNumber: '25.8%',
    avatarColor: 'success',
    trend: <ChevronUp sx={{ color: 'success.main', fontWeight: 600 }} />
  },
  {
    sales: '645k',
    subtitle: 'UK',
    trendDir: 'down',
    title: '$2,415k',
    avatarText: 'UK',
    trendNumber: '6.2%',
    avatarColor: 'error',
    trend: <ChevronDown sx={{ color: 'error.main', fontWeight: 600 }} />
  },
  {
    sales: '148k',
    title: '$865k',
    trendDir: 'up',
    avatarText: 'IN',
    subtitle: 'India',
    trendNumber: '12.4%',
    avatarColor: 'warning',
    trend: <ChevronUp sx={{ color: 'success.main', fontWeight: 600 }} />
  },
  {
    sales: '86k',
    title: '$745k',
    trendDir: 'down',
    avatarText: 'JA',
    subtitle: 'Japan',
    trendNumber: '11.9%',
    avatarColor: 'secondary',
    trend: <ChevronDown sx={{ color: 'error.main', fontWeight: 600 }} />
  },
  {
    sales: '42k',
    title: '$45k',
    trendDir: 'up',
    avatarText: 'KO',
    subtitle: 'Korea',
    trendNumber: '16.2%',
    avatarColor: 'error',
    trend: <ChevronUp sx={{ color: 'success.main', fontWeight: 600 }} />
  }
]

const ExerciseList = () => {
  const router = useRouter()


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

  return (
    <Card sx={{ borderRadius: '40px' }}>
      <CardHeader
        title='Description'
        titleTypographyProps={{ sx: { lineHeight: '1.2 !important', marginLeft: 10, letterSpacing: '0.31px !important' } }}

      />
      <CardContent sx={{ pt: theme => `${theme.spacing(2)} !important` }}>

        <Timeline
          sx={{
            [`& .${timelineOppositeContentClasses.root}`]: {
              flex: 0.2,
            },
          }}
        >
          <TimelineItem>
            <TimelineOppositeContent color="textSecondary">

            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <Typography variant="h6" component="span">
                Features
              </Typography>
              <Typography>{data.description}</Typography>
            </TimelineContent>
          </TimelineItem>

        </Timeline>

      </CardContent>
    </Card>
  )
}

export default ExerciseList
