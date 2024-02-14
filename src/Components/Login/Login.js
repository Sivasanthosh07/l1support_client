import React, {useContext} from 'react'
import { Fab, Grid, Typography, Paper } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import { AuthContext } from "../../App";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const error = useContext(AuthContext)
  const navigate = useNavigate()

  const onLogin = () => {
    navigate('/redirect') 
  }

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >  
      <Grid item xs={6} md={2} > 
      <Paper elevation={3} sx={{width:"100%", height:"100%", padding:"15%"}}>
        <Typography variant='h4' color={'#24305E'} style={{ textTransform: "none", marginBottom:"20%"}} sx={{ typography: { sm: 'h4', xs: 'h5' } }}>
          <strong>HelpDesk Insights</strong>
        </Typography>          
        <Fab variant="extended" color='primary' style={{width: "100%", height: "50px", fontSize: "100%", borderRadius:"3px"}} onClick={onLogin}>
          <LoginIcon sx={{ mr: 1 }}/>
          Login
        </Fab>
        <Typography variant='body1' color={"#F76C6C"} style={{marginTop:"10%"}}>{error.error}</Typography>
        </Paper>   
      </Grid>
    </Grid>
  )
}

export default Login