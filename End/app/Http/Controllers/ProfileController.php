<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth; 
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    

    public function Profile(Request $request )

{
    
    $user = Auth::user();
    return response()-> json(['message'=> $user  ],200);


}


public function Save(Request $request){
    
    $user = Auth::user();
   

    if ($request -> has("name") )


    {

         $Validated = $request -> validate([
            "name" =>"Required|string|min:8",
        ]);
        

        $user -> name = $Validated["name"];
        
        $user -> save();
        return response() -> json(["message" => "name sucessfuly got updated "],201);


    }

    else if ($request -> has("email") and $request -> has("oldpassword"))

    {

        
             $Validated = $request -> validate([
                "email" =>"Required|email:rfc,strict,dns,proof,filter|unique:users",
                "oldpassword" =>"Required|string|min:8"
            ]);
            if (!Hash::check($Validated["oldpassword"] ,$user-> password )){
                return response() -> json(["message" => "The Password is not correct" ],500);
            }


            if (!User::where("email",$Validated["email"]) -> first() ){
                    
                $user -> email = $Validated["email"];
                $user -> save();
            return response() -> json(["message" => "email sucessfuly got updated "],201);
           

        }
        
       
            return response() -> json(["message" => "The email is already existed  " ],500);

        
        
          
            
       
        
    
        
       

    }
    else if ($request -> has("oldpassword") && $request -> has("newpassword"))
    {
         $Validated = $request -> validate([
                "newpassword" =>"Required|string|min:8",
                "oldpassword" =>"Required|string|min:8"
            ]);
        if (Hash::check($request->input("oldpassword"),$user->password))
        {
            $user -> password = hash::make($request -> $Validated["newpassword"])  ;
            $user -> save();
            return response() -> json(["message" => "password sucessfuly got updated "],201);
            
        }
        
        
            return response() -> json(["message" => "the Old password is incorect "],401);

    }
    else {
            return response() -> json(["message" => "There is an error "],500);

    }
        


    
}




    public function updateImage(Request $request)
{
    try {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = auth()->user();
        
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $filename = 'profile-' . $user->id . '-' . time() . '.' . $image->getClientOriginalExtension();
            
            $path = $image->storeAs('profile-images', $filename, 'public');
            
            \Log::info('Image stored at: ' . $path);

            if ($user->image) {
                if (Storage::disk('public')->exists('profile-images/' . $user->image)) {
                    Storage::disk('public')->delete('profile-images/' . $user->image);
                }
            }
            
            $user->image = $filename;
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Image uploaded successfully',
                'image_url' => asset('storage/profile-images/' . $filename),
                'storage_path' => $path 
            ]);

        }

    } catch (\Exception $e) {
        \Log::error('Upload error: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ], 500);
    }
}

}
