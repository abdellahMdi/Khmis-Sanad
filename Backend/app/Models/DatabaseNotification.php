<?php

namespace App\Models;

use Illuminate\Notifications\DatabaseNotification as BaseDatabaseNotification;

class DatabaseNotification extends BaseDatabaseNotification
{
    public $incrementing = true;

    protected $keyType = 'int';

    public const UPDATED_AT = null;
}
