/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from "react-router-dom"
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
    Empty,
} from 'antd';
import {
    SearchOutlined,
    CalendarTwoTone,
    EyeTwoTone,
    LikeTwoTone,
    MessageTwoTone
} from '@ant-design/icons'
const { Meta } = Card;

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

const Article = () => {

    const [headerScrollClass, setHeaderScrollClass] = useState('');
    const [articles, setArticles] = useState(undefined);
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [currentPageSize, setCurrentPageSize] = useState(10);
    const [totalPageNumber, setTotalPageNumber] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const searchValueRef = useRef('');
    const wordCount = 200;//每条显示字数
    const location = useLocation();//获取前一页面history传递的参数
    const queryParams = useRef(new URLSearchParams(location.search));

    //将s1中出现的s2高亮显示，不区分大小写
    const addHighlight = (s1, s2) => {
        if (s2 === undefined || s2 === null || s2 === '') {
            return s1;
        }
        let s1_lower = String(s1).slice().toLowerCase(); // deep copy
        let s2_lower = String(s2).slice().toLowerCase();
        let s2_out = '';
        let out = [];
        let index = s1_lower.indexOf(s2_lower);
        let start = 0;
        while (index !== -1) {
            if (s2_out.length === 0) {
                s2_out = s1.substring(index, index + s2.length);
                console.log(s2, s2_lower, s2_out);
            }
            out.push(s1.substring(start, index));
            out.push(<span className='highlighted'>{s2_out}</span>)
            start = index + s2.length;
            index = s1_lower.indexOf(s2_lower, start);
        }
        out.push(s1.substring(start, s1.length));
        return out;
    }

    //获取articles
    const getArticles = (condition, page_number, tag_id, per_page, search_text) => {
        request({
            method: 'post',
            url: 'get_article/',
            data: {
                "condition": condition,
                "page_number": parseInt(page_number),
                "tag_id": parseInt(tag_id),
                "per_page": parseInt(per_page),
                "search_text": search_text
            },
        }).then((response) => {
            if (response.data.code === 0) {
                let newData = [];
                for (let i = 0; i < response.data.list.length; i++) {
                    let content = response.data.list[i]['fields']['content'];
                    let title = addHighlight(response.data.list[i]['fields']['title'], search_text);
                    if (condition === 'search') {
                        let content_lower = String(content).slice().toLowerCase(); // deep copy
                        let search_text_lower = String(search_text).slice().toLowerCase();
                        let index = content_lower.indexOf(search_text_lower);
                        if (index === -1 && content.length > wordCount) {
                            content = content.substring(0, wordCount) + '...';
                        } else {
                            let tempContent = content.substring(index - wordCount / 2, index + wordCount - wordCount / 2);
                            let newContent = [];
                            if (index - wordCount / 2 > 0) newContent.push('...');
                            newContent.push(addHighlight(tempContent, search_text));
                            if (index + wordCount - wordCount / 2 < content.length) newContent.push('...');
                            content = newContent;
                        }
                    } else if (content.length > wordCount) {
                        content = content.substring(0, wordCount) + '...';
                    }

                    let class_ = 'article_card animate-box';
                    if (i <= 1) {//默认先出现头两个文章
                        class_ = 'card article_card animate-fast fadeInUp';
                    }
                    newData.push(
                        <div style={{ paddingTop: '50px' }}>
                            <div className={class_} >
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
                                            <a href={`${window.location.origin}${window.location.pathname}#/Page?article_id=${response.data.list[i]['pk']}`} target="_blank">
                                                <h2></h2><h2>{title}</h2>
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
                if (newData.length === 0) {
                    newData.push(<Empty />)
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


    //监听滚动事件
    const handleScroll = () => {
        let scroll = window.scrollY;
        //设置header动画
        if (scroll >= 50) {
            setHeaderScrollClass('fixed');
        } else {
            setHeaderScrollClass('');
        }
        handleCardAnimate();
    }

    //设置card动画
    const handleCardAnimate = () => {
        let articleCards = document.getElementsByClassName('article_card');
        for (let i = 0; i < articleCards.length; i++) {
            let currentElement = articleCards[i];
            if (currentElement !== null && currentElement !== undefined && distanceToBottom(currentElement) >= -100) {
                currentElement.className = 'card article_card animate-fast fadeInUp';
            }
        }
    }

    //相当于componentDidMount，componentDidUpdate 和 componentWillUnmount
    useEffect(() => {
        // create
        setCurrentPageNumber(queryParams.current.get('page_number'));
        getArticles(queryParams.current.get('condition'), queryParams.current.get('page_number'), queryParams.current.get('tag_id'), queryParams.current.get('per_page'), queryParams.current.get('search_text'));
        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('load', handleCardAnimate, true);//加载时先执行一遍，否则需要scroll才能显示头几个card
        window.addEventListener('onbeforeunload', handleCardAnimate, true);
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
        queryParams.current.set('condition', 'search');
        queryParams.current.set('search_text', value);
        console.log(queryParams.current.get('search_text'), value)
        setCurrentPageNumber(1);
        getArticles('search', 1, -1, currentPageSize, value);
        scrollToTop();
    }

    //滑到顶部
    const scrollToTop = () => {
        const top = document.documentElement.scrollTop || document.body.scrollTop;
        if (top > 0) {
            window.requestAnimationFrame(scrollToTop);
            window.scrollTo(0, top - top / 8);//控制滑动速度
        }
    }

    const changePageNumber = (pageNumber, pageSize) => {
        setCurrentPageNumber(pageNumber);
        setCurrentPageSize(pageSize);
        setPerPage(pageSize);
        console.log(queryParams.current.get('search_text'))
        getArticles(queryParams.current.get('condition'), pageNumber, queryParams.current.get('tag_id'), pageSize, queryParams.current.get('search_text'));
        scrollToTop();
    };


    return (
        <div className='article_body'>
            <Helmet>
                <meta charSet="utf-8" />
                <title>YTMartian | 董家佚💕丁梦洁</title>
                <link rel="icon" href="../static/imgs/label.ico" type="image/x-icon"></link>
            </Helmet>
            <div>
                <header id='header' className={headerScrollClass}>
                    <div className='header-content-article'>
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
                    current={currentPageNumber}
                    defaultCurrent={1}
                    total={totalPageNumber}
                    onChange={changePageNumber}
                    showSizeChanger={false}
                    pageSize={perPage}
                    showTotal={(total) => `共${total}条`}
                    showTitle={false}

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