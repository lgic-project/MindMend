import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import { useState } from 'react'
import Exercise from 'src/views/workout/Exercise'

interface TabPanelProps {
  children?: React.ReactNode
  index: string
  value: string
}

const Workout: React.FC = () => {
  const [value, setValue] = useState("1")

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <TabContext value={value}>
      <Box >
        <TabList aria-label="lab API tabs example" onChange={handleChange}>
          <Tab label='Day 1' value="1" />
          <Tab label="Day 2" value="2" />
          <Tab label="Day 3" value="3" />
        </TabList>
      </Box>
      <TabPanel value="1">
        <Exercise />
      </TabPanel>
      <TabPanel value="2">Item Two</TabPanel>
      <TabPanel value="3">Item Three</TabPanel>
    </TabContext>
  )
}

export default Workout