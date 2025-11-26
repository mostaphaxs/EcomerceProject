<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Payment extends Model
{
    use HasFactory,Notifiable ; 
       /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */

    protected $fillable = [
        
        'transaction_id',
        'user_id', 
        'amount',
        'currency',
        'status',
        'description',
        'bank_name',
        'cmi_transaction_id',
        'bank_response',
        'paid_at'

    ];

    protected $casts = [
        'paid_at' => 'datetime', 
        'amount' => 'deciaml:2'
    ];

       public static function generateTransactionId(){
        do {

            $Transaction_ID = 'MAD_ '. Str::random(16);

        }

        while(self::where('transaction_id', $Transaction_ID));

        return $Transaction_ID ; 
    }




    public function isPending(){
        return $this -> status === "pending";
    }

     public function isProcessing(){
        return $this -> status === "processing";

    }

     public function isFailed(){
        return $this -> status === "failed";

    }

     public function isCompleted(){
        return $this -> status === "completed";

    }


    public function markAsProcessing(){
        $this -> status = 'processing' ;
        $this -> save();
    }


    public function markAsCompleted($cmiTransactionId = null,$bankResponse = null){
        $this -> update([
            "status" => "completed",
            "cmi_transaction_id" => $cmiTransactionId,
            "bank_response" => $bankResponse ,
            "paid_at" => now()
        ]);
    }


    public function markAsFailed($bankResponse = null){
        $this -> update([
            "status" => "failed",  
            "bank_response" => $bankResponse ,
        ]);
    }

      public function markAsCancelled()
    {
        $this->update(['status' => 'cancelled']);
    }


    public function scopePending($query){
        return $query -> where('status','pending') ;
    }


    public function scopeCompleted($query){
        return $query -> where('status','completed') ;
    }


    public function scopeFailed($query){
        return $query -> where('status','failed') ;
    }

    public function scopeProcessing($query){
        return $query -> where('status','processing') ;
    }
    public function user(){
        return $this->belongsTo(User::class);
        
    }


   

}
