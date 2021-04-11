<?php

namespace App\Controller;

use App\Entity\EventZurvan;
use App\Entity\User;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class TestMailController extends AbstractController
{
    /**
     * @Route("/test/mail", name="test_mail")
     */
    public function index(Request $request, \Swift_Mailer $mailer,
                          LoggerInterface $logger)
    {
        //$name = $request->query->get('name');

        $message = new \Swift_Message('Zurvan - confirmation d\'inscription');
        $message->setFrom('zurwan.cheetahcorp@gmail.com');
        $message->setTo('darius.hashemizadeh@gmail.com');
        $message->setBody(
            $this->renderView(
                'emails/mymail.html.twig',
                //['name' => $name]
                ['name' => "teubé"]
            ),
            'text/html'
        );

        $mailer->send($message);

        $logger->info('email sent');
        $this->addFlash('notice', 'Email sent');

        return $this->redirectToRoute('login_index');
    }

    //  Profile : calendar request handler
    //  Mode values:
    //      1 : invite request
    //      2 : granting access
    //      3 : removing access
    public function profileCalendarRequests(Request $request, \Swift_Mailer $mailer,
                                  LoggerInterface $logger)
    {
        $sender=$this->getDoctrine()->getRepository(User::class)
            ->find($request->request->get('idSender'));
        $dest=$this->getDoctrine()->getRepository(User::class)
            ->find($request->request->get('idDest'));
        $entityManager=$this->getDoctrine()->getManager();
        switch($request->request->get('mode')){
            case 1 :
                $title='Zurvan - demande de consultation du calendrier';
                $view='emails/cal_inviterequest.html.twig';
                break;
            case 2 :
                $title='Zurvan - accès autorisé pour un calendrier';
                $view='emails/cal_accessgranted.html.twig';
                $sender->addInvitedUser($dest);
                break;
            case 3 :
                $title='Zurvan - accès refuté pour un calendrier';
                $view='emails/cal_accessremoved.html.twig';
                $sender->removeInvitedUser($dest);
                break;
        }
        $entityManager->flush();
        $message = new \Swift_Message($title);
        $message->setFrom('zurwan.cheetahcorp@gmail.com');
        $message->setTo($dest->getEmail());
        $message->setBody(
            $this->renderView(
                $view,
                ['user' => $sender]
            ),
            'text/html'
        );

        $mailer->send($message);

        $logger->info('email sent');
        return new Response('ok');
    }

    // Calendar - sending invites for a specific event
    //  $id is the id of the event
    public function eventInvite(Request $request,$id,\Swift_Mailer $mailer,
                                LoggerInterface $logger)
    {
        $entityManager=$this->getDoctrine()->getManager();
        $event=$this->getDoctrine()->getRepository(EventZurvan::class)
            ->find($id);
        $invites=json_decode($request->getContent());
        $arr=[];
        //Preparing the array of mail adresses + adding the event to users
        foreach ($invites as $invite){
            $user=$this->getDoctrine()->getRepository(User::class)
                ->find($invite);
            array_push($arr,$user->getEmail());
            //Event push in user
            $user->addEvent($event);
            $entityManager->flush();
        }
        //dd($arr);
        $message = new \Swift_Message('Zurvan - invitation à un évènement');
        $message->setFrom('zurwan.cheetahcorp@gmail.com');
        $message->setTo($arr);
        $message->setBody(
            $this->renderView(
                'emails/event_invite.html.twig',
                ['event' => $event]
            ),
            'text/html'
        );

        $mailer->send($message);

        $logger->info('email sent');
        return new Response('ok');
    }

    /* Dashboard - sending calendar invites */
    public function dashCalendarInvites(Request $request, \Swift_Mailer $mailer,
                                            LoggerInterface $logger,$id)
    {
        $entityManager=$this->getDoctrine()->getManager();
        $mainUser=$this->getDoctrine()->getRepository(User::class)
            ->find($id);
        $invites=json_decode($request->getContent());
        $arr=[];
        //Preparing the array of mail adresses + adding the users to the main users guest list
        foreach ($invites as $invite){
            $user=$this->getDoctrine()->getRepository(User::class)
                ->find($invite);
            array_push($arr,$user->getEmail());
            //Guest push in user
            $mainUser->addInvitedUser($user);
            $entityManager->flush();
        }
        //dd($arr);
        $message = new \Swift_Message('Zurvan - invitation à un calendrier');
        $message->setFrom('zurwan.cheetahcorp@gmail.com');
        $message->setTo($arr);
        $message->setBody(
            $this->renderView(
                'emails/cal_accessgranted.html.twig',
                ['user' => $mainUser]
            ),
            'text/html'
        );

        $mailer->send($message);

        $logger->info('email sent');
        return new Response('ok');
    }

    /* Dashboard - sending calendar invites */
    public function dashCalendarBeggar(Request $request, \Swift_Mailer $mailer,
                                        LoggerInterface $logger,$id)
    {
        $mainUser=$this->getDoctrine()->getRepository(User::class)
            ->find($id);
        $invites=json_decode($request->getContent());
        $arr=[];
        //Preparing the array of mail adresses
        foreach ($invites as $invite){
            $user=$this->getDoctrine()->getRepository(User::class)
                ->find($invite);
            array_push($arr,$user->getEmail());
        }
        //dd($arr);
        $message = new \Swift_Message("Zurvan - Demande d'accès au calendrier");
        $message->setFrom('zurwan.cheetahcorp@gmail.com');
        $message->setTo($arr);
        $message->setBody(
            $this->renderView(
                'emails/cal_inviterequest.html.twig',
                ['user' => $mainUser]
            ),
            'text/html'
        );

        $mailer->send($message);

        $logger->info('email sent');
        return new Response('ok');
    }
}
