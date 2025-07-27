import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { Admin, User } from "../../generated/prisma";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(user: User) {
    const url = `${process.env.api_url}/api/users/activate/${user.activationLink}`; 
    console.log(url);

    await this.mailerService.sendMail({
      to: user.email,
      subject: "Welcome to InBook App!🙌",
      template: "./confirmation",
      context: {
        username: user.full_name,
        url,
      },
    });
  }

  async sendMailAdmin(admin: Admin) {
    const urlAdmin = `${process.env.api_url}/api/admins/activate/${admin.activationLink}`;
    console.log(urlAdmin);

    await this.mailerService.sendMail({
      to: admin.email,
      subject: "Welcome to Transport-Service App! (Admin's panel)👋",
      template: "./confirmationAdmin",
      context: {
        username: admin.full_name,
        urlAdmin,
      },
    });
  }
}
