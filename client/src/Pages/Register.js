import { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { registerUser } from "../Api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Clear previous errors

    try {
      const res = await registerUser(formData);
      console.log("Registration Successful", res.data);
      alert("Registration successful!"); // Optional: Show success message
    } catch (error) {
      console.error("Registration Failed", error.response?.data || error.message);
      setError(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToLogin = () => {
    navigate("/");
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h5" align="center" gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleSubmit}>
        {/* Username Field */}
        <TextField
          label="User Name"
          name="username"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
        />
        {/* Email Field */}
        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
        />
        {/* Password Field */}
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
        />
        {/* Error Message */}
        {error && (
          <Typography variant="body2" color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}
        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </Button>
        <Box mt={2}> 
        <Button 
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleNavigateToLogin}
        >
            Login
        </Button>
        </Box>
      </form>
    </Container>
  );
};

export default Register;