<?php

namespace App\Controller;

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
}
