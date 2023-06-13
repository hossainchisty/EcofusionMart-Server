### Reviews and Ratings:

#### Private Endpoints

- **Give Review**

  - Endpoint: `/api/v1/reviews/:productId`
  - Parameter: `productId`
  - Method: `POST`
  - Description: Create a new review
  - Response Body:

    ```json
    {
      "rating": 2.9,
      "comment": "This is a great product!"
    }
    ```

  - Response

  ```json
  {
    "stock": {
      "inStock": true,
      "remainingStock": 80
    },
    "_id": "6482e337953789a53138cda2",
    "seller": "647a41cef0b472afe3feeb95",
    "title": "Strawberry",
    "description": "Sweet and succulent strawberry",
    "price": 223.99,
    "taxes": 3.55,
    "shippingFees": 2.3,
    "images": [],
    "category": "Fruits",
    "brand": "Berry Farms",
    "SKU": "637830_1686299447642",
    "reviews": [
      {
        "user": "647a41cef0b472afe3feeb95",
        "rating": 2.9,
        "comment": "This is a great product!",
        "_id": "64885905e6e53a81a3c8bcaf"
      }
    ],
    "createdAt": "2023-06-09T08:30:47.670Z",
    "updatedAt": "2023-06-13T11:54:45.579Z",
    "averageRating": 2.9
  }
  ```
