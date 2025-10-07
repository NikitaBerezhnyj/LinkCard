import axios from "axios";

const API_URL = "http://192.168.0.106:3001/api";

interface UserData {
  username: string;
  email: string;
  password: string;
}

interface Credentials {
  email: string;
  password: string;
}

interface ILink {
  title: string;
  url: string;
}

interface IStyles {
  font: string;
  text: string;
  button: string;
  contentBackground: string;
  border: string;
  background: {
    type: string;
    value: {
      color: string;
      gradient: {
        start: string;
        end: string;
      };
      image: string;
    };
  };
}

interface ResponseData {
  token?: string;
  message?: string;
  user?: {
    id: string;
    username: string;
    email: string;
    links: string[];
  };
  data?: {
    id: string;
    username: string;
    email: string;
    avatar: string;
    bio: string;
    links: ILink[];
    styles: IStyles;
  };
}

interface UpdatedUserData {
  username: string;
  email: string;
  avatar: string;
  bio: string;
  links: ILink[];
}

export const registerUser = async (userData: UserData): Promise<ResponseData> => {
  const response = await axios.post<ResponseData>(`${API_URL}/register`, userData);
  return response.data;
};

export const loginUser = async (credentials: Credentials): Promise<ResponseData> => {
  const response = await axios.post<ResponseData>(`${API_URL}/login`, credentials);
  return response.data;
};

export const sendPasswordResetEmail = async (email: string): Promise<ResponseData> => {
  const response = await axios.post<ResponseData>(`${API_URL}/password/forgot`, {
    email
  });
  return response.data;
};

export const resetPassword = async (token: string, newPassword: string): Promise<ResponseData> => {
  const response = await axios.post<ResponseData>(`${API_URL}/password/reset/${token}`, {
    password: newPassword
  });
  return response.data;
};

export const getUserInfo = async (userName: string): Promise<ResponseData> => {
  try {
    const response = await axios.get<ResponseData>(`${API_URL}/user/${userName}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

export const updateUser = async (userData: Partial<UpdatedUserData>): Promise<ResponseData> => {
  try {
    const response = await axios.put<ResponseData>(
      `${API_URL}/user/${userData.username}`,
      userData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error;
  }
};

export const deleteUser = async (username: string): Promise<ResponseData> => {
  try {
    const response = await axios.delete<ResponseData>(`${API_URL}/user/${username}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
