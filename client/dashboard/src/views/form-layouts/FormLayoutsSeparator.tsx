// ** React Imports
import { ChangeEvent, forwardRef, MouseEvent, useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import NoSsr from '@mui/material/NoSsr'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import Select, { SelectChangeEvent } from '@mui/material/Select'

// ** Third Party Imports

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import React from 'react'

interface State {
  password: string
  password2: string
  showPassword: boolean
  showPassword2: boolean
}

const CustomInput = React.forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} label='Birth Date' autoComplete='off' />
})

// ** Icons Imports
import { PROFILE_ROUTE } from 'src/configs/appRoutes'
import axios from 'axios'
import NextUILoadingComponent from 'src/layouts/components/loading'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'
import itLocale from 'i18n-iso-countries/langs/it.json'
import { TruckFlatbed } from 'mdi-material-ui'
import { DatePicker } from '@mui/lab'


countries.registerLocale(enLocale)
countries.registerLocale(itLocale)

const countryObj = countries.getNames("en", { select: "official" })
const countryArr = Object.entries(countryObj).map(([key, value]) => {
  return {
    label: value,
    value: key
  }
})

const FormLayoutsSeparator = ({ imageByte }) => {
  // ** States
  const [profileData, setProfileData] = useState<any>({
    city: "",
    country: "",
    email: "",
    firstName: "",
    lastName: "",
    gender: "",
    image: "",
    phone: "",
    state: "",
    street: "",
    username: "",
    description: "",
    facebookLink: "",
    birthDate: null,
    zipCode: "",
    accountId: null,
    addressId: null,
    profileId: null,
    userId: null

  })
  const [readMode, setReadMode] = useState<boolean>(TruckFlatbed)

  const [state, setState] = useState("")
  const [selectedCountry, setSelectedCountry] = useState<string[]>("")


  const selectCountryHandler = (event: SelectChangeEvent<string[]>) => {
    setSelectedCountry(event.target.value as string[])
  }



  const id = 1

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'))

    const headers = {
      Authorization: `Bearer ${userData.accessToken}` // Include the token in the Authorization header
    }

    const GetProfileDataList = async () => {
      await axios.get(PROFILE_ROUTE + "/" + id, { headers }).then((res) => {
        // setLoading(true);
        setProfileData(res.data)

      })

    }
    GetProfileDataList()



  }, [])

  const handleReadMode = (event) => {
    event.preventDefault()

    setReadMode(false)
  }






  if (!profileData) {
    return <NextUILoadingComponent />
  }

  async function handleSubmit(event) {
    event.preventDefault()

    profileData.image = imageByte

    const profileReq = JSON.stringify(profileData)
    const customConfig = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const result = await axios.patch(PROFILE_ROUTE + '/' + id + "/profile", profileReq, customConfig)
      .then((res) => console.log(res))
      .catch((error) => console.log(error))

    console.log(result)


  }

  // Handle Password


  const handleChange = (event) => {
    setProfileData({ ...profileData, [event.target.name]: event.target.value })

  }



  return (
    <NoSsr>
      <Card>
        <Divider sx={{ margin: 0 }} />
        <form >
          <CardContent>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <Typography variant='body2' sx={{ fontWeight: 600 }}>
                    1. Account Details
                  </Typography>
                  <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained' onClick={handleReadMode}>
                    Edit
                  </Button>
                </CardActions>

              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='Username' onChange={handleChange} InputProps={{ readOnly: readMode }} name='username' value={profileData.username} placeholder='carterLeonard' />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type='email' onChange={handleChange} InputProps={{ readOnly: readMode }} name='email' label='Email' value={profileData.email} placeholder='carterleonard@gmail.com' />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ marginBottom: 0 }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  2. Personal Info
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='First Name' onChange={handleChange} InputProps={{ readOnly: readMode }} name='firstName' value={profileData.firstName} placeholder='Leonard' />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='Last Name' onChange={handleChange} InputProps={{ readOnly: readMode }} name='lastName' value={profileData.lastName} placeholder='carterLeonard' />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id='form-layouts-separator-select-label'>Country</InputLabel>
                  <Select
                    label='Country'
                    defaultValue={profileData.country}
                    id='form-layouts-separator-select'
                    readOnly={readMode}
                    labelId='form-layouts-separator-select-label'
                    onChange={handleChange}

                  >
                    <MenuItem key={profileData.country} value={profileData.country} selected>{profileData.country}</MenuItem>

                    {!!countryArr?.length && countryArr.map(({ label, value }) => (
                      <MenuItem key={value} value={value}>{label}</MenuItem>
                    )

                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='State' onChange={handleChange} InputProps={{ readOnly: readMode }} name='state' value={profileData.state} placeholder='Gandaki' />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='City' onChange={handleChange} InputProps={{ readOnly: readMode }} name='city' value={profileData.city} placeholder='Pokhara' />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='Street' onChange={handleChange} InputProps={{ readOnly: readMode }} name='street' value={profileData.street} placeholder='Tole' />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='Phone no' onChange={handleChange} InputProps={{ readOnly: readMode }} name='phone' value={profileData.phone} placeholder='981111111' />
              </Grid>
            </Grid>
          </CardContent>
          <Divider sx={{ margin: 0 }} />
          {!readMode && <CardActions>
            <Button size='large' onClick={handleSubmit} type='submit' sx={{ mr: 2 }} variant='contained'>
              Submit
            </Button>
            <Button size='large' color='secondary' variant='outlined'>
              Cancel
            </Button>
          </CardActions>}

        </form>
      </Card>
    </NoSsr>
  )
}

export default FormLayoutsSeparator
