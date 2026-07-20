<?php

return [
    'paths' => ['*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'https://darlington-wosa-art.vercel.app', 'https://darlingtonwosa.art', 'https://www.darlingtonwosa.art', 'https://api.darlingtonwosa.art'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
