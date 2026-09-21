<?php

namespace App\Support;

class WhatsApp
{
    /**
     * Normalize a phone number to digits for wa.me/{number}?text=...
     * Moroccan local numbers (06/07) are converted to international 212...
     */
    public static function number(?string $telephone): ?string
    {
        if ($telephone === null || trim($telephone) === '') {
            return null;
        }

        $digits = preg_replace('/\D+/', '', $telephone) ?? '';

        if ($digits === '') {
            return null;
        }

        if (str_starts_with($digits, '00')) {
            $digits = substr($digits, 2);
        }

        if (strlen($digits) === 10 && str_starts_with($digits, '0')) {
            $digits = '212'.substr($digits, 1);
        }

        if (strlen($digits) === 9 && (str_starts_with($digits, '6') || str_starts_with($digits, '7'))) {
            $digits = '212'.$digits;
        }

        return $digits;
    }
}
