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
                    "quantity": 27,
                    "_id": "647f6e72d8403a4871cba1db"
                }
            ],
            "createdAt": "2023-06-06T17:35:46.379Z",
            "updatedAt": "2023-06-06T17:35:46.379Z"
        }

    }

    ```

    ```

- ***

  - Endpoint: ``
  - Method: `GET`
  - Description:

  - No Request Body

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
