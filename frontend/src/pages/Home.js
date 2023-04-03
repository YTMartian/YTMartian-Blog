/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useRef, useState, useEffect } from 'react';
import '../static/css/Home.css'
import '../static/css/style.css'
import '../static/css/TagCloud.css'
import '../static/css/bootstrap.min.css'
import '../static/css/button.css'
import { Helmet } from 'react-helmet';
import { LeftOutlined, RightOutlined, SearchOutlined, MailFilled } from '@ant-design/icons'
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

    const searchValueRef = useRef('');
    const [slides, setSlides] = useState(undefined);
    const [wallpapers, setWallpapers] = useState(undefined);
    const [tags, setTags] = useState(undefined);
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
                                        <a href={`/#/Page?article_id=${response.data.list[i]['pk']}`} target="_blank"><h7>{response.data.list[i]['fields']['title']}</h7></a>
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
                            href={`/#/Article?condition=all&page_number=1&per_page=10`}
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
                                href={`/#/Article?condition=tag&page_number=1&per_page=10&tag_id=${response.data.list[i]['pk']}`}
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

        //获取wallpapers
        request({
            method: 'post',
            url: 'get_wallpaper/',
            data: {
                'condition': 'index'
            },
        }).then((response) => {
            if (response.data.code === 0) {
                let newData = [];
                for (let i = 0; i < response.data.list.length; i++) {
                    newData.push(
                        <div className="col-lg-3 col-md-6 col-sm-6 work">
                            <a href={`/#/Wallpaper?wallpaper_id=${response.data.list[i]['pk']}`} target='_blank' className="work-box">
                                <img src={response.data.list[i]['fields']['preview_address']} />
                                <div className="overlay">
                                    <div className="overlay-caption">
                                    </div>
                                </div>
                            </a>
                        </div>
                    );
                }
                setWallpapers(newData);
            } else {
                message.error('获取wallpapers失败(1):' + response.data.msg, 3);
            }
        }).catch((error) => {
            message.error('获取wallpapers失败(2):' + error, 3);
            console.log('获取wallpapers失败(2):', error);
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
            if (currentElement !== null && currentElement !== undefined && distanceToBottom(currentElement) >= 100) {
                currentElement.className = 'text-center gtco-heading animate-fast fadeInUp';
            }
        }

    }

    //相当于componentDidMount，componentDidUpdate 和 componentWillUnmount
    useEffect(() => {
        // create
        init();
        window.addEventListener('scroll', handleScroll, true);
        return () => {
            // destroy

        }
        // deps
    }, []);

    //点击搜索
    const onSearch = () => {
        let value = searchValueRef.current.input.value;
        if (value === undefined || value.length === 0) return;
        // navigate(
        //     '/Article', { state: { condition: 'search', page_number: 1, per_page: 10, search_text: value } }
        // )
        window.open(`/#/Article?condition=search&page_number=1&per_page=10&search_text=${value}`, '_blank')
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

            <div>
                <div className="container-fluid">
                    <div className="row no-gutter">
                        {wallpapers}
                    </div>
                </div>
            </div>

            <div id="gtco-products"></div>
            <div className="gtco-portfolio">
                <div className="gtco-container">
                    <div className="text-center gtco-heading animate-box" style={{ paddingTop: '10%' }} id='subtitle2'>
                        <a href="" target="_blank" className="button button-primary button-giant">Nothing...</a>
                    </div>
                </div>
            </div>

            <footer className="gtco-footer">
                <div className="gtco-container">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="gtco-widget">
                                <h3>关于本站</h3>
                                <p>这是使用Django、React开发，Nginx部署的个人小网站.</p>
                            </div>
                        </div>

                        <div className="col-md-4 col-md-push-1">
                            <div className="gtco-widget">
                                <h3>一些网站</h3>
                                <ul className="gtco-footer-links">
                                    <li><a target="_blank" href="https://www.reddit.com/">Reddit</a></li>
                                    <li><a target="_blank" href="https://github.com/">GitHub</a></li>
                                    <li><a target="_blank" href="https://www.v2ex.com/">V2EX</a></li>
                                    <li><a target="_blank" href="https://xueqiu.com/">XueQiu</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="gtco-widget">
                                <h3>联系我</h3>
                                <ul className="gtco-quick-contact">
                                    <li><MailFilled style={{ color: '#666666' }} /> 1773741250@qq.com</li>
                                    <li><MailFilled style={{ color: '#666666' }} /> dongtim@outlook.com</li>
                                </ul>
                            </div>
                        </div>

                    </div>

                    <div class="row copyright">
                        <div class="col-md-12">
                            <p class="pull-left">
                                <small class="block">&copy;<a href="https://beian.miit.gov.cn/" target="_blank">蜀ICP备17014384号-2</a></small>
                                <small class="block">&copy; 2017年9月</small>
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Home;
