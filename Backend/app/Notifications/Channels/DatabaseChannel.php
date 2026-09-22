<?php

namespace App\Notifications\Channels;

use Illuminate\Notifications\Channels\DatabaseChannel as BaseDatabaseChannel;
use Illuminate\Notifications\Notification;

class DatabaseChannel extends BaseDatabaseChannel
{
    protected function buildPayload($notifiable, Notification $notification): array
    {
        $payload = parent::buildPayload($notifiable, $notification);
        unset($payload['id']);

        return $payload;
    }
}
