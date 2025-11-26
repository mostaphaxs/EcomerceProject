<!DOCTYPE html>
<html>
<head>
    <title>Order Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; text-align: center; }
        .order-details { background: #fff; padding: 20px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    
    <div class="container">
        <div class="header">
            <h1>Order Confirmed!</h1>
            <p>Thank you for your purchase!</p>
        </div>
        
        <div class="order-details">
            <h2>Order Details</h2>
            <p><strong>Order Number:</strong> #{{ $order->id}}</p>
            <p><strong>Order Date:</strong> {{ $order->created_at->format('F j, Y') }}</p>
            <p><strong>Total Amount:</strong> ${{ number_format($order->total_payment, 2) }}</p>
            
            <h3>Items Ordered:</h3>
            <ul>


                @foreach(json_decode($order->items, true) as $item)

                    <li>{{ $item['name'] }} - ${{ number_format($item['price'], 2) }} x {{ $item['quantity'] }}</li>

                @endforeach


            </ul>
            
            <h3>Shipping Address:</h3>
            <p>
                {{ $order->shipping_address}}<br>
                {{ $order->detailed_shipping_address}}, {{ $order->status }} {{ $order->special_instructions }}
            </p>
        </div>
        
        <div class="footer">
            <p>If you have any questions, please contact our support team.</p>
            <p>&copy; {{ date('Y') }} Your Company Name. All rights reserved.</p>
        </div>
    </div>
</body>
</html>