import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./Login"

import Ap from './ap';

const App = () => {

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Ap />} />
       
            </Routes>
        </Router>
    );
};


export default App;
