import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
    withCredentials: true,
  },
});


export const userData = async () => {
  try {
    const response = await api.get('/user/get', {
      withCredentials: true,
    });
    return response.data.data ;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};


export const logoutUser = async () => {
  try {
    const response = await api.post("/user/logout");
    return response.data;
  } catch (error) {
    console.error("Error logging out user:", error);
    throw error;
  }
};

// get user task list 

export const getUserTaskList = async () => {
  try {
    const response = await api.get('/user/task/getTask', {
      withCredentials: true,
    });
    return response.data.data ;
  } catch (error) {
    console.error('Error fetching user task list:', error);
    throw error;
  }
}