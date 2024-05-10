import React, { useState, useContext, Suspense } from "react";
import {
  Grid,
  TextField,
  Stack,
  Snackbar,
  Alert,
  Typography,
  Box,
  Grow,
  Divider,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import { green } from '@mui/material/colors';
import CircularProgress from "@mui/material/CircularProgress";
import validator from "validator";
import SearchBar from "./SearchBar";
import AskQuestionButton from "../Questions/AskQuestionButton";
import { AuthContext } from "../../App";
import CustomButton from "./CustomButton";
import { UserAPI } from "../UserAPI";

const Main = () => {
  const [enterEmail, setEnterEmail] = useState("");
  const [loginDetails, setLoginDetails] = useState();
  const [mfaList, setMfaList] = useState();
  const [message, setMessage] = useState();
  const [enterQuestion, setEnterQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [success, setSuccess] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isMFAVerifying, setIsMFAVerifying] = useState(false);
  const [mfaVerified, setMfaVerified] = useState(false);
  const [error, setError] = useState("");
  const { access_token } = useContext(AuthContext);

  const buttonSx = {
    ...(mfaVerified ? {
      backgroundColor: green[500],
      '&:hover': {
        backgroundColor: green[700],
      },
    } : {
      
    }),
  };

  const getLocalDateTime = (stamp) => {
    const date = new Date(stamp);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return (
      date.toLocaleDateString("en-GB", options) +
      ", " +
      date.toLocaleTimeString()
    );
  };

  const fetchDetailsHandller = () => {
    setIsFetched(true);
    UserAPI.fetchUserDetails(enterEmail, access_token).then((res) => {
      setLoginDetails(res?.data);
      setIsFetched(false);
      setShowDetails(true);
    })
      .catch((err) => console.log(err?.response?.data.message));

    // to fetch the MFA factors
    UserAPI.fetchMFA(enterEmail, access_token).then((res) => {
      setMfaList(res.data.factors);
    })
      .catch((err) => console.log(err));
  };

  const changePasswordHandller = () => {
    UserAPI.changePassword(enterEmail, access_token).then((res) => {
      setMessage({});
      setMessage({ message: res.data.message, status: res.data.status });
    })
      .catch((err) => console.log(err));
  };

  const verifyMFAHandller = (factorID) => {
    setIsMFAVerifying(true);
    setMfaVerified(false)
    UserAPI.verifyMFA(enterEmail, factorID, access_token).then((res) => {
      setMessage({});
      setIsMFAVerifying(false);
      if (res.data.status === 'success') setMfaVerified(true)
      setMessage({ message: res.data.message, status: res.data.status });
    })
      .catch((err) => console.log(err));
  }

  const resetMFAHandller = (factorID) => {
    UserAPI.resetMFA(enterEmail, factorID, access_token).then((res) => {
      setMessage({});
      setMessage({ message: res.data.message, status: res.data.status });
      const list = mfaList.filter((item) => item.factor_id !== factorID);
      setMfaList(list);
    })
      .catch((err) => console.log(err));
  };

  const validateEmail = (e) => {
    setIsFetched(false);
    setShowDetails(false);
    const email = e.target.value;
    setEnterEmail(email);

    if (validator.isEmail(email)) {
      setSuccess(true);
    } else {
      setLoginDetails({});
      setMfaList([]);
      setSuccess(false);
    }
  };

  const askQuestionHandller = (e) => {
    const question = e.target.value;
    setEnterQuestion(question);
  };

  const onAskQuestion = () => {
    setIsAnswering(true);
    UserAPI.askQuestion(enterQuestion, enterEmail).then((res) => {
      setAnswer("");
      setAnswer(res.data.result);
      setIsAnswering(false);
    })
      .catch((err) => {
        setIsAnswering(false);
        console.log(err)
        setError({ message: err.message });
      });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setMessage({});
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={1}
        sx={{
          paddingTop: { xs: "25%", sm: "15%", md: "10%", lg: "7%" },
          marginInline: "5%",
        }}
      >
        <Grid item xs={12} md={6}>
          <SearchBar
            enterEmail={enterEmail}
            success={success}
            validateEmail={validateEmail}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <CustomButton
            disabled={!success}
            onClick={fetchDetailsHandller}
            style={{ height: '60px' }}
          >
            Fetch Details
          </CustomButton>
        </Grid>
      </Grid>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={1}
        sx={{
          paddingTop: { xs: "none", sm: "none", md: "2%", lg: "2%" },
          marginInline: "5%",
        }}
      >
        <Grid item xs={12} sm={12} md={10}>
          <Divider />
        </Grid>
      </Grid>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
        spacing={1}
      >
        {!showDetails && isFetched && (
          <Stack
            direction="column"
            spacing={2}
            sx={{
              display: "flex",
              paddingTop: "10%",
              minHeight: "100%",
              minWidth: "100%",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "",
            }}
          >
            <CircularProgress />
          </Stack>
        )}
        <Grid item xs={12} md={4} sx={{ marginInline: "5%", marginTop: "3%" }}>
          {showDetails && (
            <CustomButton
              disabled={loginDetails?.risk_percentage >= 80}
              onClick={changePasswordHandller}
            >
              Change Password
            </CustomButton>
          )}
          {mfaList?.length > 0 && showDetails && (
            <Grow
              in={mfaList?.length > 0}
              style={{ transformOrigin: "0 0 0" }}
              timeout={mfaList?.length > 0 ? 500 : 0}
            >
              <Typography variant="caption">
                <strong>
                  <h2>User MFA Factors</h2>
                </strong>
              </Typography>
            </Grow>
          )}
          {mfaList?.length === 0 && showDetails && (
            <Grow
              in={mfaList?.length === 0}
              style={{ transformOrigin: "0 0 0" }}
              timeout={showDetails ? 500 : 0}
            >
              <Typography variant="caption">
                <strong>
                  <h2>User has not enrolled in any MFA Factors.</h2>
                </strong>
              </Typography>
            </Grow>
          )}
          {mfaList?.map((item, index) => {
            return (
              <Grow
                in={showDetails}
                style={{ transformOrigin: "0 0 0" }}
                timeout={showDetails ? 500 * (index + 1) : 0}
              >
                <Paper
                  key={item.factor_id}
                  elevation={3}
                  sx={{
                    width: "90%",
                    height: "10%",
                    padding: "5%",
                    marginBottom: "2%",
                  }}
                >
                  <Grid
                    container
                    direction="row"
                    spacing={2}
                    sx={{
                      display: "flex",
                      minHeight: "100%",
                      minWidth: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <Grid item>
                      <Stack
                        direction="column"
                        spacing={2}
                        sx={{
                          display: "flex",
                          minHeight: "25%",
                          minWidth: "25%",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Typography>
                          <strong>{item.factor_type.toUpperCase()}</strong>
                        </Typography>
                        <Typography>
                          <strong>{item.provider.toUpperCase()}</strong>
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item sx={{
                      display: "flex",
                      flexDirection:"column",
                          minHeight: "25%",
                          minWidth: "25%",
                          justifyContent: "flex-end",
                        }}>
                        {
                          (item.factor_type === "push") && (<CustomButton
                            disabled={loginDetails?.risk_percentage >= 80 || isMFAVerifying}
                            style={ {...buttonSx}}//{mfaVerified ? {backgroundColor:"green"}: {backgroundColor:"#1976d2"}}
                            sx={{ marginBlock: "10px", paddingInline: "20px", }}
                            onClick={() => verifyMFAHandller(item.factor_id)}
                            endIcon={isMFAVerifying ? <CircularProgress
                              size={24}
                              sx={{
                                color: green[500],
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                marginTop: '-12px',
                                marginLeft: '-12px',
                              }}
                            /> : null}
                          >
                            Verify MFA
                          </CustomButton>)
                        }                                                 
                        <CustomButton
                          disabled={loginDetails?.risk_percentage >= 80}
                          style={{width: "100%"}}
                          sx={{ marginBlock: "10px", paddingInline: "20px", }}
                          onClick={() => resetMFAHandller(item.factor_id)}
                        >
                          Reset MFA
                        </CustomButton>
                    </Grid>
                  </Grid>
                </Paper>
              </Grow>
            );
          })}
        </Grid>
        <Grid item xs={12} md={4} sx={{ marginInline: "5%", marginTop: "3%" }}>
          <Stack
            direction="column"
            spacing={2}
            sx={{
              display: "flex",
              minHeight: "100%",
              minWidth: "100%",
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            {showDetails && (
              <>
                <Grow
                  in={showDetails}
                  style={{ transformOrigin: "0 0 0" }}
                  timeout={showDetails ? 500 : 0}
                >
                  <Paper
                    elevation={3}
                    sx={{ width: "90%", height: "10%", padding: "5%" }}
                  >
                    <strong>Last Login:</strong>{" "}
                    {getLocalDateTime(loginDetails?.last_login)}
                  </Paper>
                </Grow>
                <Grow
                  in={showDetails}
                  style={{ transformOrigin: "0 0 0" }}
                  timeout={showDetails ? 1000 : 0}
                >
                  <Paper
                    elevation={3}
                    sx={{ width: "90%", height: "10%", padding: "5%" }}
                  >
                    <strong>Last Password Changed:</strong>{" "}
                    {getLocalDateTime(loginDetails?.last_password_changed)}
                  </Paper>
                </Grow>
                <Grow
                  in={showDetails}
                  style={{ transformOrigin: "0 0 0" }}
                  timeout={showDetails ? 1500 : 0}
                >
                  <Paper
                    elevation={3}
                    sx={{ width: "90%", height: "10%", padding: "5%" }}
                  >
                    <strong>Risk Percentage:</strong>{" "}
                    {loginDetails?.risk_percentage}%
                  </Paper>
                </Grow>
                <Grow
                  in={showDetails}
                  style={{ transformOrigin: "0 0 0" }}
                  timeout={showDetails ? 2000 : 0}
                >
                  <Paper
                    elevation={3}
                    sx={{ width: "90%", height: "10%", padding: "5%" }}
                  >
                    <strong>Reason:</strong> {loginDetails?.risk_reason}
                  </Paper>
                </Grow>
              </>
            )}
          </Stack>
        </Grid>
      </Grid>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="flex-end"
      >
        <Grid
          item
          xs={12}
          sm={12}
          md={10}
          justifyContent="center"
          alignItems="center"
          sx={{ marginInline: { md: "11.5%", sm: "5%" }, marginTop: "2%" }}
        >
          {showDetails && (
            <Grow
              in={showDetails}
              style={{ transformOrigin: "0 0 0" }}
              timeout={showDetails ? 2000 : 0}
            >
              <Paper elevation={3} sx={{ width: "100%" }}>
                <Typography
                  style={{
                    marginBottom: "1%",
                    paddingTop: "2%",
                    paddingLeft: "2%",
                  }}
                >
                  <strong>Ask a question</strong>
                </Typography>
                <Grid
                  container
                  direction="row"
                  spacing={2}
                  sx={{
                    display: "flex",
                    minHeight: "100%",
                    minWidth: "100%",
                    justifyContent: "space-between",
                    paddingInline: "2%",
                  }}
                >
                  <Grid item xs={8} md={10}>
                    <TextField
                      fullWidth
                      style={{ marginBottom: "2em" }}
                      InputProps={{
                        style: { fontSize: 20 },
                      }}
                      multiline
                      maxRows={2}
                      value={enterQuestion}
                      onChange={askQuestionHandller}
                    />
                  </Grid>
                  <Grid item xs={4} md={2}>
                    <AskQuestionButton
                      askQuestionButtonHandller={onAskQuestion}
                    />
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={12}
                  sx={{
                    width: "100%",
                    height: "10%",
                    paddingBottom: "2%",
                    paddingInline: "2%",
                  }}
                >
                  <Box style={{ height: "10%" }}>
                    {isAnswering && (
                      <Skeleton
                        variant="rounded"
                        height={50}
                        animation="wave"
                      />
                    )}
                    {!isAnswering && (
                      <Typography color='green'>
                        {!error?.message ? answer : <Typography color={"red"}>error.error</Typography>}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Paper>
            </Grow>
          )}
          <Snackbar
            open={message?.message?.length > 0}
            autoHideDuration={10000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={handleClose}
              severity={message?.status === "success" ? "success" : "error"}
              sx={{ width: "100%" }}
            >
              {message?.message}
            </Alert>
          </Snackbar>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Main;
