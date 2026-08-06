<?php

/**
 * Temp Laravel Cache Clear Utility
 * Place this file inside your Laravel backend 'public/' directory (e.g. public/run.php).
 * Visit https://api.darlingtonwosa.art/run.php to execute, then delete this file immediately!
 */

// Load Laravel Bootstrap
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';

// Bootstrap Console Kernel
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

header('Content-Type: text/plain');
echo "--- DARLINGTON WOSA ART & FRAMES CACHE CLEAR ---\n\n";

try {
    echo "1. Clearing Config Cache...\n";
    \Illuminate\Support\Facades\Artisan::call('config:clear');
    echo \Illuminate\Support\Facades\Artisan::output() . "\n";

    echo "2. Clearing Route Cache...\n";
    \Illuminate\Support\Facades\Artisan::call('route:clear');
    echo \Illuminate\Support\Facades\Artisan::output() . "\n";

    echo "3. Clearing Application Cache...\n";
    \Illuminate\Support\Facades\Artisan::call('cache:clear');
    echo \Illuminate\Support\Facades\Artisan::output() . "\n";

    echo "4. Clearing Compiled Services Cache...\n";
    \Illuminate\Support\Facades\Artisan::call('clear-compiled');
    echo "Done.\n\n";

    echo "SUCCESS: All Laravel caches have been cleared successfully!\n";
    echo "⚠️ IMPORTANT: Please DELETE this 'public/run.php' file from your server immediately for security.";
} catch (\Exception $e) {
    echo "ERROR executing commands: " . $e->getMessage() . "\n";
}
