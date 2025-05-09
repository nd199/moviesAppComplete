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
  loginFailure,
  loginStart,
  loginSuccess,
  registerFailure,
  registerStart,
  registerSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  validateOtpFailure,
  validateOtpStart,
  validateOtpSuccess,
  verifyEmailFailure,
  verifyEmailStart,
  verifyEmailSuccess,
  fetchCurrentStart,
  fetchCurrentSuccess,
  fetchCurrentFailure,
} from "./userSlice";

export const register = async (dispatch, adminInfo) => {
  dispatch(registerStart());
  try {
    const res = await authRequest.post("/admins", adminInfo);
    dispatch(registerSuccess(res.data));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      dispatch(registerFailure(error.response.data));
      console.log(error.response);
      throw error;
    } else {
      dispatch(registerFailure({ error: "an unexpected error occurred" }));
      throw new Error("An unexpected error occurred");
    }
  }
};

// Login
export const login = async (dispatch, userInfo) => {
  dispatch(loginStart());
  try {
    const res = await authRequest.post("/loginAdmin", userInfo);
    dispatch(loginSuccess(res.data));
    localStorage.setItem(
      "persist:root",
      JSON.stringify({
        user: JSON.stringify({
          currentUser: res.data,
          token: res.data.token,
        }),
      })
    );
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
    const res = await userRequest().get("/products/AllProducts");
    const products = [...res.data.movies, ...res.data.shows];
    dispatch(fetchProductsSuccess(products));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      dispatch(fetchProductsFailure(error.response.data));
    } else {
      dispatch(fetchProductsFailure({ error: "An unexpected error occurred" }));
    }
  }
};

// Delete Product
export const deleteProduct = async (id, type, dispatch) => {
  dispatch(deleteProductsStart());
  try {
    await userRequest().delete(`/products/${id}/${type}`);
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
export const updateProduct = async (dispatch, id, type, product) => {
  dispatch(updateProductsStart());
  try {
    const res = await userRequest().put(`/products/${id}/${type}`, product);
    dispatch(updateProductsSuccess({ id, type, product: res.data }));
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
  fetchProducts(dispatch);
};

// Update User
export const updateUser = async (dispatch, id, customer) => {
  dispatch(updateUserStart());
  try {
    const res = await userRequest().put(`/customers/${id}`, customer);
    dispatch(updateUserSuccess({ id, user: res.data }));
    return res.data;
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
    await userRequest().delete(`/customers/${id}`);
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
    const res = await userRequest().get("/customers");
    dispatch(fetchUsersSuccess(res.data));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      dispatch(fetchUsersFailure(error.response.data));
    } else {
      dispatch(fetchUsersFailure({ error: "An unexpected error occurred" }));
    }
  }
};

export const fetchCurrentAdminDetails = async (dispatch, email) => {
  dispatch(fetchCurrentStart());
  try {
    const res = await userRequest().get(`/customers/currentAdmin/${email}`);
    dispatch(fetchCurrentSuccess(res.data));
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      dispatch(fetchCurrentFailure(error.response.data));
    } else {
      dispatch(fetchCurrentFailure({ error: "An unexpected error occurred" }));
    }
  }
};

export const verifyEmail = async (dispatch, email) => {
  dispatch(verifyEmailStart());
  try {
    const res = await publicRequest.post("/verify/email", email);
    dispatch(verifyEmailSuccess(res.data.message));
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      dispatch(verifyEmailFailure(error.response));
      throw error;
    } else {
      dispatch(verifyEmailFailure("An unexpected error occurred"));
    }
    return null;
  }
};

export const validateOtp = async (dispatch, validateInfo) => {
  dispatch(validateOtpStart());
  try {
    const res = await publicRequest.post("/validate/Otp", validateInfo);
    dispatch(validateOtpSuccess(res.data));
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      dispatch(validateOtpFailure(error.response.data));
      throw error;
    } else {
      dispatch(validateOtpFailure("An unexpected error occurred"));
    }
    return null;
  }
};
