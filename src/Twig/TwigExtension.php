<?php

namespace App\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class TwigFileExtension extends AbstractExtension
{

    /**
     * Return the functions registered as twig extensions
     *
     * @return array
     */
    public function getFunctions()
    {
        return [
            new TwigFunction('file_exists', 'file_exists'),
        ];
    }

    public function getName()
    {
        return 'app_file';
    }
}
