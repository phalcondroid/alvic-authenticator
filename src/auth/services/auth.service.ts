import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../repositories/auth.repository";
import { CreateUserRequest, ResendUserRequest } from "../contracts/createUser-request.interface";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { MailerService } from "@nestjs-modules/mailer";
import { mailerConfig } from "../config/auth.config";
import { UserEntity } from "../entities/user.entity";
import { AccountAlreadyExistException } from "../exceptions/account-already-exist.exception";
import { AccountDoNotExistException } from "../exceptions/account-do-not-exist.exception";
import { AccountDoNotVerifiedException } from "../exceptions/account-do-not-verified.exception";
import { AccountCredentialsException } from "../exceptions/account-credentials.exception";

@Injectable()
export class AuthService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly mailer: MailerService
  ) { }

  async getById(id: number) {
    return await this.repository.getById(id);
  }

  async getByUid(uid: string) {
    return await this.repository.getUserByUid(uid);
  }

  async doLogin(email: string, password: string): Promise<boolean> {
    const response = await this.repository.getUserByEmail(email);
    if (response.emailVerified !== true) {
      throw new AccountDoNotVerifiedException();
    }
    if (response) {
      if (response.password !== password) {
        throw new AccountCredentialsException();
      }
      return true;
    }
    return false;
  }

  async create(user: CreateUserRequest): Promise<UserEntity> {
    try {
      const userResponse: UserEntity = await this.repository.create(user);
      if (userResponse) {
        this.mailer.sendMail({
          to: userResponse.email,
          from: mailerConfig.from,
          subject: "Email Verification",
          template: "email-verification-template",
          context: {
            userName: userResponse.displayName,
            uid: userResponse.uid,
            baseUrl: process.env.BASE_URL
          },
        });
      }
      return userResponse;
    } catch (error) {
      throw new AccountAlreadyExistException();
    }
  }

  async resendEmail(request: ResendUserRequest): Promise<boolean> {
    try {
      const userResponse: UserEntity = await this.repository.getUserByEmail(
        request.email
      );
      if (userResponse) {
        this.mailer.sendMail({
          to: userResponse.email,
          from: mailerConfig.from,
          subject: "Email Verification",
          template: "email-verification-template",
          context: {
            userName: userResponse.displayName,
            uid: userResponse.uid,
            baseUrl: process.env.BASE_URL
          },
        });
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  async sendEmailResetPassword(email: string): Promise<boolean> {
    try {
      const userResponse: UserEntity = await this.repository.getUserByEmail(email);
      if (userResponse) {
        this.mailer.sendMail({
          to: userResponse.email,
          from: mailerConfig.from,
          subject: "Reset password request",
          template: "reset-password-template",
          context: {
            userName: userResponse.displayName,
            email: userResponse.email,
            uid: userResponse.uid,
            baseUrl: process.env.BASE_URL
          },
        });
        return true;
      }
    } catch (e) { }
    throw new AccountDoNotExistException();
  }

  async resetPassword(uid: string, old: string, newPass: string, confirm: string): Promise<string> {
    try {
      const exist: UserEntity = await this.repository.getUserByUid(uid);
      if (exist && exist.password === old && newPass === confirm) {
        exist.password = newPass;
        await exist.save();
        return "Password actualizado correctamente!";
      }
    } catch (e) { }
    return "Hubo un error al actualizar la contrasena!";
  }


  async verify(uid: string): Promise<string> {
    try {
      const exist: UserEntity = await this.repository.getUserByUid(uid);
      if (exist.emailVerified) {
        return "La cuenta ya ha sido verificada!";
      }
      const userResponse: UserEntity = await this.repository.verifyAccountCreation(uid);
      if (userResponse.emailVerified === true) {
        return "La cuenta ha sido verificada correctamente!";
      }
    } catch (e) { }
    return "Hubo un error al verificar el link de la cuenta!";
  }

  async deletionRequest(uid: string, pass: string): Promise<boolean> {
    try {
      const userResponse: UserEntity = await this.repository.getUserByUid(uid);
      if (userResponse && userResponse.password === pass) {
        this.mailer.sendMail({
          to: userResponse.email,
          from: mailerConfig.from,
          subject: "Email Verification",
          template: "email-verification-template",
          context: {
            userName: userResponse.displayName,
            uid: userResponse.uid,
            baseUrl: process.env.BASE_URL
          },
        });
      }
      return true;
    } catch (e) {
      return false;
    }
  }
}