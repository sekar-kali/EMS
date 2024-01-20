// frontend/src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Toaster } from "react-hot-toast";
import axios from "axios";
import jwt from 'jsonwebtoken';


axios.defaults.baseURL = "http://localhost:5000/api";
ReactDOM.createRoot(document.getElementById('root')).render(

    <React.StrictMode>
      <App />
      <Toaster />
    </React.StrictMode>
);
