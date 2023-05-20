import { Typography, Button, Grid } from '@mui/material';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

<<<<<<< HEAD
function PageHeader( { title}) {
=======
function PageHeader( { title }) {
>>>>>>> main
  const user = {
    name: 'Catherine Pike',
    avatar: '/static/images/avatars/1.jpg'
  };


  return (
    <Grid container justifyContent="space-between"  paddingY={10} alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          {title}
        </Typography>
        <Typography variant="subtitle1">
          {user.name}, these are your recent {title}
        </Typography>
      </Grid>
      <Grid item>
        <Button
          sx={{ mt: { xs: 2, md: 0 } }}
          variant="contained"
          startIcon={<AddTwoToneIcon fontSize="small" />}
        >
          Create {title}
        </Button>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
