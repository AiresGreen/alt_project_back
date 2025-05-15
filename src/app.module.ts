import {Module} from '@nestjs/common';
import {PrismaModule} from "../prisma/prisma.module";
import {UsersModule} from './users/users.module';
import {AuthModule} from "./auth/auth.module";
import {LanguagesModule} from "./languages/languages.module";
import {MailerModule} from '@nestjs-modules/mailer';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import {join} from 'path';
import {OfferModule} from "./offer/offer.module";
import {HomeModule} from "./home/home.module";
import {EducationModule} from "./education/education.module";
import {ExperienceModule} from "./experience/experience.module";
import {HobbiesModule} from "./hobbies/hobbies.module";
import {ProjectsModule} from "./projects/projects.module";
import {SkillsModule} from "./skills/skills.module";
import {EntrepriseModule} from "./entreprise/entreprise.module";
import {FavoriteModule} from "./favorite/favorite.module";
import {FollowModule} from "./follow/follow.module";
import {ProfileModule} from "./profile/profile.module";
import { UsefulInfoModule } from './useful-info/useful-info.module';


@Module({
    imports: [PrismaModule,
        SkillsModule,
        ProjectsModule,
        HobbiesModule,
        ExperienceModule,
        EducationModule,
        UsersModule,
        AuthModule,
        LanguagesModule,
        HomeModule,
        OfferModule,
        EntrepriseModule,
        FavoriteModule,
        FollowModule,
        UsefulInfoModule,
        ProfileModule,
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
        }),
        UsefulInfoModule
    ],

})
export class AppModule {
}
