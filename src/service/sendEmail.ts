import { ErrorHandler } from "@/http/middleware/errorResponse";
import nodemailer from "nodemailer";

export class SendEmailToken {
  async send(email: string, token: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST,
      port: parseInt(process.env.NODEMAILER_HOST as string),
      secure: true,
      auth: {
        user: process.env.NODEMAILER_AUTH_USER,
        pass: process.env.NODEMAILER_AUTH_PASS,
      },
    });

    await transporter
      .sendMail({
        from: process.env.NODEMAILER_AUTH_USER,
        to: email,
        subject: "Verificação de posse de e-mail",
        text: `Esse é seu token de validação: ${token}`,
        html: `<p>Esse é seu token de validação: ${token}</p>`,
      })
      .then(() => console.log("E-mail enviado com sucesso"))
      .catch((error) => {
        if (error) {
          new ErrorHandler(400, "Email sending failed, please try again");
        }
      });
  }
}
