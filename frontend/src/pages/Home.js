/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useRef, useState } from 'react';
import '../static/css/Home.css'
import '../static/css/style.css'
import { Helmet } from 'react-helmet';
import { LeftOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons'
import request from '../request'
import {
    Carousel,
    Form,
    Input,
    message,
} from 'antd';

message.config({
    top: 150
});

const Home = () => {

    const searchValueRef = useRef('');
    const [slides, setSlides] = useState(undefined);
    const [initialization, setInitialization] = useState(true);

    //初始化
    const init = () => {
        //获取slide图片地址
        request({
            method: 'get',
            url: 'get_slide/',
        }).then((response) => {
            if (response.data.code === 0) {
                let slidePicAddresses = [];
                for (let i = 0; i < response.data.list.length; i++) {
                    let pic_address = response.data.list[i]['fields']['pic_address'];
                    slidePicAddresses.push(pic_address);

                }
                //获取slide文章标题和id
                request({
                    method: 'post',
                    url: 'get_article/',
                    data: {
                        "condition": "slide",
                        "tag_id": -1,
                        "article_id": -1
                    },
                }).then((response) => {
                    if (response.data.code === 0) {
                        let newData = [];
                        for (let i = 0; i < slidePicAddresses.length; i++) {
                            newData.push(
                                <div className='carousel-item'>
                                    <img src={slidePicAddresses[i]} style={{ margin: 'auto' }} />
                                    <span className='carousel-item-text'>
                                        <a href={"article/0/" + response.data.list[i]['pk']}><h7>{response.data.list[i]['fields']['title']}</h7></a>
                                    </span>
                                </div>
                            );
                        }
                        setSlides(newData);
                    } else {
                        message.error('获取slide失败(1):' + response.data.msg, 3);
                    }
                }).catch((error) => {
                    message.error('获取slide失败(2):' + error, 3);
                    console.log('获取slide失败(2):', error);
                });
            } else {
                message.error('获取slide失败(3):' + response.data.msg, 3);
            }
        }).catch((error) => {
            message.error('获取slide失败(4):' + error, 3);
            console.log('获取slide失败(4):', error);
        });
    }
    if (initialization) {
        setInitialization(false);
        init();
    }

    //点击搜索
    const onSearch = () => {
        let value = searchValueRef.current.input.value;
        if (value === undefined || value.length === 0) return;
        alert(value)
    }

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>YTMartian | 董家佚💕丁梦洁</title>
                <link rel="icon" href="../static/imgs/label.ico" type="image/x-icon"></link>
            </Helmet>
            <div className='banner'>
                <header id='header'>
                    <div className='header-content'>
                        <a className='logo' href="">YTMartian</a>
                        <div className='dd' style={{ float: 'left', paddingLeft: '50px' }}>
                            <Form

                            >
                                <Input
                                    placeholder="搜索..."
                                    allowClear
                                    style={{
                                        width: 300,
                                    }}
                                    ref={searchValueRef}
                                    bordered={false}
                                    suffix={<SearchOutlined onClick={onSearch} style={{ color: '#343434' }} />}
                                />
                            </Form>
                        </div>
                    </div>
                </header>

                <div>
                    <Carousel
                        autoplay
                        arrows={true}
                        prevArrow={<LeftOutlined />}
                        nextArrow={<RightOutlined />}
                        style={{ marginLeft: '3%', marginRight: '3%' }}
                    >
                        {slides}

                    </Carousel>
                </div>
            </div>
        </>
    );
}

export default Home;
