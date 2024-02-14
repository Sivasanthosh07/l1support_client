import React, {useContext} from 'react';
import { AppBar, Box, Toolbar, Typography, Tooltip, IconButton, Avatar } from '@mui/material';
import { AuthContext } from "../../App";
import CustomButton from '../Main/CustomButton';
import { UserAPI } from '../UserAPI';

function Navbar() {
  const {userInfo, access_token, id_token} = useContext(AuthContext)
  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }

  const handleLogout = () => {
      UserAPI.logout(access_token).then(res=> {
        window.location.replace(`${process.env.REACT_APP_OKTA_DOMAIN_URL}/oauth2/v1/logout?id_token_hint=${id_token}&post_logout_redirect_uri=http://localhost:3000/`)
      })
      .catch(err => console.log(err))    
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" sx={{ backgroundColor: "white" }}>
          <Toolbar>
            <Typography variant='h4' color={'#24305E'} style={{ textTransform: "none"}} sx={{ typography: { sm: 'h4', xs: 'h5' } }}>
              <strong>HelpDesk Insights</strong>
            </Typography>
            <Box sx={{flexGrow: 1}}/>
            
            <Box><CustomButton size='small' onClick={handleLogout}>Logout</CustomButton></Box>
            <Tooltip title={userInfo?.email}>
              <IconButton
                size="small"
                sx={{ ml: 2 }}
                aria-haspopup="true"
              >
                {userInfo?.userName && <Avatar sx={{ width: 32, height: 32 }} {...stringAvatar(`${userInfo?.userName}`)}/>}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
    </Box>
  )
}

export default Navbar