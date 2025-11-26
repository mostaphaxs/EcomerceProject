import { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from 'react-i18next';

interface OrderDetail {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  produit_name: string;
  Total_Price: number;
  created_at: string;
  updated_at: string;
}

interface TypeOrders {
  payment_method: string;
  total_payment: number;
  status: string;
  shipping_address: string;
  detailed_shipping_address?: string;
  phone_number?: string;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
  id: number;
  order_details: OrderDetail[];
  user_id: number; 
}

interface OrderModificationModalProps {
  order: TypeOrders | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedOrder: TypeOrders) => void;
}

interface Message {
  type: 'success' | 'error' | 'info' | 'warning';
  text: string;
}

export default function OrderModificationModal({
  order,
  isOpen,
  onClose,
  onUpdate
}: OrderModificationModalProps) {
  const [formData, setFormData] = useState({
    user_id: 0,
    payment_method: "",
    shipping_address: "",
    detailed_shipping_address: "",
    phone_number: "",
    special_instructions: "",
    total_payment: 0
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
  if (order && isOpen) {
    setFormData({
      payment_method: order.payment_method || "",
      shipping_address: order.shipping_address || "",
      detailed_shipping_address: order.detailed_shipping_address || "",
      phone_number: order.phone_number || "",
      special_instructions: order.special_instructions || "",
      total_payment: order.total_payment || 0,
      user_id: order.user_id || 0
    });
  }
}, [order, isOpen]);



  useEffect(() => {
    if (!isOpen) {
      setMessage(null);
    }
  }, [isOpen]);

  const showMessage = (type: Message['type'], text: string) => {
    setMessage({ type, text });
    const duration = type === 'success' || type === 'info' ? 5000 : 7000;
    setTimeout(() => {
      setMessage(null);
    }, duration);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear message when user starts typing
    if (message) {
      setMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    setLoading(true);
    setMessage(null);
    const Token = localStorage.getItem("Token");
    console.log({
      ...formData,
      order_details: order.order_details
    });
    
    try {
      const response = await axios.put(`/api/orders/${order.id}`, {
        ...formData,
        order_details: order.order_details
      }, {
        headers: { Authorization: `Bearer ${Token}` }
      });

      if (response.data.success) {
        console.log("message", response.data.order);
        showMessage('success', t('order_modified_success'));
        // Wait a bit before closing to show success message
        setTimeout(() => {
          onUpdate(response.data.order);
          onClose();
        }, 1500);
      } else {
        showMessage('error', response.data.error || t('modification_error'));
      }
    } catch (error: any) {
      console.error("Erreur lors de la modification:", error);
      
      if (error.response?.data?.error) {
        showMessage('error', error.response.data.error);
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const validationErrors = Object.values(error.response.data.errors).flat();
        showMessage('error', `${t('validation_errors')}: ${validationErrors.join(', ')}`);
      } else if (error.code === 'NETWORK_ERROR') {
        showMessage('error', t('connection_error'));
      } else {
        showMessage('error', t('unexpected_error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setMessage(null);
    onClose();
  };

  if (!isOpen || !order) return null;



return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">
          {t('modify_order_title', { orderId: order.id })}
        </h2>
        <button 
          className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
          onClick={handleClose}
        >
          ×
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Payment Method */}
        <div>
          <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 mb-2">
            {t('payment_method_label')}:
          </label>
          <select
            id="payment_method"
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="cash">{t('cash')}</option>
            <option value="card">{t('card')}</option>
            <option value="paypal">{t('paypal')}</option>
          </select>
        </div>

        {/* Shipping Address */}
        <div>
          <label htmlFor="shipping_address" className="block text-sm font-medium text-gray-700 mb-2">
            {t('shipping_address_label')}:
          </label>
          <input
            type="text"
            id="shipping_address"
            name="shipping_address"
            value={formData.shipping_address}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Detailed Address */}
        <div>
          <label htmlFor="detailed_shipping_address" className="block text-sm font-medium text-gray-700 mb-2">
            {t('detailed_address_label')}:
          </label>
          <textarea
            id="detailed_shipping_address"
            name="detailed_shipping_address"
            value={formData.detailed_shipping_address}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
            {t('phone_number_label')}:
          </label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Special Instructions */}
        <div>
          <label htmlFor="special_instructions" className="block text-sm font-medium text-gray-700 mb-2">
            {t('special_instructions_label')}:
          </label>
          <textarea
            id="special_instructions"
            name="special_instructions"
            value={formData.special_instructions}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        {/* Total Amount (Disabled) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('total_amount_label')}:
          </label>
          <input
            type="number"
            value={formData.total_payment}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
          />
          <small className="text-gray-500 text-sm mt-1 block">
            {t('total_amount_help')}
          </small>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button 
            type="button" 
            onClick={handleClose} 
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
                {t('modifying')}
              </>
            ) : (
              t('confirm_changes')
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
);



}