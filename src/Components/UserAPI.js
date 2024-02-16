import axios from "axios";

export const UserAPI = {
  getUserInfo:(access_token) => {
    return axios.get(`${process.env.REACT_APP_SERVER_DOMAIN_URL}/api/userinfo`, {
      redirect: 'follow',
      headers:{ 'Authorization' : `Bearer ${access_token}`}
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
  logout:(access_token, id_token, error='')=>{
    return axios({
        method: 'post',
        url: `${process.env.REACT_APP_SERVER_DOMAIN_URL}/api/tokens/revoke`,
        headers: {'content-type': 'application/json'}, 
        data: {
          'access_token': access_token
        }
      })
      .then(res => 
        window.location.replace(`${process.env.REACT_APP_OKTA_DOMAIN_URL}/oauth2/v1/logout?id_token_hint=${id_token}&post_logout_redirect_uri=http://localhost:3000/&state=${error}`)
      ).catch(err => console.log(err))
  }
}