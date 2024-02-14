import axios from "axios";

export const UserAPI = {
  fetchUserInfo:(access_token)=>{
    return axios.get(`${process.env.REACT_APP_OKTA_DOMAIN_URL}/oauth2/v1/userinfo`, {
      redirect: 'follow',
      withCredentials: true,
      headers:{ 'Authorization' : `Bearer ${access_token}`, "Cookie" : 'DT=DI1piy4vsanQ-iAg5xm0G4L0A; JSESSIONID=ADDB6DE212B92F39EAD7BDE20DB90076; t=default'}
      })
  },
  getAccessToken:(auth_code)=>{
    return axios({
      method: 'post',
      url:`${process.env.REACT_APP_SERVER_DOMAIN_URL}/api/tokens`,
      headers:{
        'Content-Type': 'application/json',
      },
      data:{
         "Code": auth_code
      }
    })
  },
  fetchUserDetails: (enterEmail, access_token) =>{
    return axios
      .get(`${process.env.REACT_APP_SERVER_USER_URL}/${enterEmail}`, {
        redirect: "follow",
        headers: { Authorization: `Bearer ${access_token}` },
      })
  },
  fetchMFA:(enterEmail, access_token)=>{
    return axios
      .get(`${process.env.REACT_APP_SERVER_USER_URL}/${enterEmail}/mfa-factors`, {
        redirect: "follow",
        headers: { Authorization: `Bearer ${access_token}` },
      })
  },
  changePassword:(enterEmail, access_token)=>{
    return axios
      .post(
        `${process.env.REACT_APP_SERVER_USER_URL}/${enterEmail}/change-password`,
        {
          redirect: "follow",
        },
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      )
  },
  resetMFA:(enterEmail, factorID, access_token)=>{
    return axios
      .delete(
        `${process.env.REACT_APP_SERVER_USER_URL}/${enterEmail}/mfa-factors/${factorID}`,
        {
          redirect: "follow",
          headers: { Authorization: `Bearer ${access_token}` },
        }
      )
  },
  askQuestion:(enterQuestion)=>{
    return axios({
      method: "post",
      url: `${process.env.REACT_APP_SERVER_DOMAIN_URL}/ask_logs/`,
      headers: { "content-type": "application/json" },
      data: {
        question: enterQuestion,
      },
    })
  },
  logout:(access_token)=>{
    return axios({
        method: 'post',
        url: `${process.env.REACT_APP_SERVER_DOMAIN_URL}/api/tokens/revoke`,
        headers: {'content-type': 'application/json'}, 
        data: {
          'access_token': access_token
        }
      })
  }
}