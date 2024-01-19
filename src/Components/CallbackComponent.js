import React, {useEffect, useContext} from 'react'
import { AuthContext } from "./../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Grid } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const CallbackComponent = () => {

    const {setAccess_token, setId_token, setUserInfo, setError, userInfo} = useContext(AuthContext)
  
  const navigate = useNavigate()

    const fetchUserInfo = (id_token, accessToken) => {
    setAccess_token(accessToken);
    setId_token(id_token)
    if(accessToken){
      axios.get(`https://dev-09479545.okta.com/oauth2/v1/userinfo`, {
      redirect: 'follow',
      withCredentials: true,
      headers:{ 'Authorization' : `Bearer ${accessToken}`, "Cookie" : 'DT=DI1piy4vsanQ-iAg5xm0G4L0A; JSESSIONID=ADDB6DE212B92F39EAD7BDE20DB90076; t=default'}
      })
      .then(res => {
        setUserInfo({userName: res.data.name, email: res.data.preferred_username});   
        navigate('/home')     
      })
      .catch(err => {
        setError('The access token is invalid') 
        navigate('/')       
      })
    }
  }

  useEffect(() => {
        var url = window.location;

    if(url.hash.match(/\#(?:id_token)\=([\S\s]*?)\&/) !== null){
      var access_token = new URLSearchParams(url.href).getAll("access_token")[0];
      fetchUserInfo(url.hash.match(/\#(?:id_token)\=([\S\s]*?)\&/)[1], access_token)
      
    }else{
      var err = new URLSearchParams(url.href).getAll("error")[0];
      setError(err)
      navigate('/')
    }
  
  }, [])
  
  return (
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
  )
}

export default CallbackComponent