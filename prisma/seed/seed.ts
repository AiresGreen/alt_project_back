import {
    PrismaClient,
    profil,
    language,
    language_level_of_language,
    level,
    level_grade,
    question,
    answer,
    enterprise,
    survey,
    user,
    curriculum_vitae,
    $Enums,
    offer,
    application,
    user_has_language,
    user_has_offer,
    project,
    skill,
    hobby,
    useful_information,
    curriculum_vitae_has_language,
    curriculum_vitae_has_useful_information,
    curriculum_vitae_has_hobby,
    curriculum_vitae_has_skill,
    curriculum_vitae_has_project,
    curriculum_vitae_has_experience,
    curriculum_vitae_has_education,
    survey_has_answer,
    survey_has_question,
    question_has_answer,


} from '@prisma/client'
import {fakerFR, fakerFR as faker} from '@faker-js/faker'
import * as argon2 from 'argon2'
import {firstValueFrom} from "rxjs";
import {HttpService} from "@nestjs/axios";
import axios from 'axios';

type AuthResponse = {
    access_token: string;
    token_type: string;
    expires_in: number;
};

type JobOfferAPI = {
    intitule: string;
    description?: string;
    dateCreation?: string;
    entreprise?: { nom: string };
    lieuTravail?: { libelle: string };
    typeContratLibelle?: string;
};

type JobSearchResponse = {
    resultats: JobOfferAPI[];
};

const prisma = new PrismaClient()
const httpService = new HttpService();

// === Profil ===
async function seedProfil(n = 10): Promise<profil[]> {
    const profils: profil[] = []
    while (n) {
        const phone_number = faker.phone.number()
        const newProfil = await prisma.profil.upsert({
            where: {phone_number},
            update: {},
            create: {
                picture: faker.image.urlPicsumPhotos(),
                street: faker.location.street(),
                zip_code: faker.location.zipCode(),
                city: faker.location.city(),
                phone_number,
                created_at: faker.date.past(),
                updated_at: faker.date.recent()
            }
        })
        profils.push(newProfil)
        n--
    }
    return profils
}

// === Level ===
async function seedLevel() {
    const grades = [level_grade.admin, level_grade.pas_admin];
    const levels: level[] = []

    for (const grade of grades) {
        const newLevel = await prisma.level.upsert({
            where: {grade},
            update: {},
            create: {grade}
        });
        levels.push(newLevel)
    }
    return levels
}

// === User ===
async function seedUser(n = 10, profils: profil[], levels: level[]) {
    const users: user[] = []
    while (n) {
        const email = faker.internet.email()
        const newUser = await prisma.user.upsert({
            where: {email},
            update: {},
            create: {
                firstname: faker.person.firstName(),
                lastname: faker.person.lastName(),
                email,
                password:  await argon2.hash(faker.internet.password()),
                created_at: faker.date.past(),
                updated_at: faker.date.recent(),
                profil: {
                    connect: {id: faker.helpers.arrayElement(profils).id}
                },
                level: {
                    connect: {id: faker.helpers.arrayElement(levels).id}
                }
            }
        })
        users.push(newUser)
        n--
    }
    return users
}

// === CV ===
async function seedCurriculumVitae(n = 10, users: user[]) {
    const cvs: curriculum_vitae[] = []
    while (n) {
        const phone_number = faker.phone.number()
        const newCV = await prisma.curriculum_vitae.upsert({
            where: {phone_number},
            update: {},
            create: {
                photo: faker.image.urlPicsumPhotos(),
                lastname: faker.person.lastName(),
                firstname: faker.person.firstName(),
                mail: faker.internet.email(),
                street: faker.location.street(),
                zip_code: faker.location.zipCode(),
                city: faker.location.city(),
                phone_number,
                created_at: faker.date.past(),
                updated_at: faker.date.recent(),
                user: {
                    connect: {id: faker.helpers.arrayElement(users).id}
                }
            }
        })
        cvs.push(newCV)
        n--
    }
    return cvs
}

// === Language ===
 async function seedLanguage() {
         const apiKey = process.env.METADAPI_PRIMARY_KEY; // .env

         const response = await firstValueFrom(
             httpService.get('https://global.metadapi.com/lang/v1/languages', {
                 headers: {
                     'Ocp-Apim-Subscription-Key': apiKey,
                 },
             })
         );

         const data = response.data.data;
         const languages: language[] = []

         for (const lang of data) {
             await prisma.language.upsert({
                 where: {langEnglishName: lang.langEnglishName},
                 update: {},
                 create: {
                     langEnglishName: lang.langEnglishName,

                 },
             });
            languages.push(lang)
         }
         return languages;
     }

// === Question ===
     async function seedQuestion(n = 20) {
         const questions: question[] = []
         while (n) {
             const newQuestion = await prisma.question.create({
                 data: {
                     content: faker.lorem.sentence()
                 }
             })
             questions.push(newQuestion)
             n--
         }
         return questions
     }

// === Answer===
     async function seedAnswer(n = 20) {
         const answers: answer[] = []
         while (n) {
             const newAnswer = await prisma.answer.create({
                 data: {
                     content: faker.lorem.sentence()
                 }
             })
             answers.push(newAnswer)
             n--
         }
         return answers
     }

// === Enterprise ===
     async function seedEnterprise(n = 20) {
         const enterprises: enterprise[] = []
         while (n) {
             const newEnterprise = await prisma.enterprise.create({
                 data: {
                     name: faker.company.name(),
                     employees: faker.number.int({min: 1, max: 500}).toString(),
                     description: faker.company.catchPhrase()
                 }
             })
             enterprises.push(newEnterprise)
             n--
         }
         return enterprises
     }

// === Survey ===
     async function seedSurvey(n = 10) {
         const surveys: survey[] = []
         while (n) {
             const newSurvey = await prisma.survey.create({
                 data: {
                     message: faker.lorem.paragraph(),
                     question: faker.lorem.sentence(),
                     answer: faker.lorem.sentence()
                 }
             })
             surveys.push(newSurvey)
             n--
         }
         return surveys
     }

// === Offer ===

async function seedOfferFromFranceTravail(n = 10, users: user[], enterprises: enterprise[]) {
    const clientId = process.env.FRANCE_TRAVAIL_CLIENT_ID!;
    const clientSecret = process.env.FRANCE_TRAVAIL_CLIENT_SECRET!;

    // Auth
    const authResponse = await axios.post<AuthResponse>(
        'https://entreprise.pole-emploi.fr/connexion/oauth2/access_token?realm=/partenaire',
        new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret,
            scope: 'api_offresdemploiv2 o2dsoffre',
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const token = authResponse.data.access_token;

    // Offres
    const jobResponse = await axios.get<JobSearchResponse>(
        'https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search',
        {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                motsCles: 'développeur',
                departement: '75',
                range: `0-${n - 1}`,
            },
        }
    );

    const offers: offer[] = [];

    for (const o of jobResponse.data.resultats) {
        const offer = await prisma.offer.create({
            data: {
                title: o.intitule,
                description: o.description || '',
                publication_date: new Date(o.dateCreation || Date.now()),
                user: { connect: { id: faker.helpers.arrayElement(users).id } },
                enterprise: { connect: { id: faker.helpers.arrayElement(enterprises).id } },
            },
        });
        offers.push(offer);
    }

    return offers;
}

// === Application ===
     async function seedApplication(n = 10, users: user[], offers: offer[], cvs: curriculum_vitae[], surveys: survey[]): Promise<application[]> {
         const applications: application[] = []
         while (n) {
             const newApplication = await prisma.application.create({
                 data: {
                     send_date: faker.date.past(),
                     received_return: faker.helpers.maybe(() => faker.lorem.sentence(), {probability: 0.5}),
                     number_of_reminder: faker.number.int({min: 0, max: 5}),
                     user: {connect: {id: faker.helpers.arrayElement(users).id}},
                     offer: {connect: {id: faker.helpers.arrayElement(offers).id}},
                     curriculum_vitae: {connect: {id: faker.helpers.arrayElement(cvs).id}},
                     survey: {connect: {id: faker.helpers.arrayElement(surveys).id}}
                 }
             })
             applications.push(newApplication)
             n--
         }
         return applications
     }

// === Education & Experience ===
     async function seedEducation(n = 4, users: user[], cvs: curriculum_vitae[]): Promise<void> {
         while (n) {
             await prisma.curriculum_vitae_has_education.create({
                 data: {
                     curriculum_vitae: {connect: {id: faker.helpers.arrayElement(cvs).id}},
                     education: {
                         create: {
                             title: faker.lorem.words(3),
                             begin_year: faker.number.int(4),
                             end_year: faker.number.int(4),
                             place: faker.location.city(),
                             topics: faker.lorem.words(5),
                             created_at: faker.date.past(),
                             updated_at: faker.date.recent(),
                             user: {connect: {id: faker.helpers.arrayElement(users).id}}
                         }
                     }
                 }
             })
             n--
         }
     }

     async function seedExperience(n = 6, users: user[], cvs: curriculum_vitae[]): Promise<void> {
         while (n) {
             await prisma.curriculum_vitae_has_experience.create({
                 data: {
                     curriculum_vitae: {connect: {id: faker.helpers.arrayElement(cvs).id}},
                     experience: {
                         create: {
                             title: faker.commerce.productName(),
                             begin_year: faker.number.int(4),
                             end_year: faker.number.int(4),
                             place: faker.location.city(),
                             topics: faker.company.catchPhrase(),
                             created_at: faker.date.past(),
                             updated_at: faker.date.recent(),
                             user: {connect: {id: faker.helpers.arrayElement(users).id}}
                         }
                     }
                 }
             })
             n--
         }
     }

     // === Projets ===




// === User Has ===
async function seedUserHasLanguage(n = 3, users: user[], languages: language[]) {
    const links: user_has_language[] = [];

    if (!users?.length || !languages?.length) {
        throw new Error('Aucun utilisateur ou langue disponible.');
    }

    while (n>0) {
        const user = users[Math.floor(Math.random() * users.length)];
        const lang = languages[Math.floor(Math.random() * languages.length)];

        const alreadyExists = await prisma.user_has_language.findUnique({
            where: {
                user_id_language_id: {
                    user_id: user.id,
                    language_id: lang.id,
                },
            }
        });

        if (!lang?.id) {
            console.warn(`⛔ Langue invalide ou sans id :`, lang);
            continue;
        }

        if (alreadyExists) continue;

        const levels = Object.values(language_level_of_language);
        const newLink = await prisma.user_has_language.create({
            data: {
                user: { connect: { id: user.id } },
                language: { connect: { id: lang.id } },
                level: levels[Math.floor(Math.random() * levels.length)],
            },
        });

        links.push(newLink);
        n--;
    }

    console.log(`✅ ${links.length} liens user_has_language créés.`);
    return links;
}


     async function seedUserHasOffer(n = 20, users: user[], offers: offer[]) {
         const links: user_has_offer[] = []
         if (!users?.length || !offers?.length) {
             throw new Error('Aucun utilisateur ou offre disponible.');
         }
         while (n) {
             const user = users[Math.floor(Math.random() * users.length)];
             const offer = offers[Math.floor(Math.random() * offers.length)];

             const alreadyExists = await prisma.user_has_offer.findFirst({
                 where: {
                     user_id: user.id,
                     offer_id: offer.id,
                 },
             });

             if (alreadyExists) continue;

             const newLink = await prisma.user_has_offer.upsert({
                 where: {
                     user_id_offer_id: {
                         user_id: user.id,
                         offer_id: offer.id,
                     },
                 },
                 update: {},
                 create: {
                     user: { connect: { id: user.id } },
                     offer: { connect: { id: offer.id } },
                 },
             });
             links.push(newLink)
             n--
         }
         return links
     }


// === CV Has ===
 /*    async function seedCVHasSkills(n = 10, cvs: curriculum_vitae[], skills: skill[]): Promise<void> {
         if (!cvs?.length || !skills?.length) {
             throw new Error('❌ cvs, users ou skills non fournis');
         }

        while (n) {
            const cv = cvs[Math.floor(Math.random() * cvs.length)];
            const selectedSkill = skills[Math.floor(Math.random() * skills.length)];

            const existsAlready = await prisma.curriculum_vitae_has_skill.findUnique({
                where: {
                    curriculum_vitae_id_skill_id: {
                        curriculum_vitae_id: cv.id,
                        skill_id: selectedSkill.id,
                    },
                },
            });

            if (existsAlready) continue;

            await prisma.curriculum_vitae_has_skill.upsert({
                where: {
                    curriculum_vitae_id_skill_id: {
                        curriculum_vitae_id: cv.id,
                        skill_id: selectedSkill.id,
                    },
                },
                update: {},
                create: {
                    curriculum_vitae: { connect: { id: cv.id } },
                    skill: { connect: { id: selectedSkill.id } },
                },
            });

            n--;
        }

     }*/

 /*    async function seedCVHasProjects(n = 6, cvs: curriculum_vitae[], users: user[]): Promise<void> {
         while (n) {
             await prisma.curriculum_vitae_has_project.create({
                 data: {
                     curriculum_vitae: {connect: {id: faker.helpers.arrayElement(cvs).id}},
                     project: {
                         create: {
                             name: faker.commerce.productName(),
                             year_of_beginning: faker.date.past(),
                             end_year: faker.date.recent(),
                             place: faker.location.city(),
                             results: faker.company.catchPhrase(),
                             created_at: faker.date.past(),
                             updated_at: faker.date.recent(),
                             user: {connect: {id: faker.helpers.arrayElement(users).id}}
                         }
                     }
                 }
             })
             n--
         }
     }

     async function seedCVHasHobbies(n = 8, cvs: curriculum_vitae[], users: user[]): Promise<void> {
         while (n) {
             await prisma.curriculum_vitae_has_hobby.create({
                 data: {
                     curriculum_vitae: {connect: {id: faker.helpers.arrayElement(cvs).id}},
                     hobby: {
                         create: {
                             name: faker.word.noun(),
                             user: {connect: {id: faker.helpers.arrayElement(users).id}}
                         }
                     }
                 }
             })
             n--
         }
     }
*/
/*
     async function seedCVHasUsefulInfos(n = 6, cvs: curriculum_vitae[], users: user[]): Promise<void> {
         while (n) {
             await prisma.curriculum_vitae_has_useful_information.create({
                 data: {
                     curriculum_vitae: {connect: {id: faker.helpers.arrayElement(cvs).id}},
                     useful_information: {
                         create: {
                             name: faker.lorem.words(3),
                             user: {connect: {id: faker.helpers.arrayElement(users).id}}
                         }
                     }
                 }
             })
             n--
         }
     }
*/

     async function seedCVHasLanguages(n = 4, cvs: curriculum_vitae[], languages: language[]) {
         const links: curriculum_vitae_has_language[] = [];

         if (!cvs?.length || !languages?.length) {
             throw new Error('Aucun cv ou langue disponible.');
         }

         while (n) {
             const cv = cvs[Math.floor(Math.random() * cvs.length)];
             const lang = languages[Math.floor(Math.random() * languages.length)];

             const alreadyExists = await prisma.curriculum_vitae_has_language.findFirst({
                 where: {
                     curriculum_vitae_id: cv.id,
                     language_id: lang.id,
                 },
             });

             if (alreadyExists) continue;

             const newLink = await prisma.curriculum_vitae_has_language.upsert({
                 where: {
                     curriculum_vitae_id_language_id: {
                         curriculum_vitae_id: cv.id,
                         language_id: lang.id,
                     },
                 },
                 update: {},
                 create: {
                     curriculum_vitae: {connect: {id: cv.id}},
                     language: {connect: {id: lang.id}},

                 },
             });

             links.push(newLink);
             n--;
         }

         console.log(`✅ ${links.length} liens user_has_language créés.`);

     }


     async function handleSeed() {
         const profils = await seedProfil()
         const levels = await seedLevel()
         const users = await seedUser(10, profils, levels)
         const cvs = await seedCurriculumVitae(10, users)
         const enterprises = await seedEnterprise()
         const offers = await seedOfferFromFranceTravail(10, users, enterprises)
         const languages = await seedLanguage()
         await seedUserHasLanguage(20, users, languages)
         await seedUserHasOffer(20, users, offers)
         /*await seedCVHasSkills(20, cvs, users)
         await seedCVHasProjects(20, cvs, users)
         await seedCVHasHobbies(20, cvs, users)
         await seedCVHasUsefulInfos(20, cvs, users)*/
         await seedCVHasLanguages(20, cvs, languages)
         await seedEducation(20, users, cvs)
         await seedExperience(20, users, cvs)
         await seedQuestion()
         await seedAnswer()
         const surveys = await seedSurvey()
         await seedApplication(10, users, offers, cvs, surveys)
     }


     handleSeed()
         .then(() => {
             console.log('👽 Avec succès ton seed a été éffectué, Maître Yoda ! 👽')
         })
         .catch((e) => {
             console.error(e)
         })
         .finally(async () => {
             await prisma.$disconnect()
         })




