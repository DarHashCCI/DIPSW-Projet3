<?php

namespace App\Controller;

use App\Entity\Contact;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

class UsersController extends AbstractController
{

    public function index(): Response
    {
        $contain=[];
        $repository = $this->getDoctrine()->getRepository(Contact::class);
        $conts=$repository->showLastThreeContacts();
        //$conts=$repository->findAll();
        foreach($conts as $cont){
            $contain[$cont->getId()]=json_decode($cont->getInfos(),true);
        }
        //dd($contain);
        return $this->render('users/index.html.twig', [
            'request' => $contain,
        ]);
    }
}
