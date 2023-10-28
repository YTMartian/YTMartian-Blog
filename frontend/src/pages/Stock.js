/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from 'react';
import '../static/css/style.css'
import { Helmet } from 'react-helmet';
import request from '../request'
import {
    message,
    Timeline,
    Card,
} from 'antd';

import { ClockCircleOutlined } from '@ant-design/icons';


message.config({
    top: 150
});


const Stock = () => {

    const [stocks, setStocks] = useState(undefined);


    //获取stocks
    const init = () => {
        request({
            method: 'get',
            url: 'get_stocks/',
        }).then((response) => {
            if (response.data.code === 0) {
                let newData = [];
                let list = response.data.list;
                list.sort(compareTimes);
                for (let i = 0; i < list.length; i++) {
                    newData.push(
                        {
                            dot: <ClockCircleOutlined className="timeline-clock-icon" />,
                            children:
                                <div style={{ display: 'flex' }}>
                                    <Card
                                        title={list[i]['fields']['time']}
                                        bordered={false}
                                        style={{
                                            width: 600,
                                        }}
                                    >
                                        <p>{list[i]['fields']['content']}</p>
                                    </Card>
                                </div>
                        }
                    );
                }
                setStocks(newData);
            } else {
                message.error('获取stocks失败(1):' + response.data.msg, 3);
            }
        }).catch((error) => {
            message.error('获取stocks失败(2):' + error, 3);
            console.log('获取stocks失败(2):', error);
        });
    }

    function compareTimes(a, b) {
        const dateA = new Date(a['fields']['time']);
        const dateB = new Date(b['fields']['time']);

        if (dateA > dateB) {
            return -1;
        }
        if (dateA < dateB) {
            return 1;
        }
        return 0;
    }

    //相当于componentDidMount，componentDidUpdate 和 componentWillUnmount
    useEffect(() => {
        // create
        init();
        return () => {
            // destroy

        }
        // deps
    }, []);

    return (
        <div>
            <Helmet>
                <meta charSet="utf-8" />
                <title>YTMartian | 董家佚💕丁梦洁</title>
                <link rel="icon" href="../static/imgs/label.ico" type="image/x-icon"></link>
            </Helmet>
            <div className='centered-element'>
                <Timeline
                    mode='alternate'
                    items={stocks}
                />
            </div>
        </div>
    );
}

export default Stock;