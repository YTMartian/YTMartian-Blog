/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useRef, useState } from 'react';
import { useNavigate } from "react-router-dom"
import '../static/css/Home.css'
import '../static/css/style.css'
import '../static/css/TagCloud.css'
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

//获取元素到浏览器底部距离
const distanceToBottom = (dom) => {
    const height = window.innerHeight  //可视区窗口高度
    const curDomHeight = dom.offsetHeight
    // const curDomHeight = dom.getBoundingClientRect().height
    const curDomY = dom.getBoundingClientRect().y
    const curDomBottom = height - curDomHeight - curDomY
    return curDomBottom
}

const Home = () => {

    const navigate = useNavigate();
    const searchValueRef = useRef('');
    const [slides, setSlides] = useState(undefined);
    const [tags, setTags] = useState(undefined);
    const [initialization, setInitialization] = useState(true);
    const [headerScrollClass, setHeaderScrollClass] = useState('');


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

        //获取tags
        request({
            method: 'get',
            url: 'get_tags/',
        }).then((response) => {
            if (response.data.code === 0) {
                let newData = [];
                const tagColors = [
                    "#84bdd0",
                    "#e0768d",
                    "#e9755e",
                    "#f4a594",
                    "#73C8A9",
                    "#b28bcd",
                    "#bcd5dc",
                    "#d6a3dc",
                    "#f9dc74",
                    "#ebbdbf",
                    "#00c6ff",
                    "#81D8D0",
                    "#74caff",
                    "#95B9C7",
                    "#d68fac",
                    "#72c9c8",
                    "#FF7F50",
                    "#ffc67f",
                    "#79baec",
                    "#F660AB",
                    "#7eb2cc",
                    "#84d4ab"
                ];
                let color = tagColors[parseInt(Math.floor(Math.random() * tagColors.length))];
                newData.push(
                    <li>
                        <a
                            target="_blank"
                            onClick={() => {
                                navigate(
                                    '/Article', { state: { condition: 'all', page_number: 1, per_page: 10 } }
                                )
                            }}
                            style={{ background: color }}
                        >
                            {'全部'}
                        </a>
                    </li>
                );
                for (let i = 0; i < response.data.list.length; i++) {
                    let color = tagColors[parseInt(Math.floor(Math.random() * tagColors.length))];
                    newData.push(
                        <li>
                            <a
                                target="_blank"
                                onClick={() => {
                                    navigate(
                                        '/Article', { state: { condition: 'tag', page_number: 1, tag_id: response.data.list[i]['pk'], per_page: 10 } }
                                    )
                                }}
                                style={{ background: color }}
                            >
                                {response.data.list[i]['fields']['name']}
                            </a>
                        </li>
                    );
                }
                setTags(newData);
            } else {
                message.error('获取tags失败(1):' + response.data.msg, 3);
            }
        }).catch((error) => {
            message.error('获取tags失败(2):' + error, 3);
            console.log('获取tags失败(2):', error);
        });
    }

    //监听滚动事件
    const handleScroll = () => {
        let scroll = window.scrollY;
        //设置header动画
        if (scroll >= 50) {
            setHeaderScrollClass('fixed');
        } else {
            setHeaderScrollClass('');
        }
        //设置subtitle动画
        let len = document.getElementsByClassName('gtco-container').length;
        for (let i = 0; i < len; i++) {
            let name = 'subtitle' + i;
            let currentElement = document.getElementById(name);
            if (distanceToBottom(currentElement) >= 100) {
                currentElement.className = 'text-center gtco-heading animate-fast fadeInUp';
            }
        }

    }

    if (initialization) {
        setInitialization(false);
        init();
        window.addEventListener('scroll', handleScroll, true);

    }



    //点击搜索
    const onSearch = () => {
        let value = searchValueRef.current.input.value;
        if (value === undefined || value.length === 0) return;
        navigate(
            '/Article', { state: { condition: 'search', page_number: 1, per_page: 10, search_text: value } }
        )
    }

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>YTMartian | 董家佚💕丁梦洁</title>
                <link rel="icon" href="../static/imgs/label.ico" type="image/x-icon"></link>
            </Helmet>
            <div className='banner'>
                <header id='header' className={headerScrollClass}>
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
                                    onPressEnter={onSearch}
                                    suffix={<SearchOutlined onClick={onSearch} style={{ color: '#343434' }} />}
                                />
                            </Form>
                        </div>
                    </div>
                </header>
                <br /><br /><br /><br />
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

            <div id="gtco-products">
                <div className="gtco-container">
                    <div className='text-center gtco-heading animate-box' id='subtitle0'>
                        <h2>标签</h2>
                        <p>Tags</p>
                    </div>
                </div>
            </div>

            <div class="cloud-tags-style">
                <ul class="cloud-tags">
                    {tags}
                </ul>
            </div>

            <div id="gtco-products">
                <div className="gtco-container">
                    <div className='text-center gtco-heading animate-box' id='subtitle1'>
                        <h2>壁纸</h2>
                        <p>Wallpaper</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
