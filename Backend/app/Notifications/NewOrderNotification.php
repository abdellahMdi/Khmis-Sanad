<?php

namespace App\Notifications;

use App\Models\Command;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewOrderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Command $command) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $this->command->loadMissing('lignes.product');

        $mail = (new MailMessage)
            ->subject('Nouvelle commande #'.$this->command->id)
            ->greeting('Bonjour,')
            ->line('Une nouvelle commande a été validée sur votre boutique.')
            ->line('Total : '.$this->command->total.' MAD')
            ->line('Adresse : '.($this->command->adresse_livraison ?: 'non renseignée'));

        foreach ($this->command->lignes as $ligne) {
            $mail->line(sprintf(
                '- %s × %d (%s MAD)',
                $ligne->product?->name ?? 'Produit',
                $ligne->quantity,
                $ligne->prix_unitaire
            ));
        }

        return $mail->line('Contactez l’acheteur via WhatsApp pour finaliser l’échange (paiement hors plateforme).');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'command_id' => $this->command->id,
            'total' => $this->command->total,
            'statut' => $this->command->statut,
        ];
    }
}
