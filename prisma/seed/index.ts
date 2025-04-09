import {  PrismaClient } from '@prisma/client'
import {fakerFR, fakerFR as faker} from '@faker-js/faker';
const prisma = new PrismaClient()


function randomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


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
        const newUser = await prisma.curriculum_vitae.upsert ({
            where: {
                phone_number: curriculumVitae.phone_number
            },
            update: {},
            create: {
                ...curriculumVitae
            }
        })
        // ajoute dans le tableau des teams
        curriculumVitae.push(newUser);

        // décrémenter number
        number--; // number = number - 1;
    }

    return curriculumVitaes;

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
        const newUser = await prisma.profil.upsert({
            where: {
                phone_number: profile.phone_number
            },
            update: {},
            create: {
                ...profile
            }
        })
        // ajoute dans le tableau des teams
        profiles.push(newUser);

        // décrémenter number
        number--; // number = number - 1;
    }

    return profiles;

}

async function seedApplication (number = 15) {
    const applications = [];

    while (number) {
        // Creation du faker
        const application = {
            received_return: fakerFR.lorem.text()
        }
        // SEED
        const newUser = await prisma.application.upsert({
            where: {
                id: application.userId
            },
            update: {},
            create: {
                ...application
            }
        })
        // ajoute dans le tableau des teams
        applications.push(newUser);

        // décrémenter number
        number--; // number = number - 1;
    }

    return applications;
}