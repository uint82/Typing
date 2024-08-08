THE PROJECT STRUCTURE

<img width="250" alt="image" src="https://github.com/user-attachments/assets/ea0c4ece-2659-415d-b548-9600b128a818">

Explanation:
1. Client (Web Browser): This is where my React frontend runs after being loaded from Netlify.
2. Netlify: Hosts my compiled React application, serving it to clients.
3. PythonAnywhere: Hosts my Django backend, including:
   - Django App: my main application logic
   - Django REST Framework: Provides RESTful API endpoints
   - Database: Stores my application data

The flow usually goes like this:
1. The user interacts with the React frontend in their browser.
2. React makes API calls to the Django backend hosted on PythonAnywhere.
3. Django REST Framework handles these API requests.
4. The Django app processes the requests, interacting with the database as needed.
5. The response is returned to the React frontend, which updates the user interface accordingly.
