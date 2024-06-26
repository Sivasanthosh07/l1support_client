import { Button, Typography } from '@mui/material'
import React from 'react'

const CustomButton = (props) => {

  const {disabled, onClick, children, sx, style, size='large', endIcon} = props

  return (
    <Button
      variant='contained'
      size={size}
      disabled={disabled}
      style={{
        width: "100%",
        height: "50px",
        fontSize: "100%",
        // backgroundColor:"green",
        ...style
      }}
      endIcon={endIcon}
      sx={{...sx}}
      onClick={()=>onClick()}
    ><Typography style={{textTransform:'none'}}>{children}</Typography></Button>
  )
}

export default CustomButton