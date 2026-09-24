<?php

namespace Database\Seeders;

use App\Models\Avis;
use App\Models\Category;
use App\Models\Cooperative;
use App\Models\Product;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::query()->where('label', 'admin')->firstOrFail();
        $artisanRole = Role::query()->where('label', 'artisan')->firstOrFail();
        $clientRole = Role::query()->where('label', 'client')->firstOrFail();

        User::query()->create([
            'firstname' => 'Amina',
            'lastname' => 'El Fassi',
            'email' => 'admin@terroir.ma',
            'mot_de_passe' => 'Password123',
            'telephone' => '0661000000',
            'role_id' => $adminRole->id,
        ]);

        $client = User::query()->create([
            'firstname' => 'Youssef',
            'lastname' => 'Benali',
            'email' => 'client@terroir.ma',
            'mot_de_passe' => 'Password123',
            'telephone' => '0662000000',
            'role_id' => $clientRole->id,
        ]);

        $categories = collect([
            'Huiles',
            'Épices',
            'Miels',
            'Produits du terroir',
        ])->mapWithKeys(fn ($name) => [$name => Category::query()->create(['name' => $name])]);

        $targanineUser = User::query()->create([
            'firstname' => 'Fatima',
            'lastname' => 'Ait Ouadrim',
            'email' => 'targanine@terroir.ma',
            'mot_de_passe' => 'Password123',
            'telephone' => '0661234567',
            'role_id' => $artisanRole->id,
        ]);

        $targanine = Cooperative::query()->create([
            'name' => 'Coopérative Targanine',
            'slug' => 'cooperative-targanine',
            'bio' => 'Coopérative féminine d’Essaouira. Pressage à froid d’huile d’argan depuis trois générations, avec traçabilité des noix jusqu’à la bouteille.',
            'hq_location' => 'Essaouira, Maroc',
            'status' => Cooperative::STATUS_APPROVED,
            'user_id' => $targanineUser->id,
        ]);

        $safranUser = User::query()->create([
            'firstname' => 'Hassan',
            'lastname' => 'Oukhouya',
            'email' => 'taliouine@terroir.ma',
            'mot_de_passe' => 'Password123',
            'telephone' => '0667654321',
            'role_id' => $artisanRole->id,
        ]);

        $safran = Cooperative::query()->create([
            'name' => 'Coopérative Taliouine',
            'slug' => 'cooperative-taliouine',
            'bio' => 'Producteurs de safran et d’épices du Souss. Cueillette manuelle à l’aube sur les versants de Taliouine.',
            'hq_location' => 'Taliouine, Souss-Massa',
            'status' => Cooperative::STATUS_APPROVED,
            'user_id' => $safranUser->id,
        ]);

        $pendingUser = User::query()->create([
            'firstname' => 'Khadija',
            'lastname' => 'Idrissi',
            'email' => 'pending@terroir.ma',
            'mot_de_passe' => 'Password123',
            'telephone' => '0663000000',
            'role_id' => $artisanRole->id,
        ]);

        Cooperative::query()->create([
            'name' => 'Rucher de l’Atlas',
            'slug' => 'rucher-de-latlas',
            'bio' => 'Miels de montagne en attente de validation admin.',
            'hq_location' => 'Ifrane, Moyen Atlas',
            'status' => Cooperative::STATUS_PENDING,
            'user_id' => $pendingUser->id,
        ]);

        $argan = Product::query()->create([
            'name' => 'Huile d’argan culinaire 250ml',
            'slug' => Str::slug('Huile argan culinaire 250ml'),
            'description' => 'Huile d’argan grillée, goût de noisette, pressée à froid.',
            'prix' => 180,
            'prix_remise' => 160,
            'stock' => 40,
            'coop_id' => $targanine->id,
            'cat_id' => $categories['Huiles']->id,
        ]);
        $argan->images()->create(['url' => 'https://picsum.photos/seed/argan/600/600', 'order' => 1]);

        $cosmetic = Product::query()->create([
            'name' => 'Huile d’argan cosmétique 100ml',
            'slug' => Str::slug('Huile argan cosmetique 100ml'),
            'description' => 'Huile d’argan vierge non grillée pour la peau et les cheveux.',
            'prix' => 120,
            'stock' => 25,
            'coop_id' => $targanine->id,
            'cat_id' => $categories['Huiles']->id,
        ]);
        $cosmetic->images()->create(['url' => 'https://picsum.photos/seed/argan2/600/600', 'order' => 1]);

        $safranProduct = Product::query()->create([
            'name' => 'Safran de Taliouine 1g',
            'slug' => Str::slug('Safran de Taliouine 1g'),
            'description' => 'Filaments de safran AOP, séchés naturellement.',
            'prix' => 95,
            'stock' => 60,
            'coop_id' => $safran->id,
            'cat_id' => $categories['Épices']->id,
        ]);
        $safranProduct->images()->create(['url' => 'https://picsum.photos/seed/safran/600/600', 'order' => 1]);

        Product::query()->create([
            'name' => 'Ras el hanout 100g',
            'slug' => Str::slug('Ras el hanout 100g'),
            'description' => 'Mélange d’épices du souk, torréfié à la coopérative.',
            'prix' => 45,
            'stock' => 80,
            'coop_id' => $safran->id,
            'cat_id' => $categories['Épices']->id,
        ])->images()->create(['url' => 'https://picsum.photos/seed/epices/600/600', 'order' => 1]);

        Product::query()->create([
            'name' => 'Amlou aux amandes 250g',
            'slug' => Str::slug('Amlou aux amandes 250g'),
            'description' => 'Pâte d’amandes, argan et miel — petit-déjeuner berbère.',
            'prix' => 85,
            'stock' => 30,
            'coop_id' => $targanine->id,
            'cat_id' => $categories['Produits du terroir']->id,
        ])->images()->create(['url' => 'https://picsum.photos/seed/amlou/600/600', 'order' => 1]);

        Avis::query()->create([
            'note' => 5,
            'comment' => 'Goût authentique, livraison discutée directement sur WhatsApp.',
            'status' => Avis::STATUS_APPROVED,
            'user_id' => $client->id,
            'product_id' => $argan->id,
        ]);

        Avis::query()->create([
            'note' => 3,
            'comment' => 'Avis en attente de modération.',
            'status' => Avis::STATUS_PENDING,
            'user_id' => $client->id,
            'product_id' => $safranProduct->id,
        ]);
    }
}
