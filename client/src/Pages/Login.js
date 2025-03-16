import { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { loginUser } from "../Api";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData);
      console.log("Login Successful", res.data);
      navigate("/home", { state: {userData: res.data}});
      // Save token in local storage or context
    } catch (error) {
      console.error("Login Failed", error.response?.data || error.message);
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <Container maxWidth="xs">
    <Typography variant="h5" align="center" gutterBottom>
      Login
    </Typography>
    <form onSubmit={handleSubmit}>
      <TextField
        label="Email"
        name="email"
        fullWidth
        margin="normal"
        onChange={handleChange}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        fullWidth
        margin="normal"
        onChange={handleChange}
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Login
      </Button>

      {/* Add spacing between buttons */}
      <Box mt={2}>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={handleRegisterClick}
        >
          Register
        </Button>
      </Box>
    </form>
  </Container>
  );
};

export default Login;
