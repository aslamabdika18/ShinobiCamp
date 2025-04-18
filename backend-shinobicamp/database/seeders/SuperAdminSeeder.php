<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Buat role superadmin
        $superadminRole = Role::create(['name' => 'superadmin']);

        // Buat permission untuk manajemen event
        $permissions = [
            'view events',
            'create events',
            'edit events',
            'delete events',
            'manage events',
            'manage roles',
            'manage permissions',
            'manage users',
            'manage all'
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Berikan semua permission ke superadmin
        $allPermissions = Permission::all();
        $superadminRole->syncPermissions($allPermissions);

        // Buat user superadmin default
        $superadmin = User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@shinobi.com',
            'password' => bcrypt('password'),
        ]);

        // Assign role superadmin
        $superadmin->assignRole('superadmin');

        // Update role admin dengan permission yang sesuai
        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole) {
            $adminPermissions = Permission::whereIn('name', [
                'view events',
                'create events',
                'edit events',
                'delete events',
                'manage events'
            ])->get();

            $adminRole->syncPermissions($adminPermissions);
        }
    }
}
