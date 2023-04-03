import React, { Component } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home'
import Article from './pages/Article'
import Wallpaper from './pages/Wallpaper'
import Page from './pages/Page'
import FourZeroFour from './pages/404'
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
                        <Route path="/Wallpaper" name="Wallpaper" element={<Wallpaper />} />
                        <Route path="/Page" name="Page" element={<Page />} />
                        <Route path="/404" name="404" element={<FourZeroFour />} />
                    </Routes>
                </React.Suspense>
            </HashRouter>
        );
    }
}

export default App;
