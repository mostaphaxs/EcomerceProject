<?php
// app/Http/Controllers/ChatController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use App\Models\Product;

class ChatController extends Controller
{
    // Enhanced search configuration with better categories and synonyms
    private $searchConfig = [
    'categories' => [
        'electronics' => ['phone', 'laptop', 'computer', 'tablet', 'camera', 'headphone', 'smartphone', 'tech', 'electronic', 'device', 'gadget'],
        'fashion' => ['shirt', 'dress', 'shoe', 'jeans', 'jacket', 'fashion', 'clothing', 'wear', 'outfit', 'style', 'apparel'],
        'sports' => ['sport', 'sports', 'fitness', 'running', 'basketball', 'football', 'soccer', 'tennis', 'gym', 'exercise', 'workout', 'athletic', 'equipment', 'gear', 'lock', 'locking'],
        'home' => ['home', 'kitchen', 'furniture', 'appliance', 'decor', 'garden', 'house'],
        'beauty' => ['beauty', 'skincare', 'cosmetic', 'makeup', 'cream', 'lotion'],
        'books' => ['book', 'novel', 'read'],
        'toys' => ['toy', 'game', 'play', 'kids'],
        'health' => ['health', 'vitamin', 'supplement', 'medicine']
    ],
    'common_words' => ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'some', 'good', 'bro', 'dude', 'man', 'hey', 'hi', 'hello', 'please', 'thank', 'you', 'my', 'name', 'is', 'im', 'have', 'has', 'had', 'problem', 'issue'],
    'greetings' => ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'sup', 'yo', 'whats up', 'howdy'],
    'farewells' => ['bye', 'goodbye', 'see you', 'thanks', 'thank you', 'later', 'take care'],
    'help_words' => ['help', 'assist', 'support', 'guide', 'advice', 'suggestion', 'recomandations', 'recommendations', 'recommend', 'suggest'],
    'personal_words' => ['name', 'call', 'i am', 'im', 'my name', 'mustapha', 'mohamed', 'ahmed', 'ali'] // Common names
];

    public function sendMessage(Request $request): JsonResponse
{
    $request->validate([
        'message' => 'required|string|max:1000'
    ]);

    try {
        $userMessage = $request->message;
        
        \Log::info("User message received", ['message' => $userMessage]);
        
        // Step 1: Check for special cases (greetings, help, etc.)
        $specialResponse = $this->handleSpecialCases($userMessage);
        if ($specialResponse) {
            return response()->json([
                'success' => true,
                'response' => $specialResponse
            ]);
        }

        // Step 2: Advanced product search with multiple strategies
        $products = $this->advancedProductSearch($userMessage);
        
        // Step 3: If no products but we have category, do category search
        if (empty($products)) {
            $category = $this->detectCategory($userMessage);
            if ($category) {
                $products = Product::where('category', $category)
                                 ->where('stock', '>', 0)
                                 ->limit(6)
                                 ->get()
                                 ->toArray();
            }
        }
        
        // Step 4: Build intelligent prompt based on search results
        $prompt = $this->buildIntelligentPrompt($userMessage, $products);
        
        \Log::info("AI Prompt built", ['prompt_length' => strlen($prompt)]);
        
        // Step 5: Get AI response with better error handling
        try {
            $response = Http::timeout(30)->post('http://localhost:11434/api/generate', [
                'model' => 'gemma2:2b',
                'prompt' => $prompt,
                'stream' => false,
                'options' => [
                    'temperature' => 0.4,
                    'num_predict' => 200
                ]
            ]);

            if ($response->successful()) {
                $result = $response->json();
                $aiResponse = $result['response'] ?? 'I found some products for you!';
                
                // Step 6: Validate and sanitize the response
                $finalResponse = $this->validateAndSanitizeResponse($aiResponse, $products, $userMessage);
                
                return response()->json([
                    'success' => true,
                    'response' => $finalResponse
                ]);
            } else {
                throw new \Exception('AI service responded with error: ' . $response->status());
            }
            
        } catch (\Exception $aiException) {
            \Log::warning('AI service failed, using fallback', ['error' => $aiException->getMessage()]);
            // Fallback to rule-based response when AI is unavailable
            $fallbackResponse = $this->generateFallbackResponse($userMessage, $products);
            return response()->json([
                'success' => true,
                'response' => $fallbackResponse
            ]);
        }
        
    } catch (\Exception $e) {
        \Log::error('Chat controller error: ' . $e->getMessage(), [
            'exception' => $e,
            'user_message' => $request->message ?? 'unknown'
        ]);
        
        // Final fallback - never show error to user
        return response()->json([
            'success' => true,
            'response' => "I'm here to help! It looks like you're interested in sports products. We have various sports gear available. What specific sport are you looking for?"
        ]);
    }
}
    
    /**
     * HANDLE SPECIAL CASES BEFORE PRODUCT SEARCH
     */
    private function handleSpecialCases(string $message): ?string
{
    $message = strtolower(trim($message));
    
    // Handle personal introductions
    if (preg_match('/(my name is|i am|i\'m|call me|im)\s+([a-z\s]+)/i', $message, $matches)) {
        $name = trim($matches[2]);
        return "Nice to meet you, {$name}! 👋 I'm your ShopMe assistant. How can I help you with products today?";
    }
    
    // Handle problem reports
    if (preg_match('/(problem|issue|error|bug|not working|broken|help me|trouble|difficult)/i', $message)) {
        return "I'm sorry you're experiencing a problem! For technical issues, order support, or account help, please contact our support team at support@shopme.com or call (555) 123-HELP. They'll get you sorted out quickly!";
    }
    
    // Handle "how are you" and similar
    if (preg_match('/(how are you|how do you do|what\'s up)/i', $message)) {
        return "I'm doing great, thanks for asking! Ready to help you find some awesome products. What are you looking for today?";
    }
    
    // Handle casual language and typos
    if (strpos($message, 'bro') !== false || strpos($message, 'dude') !== false) {
        if (strpos($message, 'recomandations') !== false || strpos($message, 'recommendations') !== false) {
            return "Hey there! I'd be happy to give you recommendations. What type of products are you interested in? Like electronics, sports, fashion, etc.?";
        }
    }
    
    // Handle "looking for" queries (including typos)
    if (preg_match('/(looking|locking|searching|find).*sports/', $message)) {
        $sportsProducts = Product::where('category', 'sports')->where('stock', '>', 0)->limit(5)->get();
        
        if ($sportsProducts->count() > 0) {
            $productList = "";
            foreach ($sportsProducts as $product) {
                $productList .= "• {$product->name} - \${$product->price}\n";
            }
            return "Sure! Here are some sports products we have:\n{$productList}Which one interests you?";
        } else {
            return "We currently don't have sports products in stock, but check back soon!";
        }
    }
    
    // Greetings with casual language
    foreach ($this->searchConfig['greetings'] as $greeting) {
        if (strpos($message, $greeting) !== false && strlen($message) < 50) {
            $casualGreetings = [
                "Hey! What's up?", 
                "Hi there!", 
                "Hello!", 
                "Hey! How can I help?",
                "Hi! Ready to find some great products?",
                "Hello there! What can I help you find today?"
            ];
            return $casualGreetings[array_rand($casualGreetings)];
        }
    }
    
    // General recommendations request
    if (strpos($message, 'recommend') !== false || strpos($message, 'recomand') !== false) {
        if (strlen($message) < 30) { // Short message like "some recommendations"
            $categories = implode(', ', array_keys($this->searchConfig['categories']));
            return "I'd love to recommend some products! What category are you interested in? We have: {$categories}. Or tell me what you're looking for!";
        }
    }
    
    return null;
}
    
    /**
     * ENHANCED ADVANCED PRODUCT SEARCH WITH MULTIPLE STRATEGIES
     */
    private function advancedProductSearch(string $message): array
    {
        $searchTerms = $this->extractSearchTerms($message);
        $detectedCategory = $this->detectCategory($message);
        
        \Log::info("Search debug", [
            'message' => $message,
            'terms' => $searchTerms,
            'category' => $detectedCategory
        ]);

        $query = Product::where('stock', '>', 0);

        // Strategy 1: Direct keyword matching (highest priority)
        if (!empty($searchTerms['exact_terms'])) {
            $query->where(function($q) use ($searchTerms) {
                foreach ($searchTerms['exact_terms'] as $term) {
                    $q->orWhere('name', 'LIKE', "%{$term}%")
                      ->orWhere('description', 'LIKE', "%{$term}%")
                      ->orWhere('category', 'LIKE', "%{$term}%");
                }
            });
        }

        // Strategy 2: Category-based search
        if ($detectedCategory && (empty($searchTerms['exact_terms']) || count($searchTerms['exact_terms']) < 2)) {
            $query->orWhere('category', $detectedCategory);
        }

        // Strategy 3: Related terms search (broader search)
        if (!empty($searchTerms['related_terms']) && (empty($searchTerms['exact_terms']) || count($products = $query->get()) < 3)) {
            $query->orWhere(function($q) use ($searchTerms) {
                foreach ($searchTerms['related_terms'] as $term) {
                    $q->orWhere('name', 'LIKE', "%{$term}%")
                      ->orWhere('description', 'LIKE', "%{$term}%")
                      ->orWhere('category', 'LIKE', "%{$term}%");
                }
            });
        }

        // If no specific search terms and no category, return empty to avoid random recommendations
        if (empty($searchTerms['exact_terms']) && empty($searchTerms['related_terms']) && !$detectedCategory) {
            return [];
        }

        $products = $query->limit(10)->get()->map(function($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => number_format($product->price, 2),
                'category' => $product->category,
                'stock' => $product->stock,
                'description' => substr($product->description, 0, 100) // Truncate for prompt
            ];
        })->toArray();

        \Log::info("Products found", ['count' => count($products)]);
        
        return $products;
    }
    
    /**
     * IMPROVED SEARCH TERM EXTRACTION
     */
    private function extractSearchTerms(string $message): array
    {
        $words = str_word_count(strtolower(trim($message)), 1);
        
        $exactTerms = [];
        $relatedTerms = [];
        
        foreach ($words as $word) {
            $word = preg_replace('/[^\w]/', '', $word);
            
            if (strlen($word) < 2 || in_array($word, $this->searchConfig['common_words'])) {
                continue;
            }
            
            // Check if word is a direct product-related term
            if ($this->isProductTerm($word)) {
                $exactTerms[] = $word;
            } else if (strlen($word) > 3) {
                $relatedTerms[] = $word;
            }
        }
        
        return [
            'exact_terms' => array_slice(array_unique($exactTerms), 0, 5),
            'related_terms' => array_slice(array_unique($relatedTerms), 0, 3)
        ];
    }
    
    private function isProductTerm(string $word): bool
{
    // Skip personal and common non-product words
    $nonProductWords = ['mustapha', 'problem', 'issue', 'error', 'name', 'call', 'help', 'support'];
    
    if (in_array($word, $nonProductWords)) {
        return false;
    }
    
    // Flatten all category keywords
    $allKeywords = [];
    foreach ($this->searchConfig['categories'] as $keywords) {
        $allKeywords = array_merge($allKeywords, $keywords);
    }
    
    $productTerms = array_merge($allKeywords, [
        'product', 'item', 'buy', 'purchase', 'shop', 'shopping', 
        'price', 'cost', 'sale', 'discount', 'deal', 'offer'
    ]);
    
    return in_array($word, $productTerms) || strlen($word) > 3;
}
    
    /**
     * IMPROVED CATEGORY DETECTION
     */
    private function detectCategory(string $message): ?string
    {
        $message = strtolower($message);
        
        $categoryScores = [];
        
        foreach ($this->searchConfig['categories'] as $category => $keywords) {
            $score = 0;
            foreach ($keywords as $keyword) {
                // Higher score for exact matches
                if (preg_match('/\b' . preg_quote($keyword, '/') . '\b/', $message)) {
                    $score += 2;
                } else if (strpos($message, $keyword) !== false) {
                    $score += 1;
                }
            }
            $categoryScores[$category] = $score;
        }
        
        // Return category with highest score, if above threshold
        arsort($categoryScores);
        $topCategory = array_key_first($categoryScores);
        
        return $categoryScores[$topCategory] > 1 ? $topCategory : null;
    }
    
    /**
     * ENHANCED INTELLIGENT PROMPT BUILDER
     */
    private function buildIntelligentPrompt(string $message, array $products): string
    {
        $messageContext = strtolower(trim($message));
        
        // Handle no products found
        if (empty($products)) {
            return $this->buildNoProductsPrompt($messageContext);
        }
        
        // Handle products found
        return $this->buildProductsPrompt($messageContext, $products);
    }
    
    private function buildNoProductsPrompt(string $message): string
{
    // Check if this is a personal conversation, not product search
    if ($this->isPersonalConversation($message)) {
        return <<<PROMPT
You are ShopMe AI shopping assistant. The customer said: "{$message}"

This appears to be a personal conversation, not a product search.

RESPONSE GUIDELINES:
1. Be friendly and conversational
2. If they introduced themselves, acknowledge their name
3. If they have a problem, direct them to support
4. Gently steer conversation back to shopping assistance
5. Keep response under 2 sentences
6. Be helpful and polite

Your response:
PROMPT;
    }

    $categories = implode(', ', array_keys($this->searchConfig['categories']));
    
    return <<<PROMPT
You are ShopMe AI shopping assistant. The customer asked: "{$message}"

No specific products were found matching their query.

RESPONSE GUIDELINES:
1. Politely acknowledge you couldn't find exact matches
2. Suggest trying different search terms
3. Mention main categories: {$categories}
4. Keep response helpful and under 3 sentences
5. Don't invent or make up products
6. Be encouraging and friendly

Your response:
PROMPT;
}

private function isPersonalConversation(string $message): bool
{
    $personalPatterns = [
        '/my name is/i',
        '/i am/i', 
        '/i\'m/i',
        '/im /i',
        '/call me/i',
        '/i have a problem/i',
        '/i need help/i',
        '/how are you/i'
    ];
    
    foreach ($personalPatterns as $pattern) {
        if (preg_match($pattern, $message)) {
            return true;
        }
    }
    
    return false;
}
    private function buildProductsPrompt(string $message, array $products): string
    {
        $productList = "";
        foreach ($products as $index => $product) {
            $stockStatus = $product['stock'] > 10 ? 'In Stock' : ($product['stock'] > 0 ? 'Low Stock' : 'Out of Stock');
            $productList .= "{$index}. {$product['name']} - \${$product['price']} ({$product['category']}) - {$stockStatus}\n";
        }

        return <<<PROMPT
You are ShopMe AI shopping assistant. The customer asked: "{$message}"

AVAILABLE PRODUCTS (STRICTLY USE ONLY THESE - DO NOT INVENT PRODUCTS):
{$productList}

RESPONSE RULES:
1. ONLY recommend products from the list above - NEVER invent products
2. Use EXACT product names, prices, and categories as shown
3. Recommend 2-4 most relevant products based on the query
4. If query is broad, suggest popular or well-rated items
5. Be enthusiastic but truthful about availability
6. Include pricing and stock information naturally
7. Keep response conversational and under 5 sentences
8. End with an encouraging call-to-action

BAD EXAMPLE (DO NOT DO THIS):
- "I recommend the XYZ Phone" (if not in list)
- "We have laptops starting at $199" (if no $199 laptop in list)

GOOD EXAMPLE:
"For gaming laptops, I found these great options:
- Gaming Pro Laptop - $999 (Electronics) - In Stock
......

Both are excellent for gaming and available now!"

Your response to "{$message}":
PROMPT;
    }
    
    /**
     * IMPROVED RESPONSE VALIDATION AND SANITIZATION
     */
    private function validateAndSanitizeResponse(string $aiResponse, array $products, string $originalMessage): string
    {
        // If no products, ensure AI doesn't recommend anything
        if (empty($products)) {
            if ($this->containsProductRecommendations($aiResponse)) {
                return "I searched but couldn't find products exactly matching \"{$originalMessage}\". Try using different keywords or browse our main categories. I'm here to help!";
            }
            return $aiResponse;
        }
        
        // Validate that AI only recommends existing products
        $productNames = array_column($products, 'name');
        $recommendedProducts = $this->extractRecommendedProducts($aiResponse, $productNames);
        
        if (empty($recommendedProducts)) {
            // AI didn't recommend any real products - create safe response
            return $this->generateSafeProductResponse($products, $originalMessage);
        }
        
        // Additional check for invented products
        if ($this->containsInventedProducts($aiResponse, $productNames)) {
            return $this->generateSafeProductResponse($products, $originalMessage);
        }
        
        return $aiResponse;
    }
    
    private function containsProductRecommendations(string $response): bool
    {
        $productIndicators = ['recommend', 'suggest', 'you should', 'try', 'check out', 'consider', 'found these', 'here are', 'available'];
        
        foreach ($productIndicators as $indicator) {
            if (stripos($response, $indicator) !== false) {
                return true;
            }
        }
        
        return false;
    }
    
    private function extractRecommendedProducts(string $response, array $validProducts): array
    {
        $foundProducts = [];
        
        foreach ($validProducts as $product) {
            // Use word boundaries to avoid partial matches
            if (preg_match('/\b' . preg_quote($product, '/') . '\b/i', $response)) {
                $foundProducts[] = $product;
            }
        }
        
        return $foundProducts;
    }
    
    private function containsInventedProducts(string $response, array $validProducts): bool
    {
        // Look for product-like patterns that aren't in our valid products
        preg_match_all('/\b[A-Z][a-z]+(?:\s+[A-Z]?[a-z]*)*\b/', $response, $potentialProducts);
        
        foreach ($potentialProducts[0] as $potentialProduct) {
            // Skip if it's a common phrase or too short
            if (strlen($potentialProduct) < 3 || in_array(strtolower($potentialProduct), ['shop', 'store', 'product', 'item'])) {
                continue;
            }
            
            // Check if it looks like a product name but isn't in our list
            $isProductLike = preg_match('/\b(phone|laptop|computer|shoe|shirt|dress|book|game|tool)\b/i', $potentialProduct);
            if ($isProductLike && !in_array($potentialProduct, $validProducts)) {
                \Log::warning("Potential invented product detected: " . $potentialProduct);
                return true;
            }
        }
        
        return false;
    }
    
    private function generateSafeProductResponse(array $products, string $originalMessage): string
    {
        $productNames = array_column($products, 'name');
        $sampleProducts = array_slice($productNames, 0, min(3, count($productNames)));
        
        if (count($sampleProducts) > 1) {
            $lastProduct = array_pop($sampleProducts);
            $productList = count($sampleProducts) ? implode(', ', $sampleProducts) . " or " . $lastProduct : $lastProduct;
        } else {
            $productList = $sampleProducts[0] ?? '';
        }
        
        return "For \"{$originalMessage}\", we have products like {$productList}. Would you like me to provide more details about any of these options?";
    }
    
    private function generateFallbackResponse(string $message, array $products): string
{
    $message = strtolower($message);
    
    // Handle personal conversations in fallback too
    if (preg_match('/(my name is|i am|i\'m|im)\s+([a-z\s]+)/i', $message, $matches)) {
        $name = trim($matches[2]);
        return "Nice to meet you, {$name}! I'm here to help you find products. What are you looking for today?";
    }
    
    if (strpos($message, 'problem') !== false || strpos($message, 'issue') !== false) {
        return "I'm sorry you're having trouble! Please contact our support team at support@shopme.com for assistance with problems or issues.";
    }
    
    // Handle sports-related queries
    if (strpos($message, 'sport') !== false || strpos($message, 'lock') !== false) {
        $sportsItems = ["basketballs", "running shoes", "fitness equipment", "sports apparel", "tennis rackets"];
        $sample = implode(', ', array_slice($sportsItems, 0, 3));
        return "For sports, we have items like {$sample}. What specific sport are you interested in?";
    }
    
    if (empty($products)) {
        return "How can I help you with products today? You can ask about specific items or browse categories like electronics, fashion, sports, etc.";
    }
    
    $productNames = array_column($products, 'name');
    $sampleProducts = array_slice($productNames, 0, min(3, count($productNames)));
    
    return "I found these for you: " . implode(', ', $sampleProducts) . ". Want details about any of these?";
}
}