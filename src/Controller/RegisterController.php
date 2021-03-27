<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class RegisterController extends AbstractController
{
    public function index(): Response
    {
        return $this->render('register/index.html.twig', [
            'controller_name' => 'RegisterController',
        ]);
    }

    public function create(Request $request): Response
    {
        $test=$request->getContent();//Pour récup le JSON
        $entityManager=$this->getDoctrine()->getManager();
        //$repository = $entityManager->getRepository(User::class);
        dd(json_encode($test,true));
    }
}
