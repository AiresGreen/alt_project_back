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
    survey, user
} from '@prisma/client'
import {fakerFR, fakerFR as faker} from '@faker-js/faker'

const prisma = new PrismaClient()

async function seedProfil(n = 10): Promise<profil[]> {
    const profils: profil[] = []
    while (n) {
        const newProfil = await prisma.profil.create({
            data: {
                picture: faker.image.urlPicsumPhotos(),
                street: faker.location.street(),
                zip_code: faker.location.zipCode(),
                city: faker.location.city(),
                phone_number: faker.phone.number(),
                created_at: faker.date.past(),
                updated_at: faker.date.recent()
            }
        })
        profils.push(newProfil)
        n--
    }
    return profils
}


async function seedLanguages() {
    const languageNames = [
        'Français', 'Anglais', 'Espagnol', 'Allemand', 'Italien',
        'Russe', 'Chinois', 'Japonais', 'Arabe', 'Hindi',
        'Portugais', 'Néerlandais', 'Polonais', 'Grec', 'Turc',
        'Coréen', 'Vietnamien', 'Suédois', 'Norvégien', 'Danois'
    ];

    const levels = Object.values(language_level_of_language);

    for (const name of languageNames) {
        await prisma.language.upsert({
            where: {name},
            update: {},
            create: {
                name,
                level: fakerFR.helpers.arrayElement(levels),
            },
        });
    }
}

async function seedLevel() {
    const grades = [level_grade.admin, level_grade.pas_admin];

    for (const grade of grades) {
        await prisma.level.upsert({
            where: {grade},
            update: {},
            create: {grade}
        });
    }

}

async function seedQuestion(n = 20): Promise<question[]> {
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

async function seedAnswer(n = 20): Promise<answer[]> {
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

async function seedEnterprise(n = 20): Promise<enterprise[]> {
    const enterprises: enterprise[] = []
    while (n) {
        const newEnterprise = await prisma.enterprise.create({
            data: {
                name: faker.company.name(),
                employees: faker.string.numeric(),
                description: faker.company.catchPhrase()
            }
        })
        enterprises.push(newEnterprise)
        n--
    }
    return enterprises
}

async function seedSurvey(n = 10): Promise<survey[]> {
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

async function seedUser(n = 10, profils: profil[], levels: level[]): Promise<user[]> {
    const users: user[] = []
    while (n) {
        const newUser = await prisma.user.create({
            data: {
                firstname: faker.person.firstName(),
                lastname: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                created_at: faker.date.past(),
                updated_at: faker.date.recent(),
                profil: {
                    connect: { id: faker.helpers.arrayElement(profils).id }
                },
                level: {
                    connect: { id: faker.helpers.arrayElement(levels).id }
                }
            }
        })
        users.push(newUser)
        n--
    }
    return users
}

async function handleSeed() {
    await seedProfil()
    await seedLanguages()
    await seedLevel()
    await seedQuestion()
    await seedAnswer()
    await seedEnterprise()
    await seedSurvey()
}

handleSeed()
    .then(() => {
        console.log('✅ Seed terminé pour les tables sans clés étrangères')
    })
    .catch((e) => {
        console.error(e)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
