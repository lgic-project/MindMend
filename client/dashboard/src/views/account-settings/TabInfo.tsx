// ** React Imports
import { forwardRef, useEffect, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Radio from '@mui/material/Radio'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import FormLabel from '@mui/material/FormLabel'
import InputLabel from '@mui/material/InputLabel'
import RadioGroup from '@mui/material/RadioGroup'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { CardActions } from '@mui/material'
import { Box } from 'mdi-material-ui'
import axios from 'axios'
import { PROFILE_ROUTE } from 'src/configs/appRoutes'

const CustomInput = forwardRef((props, ref) => {
  return <TextField inputRef={ref} label='Birth Date' fullWidth {...props} />
})

const TabInfo = () => {
  // ** State
  const [date, setDate] = useState<Date | null | undefined>(null)
  const [readMode, setReadMode] = useState<boolean>(true);
  const [infoData, setInfoData] = useState<any>({
    city:"",
    country: "",
    email:"",
    firstName:"",
    lastName:"",
    gender:"",
    image:"",
    phone:"",
    state:"",
    street:"",
    username:"",
    description:"",
    facebookLink:"",
    birthDate: null,
    zipCode:"",
    accountId:null,
    addressId:null,
    profileId:null,
    userId:null

  });

  const id =1;

  useEffect(()=>{

    const GetProfileDataList = async ()=>{
       await axios.get(PROFILE_ROUTE+"/"+id).then((res)=>{
        // setLoading(true);
        setInfoData(res.data);

      });

    }
    GetProfileDataList();



  },[])

  async function handleSubmit(event){
    event.preventDefault();
    console.log(infoData)
     const profileReq = JSON.stringify(infoData);
   const customConfig = {
      headers: {
      'Content-Type': 'application/json'
      }
  };

    const result = await axios.patch(PROFILE_ROUTE + '/' + id+"/profile", profileReq,customConfig)
      .then((res) =>console.log(res))
      .catch((error)=> console.log(error));



  }


  const handleChange =(event)=>{
    setInfoData({...infoData, [event.target.name]: event.target.value})

  }

  const handleReadMode= (event) => {
    event.preventDefault();

    setReadMode(false);
    }

  return (
    <CardContent>
      <form>
        <Grid container spacing={7}>
        <CardActions >

          <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained' onClick={handleReadMode}>
            Edit
          </Button>
        </CardActions>
          <Grid item xs={12} sx={{ marginTop: 4.8 }}>
            <TextField
              fullWidth
              multiline
              label='Bio'
              minRows={2}
              name='description'
              InputProps={{readOnly:readMode}}
              placeholder='Bio'
              onChange={handleChange}
              defaultValue={infoData.description}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePickerWrapper>
              <DatePicker
                selected={infoData.birthDate}
                showYearDropdown
                showMonthDropdown
                name='birthDate'
                readOnly={readMode}
                id='account-settings-date'
                placeholderText='MM-DD-YYYY'
                customInput={<CustomInput />}
                onChange={handleChange}
              />
            </DatePickerWrapper>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Facebook'
              InputProps={{readOnly:readMode}}
              name='facebookLink'
              onChange={handleChange}
              placeholder='https://example.com/'
              defaultValue={infoData.facebookLink}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl>
              <FormLabel sx={{ fontSize: '0.875rem' }}>Gender</FormLabel>
              <RadioGroup row defaultValue={infoData.gender} name='gender'  aria-label='gender' onChange={handleChange}  disabled={readMode} name='account-settings-info-radio'>
                <FormControlLabel value='male' label='Male' control={<Radio />} />
                <FormControlLabel value='female' label='Female' control={<Radio />} />
                <FormControlLabel value='other' label='Other' control={<Radio />} />
              </RadioGroup>
            </FormControl>
          </Grid>
          {!readMode &&<Grid item xs={12}>
            <Button variant='contained' onClick={handleSubmit} sx={{ marginRight: 3.5 }}>
              Save Changes
            </Button>
            <Button type='reset' variant='outlined' color='secondary' onClick={() => setDate(null)}>
              Reset
            </Button>
          </Grid>}
        </Grid>
      </form>
    </CardContent>
  )
}

export default TabInfo
