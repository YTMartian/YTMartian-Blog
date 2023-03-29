import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import APP from './APP';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { ConfigProvider } from 'antd';//全局中文
import { Provider } from 'react-redux'
import store from './store'
import zhCN from 'antd/lib/locale/zh_CN';
import * as serviceWorker from './serviceWorker';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <ConfigProvider locale={zhCN}>
      <APP />
    </ConfigProvider>
  </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
