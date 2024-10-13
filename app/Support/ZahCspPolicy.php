<?php

namespace App\Support;

use Spatie\Csp\Directive;
use Spatie\Csp\Policies\Basic;

class ZahCspPolicy extends Basic
{
    public function configure()
    {
        parent::configure();
        
        $this->addDirective(Directive::STYLE, 'fonts.bunny.net');
        $this->addDirective(Directive::FONT, 'fonts.bunny.net');
    }
}
