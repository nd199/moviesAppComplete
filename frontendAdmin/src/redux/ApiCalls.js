import axios from "axios";
import { authRequest, publicRequest, userRequest } from "../AxiosMethods";
import {
  addProductsFailure,
  addProductsStart,
  addProductsSuccess,
  deleteProductsFailure,
  deleteProductsStart,
  deleteProductsSuccess,
  fetchProductsFailure,
  fetchProductsStart,
  fetchProductsSuccess,
  updateProductsFailure,
  updateProductsStart,
  updateProductsSuccess,
} from "./ProductsRedux";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  fetchUsersFailure,
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUserByEmailFailure,
  fetchUserByEmailStart,
  fetchUserByEmailSuccess,
  fetchUserByPhoneNumberFailure,
  fetchUserByPhoneNumberStart,
  fetchUserByPhoneNumberSuccess,
  forgotPasswordFailure,
  forgotPasswordStart,
  forgotPasswordSuccess,
  loginFailure,
  loginStart,
  loginSuccess,
  registerFailure,
  registerStart,
  registerSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  verifyEmailStart,
  verifyEmailSuccess,
  verifyEmailFailure,
  verifyPhoneStart,
  verifyPhoneSuccess,
  verifyPhoneFailure,
  validateOtpStart,
  validateOtpSuccess,
  validateOtpFailure,
} from "./userSlice";

export const register = async (dispatch, adminInfo) => {
  dispatch(registerStart());
  try {
    const res = await authRequest.post("/admins", adminInfo);
    dispatch(registerSuccess(res.data));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      dispatch(registerFailure(error.response.data));
      throw error;
    } else {
      dispatch(registerFailure({ error: "an unexpected error occurred" }));
      throw new Error("An unexpected error occurred");
    }
  }
};


export const forgotPassword = async (dispatch, data) => {
  dispatch(forgotPasswordStart());
  try {
    const res = await publicRequest.put("/customers/${customerId}", data);
    dispatch(forgotPasswordSuccess(res.data));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      dispatch(forgotPasswordFailure(error.response.data));
      throw error;
    } else {
      dispatch(
        forgotPasswordFailure({ error: "an unexpected error occurred" })
      );
      throw new Error("An unexpected error occurred");
    }
  }
};

// Login
export const login = async (dispatch, userInfo) => {
  dispatch(loginStart());
  try {
    const res = await authRequest.post("/login", userInfo);
    dispatch(loginSuccess(res.data));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      dispatch(loginFailure(error.response.data));
      throw error;
    } else {
      dispatch(loginFailure({ error: "An unexpected error occurred" }));
      throw new Error("An unexpected error occurred");
    }
  }
};

// Fetch Products
export const fetchProducts = async (dispatch) => {
  dispatch(fetchProductsStart());
  try {
    const res = await publicRequest.get("/products");
    dispatch(fetchProductsSuccess(res.data));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      dispatch(fetchProductsFailure(error.response.data));
    } else {
      dispatch(fetchProductsFailure({ error: "An unexpected error occurred" }));
    }
  }
};

// Delete Product
export const deleteProduct = async (id, dispatch) => {
  dispatch(deleteProductsStart());
  try {
    await userRequest().delete(`/products/${id}`);
    dispatch(deleteProductsSuccess(id));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      dispatch(deleteProductsFailure(error.response.data));
    } else {
      dispatch(
        deleteProductsFailure({ error: "An unexpected error occurred" })
      );
    }
  }
};

// Update Product
export const updateProduct = async (id, product, dispatch) => {
  dispatch(updateProductsStart());
  try {
    const res = await userRequest().put(`/products/${id}`, product);
    dispatch(updateProductsSuccess({ id, product: res.data }));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      dispatch(updateProductsFailure(error.response.data));
    } else {
      dispatch(
        updateProductsFailure({ error: "An unexpected error occurred" })
      );
    }
  }
};

// Add Product
export const addProduct = async (product, dispatch) => {
  dispatch(addProductsStart());
  try {
    const res = await userRequest().post("/products", product);
    dispatch(addProductsSuccess(res.data));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      dispatch(addProductsFailure(error.response.data));
    } else {
      dispatch(addProductsFailure({ error: "An unexpected error occurred" }));
    }
  }
};

// Update User
export const updateUser = async (id, user, dispatch) => {
  dispatch(updateUserStart());
  try {
    const res = await userRequest().put(`/users/${id}`, user);
    dispatch(updateUserSuccess({ id, user: res.data }));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      dispatch(updateUserFailure(error.response.data));
    } else {
      dispatch(updateUserFailure({ error: "An unexpected error occurred" }));
    }
  }
};

// Delete User
export const deleteUser = async (id, dispatch) => {
  dispatch(deleteUserStart());
  try {
    await userRequest().delete(`/users/${id}`);
    dispatch(deleteUserSuccess(id));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      dispatch(deleteUserFailure(error.response.data));
    } else {
      dispatch(deleteUserFailure({ error: "An unexpected error occurred" }));
    }
  }
};

// Fetch Users
export const fetchUsers = async (dispatch) => {
  dispatch(fetchUsersStart());
  try {
    const res = await userRequest().get("/users");
    dispatch(fetchUsersSuccess(res.data));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      dispatch(fetchUsersFailure(error.response.data));
    } else {
      dispatch(fetchUsersFailure({ error: "An unexpected error occurred" }));
    }
  }
};

export const fetchUserByEmail = async (email, dispatch) => {
  dispatch(fetchUserByEmailStart());
  try {
    const res = await userRequest().get(`/customers/email`, email);
    dispatch(fetchUserByEmailSuccess(res.data));
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      dispatch(fetchUserByEmailFailure(error.response.data.message));
    } else {
      dispatch(fetchUserByEmailFailure("An unexpected error occurred"));
    }
    return null;
  }
};

export const fetchUserByPhoneNumber = async (phoneNumber, dispatch) => {
  dispatch(fetchUserByPhoneNumberStart());
  try {
    const res = await userRequest().get(`/customers/phone`, phoneNumber);
    dispatch(fetchUserByPhoneNumberSuccess(res.data));
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      dispatch(fetchUserByPhoneNumberFailure(error.response.data.message));
    } else {
      dispatch(fetchUserByPhoneNumberFailure("An unexpected error occurred"));
    }
    return null;
  }
};


export const verifyEmail = async (dispatch, email) =>{
  dispatch(verifyEmailStart());
  try{
    const res = await publicRequest.post("/verify/email", email);
    dispatch(verifyEmailSuccess(res.data.message));
    return res.data;
  }catch(error){
    if (axios.isAxiosError(error) && error.response) {
      dispatch(verifyEmailFailure(error.response.data.message));
    } else {
      dispatch(verifyEmailFailure("An unexpected error occurred"));
    }
    return null;
  }
}

export const validateOtp = async(dispatch, validateInfo) => {
  dispatch(validateOtpStart());
  try{
    const res = await publicRequest.post("/validate/Otp", validateInfo);
    dispatch(validateOtpSuccess(res.data.message));
    return res.data;
  }catch(error){
    if (axios.isAxiosError(error) && error.response) {
      dispatch(validateOtpFailure(error.response.data.message));
    } else {
      dispatch(validateOtpFailure("An unexpected error occurred"));
    }
    return null;
  }
}


export const verifyPhone = async (otp, dispatch) =>{
  dispatch(verifyPhoneStart());
  try{
    const res = await publicRequest.post("/verify/phone", otp);
    dispatch(verifyPhoneSuccess(res.data.message));
    return res.data;
  }catch(error){
    if (axios.isAxiosError(error) && error.response) {
      dispatch(verifyPhoneFailure(error.response.data.message));
    } else {
      dispatch(verifyPhoneFailure("An unexpected error occurred"));
    }
    return null;
  }
}