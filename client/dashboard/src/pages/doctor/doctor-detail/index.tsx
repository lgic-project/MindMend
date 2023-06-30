import { Facebook, Instagram } from "@mui/icons-material"
import { Box, CardContent, CardHeader, Rating, Typography } from "@mui/material"
import { Avatar, Button, Card, Grid, Row, Text } from "@nextui-org/react"
import ApexChartWrapper from "src/@core/styles/libs/react-apexcharts"
import EastIcon from "@mui/icons-material/East"
import React from "react"

const DoctorDetail = () => {
  const [value, setValue] = React.useState<number | null>(2)

  return (
    <ApexChartWrapper>
      <Grid.Container spacing={4} style={{ gap: 25 }} marginTop={4}>
        <Grid item xs={12} md={4} style={{ height: 450 }}>
          <Card isPressable>
            <Card.Body css={{ p: 0 }}>
              <Card.Image
                src={"https://i.pravatar.cc/150?u=a042581f4e29026024d"}
                objectFit="cover"
                width="100%"
                height={380}
                alt="doctor"
              />
            </Card.Body>
            <Card.Footer css={{ justifyItems: "flex-start" }}>
              <Row wrap="wrap" justify="center" style={{ gap: 9 }} align="center">
                <Avatar squared color="primary" icon={<Facebook size={20} fill="currentColor" sx={{ color: 'white' }} />} />
                <Avatar squared color="primary" icon={<Instagram size={20} fill="currentColor" sx={{ color: 'white' }} />} />

              </Row>
            </Card.Footer>
          </Card>
        </Grid>
        <Grid item xs={12} md={7}>
          <Card css={{ padding: 30, paddingLeft: 40, paddingRight: 40 }}>
            <Card.Header style={{ display: 'grid', gap: 5 }} >

              <Text b size='$3xl'>Dr. Ram Charan</Text>
              <Text b size='$xl' color="primary">Neurologist</Text>
            </Card.Header>
            <Card.Body css={{ marginTop: -20, gap: 5 }}>
              <Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Text>
              <Grid.Container spacing={4} style={{ gap: 25 }} >
                <Grid item xs={12} md={12}>
                  <Grid.Container spacing={4} >
                    <Grid item xs={6} md={3}>
                      <Text weight='medium' size='$sm'>Experience</Text>
                    </Grid>
                    <Grid item xs={6} md={9}>
                      <Grid.Container spacing={4} >
                        <Grid item xs={12}>
                          <Box width='100%'>
                            <Row justify="flex">
                              <EastIcon fontSize='small' sx={{ marginTop: 4 }} />
                              <Text weight='normal' size='$sm' style={{ marginLeft: 8, width: '100%' }}>4 years</Text>

                            </Row>
                            <Card.Divider />

                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Box width='100%'>
                            <Row justify="flex">
                              <EastIcon fontSize='small' sx={{ marginTop: 4 }} />
                              <Text weight='normal' size='$sm' style={{ marginLeft: 8, width: '100%' }}>4 years</Text>

                            </Row>
                            <Card.Divider />

                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Box width='100%'>
                            <Row justify="flex">
                              <EastIcon fontSize='small' sx={{ marginTop: 4 }} />
                              <Text weight='normal' size='$sm' style={{ marginLeft: 8, width: '100%' }}>4 years</Text>

                            </Row>
                            <Card.Divider />

                          </Box>
                        </Grid>
                      </Grid.Container>

                    </Grid>

                    <Card.Divider />
                  </Grid.Container>

                </Grid>
                <Grid item xs={12} md={12}>
                  <Grid.Container spacing={4} >
                    <Grid item xs={6} md={3}>
                      <Text weight='medium' size='$sm'>Address</Text>
                    </Grid>
                    <Grid item xs={6} md={9}>
                      <Grid.Container spacing={4} >
                        <Grid item xs={12}>
                          <Box width='100%'>
                            <Row justify="flex">
                              <EastIcon fontSize='small' sx={{ marginTop: 4 }} />
                              <Text weight='normal' size='$sm' style={{ marginLeft: 8, width: '100%' }}>4 years</Text>

                            </Row>
                            <Card.Divider />

                          </Box>
                        </Grid>
                      </Grid.Container>

                    </Grid>

                    <Card.Divider />
                  </Grid.Container>

                </Grid>
                <Grid item xs={12} md={12}>
                  <Grid.Container spacing={4} >
                    <Grid item xs={6} md={3}>
                      <Text weight='medium' size='$sm'>Phone Number</Text>
                    </Grid>
                    <Grid item xs={6} md={9}>
                      <Grid.Container spacing={4} >
                        <Grid item xs={12}>
                          <Box width='100%'>
                            <Row justify="flex">
                              <EastIcon fontSize='small' sx={{ marginTop: 4 }} />
                              <Text weight='normal' size='$sm' style={{ marginLeft: 8, width: '100%' }}>9832847236</Text>

                            </Row>
                            <Card.Divider />

                          </Box>
                        </Grid>
                      </Grid.Container>

                    </Grid>

                    <Card.Divider />
                  </Grid.Container>

                </Grid>
                <Grid item xs={12} md={12}>
                  <Grid.Container spacing={4} >
                    <Grid item xs={6} md={3}>
                      <Text weight='medium' size='$sm'>Email</Text>
                    </Grid>
                    <Grid item xs={6} md={9}>
                      <Grid.Container spacing={4} >
                        <Grid item xs={12}>
                          <Box width='100%'>
                            <Row justify="flex">
                              <EastIcon fontSize='small' sx={{ marginTop: 4 }} />
                              <Text weight='normal' size='$sm' style={{ marginLeft: 8, width: '100%' }}>doctor@gmail.com</Text>

                            </Row>
                            <Card.Divider />

                          </Box>
                        </Grid>
                      </Grid.Container>

                    </Grid>

                    <Card.Divider />
                  </Grid.Container>

                </Grid>
              </Grid.Container>
            </Card.Body>

          </Card>
        </Grid>
        <Grid item xs={12} md={4} style={{ height: 200, marginTop: -200 }}>
          <Card sx={{ borderRadius: '40px' }}>
            <CardHeader
              title='Availability'
              titleTypographyProps={{ sx: { lineHeight: '1.2 !important', letterSpacing: '0.31px !important' } }}

            />
            <CardContent sx={{ pt: theme => `${theme.spacing(2)} !important` }}>

              <Box

                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >

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
                      <Typography sx={{ mr: 0.5, fontWeight: 400, letterSpacing: '0.25px' }}>Sunday-Thursday</Typography>

                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {/* <Avatar
                      squared
                      size="xs"
                      icon={<TimerIcon />} /> */}

                    </Box>

                  </Box>
                  <Box sx={{ display: 'flex', textAlign: 'end', flexDirection: 'column' }}>
                    <Typography color='teal' sx={{ fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.72, letterSpacing: '0.22px' }}>
                      10 am - 16 am
                    </Typography>

                  </Box>
                </Box>
              </Box>

              <Box

                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: 8,
                  gap: 6,
                }}
              >

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
                      <Typography sx={{ mr: 0.5, fontWeight: 600, letterSpacing: '0.25px' }}>Rating</Typography>

                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {/* <Avatar
      squared
      size="xs"
      icon={<TimerIcon />} /> */}

                    </Box>

                  </Box>
                  <Box sx={{ display: 'flex', textAlign: 'end', flexDirection: 'column' }}>
                    <Rating
                      name="simple-controlled"
                      value={value}
                      onChange={(event, newValue) => {
                        setValue(newValue)
                      }}
                    />


                  </Box>
                </Box>
              </Box>

            </CardContent>
          </Card>

        </Grid>
      </Grid.Container>
    </ApexChartWrapper>
  )
}

export default DoctorDetail
