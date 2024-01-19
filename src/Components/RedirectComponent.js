import React, {useEffect} from 'react'
import { Grid } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const Redirect_URL = `https://dev-09479545.okta.com/oauth2/v1/authorize?client_id=0oadejctyniwNdgOB5d7&response_type=id_token token&response_mode=fragment&scope=openid okta.users.manage okta.groups.read okta.logs.read&redirect_uri=http://localhost:3000/callback&nonce=UBGW&state=1234`

const RedirectComponent = () => {
  
  useEffect(() => {
    
    window.location.replace(Redirect_URL);
    
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