### Product Management Dashboard

    A modern Product Management Dashboard built with React 18, Vite, and Material UI, allowing users to view, add, edit, delete, and search products using a mock API.

    This project was developed as part of a Front-End Developer practical assessment and focuses on clean architecture, user experience, and real-world React practices.

#### Live Demo

 - Live URL:

    https://intricare-frontend-developer-task.vercel.app/

 - GitHub Repository:

    https://github.com/akashmishra0908/intricare-frontend-developer-task

#### Features

    - Fetch and display products from a mock API

    - Add new products (mocked POST request)

    - Edit existing products (PUT request)

    - Delete products with instant UI updates

    - Client-side search (by title & category)

    - Modal-based Add/Edit forms

    - Loading indicators and error handling

    - Responsive design (mobile-friendly)

    - Clean and professional UI using Material UI

#### Tech Stack

    - Frontend: React 18 (Functional Components & Hooks)

    - Build Tool: Vite

    - UI Library: Material UI (MUI)

    - HTTP Client: Axios

    - API: Fake Store API

    - Deployment: Vercel

#### Project Structure

    product-dashboard/
    │
    ├── src/
    │   ├── components/
    │   │   ├── ProductList.jsx
    │   │   └── ProductForm.jsx
    │   │
    │   ├── services/
    │   │   └── api.js
    │   │
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    │
    ├── public/
    ├── package.json
    ├── vite.config.js
    └── README.md

#### Getting Started (Local Setup)

    1 Clone the repository
    git clone https://github.com/your-username/product-dashboard.git
    cd product-dashboard

    2 Install dependencies
    npm install

    3 Start the development server
    npm run dev


    The app will run on:
    - http://localhost:5173

#### API Usage

    This project uses Fake Store API as a mock backend:

    `GET /products – Fetch all products`

    `POST /products – Add new product (mocked)`

    `PUT /products/:id – Update product (mocked)`

    `DELETE /products/:id – Delete product (mocked)`


#### Key Implementation Details

    State Management: React useState and useEffect

    Search: Client-side filtering without mutating original data

    Forms: Controlled inputs with automatic reset on edit/delete

    UX: Dialog-based forms for better user experience

    Error Handling: Graceful UI feedback on API failure


#### Author
    [Akash Mishra](https://github.com/akashmishra0908)
