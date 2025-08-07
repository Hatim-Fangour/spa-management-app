import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getRoleRedirect } from "../../utils/roleRedirects";
import { setCustomers } from "../customers/slices/customersSlice";
import { setAppointments } from "../calendar/slices/calendarSlice";
import { setEmployees } from "../employees/slices/employeesSlice";
import { loadAllData } from "../../app/dataThunks";
import { FcGoogle } from "react-icons/fc";
import { validateRegister } from "../../utils/validators";
import { Grid, IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  googleSignIn,
  loginUser,
  registerUser,
} from "../auth/thunks/authThunks";
import { initRegisterData } from "../auth/utils/authUtils";

const AuthPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [formData, setFormData] = useState(initRegisterData);
  const [errors, setErrors] = useState({});

  const { user, claims} = useSelector(
    (state) => state.auth || {}
  );

  const handleToggleLogin = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: "",
      password: "",
      fullName: "",
      isGoogleLogin: false,
    });
  };

  useEffect(() => {
    
    if (user && claims === 111) {
      navigate("/newuser");
    }
  }, [user, claims, navigate]);

  const handleGoogleSignIn = async () => {
    setFormData({ isGoogleLogin: true });
    try {
      // Dispatch Google sign-in action
      const resultAction = await dispatch(googleSignIn());

      if (googleSignIn.fulfilled.match(resultAction)) {
        const { customers, appointments, employees } = resultAction.payload;

        // Update all slices
        dispatch(setCustomers(customers.data));
        dispatch(setAppointments(appointments.data));
        dispatch(setEmployees(employees.data));

        await dispatch(loadAllData()).unwrap();

        // Redirect based on role
        if (resultAction.payload.customClaims?.role) {
          navigate(getRoleRedirect(resultAction.payload.customClaims.role));
        } else {
          navigate("/"); // Default redirect
        }
      }
    } catch (error) {
      // Show error to user
      alert(error.payload?.message || "Google sign-in failed");
    }
    return; // Exit after handling Google login
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginWithPasswordAndRegister = async (e) => {
    e.preventDefault();
    if (isLogin) {
      try {
        // Email/password login
        const resultAction = await dispatch(loginUser(formData));
      

        if (loginUser.fulfilled.match(resultAction)) {
          const { customers, appointments, employees, auth } =
            resultAction.payload;
          if (auth.user.role !== 111) {
            // Update all slices
            dispatch(setCustomers(customers.data));
            dispatch(setAppointments(appointments.data));
            dispatch(setEmployees(employees.data));

            await dispatch(loadAllData()).unwrap();
          }
        }

      } catch (error) {
        // Show error to user
        alert(error.message || "Login failed");
      }
    } else {
      try {
        const { isValid, errors } = validateRegister(formData);
        if (!isValid) {
          throw {
            code: 400,
            message: "Validation failed",
            details: errors,
          };
        }
      } catch (error) {
        setErrors(error);
        return;
      }
      try {
        // Registration
        const resultAction = await dispatch(registerUser(formData));
        setErrors({});
        // await resultAction
        // Optionally auto-login after registration
        navigate("/auth");
        handleToggleLogin();
      } catch (error) {
        // Show error to user
        alert(error.message || "Registration failed");
      }
    }
  };

  const handleClickShowPassword = (name) => {
    setShowPassword((prev) => ({
      ...prev,
       [name]: !prev[name],
    }));
  };


  return (
    <div className="min-h-screen  flex flex-col justify-center py-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? "Sign in to your account" : "Create a new account"}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form className="space-y-4">
            <Grid container spacing={2}>
              {!isLogin && (
                <>
                  <Grid item xs={12} sm={12} size={12}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={formData.firstName || ""}
                      name="firstName"
                      error={!!errors?.details?.firstName}
                      onChange={(e) => {
                        handleChange(e);
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          details: {
                            ...prevErrors.details,
                            firstName: null,
                          },
                        }));
                      }}
                      size="small"
                      required
                      // error={!!errors?.details?.name}
                      sx={{
                        ".MuiInputBase-root": {
                          borderRadius: "30px",
                          width: "100%",
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} size={12}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={formData.lastName || ""}
                      name="lastName"
                      size="small"
                      error={!!errors?.details?.lastName}
                      onChange={(e) => {
                        handleChange(e);
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          details: {
                            ...prevErrors.details,
                            lastName: null,
                          },
                        }));
                      }}
                      required
                      // error={!!errors?.details?.name}
                      sx={{
                        ".MuiInputBase-root": {
                          borderRadius: "30px",
                          width: "100%",
                        },
                      }}
                    />
                  </Grid>
                </>
              )}

              {/* Email */}
              <Grid item xs={12} sm={12} size={12}>
                <TextField
                  fullWidth
                  label="Email"
                  value={formData.email || ""}
                  name="email"
                  error={!!errors?.details?.email}
                  size="small"
                  onChange={(e) => {
                    handleChange(e);
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      details: {
                        ...prevErrors.details,
                        email: null,
                      },
                    }));
                  }}
                  required
                  type="email"
                  // error={!!errors?.details?.name}
                  sx={{
                    ".MuiInputBase-root": {
                      borderRadius: "30px",
                      width: "100%",
                    },
                  }}
                />
              </Grid>

              {/* Password */}
              <Grid item xs={12} sm={12} size={12}>
                <TextField
                  fullWidth
                  label="Password"
                  value={formData.password || ""}
                  name="password"
                  error={!!errors.details?.password}
                  // helperText={errors?.details?.password || ""}
                  size="small"
                  onChange={(e) => {
                    handleChange(e);
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      details: {
                        ...prevErrors.details,
                        password: null,
                      },
                    }));

                    setShowPassword(e.target.name); // Reset password visibility
                    // setShowConfirmPassword(false); // Reset password visibility
                  }}
                  required
                  type={showPassword.password ? "text" : "password"}
                  // error={!!errors?.details?.name}
                  sx={{
                    ".MuiInputBase-root": {
                      borderRadius: "30px",
                      width: "100%",
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={(e) => handleClickShowPassword("password")}
                          edge="end"
                        >
                          {showPassword.password ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Confirm password */}
              {!isLogin && (
                <Grid item xs={12} sm={12} size={12}>
                  <TextField
                    fullWidth
                    label="Confirm password"
                    value={formData.confirmPassword || ""}
                    name="confirmPassword"
                    error={!!errors?.details?.confirmPassword}
                    // helperText={errors?.details?.confirmPassword || ""}
                    size="small"
                    onChange={(e) => {
                      handleChange(e);
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        details: {
                          ...prevErrors.details,
                          confirmPassword: null,
                        },
                      }));
                      setShowPassword(e.target.name); // Reset password visibility
                    }}
                    required
                    type={showPassword.confirmPassword ? "text" : "password"}
                    // error={!!errors?.details?.name}
                    sx={{
                      ".MuiInputBase-root": {
                        borderRadius: "30px",
                        width: "100%",
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={(e) =>
                              handleClickShowPassword("confirmPassword")
                            }
                            edge="end"
                          >
                            {showPassword.confirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              )}
            </Grid>

            <div>
              <button
                onClick={handleLoginWithPasswordAndRegister}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLogin ? "Sign in" : "Register"}
              </button>
              <button
                className="mt-4 w-full flex justify-center items-center gap-5 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm  text-blue-800 font-bold bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handleGoogleSignIn}
              >
                Sign in with Google
                <FcGoogle size={24} />
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {isLogin ? "New to us ?" : "Already have an account ?"}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleToggleLogin}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLogin ? "Create a new account" : "Sign in instead"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
