import React, { Component } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home'
import Article from './pages/Article'
import { Spin } from 'antd';

const loading = (
    <Spin />
)


class App extends Component {

    render() {
        return (
            <HashRouter>
                <React.Suspense fallback={loading}>
                    <Routes>
                        <Route path="/" name="Home" element={<Home />} />
                        <Route path="/Article" name="Article" element={<Article />} />
                    </Routes>
                </React.Suspense>
            </HashRouter>
        );
    }
}

export default App;
