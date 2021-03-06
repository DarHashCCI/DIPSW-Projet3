<?php

namespace App\Controller;

use App\Entity\Contact;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;

class ContactsController extends AbstractController
{
    // Contact index page
    public function index(): Response
    {
        $session = new Session();
        if($session->get('_security.last_username')==null){
            return $this->redirectToRoute('app_login');
        }
        $contain=[];
        $repository = $this->getDoctrine()->getRepository(Contact::class);
        $conts=$repository->findAll();
        foreach($conts as $cont){
            $contain[$cont->getId()]=json_decode($cont->getInfos(),true);
        }
        //dd($contain);
        return $this->render('contacts/index.html.twig', [
            'request' => $contain,
        ]);
    }

    // Contact delete function
    public function delete(Request $request, $id): Response
    {
        $todel = $this->getDoctrine()->getRepository(Contact::class)->delete_contact($id);
        return new Response("Deletion done");
    }

    // Contact create function
    public function create(Request $request): Response
    {
        $test=$request->getContent();//Pour récup le JSON
        $entityManager=$this->getDoctrine()->getManager();
        $repository = $entityManager->getRepository(Contact::class);
        $cont=$repository->create_contact($test);
        //dd(json_encode($test,true));
        return new Response($cont);
    }

    // Contact search function with specific list as Json
    public function specifList(Request $request): Response
    {
        $contsSearched=$this->getDoctrine()->getRepository(Contact::class)->findContactsByString($request->request->get('str'));
        return new Response(json_encode($contsSearched));
    }

    // Contact update function
    public function update(Request $request, $id): Response
    {
        $test=$request->getContent();//Pour récup le JSON
        $entityManager=$this->getDoctrine()->getManager();
        $repository = $entityManager->getRepository(Contact::class);
        $cont=$repository->update_contact($id,$test);
        //dd(json_encode($test,true));
        return new Response($cont);
    }
}
