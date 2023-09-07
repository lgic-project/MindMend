// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icons Imports
import Poll from 'mdi-material-ui/Poll'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import BriefcaseVariantOutline from 'mdi-material-ui/BriefcaseVariantOutline'

// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import Table from 'src/views/dashboard/Table'
import Trophy from 'src/views/dashboard/Trophy'
import TotalEarning from 'src/views/dashboard/TotalEarning'
import StatisticsCard from 'src/views/dashboard/StatisticsCard'
import WeeklyOverview from 'src/views/dashboard/WeeklyOverview'
import { useEffect, useState } from 'react'
import SuccessAlert from 'src/content/SuccessAlert'
import { useRouter } from 'next/router'
import { DOCTOR_ROUTE } from 'src/configs/appRoutes'

const Dashboard = () => {

  const [receivedData, setReceivedData] = useState('')



  const handleDataFromTrophy = (data) => {
    setReceivedData(data)
  }

  return (
    <ApexChartWrapper>
      {receivedData == 'true' && <SuccessAlert message="You mood has been set" />}

      <Grid container spacing={6}>
        <Grid item xs={12} md={8}>
          <Trophy sendDataToMain={handleDataFromTrophy} />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatisticsCard />
        </Grid>

        <Grid item xs={12} md={8} lg={8}>
          <TotalEarning />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <WeeklyOverview />
        </Grid>

      </Grid>
    </ApexChartWrapper>
  )
}

export default Dashboard

