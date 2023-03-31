/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from 'react';
import { useLocation } from "react-router-dom"
import '../static/css/Wallpaper.css'
import '../static/css/Animate.css'
import { Helmet } from 'react-helmet';
import request from '../request'
import {
    message,
} from 'antd';

message.config({
    top: 150
});


const Wallpaper = () => {

    const [initialization, setInitialization] = useState(true);
    const location = useLocation();//获取前一页面history传递的参数
    const queryParams = new URLSearchParams(location.search);
    const [imgUrl, setImgUrl] = useState('');


    //初始化
    const init = () => {

        //获取wallpapers
        request({
            method: 'post',
            url: 'get_wallpaper/',
            data: {
                'condition': 'one',
                'id': queryParams.get('wallpaper_id')
            },
        }).then((response) => {
            console.log(response.data)
            if (response.data.code === 0) {
                setImgUrl(response.data.list[0]['fields']['pic_address']);
            } else {
                message.error('获取wallpaper失败(1):' + response.data.msg, 3);
            }
        }).catch((error) => {
            message.error('获取wallpaper失败(2):' + error, 3);
            console.log('获取wallpaper失败(2):', error);
        });

    }

    if (initialization) {
        setInitialization(false);
        init();
    }

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>YTMartian | 董家佚💕丁梦洁</title>
                <link rel="icon" href="../static/imgs/label.ico" type="image/x-icon"></link>
            </Helmet>
            <div className='wallpaper-body'>
                <img className="heroshot bounceInUp animated" src={imgUrl} />
            </div>
        </>
    );
}

export default Wallpaper;
