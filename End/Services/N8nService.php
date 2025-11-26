<?php
// app/Services/N8nService.php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Exception;

class N8nService
{
    protected $baseUrl;
    protected $webhookUrls;

    public function __construct()
    {
        $this->baseUrl = config('services.n8n.url', 'http://localhost:5678');
        $this->webhookUrls = [
            'chat' => config('services.n8n.webhooks.chat', 'http://localhost:5678/webhook/chat-bot'),
            'program' => config('services.n8n.webhooks.program', 'http://localhost:5678/webhook/program-executor'),
        ];
    }

    /**
     * Send message to chat bot workflow
     */
    public function sendToChatBot(string $message)
    {
        try {
            $response = Http::timeout(30)->post($this->webhookUrls['chat'], [
                'chatInput' => $message,
                'userId' => 'user_' . uniqid() // Simple user ID for demo
            ]);

            if ($response->failed()) {
                throw new Exception('N8n service responded with error: ' . $response->status());
            }

            return $response->json();
            
        } catch (Exception $e) {
            throw new Exception("N8n Chat service unavailable: " . $e->getMessage());
        }
    }

    /**
     * Execute program through n8n workflow
     */
    public function executeProgram(array $programData)
    {
        try {
            $response = Http::timeout(60)->post($this->webhookUrls['program'], [
                'action' => 'execute',
                'program' => $programData['program'] ?? 'python',
                'script' => $programData['script'] ?? '',
                'args' => $programData['args'] ?? [],
                'userInput' => $programData['command'] ?? ''
            ]);

            if ($response->failed()) {
                throw new Exception('N8n program service error: ' . $response->status());
            }

            return $response->json();
            
        } catch (Exception $e) {
            throw new Exception("N8n Program service unavailable: " . $e->getMessage());
        }
    }

    /**
     * Check if n8n service is available
     */
    public function isAvailable(): bool
    {
        try {
            $response = Http::timeout(5)->get($this->baseUrl);
            return $response->successful();
        } catch (Exception $e) {
            return false;
        }
    }
}