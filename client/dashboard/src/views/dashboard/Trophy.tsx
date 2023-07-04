// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import { CardActions } from '@mui/material'
import { UserIcon } from 'src/layouts/components/UserIcon'
import { MoodIcon } from 'src/layouts/components/MoodIcon'
import { Grid } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { MOODCATEGORY_ROUTE, MOOD_ROUTE } from 'src/configs/appRoutes'
import ErrorAlert from 'src/content/ErrorAlert'
import NextUILoadingComponent from 'src/layouts/components/loading'
import React from 'react'



const Trophy = ({ sendDataToMain }) => {

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState([])


  useEffect(() => {


    const GetMoodCategoryList = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'))

        const headers = {
          Authorization: `Bearer ${userData.accessToken}` // Include the token in the Authorization header
        }
        const res = await axios.get(MOODCATEGORY_ROUTE + "/active", { headers })
        // setLoading(true);
        setData(res.data)
        setLoading(false)


      } catch (error) {
        setLoading(false)
        setError(error)
      }



    }
    GetMoodCategoryList()



  }, [])

  const submitMood = async (id) => {
    // event.preventDefault()
    // moodCategoryData.logo = base64

    const userData = JSON.parse(localStorage.getItem('userData'))

    const headers = {
      Authorization: `Bearer ${userData.accessToken}` // Include the token in the Authorization header
    }
    const moodData = {
      moodId: id,
      userId: userData.id
    }

    const result = await axios.post(MOOD_ROUTE, moodData, { headers })
      .then((res) => {
        sendDataToMain("true")
      })
      .catch((error) => setError(error.response))

    // router.push(
    //   {
    //     pathname: '/mood/mood-category',
    //     query: props
    //   })
    // setVisible(false)
  }

  const renderCell = (value) => {
    const base64String = value // Base64 encoded string
    const regularString = convertBase64ToString(base64String)

    return (
      <img width={40}
        src={regularString} alt="mood" />

    )
  }
  // ** Hook
  const theme = useTheme()

  const imageSrc = theme.palette.mode === 'light' ? 'triangle-light.png' : 'triangle-dark.png'

  return (
    <Card sx={{ position: 'relative', paddingY: '30px' }}>
      {error && <ErrorAlert message={error.message} />}

      <CardContent>
        <Typography variant='h3' fontWeight='bold' fontFamily='Roboto' marginLeft={15} color={{ black: '#000000' }}>Explore your </Typography>
        <Typography variant='h3' fontFamily='Roboto' marginLeft={15} fontWeight='bold'>Meditations </Typography>
        {loading ? (
          <NextUILoadingComponent />
        ) : (
          <CardActions sx={{ gap: 8, marginLeft: 5 }}>
            {data.map((item, index) => (
              <Button size='small' key={item.id} onClick={() => submitMood(item.id)} sx={{
                height: 160, width: 90, borderRadius: 20, color: '#000000', fontWeight: 'bold', textTransform: 'none', fontFamily: 'Roboto', backgroundColor: '#f0f8ff', '&:hover': {
                  backgroundColor: '#EADCF8', border: '2px solid #E0CBF5',

                }
              }} variant='contained'>
                <Grid.Container gap={1} >
                  <Grid xs={12} style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <React.Fragment key={index}>
                      {renderCell(item.encodedImage)}
                    </React.Fragment>

                  </Grid>
                  <Grid xs={12} style={{ alignItems: 'center', justifyContent: 'center' }} >
                    <Typography fontWeight='bold' fontSize={10} fontFamily='Roboto' color={{ black: '#000000' }} style={{ textAlign: 'center' }}

                    >  {item.name}
                    </Typography>
                  </Grid>
                </Grid.Container>

              </Button>
            ))}

          </CardActions>
        )}
        {/* <TriangleImg alt='triangle background' src={`/images/misc/${imageSrc}`} />
        <TrophyImg alt='trophy' src='/images/misc/trophy.png' /> */}
      </CardContent>
    </Card >
  )
}

export default Trophy

function convertBase64ToString(base64) {
  return atob(base64)
}
