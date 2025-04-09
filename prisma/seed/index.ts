import {  PrismaClient } from '@prisma/client'
import {fakerFR, fakerFR as faker} from '@faker-js/faker';
const prisma = new PrismaClient()


function randomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



async function seedProfil(number = 5) {

    const profiles = [];

    while (number) {
        // Creation du faker
        const profile = {
            picture: fakerFR.image.urlPicsumPhotos(),
            street: fakerFR.location.street(),
            zip_code: fakerFR.location.zipCode(),
            city: fakerFR.location.city(),
            phone_number: fakerFR.phone.number(),
        }
        // SEED
        const newProfil = await prisma.profil.upsert({
            where: {
                phone_number: profile.phone_number
            },
            update: {},
            create: {
                ...profile
            }
        })
        // ajoute dans le tableau des teams
        profiles.push(newProfil);

        // décrémenter number
        number--; // number = number - 1;
    }

    return profiles;

}

async function seedLevel() {
    const grades = ['admin', 'pas_admin'];
    const levels = [];

    for (const grade of grades) {
        const newLevel = await prisma.level.upsert({
            where: { grade },
            update: {},
            create: { grade }
        });

        levels.push(newLevel);
    }

    return levels;
}

async function seedEnterprise (number = 66) {

    const enterprises = [];

    while (number) {
        // Creation du faker
        const enterprise = {
            name: faker.company.name(),
            employees: faker.number.int({ min: 1, max: 100 }),
            description: faker.lorem.sentence()
        }
        // SEED
        const newEnterprise = await prisma.enterprise.create({
            data: enterprise

        })
        // ajoute dans le tableau des teams
        enterprises.push(newEnterprise);

        // décrémenter number
        number--; // number = number - 1;
    }

    return enterprises;

}

async function seedQuestion (number = 42) {

    const questions = [];

    while (number) {
        // Creation du faker
        const question = {
            question: faker.lorem.sentence(),
        }
        // SEED
        const newQuestion = await prisma.question.create({
            data:question
        })
        // ajoute dans le tableau des teams
        questions.push(newQuestion);

        // décrémenter number
        number--; // number = number - 1;
    }

    return questions;

}

async function seedAnswer (number = 42) {

    const answers = [];

    while (number) {
        // Creation du faker
        const answer = {
            answer: faker.lorem.sentence(),
        }
        // SEED
        const newAnswer = await prisma.answer.create({
            data:answer
        })
        // ajoute dans le tableau des teams
        answers.push(newAnswer);

        // décrémenter number
        number--; // number = number - 1;
    }

    return answers;

}

async function seedSurvey (number = 15) {

    const surveys = [];

    while (number) {
        // Creation du faker
        const survey = {
            message: faker.lorem.text(),
            question: faker.lorem.sentence(),
            answer: faker.lorem.sentence(),
        }
        // SEED
        const newSurvey = await prisma.survey.create({
            data:survey
        })
        // ajoute dans le tableau des teams
        surveys.push(newSurvey);

        // décrémenter number
        number--; // number = number - 1;
    }

    return surveys;

}

async function seedLanguage (number = 19) {
    const languages = [];

    while (number) {
        // Creation du faker
        const language = {
            name: fakerFR.location.language().name

        }
        // SEED
        const newLanguage = await prisma.language.create({
            data:language
        })
        // ajoute dans le tableau des teams
        languages.push(newLanguage);

        // décrémenter number
        number--; // number = number - 1;
    }

    return languages;

}

/*

async function seedUser(number = 50) {
    const users = [];
    while (number) {
        // Creation du faker
        const user = {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        }
        // SEED
        const newUser = await  prisma.user.upsert({
            where: {
                email: user.email
            },
            update: {},
            create: {
                ...user
            }
        })
        // ajoute dans le tableau des users
        users.push(newUser);

        // décrémenter number
        number--; // number = number - 1;
    }

    return users;

}

async function seedCurriculumVitae(number = 3) {

    const curriculumVitaes = [];

    while (number) {
        // Creation du faker
        const curriculumVitae = {
            photo: fakerFR.image.urlPicsumPhotos(),
            lastname: fakerFR.person.lastName(),
            firstname: fakerFR.person.firstName(),
            mail: fakerFR.internet.email(),
            street: fakerFR.location.street(),
            zip_code: fakerFR.location.zipCode(),
            city: fakerFR.location.city(),
            phone_number: fakerFR.phone.number(),
        }
        // SEED
        const newCurriculumVitae = await prisma.curriculum_vitae.upsert ({
            where: {
                phone_number: curriculumVitae.phone_number
            },
            update: {},
            create: {
                ...curriculumVitae
            }
        })
        // ajoute dans le tableau des teams
        curriculumVitaes.push(newCurriculumVitae);

        // décrémenter number
        number--; // number = number - 1;
    }

    return curriculumVitaes;

}

async function seedApplication (number = 15, users) {
    const applications = [];

    while (number) {
        // Creation du faker
        const application = {
            received_return: faker.number.int({ min: 0, max: 3 }),
            number_of_reminder: faker.number.int({ min: 0, max: 5 }),
            id: [randomInt(0, users.length)]
        }
        // SEED
        const newApplication = await prisma.application.create({

            data: {

            }
        })
        // ajoute dans le tableau des teams
        applications.push(newApplication);

        // décrémenter number
        number--; // number = number - 1;
    }

    return applications;
}

async function seedOffer (number = 15, users) {
    const offers = [];

    while (number) {
        // Creation du faker
        const offer = {
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            id: [randomInt(0, users.length)]
        }
        // SEED
        const newOffer = await prisma.offer.upsert({
            where: {
                id: offer.id,
            update: {},
            create: {
                ...offer
            }
        })
        // ajoute dans le tableau des teams
        offers.push(newOffer);

        // décrémenter number
        number--; // number = number - 1;
    }

    return offers;

}

async function seedLevelGrade (number = 2) {

    const levelGrades = [];

    while (number) {
        // Creation du faker
        const levelGrade = {
            admin: number
        }
        // SEED
        const newLevelGrade = await prisma.level_grade.upsert({
            where: {
                name: levelGrade.name
            },
            update: {},
            create: {
                ...levelGrade
            }
        })
        // ajoute dans le tableau des teams
        levelGrades.push(newUser);

        // décrémenter number
        number--; // number = number - 1;
    }

    return levelGrades;

}*/
