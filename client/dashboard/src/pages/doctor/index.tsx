import { Box, InputAdornment, Tab, TextField } from "@mui/material"
import { Magnify } from "mdi-material-ui"
import ApexChartWrapper from "src/@core/styles/libs/react-apexcharts"
import { Card, Grid, Text, Link, Avatar, Button } from "@nextui-org/react"
import BookmarkIcon from '@mui/icons-material/Bookmark'
import StarIcon from '@mui/icons-material/Star'
import React from "react"
import { useRouter } from "next/router"

const VISIBLE_FIELDS: string[] = ['name', 'rating', 'category', 'dateCreated', 'isAdmin']


interface RowData {
  id: number
  name: string
  rating: number
  category: string
  dateCreated: string
  isAdmin: boolean
}

const data: RowData[] = [
  {
    id: 1,
    name: 'John Doe',
    rating: 4,
    category: 'Neurologist',
    dateCreated: '2022-01-01',
    isAdmin: false,
  },
  {
    id: 2,
    name: 'simran baniya',
    rating: 3.5,
    category: 'Physiologist',
    dateCreated: '2022-01-01',
    isAdmin: false,
  },
]
const DoctorList = () => {
  const [filterText, setFilterText] = React.useState('')
  const router = useRouter()

  const handleGridClick = () => {
    // Perform any necessary logic or data manipulation before navigating
    // For example, you can pass additional data to the next page using query parameters or state

    // Navigate to the desired link
    router.push('/doctor/doctor-detail')
  }

  const filteredData = React.useMemo(() => {
    if (!filterText) {
      return data
    }

    return data.filter((row: RowData) =>
      VISIBLE_FIELDS.some((field) =>
        String(row[field]).toLowerCase().includes(filterText.toLowerCase())
      )
    )
  }, [filterText])

  return (
    <ApexChartWrapper>
      <Grid.Container spacing={12} marginTop={4}>

        <Grid item xs={12} md={12} onClick={handleGridClick}>
          <Box paddingX={10} sx={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between'
          }} >
            <Tab label='Doctors' value="doctor" sx={{ fontSize: 18, color: 'black', fontWeight: 'bold' }} />

            <TextField
              label="Search Doctor"
              variant="outlined"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Magnify fontSize='small' />
                  </InputAdornment>
                )
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={12} style={{ marginTop: 26 }} onClick={handleGridClick}>
          <Grid.Container spacing={6} gap={1} marginTop={4}>
            {filteredData.map((row: RowData) => (
              // eslint-disable-next-line react/jsx-key
              <Grid item xs={6} md={3}>
                <Card css={{ p: "$6", mw: "400px" }}>
                  <Card.Header style={{ marginLeft: -31 }} >
                    <BookmarkIcon sx={{
                      transform: 'rotate(270deg)', fontSize: 70, color: '#FDEFD8', marginTop: -30
                    }} />
                    <Box sx={{
                      position: 'absolute',
                      top: '17%',
                      left: '1%',
                      display: 'flex',
                      gap: 1
                    }}>
                      <StarIcon
                        sx={{
                          fontSize: 15,
                          color: '#F5A524'

                        }}
                      />
                      <Text h5 css={{ color: "$accents8", marginTop: -2, color: '#F5A524' }}>{row.rating}</Text>

                    </Box>


                    <Grid.Container>
                      <Grid xs={12} justify="center">
                        <Avatar
                          src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                          color="primary"
                          style={{ width: 100, height: 100 }}
                          bordered
                        />
                      </Grid>
                      <Grid xs={12} justify="center">
                        < Text h4 css={{ lineHeight: "$xs" }}>
                          {row.name}
                        </Text>
                      </Grid>
                      <Grid xs={12} justify="center">
                        <Text css={{ color: "$accents8", fontSize: '$sm', marginTop: -8 }}>{row.name}</Text>
                      </Grid>
                    </Grid.Container>
                  </Card.Header>
                  <Card.Body css={{ px: "$xl", marginTop: -25 }}>
                    <Button style={{ color: '#0072F5', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.5 }} disabled>{row.category}</Button>
                  </Card.Body>

                </Card>
              </Grid>

            ))}
          </Grid.Container>
        </Grid>

      </Grid.Container >

    </ApexChartWrapper >
  )
}

export default DoctorList
