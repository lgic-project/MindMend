import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import { useState } from 'react'
import Exercise from 'src/views/workout/Exercise'
import { useRouter } from 'next/router'


interface TabPanelProps {
  children?: React.ReactNode
  index: string
  value: string
}

const WorkoutDetail: React.FC = () => {
  const router = useRouter()

  const { id } = router.query
  const [value, setValue] = useState("1")

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <TabContext value={value}>
      <Box >
        <TabList aria-label="lab API tabs example" onChange={handleChange}>
          <Tab label='Day 1' value="1" />
        </TabList>
      </Box>
      <TabPanel value="1">
        <Exercise id={id} />
      </TabPanel>
    </TabContext>
  )
}

export default WorkoutDetail
