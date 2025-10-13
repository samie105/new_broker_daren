import { getActiveOrdersAction, getOrderHistoryAction } from '@/server/actions/portfolio'
import { ActiveOrders } from './active-orders'

export async function ActiveOrdersServer() {
  try {
    // Fetch both active orders and order history
    const [activeOrdersResult, orderHistoryResult] = await Promise.all([
      getActiveOrdersAction(),
      getOrderHistoryAction()
    ])

    const activeOrders = activeOrdersResult.success ? (activeOrdersResult.data || []) : []
    const orderHistory = orderHistoryResult.success ? (orderHistoryResult.data || []) : []

    return (
      <ActiveOrders 
        activeOrders={activeOrders} 
        orderHistory={orderHistory}
      />
    )
  } catch (error) {
    console.error('Failed to fetch orders:', error)
    return (
      <ActiveOrders 
        activeOrders={[]} 
        orderHistory={[]}
      />
    )
  }
}
