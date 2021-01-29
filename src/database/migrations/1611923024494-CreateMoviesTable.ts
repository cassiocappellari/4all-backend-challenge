import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateMoviesTable1611923024494 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'movies',
            columns: [
            {
                name: 'id',
                type: 'integer',
                unsigned: true,
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment'
            },
            {
                name: 'title',
                type: 'varchar'
            },
            {
                name: 'director',
                type: 'varchar'
            },
            {
                name: 'quantity',
                type: 'integer'
            }
        ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('movies')
    }
}