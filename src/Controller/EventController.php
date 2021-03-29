<?php

namespace App\Controller;

use App\Entity\Event;
use App\Form\EventType;
use App\Repository\EventRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class EventController extends AbstractController
{
    public function index(EventRepository $eventRepository)
    {
        return $this->render('event/index.html.twig', [
            'events' => $eventRepository->findAll(),
        ]);
    }


    public function new(Request $request)
    {
        $event = new Event();
        $form = $this->createForm(EventType::class, $event);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($event);
            $entityManager->flush();

            return $this->redirectToRoute('event_index');
        }

        return $this->render('event/new.html.twig', [
            'event' => $event,
            'form' => $form->createView(),
        ]);
    }

    public function show(Event $event): Response
    {
        return $this->render('event/show.html.twig', [
            'event' => $event,
        ]);
    }


    /*
      public function show(Event $event): Response
    {
        return $this->render('event/show.html.twig', [
            'event' => $event,
        ]);
    }*/

      public function edit(Request $request, Event $event): Response
    {
        $form = $this->createForm(EventType::class, $event);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('event_index');
        }

        return $this->render('event/edit.html.twig', [
            'event' => $event,
            'form' => $form->createView(),
        ]);
    }

    public function delete(Request $request, Event $event): Response
    {
        if ($this->isCsrfTokenValid('delete'.$event->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($event);
            $entityManager->flush();
        }

        return $this->redirectToRoute('event_index');
    }

    public function calendar(): Response
    {
        return $this->render('event/calendar.html.twig');
    }

    public function update(Request $request,$id)
    {
        $entityManager=$this->getDoctrine()->getManager();
        $repository = $this->getDoctrine()->getRepository(Event::class);
        $event=$repository->find($id);
        if(!$event){
            throw $this->createNotFoundException("Évènement introuvable");
        }
        // Event drop
        if($dr=$request->request->get('dr')){
            $ba=$event->getBeginAt();
            $ea=$event->getEndAt();
            $ba->modify(($dr['years']).' year');
            $ba->modify(($dr['months']).' month');
            $ba->modify(($dr['days']).' day');
            $ba->modify(($dr['milliseconds']/60000).' minutes');
            $event->setBeginAt($ba);
            $ea->modify(($dr['years']).' year');
            $ea->modify(($dr['months']).' month');
            $ea->modify(($dr['days']).' day');
            $ea->modify(($dr['milliseconds']/60000).' minutes');
            $event->setEndAt($ea);
        }
        $entityManager->persist($event);
        $entityManager->flush();
        return new Response("ok");
    }
}
