<?php

namespace App\Controller;

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
}
