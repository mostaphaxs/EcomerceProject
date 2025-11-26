// src/components/OrderConfirmationModal.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

interface Order {
  id: number;
  payment_method: string;
  total_payment: number;
  status: string;
  shipping_address: string;
  detailed_shipping_address?: string;
  phone_number?: string;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
}

interface TypeMessage{
  color:string , 
  message:string 
}
interface OrderConfirmationModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (confirmedOrder: Order) => void;
  
}

interface ConfirmationFormData {
  payment_method: string;
  shipping_address: string;
  detailed_shipping_address: string;
  phone_number: string;
  special_instructions: string;
}

const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [formData, setFormData] = useState<ConfirmationFormData>({
    payment_method: order?.payment_method || 'cash',
    shipping_address: order?.shipping_address || '',
    detailed_shipping_address: order?.detailed_shipping_address || '',
    phone_number: order?.phone_number || '',
    special_instructions: order?.special_instructions || ''
  });
  
  const [Message, setMessage] = useState<TypeMessage>({ message: "", color: "" })
  const { t } = useTranslation();
  
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!order) return;
    
    setLoading(true);

    try {
      const Token = localStorage.getItem("Token");
      const Info = {
        order_id: order.id,
        ...formData
      }
      console.log(Info)

      const response = await axios.post('/api/orders/confirm',Info
      , {
        headers: { Authorization: `Bearer ${Token}` }
      });

      if (response.data.success) {
        onConfirm(response.data.order);
        setMessage({color:"",message:""})
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat();
        setMessage({color:"red",message:`Veuillez corriger les erreurs suivantes:\n + ${errors.join('\n')} `})

      } else {
        setMessage({color:"red",message:`Échec de la confirmation de commande. Veuillez réessayer.`})
        console.log(error.response.data)
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !order) return null;

 return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {t('confirm_order_title', { orderId: order.id })}
        </h2>
        {Message.message && (
          <h3 className={`text-sm ${Message.color === 'red' ? 'text-red-600' : 'text-green-600'}`}>
            {Message.message}
          </h3>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('order_summary')}</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('current_payment_method')}:</span>
              <span className="text-gray-900 font-medium capitalize">{t(order.payment_method)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('total_amount')}:</span>
              <span className="text-gray-900 font-semibold">{order.total_payment}€</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('shipping_address')}:</span>
              <span className="text-gray-900 text-right">{order.shipping_address}</span>
            </div>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('payment_method')} <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['cash', 'card', 'paypal'].map((method) => (
                <label 
                  key={method}
                  className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.payment_method === method 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value={method}
                    checked={formData.payment_method === method}
                    onChange={handleInputChange}
                    className="sr-only"
                    required
                  />
                  <span className="text-sm font-medium capitalize">
                    {t(method)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('shipping_address')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="shipping_address"
              value={formData.shipping_address}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={t('address_placeholder')}
            />
          </div>

          {/* Detailed Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('detailed_address')} <span className="text-red-500">*</span>
            </label>
            <textarea
              name="detailed_shipping_address"
              value={formData.detailed_shipping_address}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder={t('detailed_address_placeholder')}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('phone_number')} <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={t('phone_placeholder')}
            />
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('special_instructions')}
            </label>
            <textarea
              name="special_instructions"
              value={formData.special_instructions}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder={t('instructions_placeholder')}
            />
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('confirming')}
                </>
              ) : (
                t('confirm_order')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);
};

export default OrderConfirmationModal;