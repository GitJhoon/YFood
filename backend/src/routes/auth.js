import express from "express";
import Client from "../database/mongodb.js";
import passport from "passport";
import LocalStrategy from "passport-local";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { ObjectId  } from "mongodb";
import { successResponse, notFoundResponse, errorResponse } from "../helpers/httpResponse.js";

const collectionName = "users";

passport.use(
  new LocalStrategy({ usernameField: "email" }, async (email, passwordUser, callback) => {      
      const user = await Client.db.collection(collectionName).findOne({ email: email });

      if (!user) {
	      return callback(null, false);
      }
      
      const saltBuffer = user.salt.buffer;
	  
	  crypto.pbkdf2(passwordUser, saltBuffer, 31000, 16, "sha256", (err, hashedPassword) => {
		
		if(err){
			return callback(err);
		}
		
		const userPasswordBuffer = Buffer.from(user.password.buffer);
		
		if(!crypto.timingSafeEqual(userPasswordBuffer, hashedPassword)){
			return callback(null, false);
		}
		
		const { password, salt, ...rest  } = user;
		
		return callback(null, rest);
	}) 
}));

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
	
	try{
		const checkUser = await Client.db.collection(collectionName).findOne({email: req.body.email});
		
		if(checkUser){
			return res.status(409).send({
				success: false,
				statusCode: 409,
				body: {
					text: "User already exist!"
				}
			});
		}

		const salt = crypto.randomBytes(16);

		crypto.pbkdf2(req.body.password, salt, 31000, 16, "sha256", async (error, hashedPassword) => {
			if(error){
				return res.status(500).send(errorResponse(error));
			}

			const result = await Client.db.collection(collectionName).insertOne({
				email: req.body.email,
				password: hashedPassword,
				salt: salt
			});
			
			if(result.insertedId){
				const user = await Client.db.collection(collectionName).findOne({
					_id: new ObjectId(result.insertedId)
				});
				
				const token = jwt.sign(user, "secret"); 
				
				return res.status(200).send(successResponse({ 
					text: "User registered correctly!", 
					token, user, 
					logged: true 
				}));
			};
		});
	}catch(error){
		console.error(error.message);
	}
});

authRouter.post("/login", async (req, res) => {
	passport.authenticate("local", (error, user) => {
		if(error){
			return res.status(500).send(errorResponse(error));
		}

		if(!user){
			return res.status(404).send(notFoundResponse("User or password incorrect!"));
		}

		const token = jwt.sign(user, "secret");

		return res.status(200).send(successResponse({
			 text: "User logged in correctly!",
			 token, 
			 user, 
			 logged: true 
			}));
	})(req, res);
});

export default authRouter;
