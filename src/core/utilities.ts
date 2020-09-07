import sgMail from '@sendgrid/mail';
import { ClientResponse } from '@sendgrid/client/src/response';

class Utilities {
  static async sendEmail(
    mailObj: object,
  ): Promise<{
    success: boolean;
    error?: any;
    mailResp?: [ClientResponse, {}];
  }> {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg: any = { from: process.env.EMAIL_FROM, ...mailObj };
    const mailResp = await sgMail.send(msg);
    return {
      success: true,
      mailResp,
    };
  }
}

export default Utilities;
