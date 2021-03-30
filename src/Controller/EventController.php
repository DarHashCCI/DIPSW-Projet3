<?php

namespace App\Controller;

use App\Entity\EventZurvan;
use App\Entity\User;
use App\Form\EventType;
use App\Repository\EventZurvanRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;

class EventController extends AbstractController
{
    public function index(EventZurvanRepository $eventRepository)
    {
        return $this->render('event/index.html.twig', [
            'events' => $eventRepository->findAll(),
        ]);
    }

    public function create(Request $request)
    {
        $entityManager=$this->getDoctrine()->getManager();
        $connection=$this->getDoctrine()->getConnection();
        $values= array();
        parse_str($request->request->get('data'),$values);
        //dd($values);
        $connection->beginTransaction();
        try{
            $event= new EventZurvan();
            $event->setTitle($values['title']);
            $event->setDescription($values['description']);
            $event->setBeginAt(new \DateTime($values['dateBegin'].' '.$values['timeBegin'].':00'));
            $event->setEndAt(new \DateTime($values['dateEnd'].' '.$values['timeEnd'].':00'));
            $event->setBackColor($values['colorback']);
            $event->setTextColor($values['colorfont']);
            $entityManager->persist($event);
            $entityManager->flush();
            $connection->commit();
        } catch (\Exception $e){
            $connection->rollback();
            throw $e;
        }

        return new Response("ok");
    }

    public function get($id)
    {
        $event = $this->getDoctrine()->getRepository(EventZurvan::class)->find($id);
        //dd($event->getBeginAt()->format('Y-m-d H:i:s'));
        $arr=array('id'=>$event->getId(),'beginAt'=>$event->getBeginAt()->format('Y-m-d H:i:s'),'endAt'=>$event->getEndAt()->format('Y-m-d H:i:s'),'title'=>$event->getTitle(),'description'=>$event->getDescription(),'backColor'=>$event->getBackColor(),'textColor'=>$event->getTextColor());
        //dd(json_encode($arr));
        return new Response(json_encode($arr));
    }


    /*
      public function show(Event $event): Response
    {
        return $this->render('event/show.html.twig', [
            'event' => $event,
        ]);
    }*/

      public function edit(Request $request, EventZurvan $event): Response
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

    public function delete(Request $request, EventZurvan $event): Response
    {
        if ($this->isCsrfTokenValid('delete'.$event->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($event);
            $entityManager->flush();
        }

        return $this->redirectToRoute('event_index');
    }

    public function calendar($id): Response
    {
        $session = new Session();
        if($session->get('_security.last_username')==null){
            return $this->redirectToRoute('app_login');
        }
        else {
            $user = $this->getDoctrine()->getRepository(User::class)
                ->findNonSecretInfo($id);
            //dd($user);
            if ($user == null)
                return $this->render('event/nocalendar.html.twig');
            // Needs authorisation page for uninvited calendars.
            $filesystem = new Filesystem();
            return $this->render('event/calendar.html.twig', [
                'id' => $id,
            ]);
        }
    }

    public function update(Request $request,$id)
    {
        $entityManager=$this->getDoctrine()->getManager();
        $repository = $this->getDoctrine()->getRepository(EventZurvan::class);
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
            $event->setBeginAt(new \DateTime($ba->format('Y-m-d H:i:s')));
            $ea->modify(($dr['years']).' year');
            $ea->modify(($dr['months']).' month');
            $ea->modify(($dr['days']).' day');
            $ea->modify(($dr['milliseconds']/60000).' minutes');
            $event->setEndAt(new \DateTime($ea->format('Y-m-d H:i:s')));
        }
        // Event resize
        if($re=$request->request->get('re')){
            $ea=$event->getEndAt();
            $ea->format('Y-m-d H:i:s');
            $ea->modify(($re['years']).' year');
            $ea->modify(($re['months']).' month');
            $ea->modify(($re['days']).' day');
            $ea->modify(($re['milliseconds']/60000).' minutes');
            $event->setEndAt(new \DateTime($ea->format('Y-m-d H:i:s')));
        }
        $entityManager->flush();
        return new Response("ok");
    }
}
