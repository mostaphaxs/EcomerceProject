import axios from "axios"
import { useEffect, useState,useContext } from "react"
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
 import { AllthePageCanUseIt } from "../main"
 import StarRating from './StarRating';

 
export default function Cart() {
  interface MessageType {
    message: string,
    color: string
  }

  interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
  }

  interface User {
    id: number;
    name: string;
    email: string;
    image: string | null;
    Admin: number;
  }

  interface TypeCart {
    id: number;
    quantity: number;
    canceled: boolean;
    product_id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    product: Product;
    user: User;
    OrderRating?: number;
  }


  const [Carts, setCarts] = useState<TypeCart[]>([])
  const [Message, setMessage] = useState<MessageType>({ message: "", color: "" })
  const [Max, SetMax] = useState<number>(0)
  const Navigate = useNavigate()
  const [ConfirmActivated, setConfirmActivated] = useState<boolean>(true)
  const { t } = useTranslation()
   const { WishListValue, SetWishListValue, CartValue, SetCartValue } = useContext(AllthePageCanUseIt);

  useEffect(() => {
    const Process = async () => {
      try {
        const Token = localStorage.getItem("Token")
        const Response = await axios.get("/api/CartView", {
          headers: { Authorization: `Bearer ${Token}` }
        })
        setCarts(Response.data[1])
        console.log(Response.data[1])

      } catch (error) {
        console.log(error)
      }
    }
    Process()
  }, [])

  useEffect(() => {
    const total = Carts.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
    SetMax(total);
    console.log("max", total)
  }, [Carts])

const handleRatingChange = (rating: number, idCart: number) => {
  setCarts(prevCarts => 
  prevCarts.map(cart => 
    cart.id === idCart ? { ...cart, OrderRating: rating } : cart
  )
);
};
  async function Procédure(IdCart: number, Op: string) {
    try {
      const currentCart = Carts.find(cart => cart.id === IdCart);
      if (!currentCart) return;

      const newQuantity = Op === "+" ? currentCart.quantity + 1 : currentCart.quantity - 1;

      if (newQuantity < 1) {
        setMessage({ message: t('cannot_less_than_one'), color: 'red' });
        return;
      }

      setCarts(Prev =>
        Prev.map(cart =>
          cart.id === IdCart ? { ...cart, quantity: newQuantity } : cart
        )
      );

      setMessage({ message: t('successfully'), color: 'green' });

      const Token = localStorage.getItem("Token");
      const Info = {
        IdCart: IdCart,
        Q: newQuantity
      };

      const Response = await axios.post('/api/ModifyCart', Info, {
        headers: { Authorization: `Bearer ${Token}` }
      });

      console.log(Response);

      if (Response.status !== 200) {
        setCarts(Prev =>
          Prev.map(cart =>
            cart.id === IdCart ? { ...cart, quantity: currentCart.quantity } : cart
          )
        );
        setMessage({ message: t('failed_to_update'), color: 'red' });
      }

    } catch (error) {
      console.log(error);
      setCarts(Prev =>
        Prev.map(cart =>
          cart.id === IdCart ? { ...cart, quantity: Carts.find(c => c.id === IdCart)?.quantity || 0 } : cart
        )
      );
      setMessage({ message: t('error_updating_cart'), color: 'red' });
    }
  }

  async function Confirm(e: React.MouseEvent): Promise<void> {
    const UserId = Carts[0].user.id
    const Token = localStorage.getItem("Token")

    const Info = {
      user_id: UserId,
      Cart: Carts,
      TotalPayment: Max,
      shipping_address: t('not_known_yet'),
      payment_method: "cash",
      detailed_shipping_address: t('not_known_yet'),
      special_instructions: t('not_known_yet'),
      phone_number: t('not_known_yet'),
    }
    console.log(Info)
    try {
      const Response = await axios.post("/api/ToOrders", Info, {
        headers: { Authorization: `Bearer ${Token}` }
      })

      console.log(Response.data.message)
      console.log(Carts)

      setMessage({ message: t('successfully_added_to_orders'), color: "green" })
      SetCartValue(prev => 0 ) 
    
      setTimeout(() => {
        Navigate("/Orders")
        setConfirmActivated(true)
      }, 1500)
               

    }
    catch (error: any) {
      console.log("Error", error.response.data.error)
        SetCartValue(prev => 0 ) 
      setConfirmActivated(true)
      setMessage({ message: `${error.response.data.error} `, color: "red" })
              

    }
  }

  async function Cancel(e: React.MouseEvent): Promise<void> {
    const { id } = e.currentTarget;
    const CartId = parseInt(id);

    if (isNaN(CartId)) {
      console.error('Invalid cart ID');
      return;
    }

    const Token = localStorage.getItem('Token');

    try {
      const Response = await axios.post('/api/DeleteCart',
        { CartId },
        {
          headers: { Authorization: `Bearer ${Token}` }
        }
      );

      console.log(Response.data);

      setCarts(prev =>
        prev.filter(cart => cart.id !== CartId)
      );
               SetCartValue(prev => prev - 1  ) 


      setMessage({ message: t('product_removed_successfully'), color: 'green' });


    } catch (error) {
      console.log(error);
                SetCartValue(prev => prev - 1  ) 


      setMessage({ message: t('error_removing_product'), color: 'red' });
        

    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

 return (
  
  <div className="min-h-screen bg-gray-50 py-8">
     
    {Carts.length === 0 ? (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-24 h-24 text-gray-400 mb-6">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('your_cart_is_empty')}</h3>
        <p className="text-gray-600 mb-6 max-w-md">{t('add_products_to_start_shopping')}</p>
        <button
          onClick={() => Navigate("/products")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          {t('discover_our_products')}
        </button>
      </div>
    ) : (
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('my_cart')}</h1>
          <p className="text-gray-600">{t('check_your_items_before_ordering')}</p>
        </div>

        {Message.message && (
          <div className={`mb-6 p-4 rounded-lg ${
            Message.color === 'red' 
              ? 'bg-red-50 border border-red-200 text-red-800' 
              : 'bg-green-50 border border-green-200 text-green-800'
          }`}>
            {Message.message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-700 font-medium">{t('cart_total')}:</span>
              <span className="text-2xl font-bold text-gray-900 ml-2">{formatCurrency(Max)}</span>
            </div>
            {ConfirmActivated && (
              <button 
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                onClick={(e) => {
                  Confirm(e), setConfirmActivated(prev => !prev)
                }}
              >
                {t('confirm_order')}
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {Carts.map(cart => (
            <div key={cart.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                {/* Product Image */}
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{cart.product.name}</h3>
                  <p className="text-xl font-bold text-gray-900 mb-3">{formatCurrency(cart.product.price)} </p>
                   <StarRating 
                    initialRating={4}
                    onRatingChange={handleRatingChange}
                    cart_id={cart.id}
                    size="md"
                    showRatingText={true}
                    className="my-4"
                  />
                  
                  <div className="flex items-center gap-4">
                    <span className="text-gray-700 font-medium">{t('quantity')}:</span>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => Procédure(cart.id, "-")}
                        disabled={cart.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">{cart.quantity}</span>
                      <button
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                        onClick={() => Procédure(cart.id, "+")}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0">
                  {cart.canceled ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800 font-medium mb-3">{t('are_you_sure')}</p>
                      <div className="flex gap-2">
                        <button
                          id={cart.id.toString()}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                          onClick={Cancel}
                        >
                          {t('yes')}
                        </button>
                        <button
                          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                          onClick={() => {
                            setCarts(prev =>
                              prev.map(cart1 =>
                                cart1.id === cart.id ? { ...cart1, canceled: false } : cart1
                              )
                            )
                          }}
                        >
                          {t('no')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                      onClick={() => {
                        setCarts(prev =>
                          prev.map(cart1 =>
                            cart1.id === cart.id ? { ...cart1, canceled: true } : cart1
                          )
                        )
                      }}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {t('delete')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);
}