import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REACT_APP_API_BASE_URL } from "@/constants/env";

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: REACT_APP_API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    this.token = null;

    this.api.interceptors.request.use(
      async (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.log("API Error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });

        if (error.response?.status === 401) {
          try {
            const refreshToken = await AsyncStorage.getItem("refresh_token");
            if (refreshToken) {
              const newToken = await this.refreshToken(refreshToken);
              if (newToken) {
                const originalRequest = error.config;
                if (originalRequest) {
                  originalRequest.headers.Authorization = `Bearer ${newToken}`;
                  return this.api(originalRequest);
                }
              }
            }
          } catch (refreshError) {
            await this.clearTokens();
            throw new Error("Session expired. Please login again.");
          }
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  setToken(token) {
    this.token = token;
    if (token) {
      this.api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete this.api.defaults.headers.common.Authorization;
    }
  }

  async clearTokens() {
    this.setToken(null);
    await AsyncStorage.multiRemove(["access_token", "refresh_token"]);
  }

  handleError(error) {
    if (error.response) {
      const data = error.response.data;
      return new Error(data.detail || data.message || "Server error");
    }
    if (error.request) {
      console.log(error.request);
      return new Error("Network error. Please check your connection.");
    }
    return new Error(error.message || "An unexpected error occurred");
  }

  async refreshToken(refreshToken) {
    try {
      const response = await this.api.post("users/token/refresh/", {
        refresh: refreshToken,
      });
      const newToken = response.data.access;
      this.setToken(newToken);
      await AsyncStorage.setItem("access_token", newToken);
      return newToken;
    } catch (error) {
      throw error;
    }
  }

  async login(username, password) {
    try {
      console.log("Login request:", { username, password });
      const response = await this.api.post("users/login/", {
        username,
        password,
      });

      this.setToken(response.data.access);

      return response.data;
    } catch (error) {
      console.log("Hahahaaaa", error);

      throw this.handleError(error);
    }
  }

  async getCurrentUser() {
    try {
      const response = await this.api.get("users/current-user/");
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProfile({
    first_name,
    last_name,
    avatar,
    password,
    confirm_password,
    is_first_login,
  }) {
    try {
      const formData = new FormData();

      formData.append("first_name", first_name);
      formData.append("last_name", last_name);
      formData.append("password", password);
      formData.append("confirm_password", confirm_password);
      formData.append("is_first_login", is_first_login);

      if (avatar) {
        let uri = avatar;
        let name = "avatar.jpg";
        let type = "image/jpeg";

        if (uri.startsWith("content://")) {
          const fileInfo = await FileSystem.getInfoAsync(uri);
          uri = fileInfo.uri;
        }

        if (uri.startsWith("ph://")) {
          const asset = await MediaLibrary.getAssetInfoAsync(uri);
          uri = asset.localUri || asset.uri;
        }

        if (!uri.startsWith("file://")) {
          uri = "file://" + uri;
        }

        name = uri.split("/").pop() || "avatar.jpg";
        const extension = name.split(".").pop();
        type = `image/${extension === "jpg" ? "jpeg" : extension}`;

        formData.append("avatar", {
          uri,
          name,
          type,
        });
      }

      const response = await this.api.put("users/update/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async listApartments(page = 1) {
    try {
      const response = await this.api.get("apartments/list/", {
        params: { page },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async listParkings(page = 1) {
    try {
      const response = await this.api.get("parkings/list/", {
        params: { page },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createParkingCard(data) {
    try {
      const response = await this.api.post("/parkings/create/", data);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo thẻ xe:", error);
      throw error;
    }
  }

  async listLockerItems(page = 1) {
    try {
      const response = await this.api.get("/lockers/locker-items/", {
        params: { page },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async lockerDetail() {
    try {
      const response = await this.api.get("/lockers/locker/");
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async listComplaints(page = 1) {
    try {
      const response = await this.api.get("/complaints/list/", {
        params: { page },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createComplaint(newComplaint) {
    try {
      const response = await this.api.post("/complaints/create/", newComplaint);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async ComplaintById(id) {
    try {
      const response = await this.api.get(`/complaints/${id}/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout() {
    try {
      await this.clearTokens();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateComplaint(id, complaint) {
    try {
      const response = await this.api.put(
        `/complaints/${id}/update/`,
        complaint
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async listSurveys(page = 1) {
    try {
      const response = await this.api.get("/surveys/list/", {
        params: { page },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSurveyDetail(id) {
    try {
      const response = await this.api.get(`/surveys/${id}/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async submitSurveyResponse(surveyId, payload) {
    try {
      const response = await this.api.post(`/surveys/${surveyId}/response/`, payload);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export default new ApiService();
