/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from 'react';
import { useLocation } from "react-router-dom"
import { Helmet } from 'react-helmet';
import request from '../request'
import '../static/css/Page.css'
import '../static/css/button.css'
import { LikeFilled, HeartTwoTone } from '@ant-design/icons'
import {
    message,
} from 'antd';

message.config({
    top: 0
});


const Page = () => {

    const [initialization, setInitialization] = useState(true);
    const location = useLocation();//获取前一页面history传递的参数
    const queryParams = new URLSearchParams(location.search);


    //初始化
    const init = () => {

        //获取article
        request({
            method: 'post',
            url: 'get_article_by_id/',
            data: {
                'condition': 'one_article',
                'article_id': queryParams.get('article_id'),
                'is_reading': true
            },
        }).then((response) => {
            if (response.data.code === 0) {
                let this_article = {
                    pk: response.data.list[0]['pk'],
                    title: response.data.list[0]['fields']['title'],
                    content: response.data.list[0]['fields']['content'],
                    modify_time: response.data.list[0]['fields']['modify_time'].substring(0, 10),
                    publish_time: response.data.list[0]['fields']['publish_time'].substring(0, 10),
                    readings: response.data.list[0]['fields']['readings'],
                    thumbs_up: response.data.list[0]['fields']['thumbs_up'],
                    comments: response.data.list[0]['fields']['comments'],
                }

                console.log(this_article);

            } else {
                //404
                if (response.data.msg === '404') {
                    console.log(404)
                } else {
                    message.error('获取article失败(1):' + response.data.msg, 3);
                }

            }
        }).catch((error) => {
            message.error('获取article失败(2):' + error, 3);
            console.log('获取article失败(2):', error);
        });

    }

    if (initialization) {
        setInitialization(false);
        init();
    }

    const thumbsUp = () => {
        message.success(['点赞成功! ', <HeartTwoTone twoToneColor="#eb2f96" />])
    }

    return (
        <div className='body'>
            <Helmet>
                <meta charSet="utf-8" />
                <title>YTMartian | 董家佚💕丁梦洁</title>
                <link rel="icon" href="../static/imgs/label.ico" type="image/x-icon"></link>
            </Helmet>
            {queryParams.get('article_id')}

            <nav className="thumb_up_navigation">
                <button style={{ position: 'fixed', top: '6%', right: '8%' }} className="button button-glow button-circle button-caution button-jumbo" onClick={thumbsUp}>
                    <LikeFilled />
                </button>
            </nav>
        </div>
    );
}

export default Page;
