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
