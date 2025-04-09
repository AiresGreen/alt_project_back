import {  PrismaClient } from '@prisma/client'
import { fakerFR as faker } from '@faker-js/faker';
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

async function seedFormation(number = 5) {

    const formations = [];

    while (number) {
        // Creation du faker
        const formation = {
            name: faker.commerce.productName()
        }
        // SEED
        const newTeam = await prisma.formation.upsert({
            where: {
                name: formation.name
            },
            update: {},
            create: {
                ...formation
            }
        })
        // ajoute dans le tableau des teams
        formations.push(newTeam);

        // décrémenter number
        number--; // number = number - 1;
    }

    return formations;

}