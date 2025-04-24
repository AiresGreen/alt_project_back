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
    user, curriculum_vitae, $Enums, offer, application, user_has_language, user_has_offer,

} from '@prisma/client'
import {fakerFR, fakerFR as faker} from '@faker-js/faker'
import * as argon2 from 'argon2'


const prisma = new PrismaClient()

async function handleSeed() {
    const profils = await seedProfil()
    const levels = await seedLevel()
    const users = await seedUser(10, profils, levels)
    const cvs = await seedCurriculumVitae(10, users)
    const enterprises = await seedEnterprise()
    const offers = await seedOffer(10, users, enterprises)
    // const languages = await seedLanguage(5)
    // await seedUserHasLanguage(20, users, languages)
    await seedUserHasOffer(20, users, offers)
    await seedCVHasSkills(20, cvs, users)
    await seedCVHasProjects(20, cvs, users)
    await seedCVHasHobbies(20, cvs, users)
    await seedCVHasUsefulInfos(20, cvs, users)
    // await seedCVHasLanguages(20, cvs, languages)
    await seedEducation(20, users, cvs)
    await seedExperience(20, users, cvs)
    await seedQuestion()
    await seedAnswer()
    const surveys = await seedSurvey()
    await seedApplication(10, users, offers, cvs, surveys)
}


handleSeed()
    .then(() => {
        console.log('✅ Seed a été éffectué avec succès, Maître Jedi !')
    })
    .catch((e) => {
        console.error(e)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

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
// async function seedLanguage(n = 10) {
//     const languages: language[] = [];
//     const levels = Object.values(language_level_of_language);

//     while (n) {
//         const name = faker.location.language().name;
//         const level = faker.helpers.arrayElement(levels);
//         const newLanguage: { id: number, name: string, level: $Enums.language_level_of_language } = await prisma.language.upsert({
//             where: { name },
//             update: {},
//             create: {
//                 name,
//                 level
//             }
//         });
//         languages.push(newLanguage);
//         n--;
//     }
//     return languages;
// }

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

// === SUrvey ===
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
async function seedOffer(n = 10, users: user[], enterprises: enterprise[]) {
    const offers: offer[] = []
    while (n) {
        const newOffer = await prisma.offer.create({
            data: {
                title: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                publication_date: faker.date.recent(),
                user: {
                    connect: {id: faker.helpers.arrayElement(users).id}
                },
                enterprise: {
                    connect: {id: faker.helpers.arrayElement(enterprises).id}
                }
            }
        })
        offers.push(newOffer)
        n--
    }
    return offers
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

// // === User Has ===
// async function seedUserHasLanguage(n = 3, users: user[], languages: language[]) {
//     const links: user_has_language[] = []
//     while (n) {
//         const newLink = await prisma.user_has_language.create({
//             data: {
//                 user: {connect: {id: faker.helpers.arrayElement(users).id}},
//                 language: {connect: {id: faker.helpers.arrayElement(languages).id}}
//             }
//         })
//         links.push(newLink)
//         n--
//     }
//     return links
// }

async function seedUserHasOffer(n = 20, users: user[], offers: offer[]) {
    const links: user_has_offer[] = []
    while (n) {
        const newLink = await prisma.user_has_offer.create({
            data: {
                user: {connect: {id: faker.helpers.arrayElement(users).id}},
                offer: {connect: {id: faker.helpers.arrayElement(offers).id}}
            }
        })
        links.push(newLink)
        n--
    }
    return links
}


// === CV Has ===
async function seedCVHasSkills(n = 10, cvs: curriculum_vitae[], users: user[]): Promise<void> {
    while (n) {
        await prisma.curriculum_vitae_has_skill.create({
            data: {
                curriculum_vitae: {connect: {id: faker.helpers.arrayElement(cvs).id}},
                skill: {
                    create: {
                        name: faker.hacker.noun(),
                        user: {connect: {id: faker.helpers.arrayElement(users).id}}
                    }
                }
            }
        })
        n--
    }
}

async function seedCVHasProjects(n = 6, cvs: curriculum_vitae[], users: user[]): Promise<void> {
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

async function seedCVHasLanguages(n = 4, cvs: curriculum_vitae[], languages: language[]): Promise<void> {
    while (n) {
        await prisma.curriculum_vitae_has_language.create({
            data: {
                curriculum_vitae: {connect: {id: faker.helpers.arrayElement(cvs).id}},
                language: {connect: {id: faker.helpers.arrayElement(languages).id}}
            }
        })
        n--
    }
}







