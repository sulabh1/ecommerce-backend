import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddOtpForeignKey1758745851584 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'otps',
      new TableForeignKey({
        name: 'FK_OTP_USER_ID',
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('otps', 'FK_OTP_USER_ID');
  }
}
