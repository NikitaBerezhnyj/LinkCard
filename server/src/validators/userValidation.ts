import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

export const validateRegistration = (data: {
  username: string;
  email: string;
  password: string;
}) => {
  const schema = Joi.object({
    username: Joi.string().required().label("Username"),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password")
  });
  return schema.validate(data);
};

export const validateLogin = (data: { email: string; password: string }) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password")
  });
  return schema.validate(data);
};

export const validatePassword = (password: string) => {
  const schema = passwordComplexity();
  return schema.validate(password);
};
