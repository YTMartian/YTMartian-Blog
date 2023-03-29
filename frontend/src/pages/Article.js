/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useRef, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom"
import '../static/css/Article.css'
import '../static/css/style.css'
import '../static/css/TagCloud.css'
import { Helmet } from 'react-helmet';
import request from '../request'
import {
    Pagination,
    Form,
    Input,
    message,
    Card,
    FloatButton,
    Tooltip,
} from 'antd';
import {
    SearchOutlined,
    CalendarTwoTone,
    EyeTwoTone,
    LikeTwoTone,
    MessageTwoTone,
    RocketTwoTone
} from '@ant-design/icons'
const { Meta } = Card;

message.config({
    top: 150
});

const Article = () => {

    const [headerScrollClass, setHeaderScrollClass] = useState('');
    const [initialization, setInitialization] = useState(true);
    const [articles, setArticles] = useState(undefined);
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalPageNumber, setTotalPageNumber] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const searchValueRef = useRef('');
    const location = useLocation();//获取前一页面history传递的参数

    //获取articles
    const getArticles = (condition, page_number, tag_id, per_page) => {

        request({
            method: 'post',
            url: 'get_article/',
            data: {
                "condition": condition,
                "page_number": page_number,
                "tag_id": tag_id,
                "per_page": per_page
            },
        }).then((response) => {
            if (response.data.code === 0) {
                let newData = [];

                for (let i = 0; i < response.data.list.length; i++) {
                    var content = response.data.list[i]['fields']['content'];
                    if (content.length > 150) content = content.substring(0, 150) + '...';
                    newData.push(
                        <div style={{ paddingTop: '50px' }}>
                            <div className='card'>
                                <Card
                                    className='card_header'
                                    actions={[
                                        <span><CalendarTwoTone /> {response.data.list[i]['fields']['publish_time'].substring(0, 10)}</span>,
                                        <span><EyeTwoTone /> {response.data.list[i]['fields']['readings']}</span>,
                                        <span><LikeTwoTone /> {response.data.list[i]['fields']['thumbs_up']}</span>,
                                        <span><MessageTwoTone /> {response.data.list[i]['fields']['comments']}</span>,
                                    ]}
                                >
                                    <Meta
                                        title={
                                            <a onClick={() => { }} target="_blank">
                                                <h2></h2><h2>{response.data.list[i]['fields']['title']}</h2>
                                            </a>
                                        }
                                        description={
                                            <p>{content}</p>
                                        }
                                    />
                                </Card>
                            </div>
                        </div>
                    );
                }
                setArticles(newData);
                setTotalPageNumber(response.data.total_count);
            } else {
                message.error('获取articles失败(1):' + response.data.msg, 3);
            }
        }).catch((error) => {
            message.error('获取articles失败(2):' + error, 3);
            console.log('获取articles失败(2):', error);
        });
    }

    const init = () => {
        getArticles(location.state.condition, location.state.page_number, location.state.tag_id, location.state.per_page);
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
    }

    if (initialization) {
        setCurrentPageNumber(location.state.page_number);
        setInitialization(false);
        init();
        window.addEventListener('scroll', handleScroll, true);
    }

    //点击搜索
    const onSearch = () => {
        let value = searchValueRef.current.input.value;
        if (value === undefined || value.length === 0) return;
        alert(value)
    }

    const changePageNumber = (pageNumber, pageSize) => {
        setCurrentPageNumber(pageNumber);
        setPerPage(pageSize);
        getArticles(location.state.condition, pageNumber, location.state.tag_id, pageSize);
    };


    return (
        <div className='body'>
            <Helmet>
                <meta charSet="utf-8" />
                <title>YTMartian | 董家佚💕丁梦洁</title>
                <link rel="icon" href="../static/imgs/label.ico" type="image/x-icon"></link>
            </Helmet>
            <div>
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
            </div>
            <br /><br />
            {articles}
            <div className='pagination'>
                <Pagination
                    showQuickJumper
                    defaultCurrent={currentPageNumber}
                    total={totalPageNumber}
                    onChange={changePageNumber}
                    showSizeChanger={true}
                    pageSize={perPage}
                    showTotal={(total) => `共${total}条`}
                />
            </div>
            <Tooltip title="回到顶部" placement='left' mouseEnterDelay={0.5}>
                <FloatButton.BackTop duration={800} type='default' />
            </Tooltip>


            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        </div>
    );
}

export default Article;