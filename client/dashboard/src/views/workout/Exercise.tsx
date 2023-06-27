import Grid from '@mui/material/Grid'
import ApexChartWrapper from "src/@core/styles/libs/react-apexcharts"
import SalesByCountries from '../dashboard/SalesByCountries'
import { IconButton } from '@mui/material'
import user from '@nextui-org/react/types/user'
import { Box, Button } from '@mui/material'
import ExerciseVideo from './ExerciseVideo'

const Exercise = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6} marginTop={4}>
        <Grid item xs={12} md={8}>
          <ExerciseVideo />
        </Grid>


        <Grid item xs={12} md={4}>
          <SalesByCountries />

        </Grid>

      </Grid>
    </ApexChartWrapper>
  )
}

export default Exercise

