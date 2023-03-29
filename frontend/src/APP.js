import React, { Component } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home'
import Article from './pages/Article'

const loading = (
    <div className="pt-3 text-center">
        <div className="sk-spinner sk-spinner-pulse"></div>
    </div>
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
