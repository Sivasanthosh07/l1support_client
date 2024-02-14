import React from 'react'
import { Fab } from "@mui/material";
import HelpIcon from '@mui/icons-material/Help';

const AskQuestionButton = ({askQuestionButtonHandller}) => {

  const onAskQuestionHandller = () => {
    askQuestionButtonHandller();
  }

  return (
    <>
      <Fab variant="extended" color='primary' style={{width: "100%", height: "65%", fontSize: "100%", borderRadius:"3px"}} onClick={onAskQuestionHandller}>
        <HelpIcon sx={{ mr: 1 }}/>
        Ask Question
      </Fab>
    </>
  )
}

export default AskQuestionButton