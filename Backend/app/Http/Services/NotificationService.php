<?php

namespace App\Http\Services;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Notifications\DatabaseNotification;

class NotificationService
{
    /**
     * Return paginated notifications for the given user.
     * Unread notifications appear first.
     */
    public function listForUser(User $user, int $perPage = 20): LengthAwarePaginator
    {
        return $user->notifications()
            ->orderByRaw('read_at IS NULL DESC')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Return only unread notifications for the user.
     */
    public function unread(User $user): Collection
    {
        return $user->unreadNotifications()->get();
    }

    /**
     * Mark a specific notification as read.
     */
    public function markRead(User $user, string $notificationId): void
    {
        /** @var DatabaseNotification|null $notification */
        $notification = $user->notifications()->findOrFail($notificationId);
        $notification->markAsRead();
    }

    /**
     * Mark all of the user's notifications as read.
     */
    public function markAllRead(User $user): void
    {
        $user->unreadNotifications()->update(['read_at' => now()]);
    }

    /**
     * Delete a specific notification.
     */
    public function delete(User $user, string $notificationId): void
    {
        $user->notifications()->findOrFail($notificationId)->delete();
    }

    /**
     * Count of unread notifications for badge display.
     */
    public function unreadCount(User $user): int
    {
        return $user->unreadNotifications()->count();
    }
}
