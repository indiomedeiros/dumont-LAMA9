import { Request, Response } from "express";
import { UserBusiness } from "../bussines/UserBusiness";
import { UserInputDTO, LoginInputDTO } from "../bussines/entities/User";
import { IdGenerator } from "../bussines/service/IdGenerator";
import { HashManager } from "../bussines/service/HashManager";
import { Authenticator } from "../bussines/service/Authenticatior";
import { UserDatabase } from "../data/UserDatabase";

const userBusiness = new UserBusiness(
  new IdGenerator(),
  new HashManager(),
  new Authenticator(),
  new UserDatabase()
);

export class UserController {
  async signup(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;
      const input: UserInputDTO = {
        name,
        email,
        password,
        role,
      };

      const token = await userBusiness.createUser(input);
      res.status(200).send({ token });
    } catch (error) {
      res.status(error.statusCode || 400).send({ error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const {email, password} = req.body;
      const input: LoginInputDTO = {
        email,
        password
      };

      const token = await userBusiness.getUserByEmail(input);

      res.status(200).send({message: "User logged!", token})
    } catch (error) {
      res.status(error.statusCode || 400).send({ error: error.message });
    }
  }
}
