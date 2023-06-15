### Seller Dashboard

#### Private Endpoints

- **Approve Seller Account**

  - Endpoint: `/api/v1/admin/:sellerId/approve`
  - Method: `POST`
  - Parameters: `:sellerId`
  - Description: Approve seller registration
  - Response Body (Success):

    ```json
    { "message": "Seller approved successfully" }
    ```
