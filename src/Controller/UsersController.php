<?php

namespace App\Controller;

use App\Entity\Contact;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;

class UsersController extends AbstractController
{
    //Redirection index
    //If user logged, redirected straight to dashboard
    //Else, sent to login window
    public function index():Response
    {
        $session = new Session();
        if($session->get('_security.last_username')==null){
            return $this->redirectToRoute('app_login');
        }
        else return $this->redirectToRoute('users_home');
    }

    //User dashboard
    public function home(): Response
    {
        $session = new Session();
        if($session->get('_security.last_username')==null){
            return $this->redirectToRoute('app_login');
        }
        else{
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

    public function profile (Request $request,$id)
    {
        $session = new Session();
        if($session->get('_security.last_username')==null){
            return $this->redirectToRoute('app_login');
        }
        else{
            return $this->render('users/profile.html.twig', [
                'id' => $id,
            ]);
        }
    }
}
