import axios from "axios";
import { API_BASE_URL } from "../common/constants";

const frameToken = (token) => `Bearer ${token}`;

const frameResponse = (
  reqStatus = 0,
  reqPayLoad = "Invalid request. Please try again later."
) => {
  return {
    status: reqStatus,
    payLoad: reqPayLoad,
  };
};

export const signUpApi = async (
  firstName,
  lastName,
  username,
  phone,
  emailId,
  password
) => {
  let response = frameResponse();

  try {
    const url = `${API_BASE_URL}/user/signup`;
    const apiResponse = await axios.post(url, {
      firstName,
      lastName,
      username,
      phone,
      emailId,
      password,
    });
    if (apiResponse.status === 200) {
      response = frameResponse(1);
    }
  } catch (err) {
    if (err.response) {
      response = frameResponse(0, err.response.data.message);
    }
    console.log(err);
  } finally {
    return response;
  }
};

export const resetEmailLinkApi = async (emailId) => {
  let response = frameResponse();

  try {
    const url = `${API_BASE_URL}/user/reset/${emailId}`;
    const apiResponse = await axios.get(url);

    if (apiResponse.status === 200) {
      response = frameResponse(1);
    }
  } catch (err) {
    if (err.response) {
      response = frameResponse(0, err.response.data.message);
    }
    console.log(err);
  } finally {
    return response;
  }
};

export const loginApi = async (username, password) => {
  let response = frameResponse();
  try {
    const url = `${API_BASE_URL}/user/login`;
    const apiResponse = await axios.post(url, {
      username,
      password,
    });
    if (apiResponse.status === 200) {
      const payLoad = {
        token: apiResponse.headers.authorization,
        username: apiResponse.data.username,
      };
      response = frameResponse(1, payLoad);
    }
  } catch (err) {
    if (err.response) {
      response = frameResponse(0, err.response.data.message);
    }
  } finally {
    return response;
  }
};

export const verifyEmailApi = async (token) => {
  let response = frameResponse();

  try {
    const url = `${API_BASE_URL}/user/verify/email`;
    const headers = { Authorization: frameToken(token) };
    const apiResponse = await axios.get(url, { headers: headers });

    if (apiResponse.status === 200) {
      response = frameResponse(1, apiResponse.data);
    }
  } catch (err) {
    if (err.response) {
      response = frameResponse(0, err.response.data.message);
    }
    console.log(err);
  } finally {
    return response;
  }
};

// Calls a protected endpoint with the user's JWT.
// status: 1 = success, 0 = error, -1 = token expired/invalid (caller should log out)
const authRequest = async (method, path, token) => {
  let response = frameResponse();

  try {
    const apiResponse = await axios({
      method,
      url: `${API_BASE_URL}${path}`,
      headers: { Authorization: frameToken(token) },
    });
    response = frameResponse(1, apiResponse.data);
  } catch (err) {
    if (err.response) {
      const status = err.response.status;
      response = frameResponse(
        status === 401 || status === 403 ? -1 : 0,
        err.response.data?.message || "Something went wrong. Please try again."
      );
    }
    console.log(err);
  }
  return response;
};

export const getWeatherApi = (token, city) =>
  authRequest("get", `/weathers/${encodeURIComponent(city)}/true`, token);

export const getWeathersApi = (token) => authRequest("get", "/weathers", token);

export const getFavouriteCitiesApi = (token) =>
  authRequest("get", "/favouritecity", token);

export const addFavouriteCityApi = (token, cityId) =>
  authRequest("post", `/favouritecity/${cityId}`, token);

export const deleteFavouriteCityApi = (token, favouriteCityId) =>
  authRequest("delete", `/favouritecity/${favouriteCityId}`, token);
