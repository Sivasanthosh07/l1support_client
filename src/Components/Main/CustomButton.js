import { Button } from '@mui/material'
import React from 'react'

const CustomButton = (props) => {

  const {disabled, onClick, children, sx, style, size='large'} = props

  return (
    <Button
      variant='contained'
      size={size}
      disabled={disabled}
      style={{
        width: "100%",
        height: "50px",
        fontSize: "100%",
        ...style
      }}
      sx={{...sx}}
      onClick={()=>onClick()}
    >{children}</Button>
  )
}

export default CustomButton