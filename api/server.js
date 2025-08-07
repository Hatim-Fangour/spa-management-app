import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config()
// Add to very top of your main file
process.removeAllListeners("warning");
// we import our routes we created before
// const userRoute = require("./routes/customers");
import authRoute from "./routes/auth.js";
import dashRoute from "./routes/dashboard.js";
import utilsRoute from "./routes/utils.js";
import customersRoute from "./routes/customers.js";
import appointmentsRoute from "./routes/calendar.js";
import servicesRoute from "./routes/services.js";
import employeesRoute from "./routes/employee.js";
// import verificationRoute from "./routes/verifyEmail.js";

// create our app object
const app = express();

// config dotenv
dotenv.config();

// app.use(cors());

// MiddleWares
app.use(express.json());

app.use(helmet());
app.use(morgan("common"));

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true })); // To handle URL-encoded form data
app.use(bodyParser.json()); // To handle JSON payloads
app.use(
  cors({
    origin: [
      // "https://hatim.digital.com","https://hatim.digital",
       "http://localhost:3000"
      ], // Replace with your frontend domain
    credentials: true,
  })
);



// for exepmles here :  we already use http://localhost/api/auth
// so for login, we should use /login in route file to get this complet url
// http://localhost/api/auth/login OR http://localhost/api/auth/register
app.use("/api/auth", authRoute);
app.use("/api/dash", dashRoute);
app.use("/api/utils", utilsRoute);
app.use("/api/customers", customersRoute);
app.use("/api/appointments", appointmentsRoute);
app.use("/api/services", servicesRoute);
app.use("/api/employees", employeesRoute);
// app.use("/api/verification", verificationRoute);

// listning to Port 8800
app.listen(process.env.PORT || 8800 , () => {
  console.log("BackEnd server is ready !!");
});
