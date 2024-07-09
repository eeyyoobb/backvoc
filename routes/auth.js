import express from "express";
import { googleAuth,signin,signup,signout} from "../controllers/auth.js";

const router = express.Router();

//CREATE A USER
  router.post("/signup", signup)

//SIGN IN
  router.post("/signin", signin)

  router.post("/signout", signout)

//  //GOOGLE AUTH
 router.post("/google", googleAuth)


export default router;
