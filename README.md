**THE PROJECT STRUCTURE**

<img width="600" alt="image" src="https://github.com/user-attachments/assets/f6501d1a-fba3-4488-baf2-c236663435f9">



**Explanation:**
1. Client (Web Browser): This is where my React front end runs after being loaded from Netlify.
2. Netlify: Hosts my compiled React application, serving it to clients.
3. PythonAnywhere: Hosts my Django backend, including:
   - Django App: my main application logic
   - Django REST Framework: Provides RESTful API endpoints
   - Database: Stores my application data

**The flow usually goes like this:**

1. **User Interaction:**
The user interacts with the React Frontend in their web browser.
This could be actions like logging in, submitting a form, or requesting data.

2. **JWT Storage/Retrieval:**
The React app interacts with the browser's Local Storage to store or retrieve the JWT token.
After a successful login, the token is stored here.
For subsequent requests, the token is retrieved from here.

3. **API Requests:**
The React Frontend makes API requests to the backend.
These requests go through Netlify, which hosts the React build.
The JWT token is included in the request headers for authentication.

4. **Request Forwarding:**
Netlify forwards these API calls to your Django backend hosted on PythonAnywhere.

5. **Authentication:**
When the request reaches the Django REST Framework, it first goes through the JWT Authentication process.
The JWT token is validated to ensure the request is from an authenticated user.

6. **Request Processing:**
If authentication is successful, the Django REST Framework passes the request to the appropriate view in your Django App.
The Django App processes the request, which might involve business logic, data validation, etc.

7. **Data Operations:**
If the request requires data operations, the Django App interacts with the Database.
This could involve querying, inserting, updating, or deleting data.

8. **Response:**
After processing, the Django backend prepares a response.
This response is sent back through the Django REST Framework, and then to Netlify.

9. **UI Update:**
Netlify forwards the response to the React Frontend.
The React app then updates the UI based on the response, completing the cycle.


Additional Flows:

**Login:**
When a user logs in, the credentials are sent to the backend.
If valid, the JWT Authentication component generates a new JWT token.
This token is sent back to the React Frontend and stored in Local Storage.


**Token Refresh:**
If the JWT token is nearing expiration, the React Frontend can request a new token.
This typically involves sending the current token to a refresh endpoint.
The backend validates the current token and issues a new one if it is valid.
