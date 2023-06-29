import Grid from '@mui/material/Grid'
import ApexChartWrapper from "src/@core/styles/libs/react-apexcharts"
import { IconButton } from '@mui/material'
import user from '@nextui-org/react/types/user'
import { Box, Button } from '@mui/material'
import ExerciseVideo from './ExerciseVideo'
import ExerciseList from './ExerciseList'
import { Timeline } from 'mdi-material-ui'
import { TimelineItem, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent } from '@mui/lab'
import ExerciseTimeline from './ExerciseTimeline'

const Exercise = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6} marginTop={4}>
        <Grid item xs={12} md={8}>
          <ExerciseVideo />
        </Grid>


        <Grid item xs={12} md={4}>
          <ExerciseList />

        </Grid>
        <Grid item xs={12} md={8}>
          <ExerciseTimeline />

        </Grid>

      </Grid>
    </ApexChartWrapper>
  )
}

export default Exercise

