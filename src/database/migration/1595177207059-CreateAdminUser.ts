import {
    MigrationInterface,
    QueryRunner,
    getRepository
} from "typeorm";
import { User } from "../entity/User";

export class CreateAdminUser1595177207059 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const userRepo = getRepository(User);
        const userCount = await userRepo.count();

        if (userCount === 0) {
            let user = new User();
            user.username = "admin";
            user.password = "admin";
            user.hashPassword();
            const userRepository = getRepository(User);
            await userRepository.save(user);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
