import {Module} from '@nestjs/common';
import {PrismaModule} from "../prisma/prisma.module";
import {UsersModule} from './users/users.module';
import {AuthModule} from "./auth/auth.module";
import {LanguagesModule} from "./languages/languages.module";
import {MailerModule} from '@nestjs-modules/mailer';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import {join} from 'path';


@Module({
    imports: [PrismaModule, UsersModule, AuthModule, LanguagesModule,
        MailerModule.forRootAsync({
            imports: undefined,
            useFactory: () => ({
                transport: {
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: 'vlad.kunitsyn.news@gmail.com',
                        pass: 'ywkk xjoh rwmf dlgl',
                    },
                },
                defaults: {
                    from: '"no-reply-BalanceTonJob.io" <noreply@balance-ton-job.fr>',
                },
                template: {
                  dir: join(__dirname + '/templates/confirm'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
        })
    ],

})
export class AppModule {}
