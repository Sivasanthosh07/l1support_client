import React, {useEffect, useContext} from 'react'
import { AuthContext } from "./../App";

import { useNavigate } from "react-router-dom";
import { Grid } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { UserAPI } from './UserAPI';

const CallbackComponent = () => {

  const {setAccess_token, setId_token, setUserInfo, setError, userInfo} = useContext(AuthContext)
    
  const navigate = useNavigate()

  const fetchUserInfo = (access_token, id_token) => {
    // console.log(access_token)
    if(access_token){
      UserAPI.getUserInfo(access_token).then(res => {
        // console.log(res)
        if(res?.data?.role === 'ADMIN'){
          setUserInfo({userName: res?.data?.username, email: res?.data?.email});   
          navigate('/home')   
        }else if(res?.data?.role === 'USER'){
          // setError('Access is denied.') 
          UserAPI.logout(access_token, id_token, 'Access denied! You dont have permission to access the app. ')
        }
      })
      .catch(err => {
        setError('The access token is invalid') 
        navigate('/')       
      })
    }
  }

  const getAccessToken = (auth_code) =>{
    UserAPI.getAccessToken(auth_code).then(res => {
      setAccess_token(res.data.access_token);
      setId_token(res.data.id_token)
      fetchUserInfo(res.data.access_token, res.data.id_token)
    }).catch(error => {
      console.log(error)
    })
  }

  useEffect(() => {
    var url = window.location;

    const searchParams = new URLSearchParams(window.location.search);

    if(searchParams.has('code')){ 
      getAccessToken(searchParams.get('code'))  
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