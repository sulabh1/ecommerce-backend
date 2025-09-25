import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class AddEmailVerification1758794208948 implements MigrationInterface {
  name = 'AddEmailVerification1758794208948';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'is_email_verified',
        type: 'boolean',
        default: false,
      }),
      new TableColumn({
        name: 'email_verified_at',
        type: 'timestamp',
        isNullable: true,
      }),
    ]);

    await queryRunner.createTable(
      new Table({
        name: 'otps',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'email',
            type: 'varchar',
          },
          {
            name: 'otp',
            type: 'varchar',
            length: '6',
          },
          {
            name: 'expires_at',
            type: 'timestamp',
          },
          {
            name: 'is_used',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        indices: [
          {
            name: 'IDX_OTP_USER_ID',
            columnNames: ['user_id'],
          },
          {
            name: 'IDX_OTP_EMAIL',
            columnNames: ['email'],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('otps');
    await queryRunner.dropColumn('users', 'is_email_verified');
    await queryRunner.dropColumn('users', 'email_verified_at');
  }
}
