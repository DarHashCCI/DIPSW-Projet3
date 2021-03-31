<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210331091301 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE user_event_zurvan (user_id INT NOT NULL, event_zurvan_id INT NOT NULL, INDEX IDX_DFBA81A7A76ED395 (user_id), INDEX IDX_DFBA81A7A186111D (event_zurvan_id), PRIMARY KEY(user_id, event_zurvan_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user_event_zurvan ADD CONSTRAINT FK_DFBA81A7A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_event_zurvan ADD CONSTRAINT FK_DFBA81A7A186111D FOREIGN KEY (event_zurvan_id) REFERENCES event_zurvan (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE user_event_zurvan');
    }
}
