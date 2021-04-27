<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ExportController extends Controller
{
    public function __invoke($name)
    {
        $class = "\\App\\Exports\\" . ucfirst($name) . "Export";

        return new $class();
    }
}
