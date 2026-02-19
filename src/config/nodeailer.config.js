import nodemailer from "nodemailer";

// create transport for nodemailer

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "",
    pass: "",
  },
  port: "",
});
