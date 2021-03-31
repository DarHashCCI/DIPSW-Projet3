<?php

namespace App\Repository;

use App\Entity\EventZurvan;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method EventZurvan|null find($id, $lockMode = null, $lockVersion = null)
 * @method EventZurvan|null findOneBy(array $criteria, array $orderBy = null)
 * @method EventZurvan[]    findAll()
 * @method EventZurvan[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class EventZurvanRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, EventZurvan::class);
    }

    // /**
    //  * @return Event[] Returns an array of Event objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('e')
            ->andWhere('e.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('e.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Event
    {
        return $this->createQueryBuilder('e')
            ->andWhere('e.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */

    public function findEventsBetweenDates($start, $end, $id)
    {
        return $this->createQueryBuilder('event')
            ->join('event.invites','user')
            ->where('event.beginAt BETWEEN :start and :end OR event.endAt BETWEEN :start and :end')
            ->andWhere('user.id=:id')
            ->setParameter('start', $start->format('Y-m-d H:i:s'))
            ->setParameter('end', $end->format('Y-m-d H:i:s'))
            ->setParameter('id',$id)
            ->getQuery()
            ->getResult()
            ;
    }
}
