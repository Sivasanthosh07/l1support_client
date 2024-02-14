import React, {useEffect} from 'react'
import { Grid } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const RedirectComponent = () => {
  
  useEffect(() => {
    console.log()
    window.location.replace(process.env.REACT_APP_OKTA_REDIRECT_URL);
    
  }, [])

  return (
    <div style={{minHeight:"100vh", backgroundColor:"white"}}>
      <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      >  
        <Grid item xs={12} md={6} sm={6} lg={6} sx={{justifyContent:"center", alignItems:"center", display:"flex"}}> 
          <CircularProgress />
        </Grid>
      </Grid>
    </div>
  )
}

export default RedirectComponent