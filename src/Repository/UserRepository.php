<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    /**
     * Used to upgrade (rehash) the user's password automatically over time.
     */
    public function upgradePassword(UserInterface $user, string $newEncodedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', \get_class($user)));
        }

        $user->setPassword($newEncodedPassword);
        $this->_em->persist($user);
        $this->_em->flush();
    }

    // Seek non secret info of a user
    public function findNonSecretInfo($id)
    {
        return $this->createQueryBuilder('u')
            ->select(['u.id','u.first_name','u.last_name','u.sex','u.bio'])
            ->where('u.id = :id')
            ->setParameter('id',$id)
            ->setMaxResults(1)
            ->getQuery()->getOneOrNullResult();
    }

    // Find all users having a string in parts of their name or email
    public function findUsersByString($str,$ev,$id)
    {
        $entityManager=$this->getEntityManager();
        $sql='SELECT u.id, u.email, u.first_name, u.last_name
        FROM user u WHERE
        (u.first_name LIKE :str OR u.last_name LIKE :str OR u.email LIKE :str
        OR CONCAT(u.first_name," ",u.last_name) LIKE :str OR CONCAT(u.last_name," ",u.first_name) LIKE :str)
        AND u.id!=:id AND u.id NOT IN(SELECT ez.user_id FROM user_event_zurvan ez WHERE ez.event_zurvan_id =:ez)';
       $query=$entityManager->getConnection()->prepare($sql);
       $query->bindValue('ez',$ev);
       $query->bindValue('str','%'.$str.'%');
       $query->bindValue('id',$id);
       $query->execute();

        return $query->fetchAllAssociative();
    }

    // /**
    //  * @return User[] Returns an array of User objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('u.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?User
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
