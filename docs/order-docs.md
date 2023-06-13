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
