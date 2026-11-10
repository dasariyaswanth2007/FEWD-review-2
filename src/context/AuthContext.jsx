import React, { createContext, useContext, useState, useEffect } from 'react';
import { getData, setData, removeData, normalizeRoleString, ADMIN_SECURITY_CODE, getNextId } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => getData('currentUser', null));

  useEffect(() => {
    if (currentUser) {
      setData('currentUser', currentUser);
    } else {
      removeData('currentUser');
    }
  }, [currentUser]);

  const login = ({ selectedRole, email, password, adminCode }) => {
    const normSelectedRole = normalizeRoleString(selectedRole);
    const trimmedEmail = String(email || '').trim();
    const rawPassword = String(password || '');
    const trimmedAdminCode = String(adminCode || '').trim();

    if (!normSelectedRole || !['user', 'artist', 'admin'].includes(normSelectedRole)) {
      return { success: false, error: 'Please select a valid Account Type (Buyer / User, Artist, or Admin).' };
    }

    if (!trimmedEmail || !rawPassword) {
      return { success: false, error: 'Please enter both Email/Username and Password.' };
    }

    const users = getData('users', []);
    const matchedUser = users.find((u) => {
      const emailMatch = u.email && u.email.toLowerCase() === trimmedEmail.toLowerCase();
      const nameMatch = u.name && u.name.toLowerCase() === trimmedEmail.toLowerCase();
      return (emailMatch || nameMatch) && u.password === rawPassword;
    });

    if (!matchedUser) {
      if (normSelectedRole === 'admin' && trimmedAdminCode !== ADMIN_SECURITY_CODE) {
        return { success: false, error: 'Invalid Admin credentials or Admin Security Code.' };
      }
      return { success: false, error: 'Invalid email/username or password. Please try again.' };
    }

    const userNormalizedRole = normalizeRoleString(matchedUser.role);
    if (userNormalizedRole !== normSelectedRole) {
      return {
        success: false,
        error: `Role mismatch: This account is registered as "${matchedUser.role}". Please select the correct login role.`
      };
    }

    if (normSelectedRole === 'admin') {
      if (trimmedAdminCode !== ADMIN_SECURITY_CODE) {
        return {
          success: false,
          error: 'Invalid Admin Security Code. Required for administrative access.'
        };
      }
    }

    setCurrentUser(matchedUser);
    return { success: true, user: matchedUser };
  };

  const signup = ({ name, email, password, role }) => {
    const trimmedName = String(name || '').trim();
    const trimmedEmail = String(email || '').trim().toLowerCase();
    const rawPassword = String(password || '');
    const normRole = normalizeRoleString(role) || 'user';

    if (!trimmedName || !trimmedEmail || !rawPassword) {
      return { success: false, error: 'All fields are required.' };
    }

    if (rawPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const users = getData('users', []);
    const exists = users.some((u) => u.email && u.email.toLowerCase() === trimmedEmail);
    if (exists) {
      return { success: false, error: 'An account with this email address already exists. Please login.' };
    }

    const avatarUrl = normRole === 'artist' ? '/images/avatar-artist.svg' : '/images/avatar-user.svg';

    const newUser = {
      id: getNextId(users),
      name: trimmedName,
      email: trimmedEmail,
      password: rawPassword,
      role: normRole,
      avatar: avatarUrl,
      createdAt: new Date().toISOString().slice(0, 10),
      ...(normRole === 'artist' ? {
        specialization: "Contemporary Art",
        bio: `Hello! I am ${trimmedName}, an artist showcasing fine art on ArtLoom.`
      } : {})
    };

    const updatedUsers = [...users, newUser];
    setData('users', updatedUsers);
    setCurrentUser(newUser);

    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const normalizedRole = currentUser ? normalizeRoleString(currentUser.role) : '';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        role: normalizedRole,
        login,
        signup,
        logout,
        isAdmin: normalizedRole === 'admin',
        isArtist: normalizedRole === 'artist',
        isUser: normalizedRole === 'user'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

