<?php

namespace App\Controller;

use App\Entity\Contact;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class ContactsController extends AbstractController
{
    public function index(): Response
    {
        $contain=[];
        $repository = $this->getDoctrine()->getRepository(Contact::class);
        $conts=$repository->findAll();
        foreach($conts as $cont){
            $contain[$cont->getId()]=json_decode($cont->getInfos(),true);
            //$cont->setInfos(json_decode($cont->getInfos(),true));
        }
        //dd($contain);
        return $this->render('contacts/index.html.twig', [
            'request' => $contain,
        ]);
    }

    public function edit(Request $request, $id): Response
    {
        $repository = $this->getDoctrine()->getRepository(Contact::class);
        $cont=$repository->find($id);
        //dd(json_decode($cont->getInfos(),true));
        return $this->render('contacts/edit.html.twig', [
            'infos' => json_decode($cont->getInfos(),true),
            'id' => $id,
        ]);
    }

    // Contact delete function
    public function delete(Request $request, $id): Response
    {
        $todel = $this->getDoctrine()->getRepository(Contact::class)->delete_contact($id);
        return new Response("Deletion done");
    }

    public function new(): Response
    {
        return $this->render('contacts/new.html.twig');
    }

    public function create(Request $request): Response
    {
        $test=$request->getContent();//Pour récup le JSON
        $entityManager=$this->getDoctrine()->getManager();
        $repository = $entityManager->getRepository(Contact::class);
        $cont=$repository->create_contact($test);
        //dd(json_encode($test,true));
        return new Response($cont);
    }

    public function update(Request $request, $id): Response
    {
        $test=$request->getContent();//Pour récup le JSON
        $entityManager=$this->getDoctrine()->getManager();
        $repository = $entityManager->getRepository(Contact::class);
        $cont=$repository->update_contact($id,$test);
        //dd(json_encode($test,true));
        return new Response("c'est bon");
    }
}
