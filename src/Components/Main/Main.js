import React, { useState, useContext } from "react";
import {
  Grid,
  TextField,
  Button,
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
import CircularProgress from "@mui/material/CircularProgress";
import validator from "validator";
import axios from "axios";
import SearchBar from "./SearchBar";
import AskQuestionButton from "../Questions/AskQuestionButton";
import { AuthContext } from "../../App";

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
  const [error, setError] = useState("");
  const { access_token } = useContext(AuthContext);

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
    axios
      .get(`http://127.0.0.1:5000/api/users/${enterEmail}`, {
        redirect: "follow",
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        setLoginDetails(res?.data);
        setIsFetched(false);
        setShowDetails(true);
      })
      .catch((err) => console.log(err?.response?.data.message));

    //to fetch the MFA factors
    axios
      .get(`http://127.0.0.1:5000/api/users/${enterEmail}/mfa-factors`, {
        redirect: "follow",
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        setMfaList(res.data.factors);
      })
      .catch((err) => console.log(err));
  };

  const changePasswordHandller = () => {
    axios
      .post(
        `http://127.0.0.1:5000/api/users/${enterEmail}/change-password`,
        {
          redirect: "follow",
        },
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      )
      .then((res) => {
        setMessage({});
        setMessage({ message: res.data.message, status: res.data.status });
      })
      .catch((err) => console.log(err));
  };

  const resetMFAHandller = (factorID) => {
    axios
      .delete(
        `http://127.0.0.1:5000//api/users/${enterEmail}/mfa-factors/${factorID}`,
        {
          redirect: "follow",
          headers: { Authorization: `Bearer ${access_token}` },
        }
      )
      .then((res) => {
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
    axios({
      method: "post",
      url: "http://127.0.0.1:5000/ask_logs/",
      headers: { "content-type": "application/json" },
      data: {
        question: enterQuestion,
      },
    })
      .then((res) => {
        setAnswer("");
        console.log(res.data)
        setAnswer(res.data.result[0]);
        setIsAnswering(false);
      })
      .catch((err) => {
        setIsAnswering(false);
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
          <Button
            variant="contained"
            size="large"
            disabled={!success}
            style={{
              width: "100%",
              height: "50px",
              fontSize: "100%",
              backgroundColor: "#F76C6C",
            }}
            onClick={fetchDetailsHandller}
          >
            Fetch Details
          </Button>
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
            <Button
              variant="contained"
              disabled={loginDetails?.risk_percentage >= 50}
              style={{
                width: "100%",
                height: "50px",
                fontSize: "100%",
                marginBlock: "10px",
                backgroundColor: "#F76C6C",
              }}
              onClick={changePasswordHandller}
            >
              Change Password
            </Button>
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
                          minHeight: "100%",
                          minWidth: "100%",
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
                    <Grid item>
                      <Button
                        variant="contained"
                        size="large"
                        style={{
                          width: "100%",
                          height: "50px",
                          fontSize: "100%",
                          marginBlock: "10px",
                          backgroundColor: "#F76C6C",
                        }}
                        disabled={loginDetails?.risk_percentage >= 50}
                        sx={{ marginBlock: "10px", paddingInline: "20px" }}
                        onClick={() => resetMFAHandller(item.factor_id)}
                      >
                        Reset MFA
                      </Button>
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
                      <Typography color={"black"}>
                        {!error?.message ? answer : error.message}
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
