### Place order

#### Private Endpoints

- **Place to order**

  - Endpoint: `/api/v1/order/`
  - Method: `POST`
  - Description: Place order from cart payment with stripe

  - Request Body

  ```json
  {
    "paymentMethodId": "pm_test_4242424242",
    "shippingAddress": "Banani, Dhaka"
  }
  ```

  - Response Body (Success):

    ```json
    {
      "message": "Order placed successfully"
    }
    ```

#### Private Endpoints

- **Update order status**

  - Endpoint: `/api/v1/seller/:orderId/order/status`
  - Parameter: orderId
  - Method: `PUT`
  - Description: Update order status for the specified order.

  - Request Body

  ```json
  {
    "status": "shipped"
  }
  ```

  - Response Body:

    ```json
    {
      "message": "Order status updated successfully"
    }
    ```
