### Cart Management

#### Private Endpoints

- ** Get cart items **

  - Endpoint: `/api/v1/cart/getCarts`
  - Method: `GET`
  - Description: Get cart items
  - Response Body (Success):

    ```json
    {
      "cart": {
        "_id": "647f6e72d8403a4871cba1da",
        "user": "647a41cef0b472afe3feeb95",
        "items": [
          {
            "product": {
              "stock": {
                "inStock": true,
                "remainingStock": 55
              },
              "_id": "64789a1a30b119f395c1ed5d",
              "seller": "6475c5e0a868b8afa86a5c41",
              "title": "Cherry",
              "description": "Sweet and tangy cherry",
              "price": 3.99,
              "images": [],
              "category": "Fruits",
              "brand": "Orchard Fresh",
              "SKU": "685678_1685625370936",
              "reviews": [],
              "__v": 0
            },
            "quantity": 77,
            "_id": "64801717b659dd3aec005a96"
          },
          {
            "product": {
              "stock": {
                "inStock": true,
                "remainingStock": 25
              },
              "_id": "64789a1a30b119f395c1ed5e",
              "seller": "6475c5e0a868b8afa86a5c41",
              "title": "Kiwi",
              "description": "Exotic and refreshing kiwi",
              "price": 1.99,
              "images": [],
              "category": "Fruits",
              "brand": "Tropical Delights",
              "SKU": "143705_1685625370941",
              "reviews": [],
              "__v": 0
            },
            "quantity": 5,
            "_id": "64802746b36daa6a98acafa3"
          }
        ],
        "createdAt": "2023-06-06T17:35:46.379Z",
        "updatedAt": "2023-06-07T06:51:54.776Z"
      },
      "totalPrice": 317.18
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

- ***

  - Endpoint: ``
  - Method: `POST`
  - Description:
  - Request Body:

    ```json

    ```

  - Response Body (Success):

    ```json

    ```

- ***

  - Endpoint: ``
  - Method: `POST`
  - Description:
  - Request Body:

    ```json

    ```

  - Response Body (Success):

    ```json

    ```
