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

### Product Search API

The Product Search API allows you to search for products based on various criteria such as category, price, brand, and title. The API supports case-insensitive search for both the title and category fields, providing more flexibility for users when searching for products.

#### Public Endpoints

- **URL:** `/api/products?category=fruits&priceMin=100&priceSort=asc&title=apple`
- **Method:** `GET`
- **Access:** Public

### Query Parameters

- `category` (optional): The category to filter products by (case-insensitive).
- `priceMin` (optional): The minimum price of products to filter by.
- `priceMax` (optional): The maximum price of products to filter by.
- `brand` (optional): The brand to filter products by.
- `title` (optional): The title to search products by (case-insensitive).
- `priceSort` (optional): The sort order for price ('asc' or 'desc').
- `popularitySort` (optional): The sort order for popularity ('asc' or 'desc').

#### Response

The API returns an array of products that match the search criteria. Each product object includes details such as the seller, title, description, price, images, category, brand, stock availability, new arrival status, SKU, and associated reviews.

- **Status Code:** 200 (OK)
- **Content Type:** application/json

```json
{
  "result": [
    {
      "stock": {
        "inStock": true,
        "remainingStock": 50
      },
      "newArrival": false,
      "popularity": 0,
      "_id": "64789a1a30b119f395c1ed53",
      "seller": "6475c5e0a868b8afa86a5c41",
      "title": "Apple",
      "description": "Fresh and juicy apple",
      "price": 1.99,
      "images": [
        "https://cdn.shopify.com/s/files/1/0412/8151/9765/products/25_1080x.jpg?v=1660816037",
        "https://th.bing.com/th/id/OIP.BlQJNMKQePTXZgWfZlhe3QHaE8?pid=ImgDet&rs=1"
      ],
      "category": "Fruits",
      "brand": "Farm Fresh",
      "SKU": "5064_1685625370879",
      "reviews": []
    },
    {
      "stock": {
        "inStock": true,
        "remainingStock": 40
      },
      "newArrival": false,
      "popularity": 0,
      "_id": "64789a1a30b119f395c1ed59",
      "seller": "6475c5e0a868b8afa86a5c41",
      "title": "Pineapple",
      "description": "Tropical and tangy pineapple",
      "price": 3.49,
      "images": [],
      "category": "Fruits",
      "brand": "Tropical Delights",
      "SKU": "657493_1685625370929",
      "reviews": []
    }
  ]
}
```

### Error Handling

If an internal server error occurs during the search, the API will respond with an error message and a status code of 500.
