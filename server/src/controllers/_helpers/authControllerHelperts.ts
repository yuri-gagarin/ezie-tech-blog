export const trimRegistrationData = ({ email, password, confirmPassword }: { email: string; password: string; confirmPassword: string }) => {
  email = email.trim();
  password = password.trim();
  return {
    email, password 
  };
};