### Cart Management

#### Private Endpoints

- ** Get cart items **

  - Endpoint: `/api/v1/cart/getCarts`
  - Method: `GET`
  - Description: Get cart items
  - Response:

    ```json
    {
      "cart": {
        "_id": "6482fa43a570e5031c22b62b",
        "user": "647a41cef0b472afe3feeb95",
        "items": [
          {
            "product": {
              "stock": {
                "inStock": true,
                "remainingStock": 100
              },
              "_id": "6482e337953789a53138cd9c",
              "seller": "647a41cef0b472afe3feeb95",
              "title": "Banana",
              "description": "Ripe and yellow banana",
              "price": 35.99,
              "taxes": 1.55,
              "shippingFees": 3.3,
              "images": [
                "https://cdn.shopify.com/s/files/1/0412/8151/9765/products/14_1b19e2a2-d6e3-4ac7-932d-54166a9b4e84_1024x1024.jpg?v=1620642219"
              ],
              "category": "Fruits",
              "brand": "Organic Farms",
              "SKU": "806298_1686299447632",
              "reviews": [],
              "__v": 0,
              "createdAt": "2023-06-09T08:30:47.668Z",
              "updatedAt": "2023-06-09T08:30:47.668Z"
            },
            "quantity": 1,
            "_id": "6482fa43a570e5031c22b62c"
          }
        ],
        "createdAt": "2023-06-09T10:09:07.261Z",
        "updatedAt": "2023-06-09T10:09:07.261Z",
        "__v": 0
      },
      "subTotal": 35.99,
      "taxes": 1.55,
      "shippingFees": 3.3,
      "totalPrice": 40.83
    }
    ```

- **Add To Cart**

  - Endpoint: `/api/v1/cart/`
  - Method: `POST`
  - Description: Adds products to the cart

  - Request Body

  ```json
  {
    "productId": "64789a1a30b119f395c1ed5e",
    "quantity": 14
  }
  ```

  - Response Body (Success):

    ```json
    {
      "message": "Product added to cart"
    }
    ```

- **Remove Item**

  - Endpoint: `/api/v1/cart/remove/:itemId`
  - Parameter: `itemId`
  - Method: `DELETE`
  - Description: Remove an item from the user's cart
  - Response:

    ```json
    { "message": "Item removed from cart" }
    ```
