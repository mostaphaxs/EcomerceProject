import React from 'react';
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

interface Order {
  id: number;
  user_id: number;
  payment_method: string;
  total_payment: number;
  status: string;
  shipping_address: string;
  detailed_shipping_address: string;
  special_instructions: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
  order_details: OrderDetail[];
}

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'completed': return 'status-completed';
      case 'processing': return 'status-processing';
      case 'cancelled': return 'status-cancelled';
      case 'shipped': return 'status-shipped';
      case 'delivred': return 'status-completed';
      default: return 'status-default';
    }
  };
    const { t } = useTranslation();
  
  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': 'En attente',
      'processing': 'En traitement',
      'completed': 'Terminée',
      'cancelled': 'Annulée',
      'shipped': 'Expédiée',
      'delivred': 'Livrée'
    };
    return statusMap[status.toLowerCase()] || status;
  };

  const getPaymentMethodText = (method: string) => {
    const methodMap: { [key: string]: string } = {
      'cash': 'Espèces',
      'card': 'Carte bancaire',
      'paypal': 'PayPal',
      'before_delivery': 'Paiement avant livraison',
      'after_delivery': 'Paiement après livraison'
    };
    return methodMap[method] || method;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (!isOpen || !order) return null;

 return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {t('order_details_title', { orderId: order.id })}
        </h2>
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-6">
        {/* General Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('general_information')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('status')}:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {t(order.status.toLowerCase())}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('payment_method')}:</span>
              <span className="text-gray-900">{t(order.payment_method)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('total_amount')}:</span>
              <span className="font-bold text-green-600">
                {formatCurrency(order.total_payment)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('created_date')}:</span>
              <span className="text-gray-900">{formatDate(order.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('last_updated')}:</span>
              <span className="text-gray-900">{formatDate(order.updated_at)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('delivery_information')}</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('address')}:</span>
              <span className="text-gray-900 text-right">{order.shipping_address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('detailed_address')}:</span>
              <span className="text-gray-900 text-right">{order.detailed_shipping_address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('phone_number')}:</span>
              <span className="text-gray-900">{order.phone_number}</span>
            </div>
            {order.special_instructions && (
              <div className="flex justify-between">
                <span className="text-gray-600">{t('special_instructions')}:</span>
                <span className="text-gray-900 text-right">{order.special_instructions}</span>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('order_items', { count: order.order_details.length })}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">{t('product')}</th>
                  <th className="text-center py-3 px-4 text-gray-700 font-semibold">{t('quantity')}</th>
                  <th className="text-right py-3 px-4 text-gray-700 font-semibold">{t('unit_price')}</th>
                  <th className="text-right py-3 px-4 text-gray-700 font-semibold">{t('total')}</th>
                </tr>
              </thead>
              <tbody>
                {order.order_details.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{item.produit_name}</div>
                        <div className="text-sm text-gray-500">{t('id')}: {item.product_id}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900">
                      {formatCurrency(item.unit_price)}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900 font-medium">
                      {formatCurrency(item.Total_Price)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100">
                  <td colSpan={3} className="py-3 px-4 text-right font-semibold text-gray-900">
                    {t('grand_total')}:
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-green-600">
                    {formatCurrency(order.total_payment)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {t('close')}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('explore')}
          </button>
        </div>
      </div>
    </div>
  </div>
);
};

export default OrderDetailsModal;