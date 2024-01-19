import React from 'react'
import { TextField, Fab } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress'
import CheckIcon from '@mui/icons-material/Check';

const SearchBar = ({enterEmail, validateEmail, success}) => {
  return (
    <TextField
      label="UserName"
      fullWidth
      // variant='standard'
      style={{ backgroundColor:"white",  borderColor:"#24305E" }}            
      InputProps={{
        style: { fontSize: 20, color:"#24305E", },
        endAdornment: (
          <InputAdornment position="end">
            {(enterEmail && !success) && <CircularProgress disableShrink size={25}/>}
            {success && <Fab
              color="success"
              size='small'  
              variant='string'                                    
            >
              <CheckIcon />
            </Fab>}
          </InputAdornment>
        ),
      }}
      InputLabelProps={{ style: { fontSize: 20 } }}
      value={enterEmail}
      onChange={validateEmail}
    /> 
  )
}

export default SearchBar