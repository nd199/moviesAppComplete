// Profile validation utilities

export const validateProfileForm = (formData) => {
  const errors = {};

  // Name validation
  if (!formData.name || formData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  } else if (formData.name.trim().length > 100) {
    errors.name = 'Name must not exceed 100 characters';
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !emailRegex.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Phone validation
  const phoneRegex = /^[0-9]{10}$/;
  if (!formData.phoneNumber || !phoneRegex.test(formData.phoneNumber.replace(/\D/g, ''))) {
    errors.phoneNumber = 'Phone number must be exactly 10 digits';
  }

  // Address validation
  if (formData.address && formData.address.length > 200) {
    errors.address = 'Address must not exceed 200 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validatePasswordForm = (passwordData) => {
  const errors = {};

  // Current password validation
  if (!passwordData.currentPassword || passwordData.currentPassword.length < 1) {
    errors.currentPassword = 'Current password is required';
  }

  // New password validation - Match backend exactly
  if (!passwordData.newPassword || passwordData.newPassword.length < 8) {
    errors.newPassword = 'Password must be between 8 and 128 characters';
  } else {
    // Check for password strength - Match backend pattern exactly
    const hasUpperCase = /[A-Z]/.test(passwordData.newPassword);
    const hasLowerCase = /[a-z]/.test(passwordData.newPassword);
    const hasNumbers = /\d/.test(passwordData.newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword);
    
    // Additional check: ensure password matches the complete pattern
    const fullPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,128}$/;
    const matchesFullPattern = fullPattern.test(passwordData.newPassword);

    if (!hasUpperCase) {
      errors.newPassword = 'Password must contain at least one uppercase letter';
    } else if (!hasLowerCase) {
      errors.newPassword = 'Password must contain at least one lowercase letter';
    } else if (!hasNumbers) {
      errors.newPassword = 'Password must contain at least one digit';
    } else if (!hasSpecialChar) {
      errors.newPassword = 'Password must contain at least one special character';
    } else if (passwordData.newPassword.length > 128) {
      errors.newPassword = 'Password must not exceed 128 characters';
    } else if (!matchesFullPattern) {
      errors.newPassword = 'Password format is invalid. Please check all requirements.';
    }
  }

  // Confirm password validation
  if (!passwordData.confirmPassword || passwordData.confirmPassword.length < 1) {
    errors.confirmPassword = 'Please confirm your new password';
  } else if (passwordData.newPassword !== passwordData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  // Check if new password is same as current
  if (passwordData.currentPassword === passwordData.newPassword) {
    errors.newPassword = 'New password must be different from current password';
  } else if (isPasswordTooSimilar(passwordData.currentPassword, passwordData.newPassword)) {
    errors.newPassword = 'New password is too similar to current password. Please choose a more different password.';
  }

  // Check if password might contain personal information (backend validation)
  if (passwordData.userName && containsPersonalInfo(passwordData.newPassword, passwordData.userName, passwordData.userEmail, passwordData.userPhone)) {
    errors.newPassword = 'Password must not contain personal information like your name, email, or phone number';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

const isPasswordTooSimilar = (currentPassword, newPassword) => {
  if (!currentPassword || !newPassword) return false;

  const current = currentPassword.toLowerCase();
  const newPass = newPassword.toLowerCase();

  let commonChars = 0;
  for (let char of newPass) {
    if (current.includes(char)) {
      commonChars++;
    }
  }

  const similarity = commonChars / newPass.length;
  return similarity > 0.5;
};

// Helper function to check if password contains personal information
const containsPersonalInfo = (password, name, email, phone) => {
  if (!password) return false;

  const passwordLower = password.toLowerCase();

  // Check name (split into parts)
  if (name) {
    const nameParts = name.toLowerCase().split(' ');
    for (let part of nameParts) {
      if (part.length >= 3 && passwordLower.includes(part)) {
        return true;
      }
    }
  }

  // Check email (before @)
  if (email) {
    const emailLocal = email.toLowerCase().split('@')[0];
    if (emailLocal.length >= 3 && passwordLower.includes(emailLocal)) {
      return true;
    }
  }

  // Check phone number (any sequence of 3+ digits)
  if (phone) {
    const phoneDigits = phone.replace(/\D/g, '');
    for (let i = 0; i <= phoneDigits.length - 3; i++) {
      const sequence = phoneDigits.substring(i, i + 3);
      if (password.includes(sequence)) {
        return true;
      }
    }
  }

  return false;
};

export const formatPhoneNumber = (phoneNumber) => {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Check if it's exactly 10 digits
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  return phoneNumber; // Return original if not 10 digits
};

export const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: 'Very Weak', color: '#ef4444' };

  let strength = 0;
  const checks = {
    length: password.length >= 8 && password.length <= 128,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  Object.values(checks).forEach(check => {
    if (check) strength++;
  });

  const strengthLevels = [
    { strength: 0, label: 'Very Weak', color: '#ef4444' },
    { strength: 1, label: 'Weak', color: '#f97316' },
    { strength: 2, label: 'Fair', color: '#eab308' },
    { strength: 3, label: 'Good', color: '#84cc16' },
    { strength: 4, label: 'Strong', color: '#22c55e' },
    { strength: 5, label: 'Very Strong', color: '#10b981' }
  ];

  return strengthLevels[strength] || strengthLevels[0];
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Export helper functions for reuse
export { isPasswordTooSimilar, containsPersonalInfo };
