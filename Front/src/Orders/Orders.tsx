import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import OrderConfirmationModal from "./OrdersConfirmation";
import OrderDetailsModal from "./OrderDetails";
import OrderModificationModal from "./OrderModificationModal";

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
  order_details: OrderDetail
}

interface TypeMessage {
  color: string,
  message: string
}

export default function Orders() {
  const [Orders, setOrders] = useState<TypeOrders[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<TypeOrders | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<TypeMessage>({ color: "", message: "" })
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [isModificationModalOpen, setIsModificationModalOpen] = useState<boolean>(false);
  const [pendingOrders,setPendingOrders]=useState<any[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    Process();
  }, []);

  const Process = async (): Promise<void> => {
    const Token = localStorage.getItem("Token");
    try {
      const Response = await axios.get("api/ViewOrders", {
        headers: { Authorization: `Bearer ${Token}` }
      });
      console.log(Response.data.Orders);
      setPendingOrders(Response.data.Orders.filter(order=>order.status==="pending" ) );
      setOrders(Response.data.Orders);

    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDetailsClick = async (order: TypeOrders) => {
    try {
      const Token = localStorage.getItem("Token");
      const response = await axios.get(`api/orderDetails/${order.id}`, {
        headers: { Authorization: `Bearer ${Token}` }
      });

      setSelectedOrder(response.data.order);
      setIsDetailsModalOpen(true);
      console.log(response.data.order)
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const handleConfirmClick = (order: TypeOrders): void => {
    setSelectedOrder(order);
    setIsConfirmationModalOpen(true);
  };

  const handleModifyClick = (order: TypeOrders): void => {
    setSelectedOrder(order);
    setIsModificationModalOpen(true);
  };

  const handleOrderUpdate = (updatedOrder: TypeOrders) => {
    setIsModificationModalOpen(false);
    setOrders(prev => prev.map(order =>
      order.id === updatedOrder.id ? updatedOrder : order
    ));
  };

  const handleConfirmationSuccess = (confirmedOrder: TypeOrders): void => {
    setMessage({ 
      color: "green", 
      message: t('order_confirmed_success', { orderId: confirmedOrder.id }) 
    })
    setTimeout(() => {
      setIsConfirmationModalOpen(false);
      setOrders(prev => prev.map(order =>
        order.id === confirmedOrder.id ? confirmedOrder : order
      ));
      setMessage({ color: "", message: `` })
    }, 1500)
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'completed': return 'status-completed';
      case 'processing': return 'status-processing';
      case 'cancelled': return 'status-cancelled';
      case 'shipped': return 'status-shipped';
      default: return 'status-default';
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  async function Annuler(e: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    const { id } = e.currentTarget;
    const IdOrder = parseInt(id);
    if (isNaN(IdOrder)) {
      console.error("That id must be a number !!");
      return;
    }

    const Token = localStorage.getItem("Token");
    try {
      const Response = await axios.post("api/DeleteOrder", { IdOrder }, {
        headers: { Authorization: `Bearer ${Token}` }
      });
      console.log(Response.data.message);
      Process();
    } catch (error) {
      console.log(error);
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">{t('loading_orders')}</p>
      </div>
    );
  }

return (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('my_orders')}</h1>
        <p className="text-gray-600">{t('view_order_history')}</p>
        {message.message && (
          <h3 className={`mt-4 text-lg ${message.color === 'red' ? 'text-red-600' : 'text-green-600'}`}>
            {message.message}
          </h3>
        )}
      </div>

      {Orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-24 h-24 text-gray-400 mb-6">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('no_orders')}</h3>
          <p className="text-gray-600 mb-6 max-w-md">{t('no_orders_message')}</p>
          <button
            onClick={() => window.location.href = '/products'}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {t('discover_our_products')}
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {t('payment_method')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {t('total_amount')}
                  </th>
                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {t('rate order')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {t('status')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {t('shipping_address')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {t('created_date')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {t('actions')}
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {Orders.map((order, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900 font-medium capitalize">
                        {order.payment_method}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900 font-semibold">
                        {formatCurrency(order.total_payment)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900 font-medium capitalize">
                        *****
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {t(order.status.toLowerCase())}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600 line-clamp-1">
                        {order.shipping_address} 
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-600">
                        {formatDate(order.created_at)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {order.status !== "pending" ? (
                          <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                            {t('track_order')}
                          </button>
                        ) : (
                          <>
                            <button
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                              onClick={() => handleConfirmClick(order)}
                            >
                              {t('confirm')}
                            </button>
                            <button
                              id={order.id.toString()}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                              onClick={Annuler}
                            >
                              {t('cancel')}
                            </button>
                            <button
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                              onClick={() => handleModifyClick(order)}
                            >
                              {t('modify')}
                            </button>
                          </>
                        )}
                        <button 
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                          onClick={() => handleDetailsClick(order)}
                        >
                          {t('details')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-gray-700">
                <strong>{t('maximum_orders', { count: pendingOrders.length })}</strong>
              </p>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  {t('export')}
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  {t('help')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <OrderConfirmationModal
        order={selectedOrder}
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={handleConfirmationSuccess}
      />
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
      <OrderModificationModal
        order={selectedOrder}
        isOpen={isModificationModalOpen}
        onClose={() => setIsModificationModalOpen(false)}
        onUpdate={handleOrderUpdate}
      />
    </div>
  </div>
);
}