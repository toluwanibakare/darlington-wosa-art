<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class GzipResponse
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (in_array('gzip', $request->getEncodings()) && function_exists('gzencode')) {
            // Compress only text/HTML/JSON-like responses (don't compress binary files like images which are already compressed/handled)
            $contentType = $response->headers->get('Content-Type');
            if (is_string($contentType) && (
                str_contains($contentType, 'application/json') ||
                str_contains($contentType, 'text/html') ||
                str_contains($contentType, 'text/plain') ||
                str_contains($contentType, 'text/css') ||
                str_contains($contentType, 'application/javascript')
            )) {
                $content = $response->getContent();
                if ($content !== false && strlen($content) > 1024) {
                    $compressed = gzencode($content, 5);
                    if ($compressed !== false) {
                        $response->setContent($compressed);
                        $response->headers->set('Content-Encoding', 'gzip');
                        $response->headers->set('Content-Length', strlen($compressed));
                    }
                }
            }
        }

        return $response;
    }
}
