## API Documentation

This documentation provides an overview of the API routes and methods used in the project.

### User Authentication

#### Public Endpoints

- **Register a new user**

  - Endpoint: `/api/v1/users/register`
  - Method: `POST`
  - Description: This endpoint allows users to register a new account by providing their registration details, such as name, email, isCustomer/isSeller or isAdmin and password. Upon successful registration, a new user account is created.

  - Request Body:

    ```json
    {
      "full_name": "John Doe",
      "email": "johndoe@example.com",
      "password": "secretpassword",
      "isCustomer": "true"
    }
    ```

  - Response Body (Success):
    ```json
    {
      "message": "Please check your email to verify your account."
    }
    ```

- **Email verification**

  - Endpoint: `/api/v1/users/verify`
  - Method: `POST`
  - Description: This endpoint handles the email verification process for registered users. Users need to provide their verification token received via email to verify their email address. Once the email is verified, the user can proceed with logging in.

  - Request Body:

    ```json
    {
      "token": "verificationtoken"
    }
    ```

  - Response Body (Success):
    ```json
    {
      "message": "Email verified successfully"
    }
    ```

- **User login**

  - Endpoint: `/api/v1/users/login`
  - Method: `POST`
  - Description: This endpoint authenticates a user by validating their credentials (email and password) and generates a JSON Web Token (JWT) as a response. The JWT can be used for subsequent authenticated requests to protected endpoints.

  - Request Body:

    ```json
    {
      "email": "johndoe@example.com",
      "password": "secretpassword"
    }
    ```

  - Response Body (Success):
    ```json
    {
      "token": "generatedjwttoken"
    }
    ```

#### Private Endpoints

- **User logout**

  - Endpoint: `/api/v1/users/logout`
  - Method: `POST`
  - Description: This endpoint logs out the currently logged-in user by invalidating the JWT token. After logging out, the token becomes invalid, and the user needs to reauthenticate to access protected endpoints.

  - No Request Body

  - Response Body (Success):
    ```json
    {
      "message": "User logged out successfully"
    }
    ```

- **Get user data**

  - Endpoint: `/api/v1/users/me`
  - Method: `GET`
  - Description: This endpoint retrieves the user's data, such as their name, email, and other relevant information. It requires a valid JWT token in the request headers for authentication and authorization.

  - No Request Body

  - Response Body (Success):
    ```json
    {
      "full_name": "John Doe",
      "email": "johndoe@example.com",
      "role": "user"
    }
    ```

- **Password forget**

  - Endpoint: `/api/v1/users/forgot-password`
  - Method: `POST`
  - Description: This endpoint allows users who have forgotten their password to request a password reset email. The user needs to provide their registered email address, and if it exists in the system, an email with a reset password token will be sent to that email address.
  - Request Body:
    ```json
    {
      "email": "johndoe@example.com"
    }
    ```
  - Response Body (Success):
    ```json
    {
      "message": "Password reset email sent. Please check your email."
    }
    ```

- **Password reset**
  - Endpoint: `/api/v1/users/reset-password`
  - Method: `POST`
  - Description: This endpoint allows users to reset their password using the reset password token received via email. The user needs to provide the reset token and their new password to reset the password successfully.
  - Request Body:
    ```json
    {
      "newPassword": "newsecretpassword"
    }
    ```
  - Response Body (Success):
    ```json
    {
      "message": "Password reset successfully."
    }
    ```

Author: Hossain Chisty <br>
Email: hossain.chisty11@gmail.com <br>
Github: https://github.com/hossainchisty

<!-- Todo: Write your info if you are co-author -->
