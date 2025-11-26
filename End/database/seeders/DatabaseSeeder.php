<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('products')->insert([
            [
                'name' => 'iPhone 15 Pro',
                'description' => 'Dernier iPhone avec écran Dynamic Island et camera 48MP',
                'price' => 1229.00,
                'stock' => 50,
                'image' => 'iphone15-pro.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Samsung Galaxy S24',
                'description' => 'Smartphone Android avec écran AMOLED 120Hz',
                'price' => 899.99,
                'stock' => 35,
                'image' => 'galaxy-s24.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'MacBook Air M3',
                'description' => 'Ordinateur portable Apple avec puce M3',
                'price' => 1349.00,
                'stock' => 20,
                'image' => 'macbook-air-m3.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'AirPods Pro',
                'description' => 'Écouteurs sans fil avec réduction de bruit active',
                'price' => 279.00,
                'stock' => 100,
                'image' => 'airpods-pro.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'iPad Air',
                'description' => 'Tablette polyvalente avec puce M1',
                'price' => 749.00,
                'stock' => 30,
                'image' => 'ipad-air.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Apple Watch Series 9',
                'description' => 'Montre connectée avec capteur cardiaque',
                'price' => 429.00,
                'stock' => 75,
                'image' => 'apple-watch-9.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'PlayStation 5',
                'description' => 'Console de jeu next-gen avec SSD ultra-rapide',
                'price' => 499.99,
                'stock' => 15,
                'image' => 'ps5.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Nintendo Switch OLED',
                'description' => 'Console hybride avec écran OLED 7 pouces',
                'price' => 349.99,
                'stock' => 25,
                'image' => 'switch-oled.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Casque Sony WH-1000XM5',
                'description' => 'Casque audio avec annulation de bruit optimale',
                'price' => 399.99,
                'stock' => 40,
                'image' => 'sony-xm5.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Samsung TV 4K 55"',
                'description' => 'Téléviseur LED 4K UHD avec Smart TV',
                'price' => 599.00,
                'stock' => 10,
                'image' => 'samsung-tv-55.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}