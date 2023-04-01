/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from 'react';
import { useLocation } from "react-router-dom"
import { Helmet } from 'react-helmet';
import request from '../request'
import '../static/css/Page.css'
import '../static/css/button.css'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialOceanic } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkMath from 'remark-math'
import rehypeMathjax from 'rehype-mathjax'
import remarkGfm from 'remark-gfm'
import {
    message,
    Tooltip,
    FloatButton,
    Modal,
} from 'antd';
import {
    LikeFilled,
    HeartTwoTone,
    SettingFilled,
    CodeOutlined
} from '@ant-design/icons'


message.config({
    top: 0
});


const Page = () => {

    const [initialization, setInitialization] = useState(true);
    const location = useLocation();//获取前一页面history传递的参数
    const queryParams = new URLSearchParams(location.search);
    const [articleContent, setArticleContent] = useState(undefined);
    const [isCodeSettingsModalOpen, setIsCodeSettingsModalOpen] = useState(false);


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
                setArticleContent(this_article.content);

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

    const showCodeSettingsModal = () => {
        setIsCodeSettingsModalOpen(true);
    };
    const handleCodeSettingsOk = () => {
        setIsCodeSettingsModalOpen(false);
    };
    const handleCodeSettingsCancel = () => {
        setIsCodeSettingsModalOpen(false);
    };

    return (
        <div className='page_body'>
            <Helmet>
                <meta charSet="utf-8" />
                <title>YTMartian | 董家佚💕丁梦洁</title>
                <link rel="icon" href="../static/imgs/label.ico" type="image/x-icon"></link>
            </Helmet>

            <ReactMarkdown className='table_hljs'
                children={articleContent}
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                            <SyntaxHighlighter
                                children={String(children).replace(/\n$/, '')}
                                style={materialOceanic}
                                language={match[1]}
                                PreTag="div"
                                showLineNumbers={true}
                                {...props}
                            />
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        )
                    }
                }}
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeMathjax]}
            />

            <nav className="thumb_up_navigation">
                <button style={{ position: 'fixed', top: '6%', right: '8%' }} className="button button-glow button-circle button-caution button-jumbo" onClick={thumbsUp}>
                    <LikeFilled />
                </button>
            </nav>

            <FloatButton.Group
                trigger="hover"
                type="primary"
                style={{
                    bottom: 100,
                }}
                icon={<SettingFilled />}
            >
                <FloatButton icon={
                    <Tooltip title="代码区域设置" placement='left' mouseEnterDelay={0.2}>
                        <CodeOutlined onClick={showCodeSettingsModal} />
                    </Tooltip>
                } />
            </FloatButton.Group>

            <Tooltip title="回到顶部" placement='left' mouseEnterDelay={0.5}>
                <FloatButton.BackTop duration={800} type='default' style={{ bottom: 50, }} />
            </Tooltip>

            <Modal
                title="代码区域设置"
                open={isCodeSettingsModalOpen}
                onOk={handleCodeSettingsOk}
                onCancel={handleCodeSettingsCancel}>
                <p>示例</p>
            </Modal>
        </div>
    );
}

export default Page;
