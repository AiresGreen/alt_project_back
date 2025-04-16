
import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
    private readonly users = [
        {
            userId: 1,
            email: 'Primerose.Dupuy@yahoo.fr',
            password: 'azerty',
        },
        {
            userId: 2,
            email: 'Bathilde.Roger85@yahoo.fr',
            password: 'azerty2',
        },
    ];

    async findOne(email: string): Promise<User | undefined> {
        return this.users.find(user => user.email === email);
    }
}
