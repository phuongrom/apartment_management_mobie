import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiService from "@/services/apiService";
import { transformUser } from "@/services/transform";
import { STORAGE_KEYS } from "@/constants/StorageKey";
const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = async () => {
    try {
      setLoading(true);
      const [accessToken, userData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER),
      ]);

      console.log("Loading auth state:", { accessToken, userData });

      if (accessToken) {
        apiService.setToken(accessToken);
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setCurrentUser(parsedUser);
        }
        setIsAuthenticated(true);
      }
    } catch (error) {
      await clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  const clearAuthData = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER,
        STORAGE_KEYS.IS_LOGIN,
      ]);
      apiService.setToken(null);
      setCurrentUser(null);
      setIsAuthenticated(false);
    } catch (error) {}
  };

  const login = async (username, password) => {
    let user = null;
    try {
      setLoading(true);
      const response = await apiService.login(username, password);
      console.log("Login response:", response);

      if (!response || !response.access) {
        throw new Error("Invalid login response");
      }

      const { access, refresh } = response;

      const storageData = [
        [STORAGE_KEYS.ACCESS_TOKEN, access],
        [STORAGE_KEYS.IS_LOGIN, "true"],
      ];

      if (refresh) {
        storageData.push([STORAGE_KEYS.REFRESH_TOKEN, refresh]);
      }

      if (access) {
        const rawUser = await apiService.getCurrentUser();
        user = transformUser(rawUser);
        const userString = JSON.stringify(user);
        storageData.push([STORAGE_KEYS.USER, userString]);
        setCurrentUser(user);
      }

      await AsyncStorage.multiSet(storageData);

      apiService.setToken(access);
      setIsAuthenticated(true);

      return { access, refresh, user };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await clearAuthData();
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    currentUser,
    loading,
    login,
    logout,
    setCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
