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

const Trophy = () => {
  // ** Hook
  const theme = useTheme()

  const imageSrc = theme.palette.mode === 'light' ? 'triangle-light.png' : 'triangle-dark.png'

  return (
    <Card sx={{ position: 'relative', paddingY: '30px' }}>
      <CardContent>
        <Typography variant='h3' fontWeight='bold' fontFamily='Roboto' marginLeft={15} color={{ black: '#000000' }}>Explore your </Typography>
        <Typography variant='h3' fontFamily='Roboto' marginLeft={15} fontWeight='bold'>Meditations </Typography>

        <CardActions sx={{ gap: 8, marginLeft: 5 }}>
          <Button size='small' sx={{
            height: 160, width: 90, borderRadius: 20, color: '#000000', fontWeight: 'bold', textTransform: 'none', fontFamily: 'Roboto', backgroundColor: '#f0f8ff', '&:hover': {
              backgroundColor: '#EADCF8', border: '2px solid #E0CBF5',

            }
          }} variant='contained'>
            <Grid.Container >
              <Grid xs={12} style={{ marginLeft: -10 }}>
                <img width={80}
                  src='/images/logo.png' alt="mood" />
              </Grid>
              <Grid xs={12} style={{ marginLeft: 12 }}>
                <Typography fontWeight='bold' fontSize={11} fontFamily='Roboto' color={{ black: '#000000' }}>            Happy
                </Typography>
              </Grid>
            </Grid.Container>

          </Button>
          <Button size='small' sx={{
            height: 160, width: 90, borderRadius: 20, color: '#000000', fontWeight: 'bold', textTransform: 'none', fontFamily: 'Roboto', backgroundColor: '#f0f8ff', '&:hover': {
              backgroundColor: '#EADCF8', border: '2px solid #E0CBF5',

            }
          }} variant='contained'>
            <Grid.Container >
              <Grid xs={12} style={{ marginLeft: -10 }}>
                <img width={80}
                  src='/images/logo.png' alt="mood" />
              </Grid>
              <Grid xs={12} style={{ marginLeft: 12 }}>
                <Typography fontWeight='bold' fontSize={11} fontFamily='Roboto' color={{ black: '#000000' }}>            Happy
                </Typography>
              </Grid>
            </Grid.Container>

          </Button><Button size='small' sx={{
            height: 160, width: 90, borderRadius: 20, color: '#000000', fontWeight: 'bold', textTransform: 'none', fontFamily: 'Roboto', backgroundColor: '#f0f8ff', '&:hover': {
              backgroundColor: '#EADCF8', border: '2px solid #E0CBF5',

            }
          }} variant='contained'>
            <Grid.Container >
              <Grid xs={12} style={{ marginLeft: -10 }}>
                <img width={80}
                  src='/images/logo.png' alt="mood" />
              </Grid>
              <Grid xs={12} style={{ marginLeft: 10 }}>
                <Typography fontWeight='bold' fontSize={11} fontFamily='Roboto' color={{ black: '#000000' }}> Very Good
                </Typography>
              </Grid>
            </Grid.Container>

          </Button><Button size='small' sx={{
            height: 160, width: 90, borderRadius: 20, color: '#000000', fontWeight: 'bold', textTransform: 'none', fontFamily: 'Roboto', backgroundColor: '#f0f8ff', '&:hover': {
              backgroundColor: '#EADCF8', border: '2px solid #E0CBF5',

            }
          }} variant='contained'>
            <Grid.Container >
              <Grid xs={12} style={{ marginLeft: -10 }}>
                <img width={80}
                  src='/images/logo.png' alt="mood" />
              </Grid>
              <Grid xs={12} style={{ marginLeft: 12 }}>
                <Typography fontWeight='bold' fontSize={11} fontFamily='Roboto' color={{ black: '#000000' }}>            Good
                </Typography>
              </Grid>
            </Grid.Container>

          </Button><Button size='small' sx={{
            height: 160, width: 90, borderRadius: 20, color: '#000000', fontWeight: 'bold', textTransform: 'none', fontFamily: 'Roboto', backgroundColor: '#f0f8ff', '&:hover': {
              backgroundColor: '#EADCF8', border: '2px solid #E0CBF5',

            }
          }} variant='contained'>
            <Grid.Container >
              <Grid xs={12} style={{ marginLeft: -10 }}>
                <img width={80}
                  src='/images/logo.png' alt="mood" />
              </Grid>
              <Grid xs={12} style={{ marginLeft: 12 }}>
                <Typography fontWeight='bold' fontSize={11} fontFamily='Roboto' color={{ black: '#000000' }}>            Very Sad
                </Typography>
              </Grid>
            </Grid.Container>

          </Button>
        </CardActions>
        {/* <TriangleImg alt='triangle background' src={`/images/misc/${imageSrc}`} />
        <TrophyImg alt='trophy' src='/images/misc/trophy.png' /> */}
      </CardContent>
    </Card >
  )
}

export default Trophy
