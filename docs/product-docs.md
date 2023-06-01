## Product Listing API

#### Public Endpoints

### List Products

Returns a list of products with pagination.

- **URL:** `/api/v1/products/`
- **Method:** `GET`
- **Access:** Public

#### Query Parameters

- `page` (optional): The current page number (default: 1).
- `limit` (optional): The number of items per page (default: 10).
- For example, `/api/v1/products/?page=2&limit=20` would return the second page of products with 20 items per page.

#### Response

- **Status Code:** 200 (OK)
- **Content Type:** application/json

```json
{
  "products": [
    {
      "stock": {
        "inStock": true,
        "remainingStock": 20
      },
      "_id": "6476f0da3aa704f943711029",
      "seller": {
        "_id": "6475c5e0a868b8afa86a5c41",
        "full_name": "Harman"
      },
      "title": "Watermelon",
      "description": "Juicy and refreshing watermelon",
      "price": 4.99,
      "images": [
        "https://exmaple.com/weatermelon-v1.png",
        "https://exmaple.com/weatermelon-v2.png"
      ],
      "category": "Fruits",
      "brand": "Farm Fresh",
      "SKU": "754833_1685516506313",
      "reviews": []
    },
    {
      "stock": {
        "inStock": true,
        "remainingStock": 40
      },
      "_id": "6476f0da3aa704f94371102a",
      "seller": {
        "_id": "6475c5e0a868b8afa86a5c41",
        "full_name": "Jon Doe"
      },
      "title": "Pineapple",
      "description": "Tropical and tangy pineapple",
      "price": 3.49,
      "images": [],
      "category": "Fruits",
      "brand": "Tropical Delights",
      "SKU": "260504_1685516506313",
      "reviews": []
    }
  ],
  "currentPage": 2,
  "totalPages": 4,
  "totalProducts": 16
}
```
