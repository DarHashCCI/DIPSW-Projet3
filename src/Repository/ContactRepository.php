<?php

namespace App\Repository;

use App\Entity\Contact;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Validator\Constraints\Json;
use DateInterval;

/**
 * @method Contact|null find($id, $lockMode = null, $lockVersion = null)
 * @method Contact|null findOneBy(array $criteria, array $orderBy = null)
 * @method Contact[]    findAll()
 * @method Contact[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ContactRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Contact::class);
    }

    public function create_contact(String $js)
    {
        $entityManager=$this->getEntityManager();
        $connection=$this->getEntityManager()->getConnection();
        $connection->beginTransaction();
        try{
            $contact= new Contact();
            $contact->setInfos($js);
            $td=new \DateTime();
            $td->add(new DateInterval('PT1H'));
            $contact->setDateAdded($td);
            $entityManager->persist($contact);
            $entityManager->flush();
            $connection->commit();
        } catch (\Exception $e){
            $connection->rollback();
            throw $e;
        }
    }

    public function update_contact($id,string $js)
    {
        $entityManager=$this->getEntityManager();
        $connection=$this->getEntityManager()->getConnection();
        $connection->beginTransaction();
        try{
            $contact= $this->find($id);
            $contact->setInfos($js);
            $entityManager->persist($contact);
            $entityManager->flush();
            $connection->commit();
        } catch (\Exception $e){
            $connection->rollback();
            throw $e;
        }
    }

    public function showLastThreeContacts()
    {
        return $this->createQueryBuilder('c')
            ->orderBy('c.dateAdded', 'DESC')
            ->setMaxResults(3)
            ->getQuery()
            ->getResult()
            ;
    }

    // /**
    //  * @return Contact[] Returns an array of Contact objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('c.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Contact
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
