import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getStoredUsers,
  getStoredCurrentUser,
  setStoredCurrentUser,
  updateStoredUser,
} from "../services/storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadedUsers = getStoredUsers();
    setUsers(loadedUsers);
    const existing = getStoredCurrentUser();
    // Default to customer user if none set for immediate smooth browsing/testing, or null
    if (existing) {
      setUser(existing);
    } else {
      // Default to customer demo for smooth testing
      const defaultCust = loadedUsers.find((u) => u.role === "customer") || loadedUsers[0];
      setUser(defaultCust);
      setStoredCurrentUser(defaultCust);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const allUsers = getStoredUsers();
    const found = allUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!found) {
      return { success: false, message: "User not found with this email." };
    }
    if (found.password && found.password !== password) {
      return { success: false, message: "Incorrect password entered." };
    }

    setUser(found);
    setStoredCurrentUser(found);
    return { success: true, user: found };
  };

  const register = (data) => {
    const allUsers = getStoredUsers();
    const exists = allUsers.some(
      (u) => u.email.toLowerCase() === data.email.trim().toLowerCase()
    );
    if (exists) {
      return { success: false, message: "Account already exists with this email." };
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone || "+91 98000 00000",
      role: "customer",
      password: data.password || "password123",
      addresses: data.address
        ? [
            {
              id: `addr_${Date.now()}`,
              fullName: data.name,
              phone: data.phone,
              ...data.address,
              isDefault: true,
            },
          ]
        : [],
      createdAt: new Date().toISOString(),
    };

    allUsers.push(newUser);
    localStorage.setItem("saaj_db_users_v1", JSON.stringify(allUsers));
    setUsers(allUsers);
    setUser(newUser);
    setStoredCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    setStoredCurrentUser(null);
  };

  const switchAccount = (role) => {
    const allUsers = getStoredUsers();
    const target = allUsers.find((u) => u.role === role);
    if (target) {
      setUser(target);
      setStoredCurrentUser(target);
    }
  };

  const updateProfile = (name, phone, newPassword = "") => {
    if (!user) return { success: false, message: "Not logged in" };
    const updated = {
      ...user,
      name: name.trim() || user.name,
      phone: phone.trim() || user.phone,
    };
    if (newPassword && newPassword.trim().length >= 6) {
      updated.password = newPassword.trim();
    }
    updateStoredUser(updated);
    setUser(updated);
    return { success: true, message: "Profile updated successfully!" };
  };

  const addAddress = (addressData) => {
    if (!user) return;
    const newAddress = {
      id: `addr_${Date.now()}`,
      ...addressData,
      isDefault: user.addresses.length === 0 || addressData.isDefault,
    };

    let updatedAddresses = [...(user.addresses || [])];
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
    }
    updatedAddresses.push(newAddress);

    const updatedUser = { ...user, addresses: updatedAddresses };
    updateStoredUser(updatedUser);
    setUser(updatedUser);
    return newAddress;
  };

  const updateAddress = (addressId, addressData) => {
    if (!user) return;
    let updatedAddresses = (user.addresses || []).map((addr) => {
      if (addr.id === addressId) {
        return { ...addr, ...addressData };
      }
      if (addressData.isDefault) {
        return { ...addr, isDefault: false };
      }
      return addr;
    });

    const updatedUser = { ...user, addresses: updatedAddresses };
    updateStoredUser(updatedUser);
    setUser(updatedUser);
  };

  const deleteAddress = (addressId) => {
    if (!user) return;
    let updatedAddresses = (user.addresses || []).filter((a) => a.id !== addressId);
    if (updatedAddresses.length > 0 && !updatedAddresses.some((a) => a.isDefault)) {
      updatedAddresses[0].isDefault = true;
    }
    const updatedUser = { ...user, addresses: updatedAddresses };
    updateStoredUser(updatedUser);
    setUser(updatedUser);
  };

  const setDefaultAddress = (addressId) => {
    if (!user) return;
    const updatedAddresses = (user.addresses || []).map((a) => ({
      ...a,
      isDefault: a.id === addressId,
    }));
    const updatedUser = { ...user, addresses: updatedAddresses };
    updateStoredUser(updatedUser);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        loading,
        login,
        register,
        logout,
        switchAccount,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

