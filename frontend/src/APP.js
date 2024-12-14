import React, { Component } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home'
import Article from './pages/Article'
import Wallpaper from './pages/Wallpaper'
import Page from './pages/Page'
import Stock from './pages/Stock'
import FourZeroFour from './pages/404'
import Write from './pages/Write'
import { Spin } from 'antd';
import Login from './pages/login'

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
                        <Route path="/Wallpaper" name="Wallpaper" element={<Wallpaper />} />
                        <Route path="/Page" name="Page" element={<Page />} />
                        <Route path="/404" name="404" element={<FourZeroFour />} />
                        <Route path="/Stock" name="Stock" element={<Stock />} />
                        <Route path="/Write" name="Write" element={<Write />} />
                        <Route path="/login" name="login" element={<Login />} />
                    </Routes>
                </React.Suspense>
            </HashRouter>
        );
    }
}

export default App;
