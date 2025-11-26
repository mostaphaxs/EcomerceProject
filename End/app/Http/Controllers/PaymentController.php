<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentController extends Controller
{   
   
    public function Initiate(Request $request){
        if (!auth()->user()) {
                return response()->json(["Error" => "Login First"], 401);
        }
        $Validate = $request -> validate([
            'amount' => 'required|numeric|min:1' ,
            'description' => 'required|srting|max:250' ,
            'bank_name' => 'required|string' ,
        ]) ;


        $Transaction_ID = 'MAD_ ' . Str::random(16);

        $payment = Payment::create([
            'transaction_id' => $Transaction_ID ,
            'amount' => $Validate['amount'] ,
            'description' => $Validate['description'],
            'bank_name' => $Validate['bank_name'],
            'status' => 'pending',
            'currency' => 'MAD',
        ]);

         return response()->json([
            'success' => true,
            'message' => 'Paiement initié avec succès',
            'payment' => [
                'transaction_id' => $payment->transaction_id,
                'amount' => $payment->amount,
                'currency' => $payment->currency,
                'description' => $payment->description
            ]
        ]);


        
    }

    public function History(Request $request){

            $payment = Payment::with('user')
                -> where('user_id',auth()->user()->id )
                -> orderBy('created_at','desc')
                -> get()
            ;

            return response() ->  json(['Message' => $payment ]);
    } 


 
}
