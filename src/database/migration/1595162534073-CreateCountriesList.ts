import {
    MigrationInterface,
    QueryRunner,
    getRepository
} from "typeorm";
import { Country } from "../entity/Country";
import countries from "../../configs/country";

export class CreateCountriesList1595162534073 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        let countryRepo = getRepository(Country);
        let countryCount = await countryRepo.count();
        if (countryCount === 0) {
            let initialCountries = countries.map((country) => {
                return {
                    ...country,
                    population: undefined
                };
            });
            await countryRepo.save(initialCountries);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
