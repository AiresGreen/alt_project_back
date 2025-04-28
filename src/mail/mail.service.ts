import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService,
    ) {}

    async sendVerificationEmail(to: string, token: string) {
        const url = `http://localhost:3000/auth/verify-email?token=${token}`;
        await this.mailerService.sendMail({
            to,
            from: '"no-reply-BalanceTonJob.io" <noreply@balance-ton-job.fr>',
            subject: 'Confirme ton email',
            template: join(__dirname + '/templates/confirm'),
            context: {
                url: `http://localhost:3000/auth/verify-email?token=${token}`,
                email: to,
            },
        });
    }


}
