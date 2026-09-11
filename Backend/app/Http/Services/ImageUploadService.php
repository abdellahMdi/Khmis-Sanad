<?php

namespace App\Http\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUploadService
{
    /**
     * Store a single image on the configured disk and return its public URL.
     *
     * @param  UploadedFile  $file
     * @param  string        $folder   e.g. 'products', 'cooperatives'
     * @param  string        $disk     default: 'public'  (use 's3' in production)
     * @return string        Public URL to store in the database
     */
    public function store(UploadedFile $file, string $folder = 'products', string $disk = 'public'): string
    {
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();

        $path = $file->storeAs($folder, $filename, $disk);

        return Storage::disk($disk)->url($path);
    }

    /**
     * Store multiple images and return an array of ordered URL records.
     *
     * @param  UploadedFile[]  $files
     * @return array<array{url:string, order:int}>
     */
    public function storeMany(array $files, string $folder = 'products', string $disk = 'public'): array
    {
        $results = [];

        foreach ($files as $index => $file) {
            $results[] = [
                'url'   => $this->store($file, $folder, $disk),
                'order' => $index,
            ];
        }

        return $results;
    }

    /**
     * Delete an image from storage given its URL.
     */
    public function delete(string $url, string $disk = 'public'): bool
    {
        // Extract the relative path from the full URL
        $path = str_replace(Storage::disk($disk)->url(''), '', $url);

        return Storage::disk($disk)->delete($path);
    }
}
