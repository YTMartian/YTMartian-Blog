/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from 'react';
import { useLocation } from "react-router-dom"
import { Helmet } from 'react-helmet';
import request from '../request'
import styles from '../static/css/Page.module.css'
import '../static/css/button.css'
import '../static/css/bootstrap.min.css'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import {
    a11yDark,
    atomDark,
    base16AteliersulphurpoolLight,
    cb,
    coldarkCold,
    coldarkDark,
    coy,
    darcula,
    dark,
    dracula,
    duotoneDark,
    duotoneEarth,
    duotoneForest,
    duotoneLight,
    duotoneSea,
    duotoneSpace,
    funky,
    ghcolors,
    gruvboxDark,
    gruvboxLight,
    hopscotch,
    materialDark,
    materialLight,
    materialOceanic,
    nord,
    okaidia,
    oneDark,
    oneLight,
    pojoaque,
    prism,
    shadesOfPurple,
    solarizedlight,
    synthwave84,
    tomorrow,
    twilight,
    vs,
    vscDarkPlus,
    xonokai,
} from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkMath from 'remark-math'
import rehypeMathjax from 'rehype-mathjax'
import remarkGfm from 'remark-gfm'
import Cookies from 'js-cookie'
import {
    message,
    Tooltip,
    FloatButton,
    Modal,
    Spin,
    Select,
    Image,
} from 'antd';
import {
    LikeFilled,
    HeartTwoTone,
    SettingFilled,
    CodeOutlined,
    CalendarOutlined,
    CommentOutlined,
    LikeOutlined,
    EyeOutlined
} from '@ant-design/icons'


message.config({
    top: 0
});


const Page = () => {

    const [initialization, setInitialization] = useState(true);
    const location = useLocation();//获取前一页面history传递的参数
    const queryParams = new URLSearchParams(location.search);
    const [thisArticle, setThisArticle] = useState({});
    const [thisArticleThumbsUp, setThisArticleThumbsUp] = useState(0);
    const [thisArticleCommentsCount, setThisArticleCommentsCount] = useState(0);
    const [isCodeSettingsModalOpen, setIsCodeSettingsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentCodeTheme, setCurrentCodeTheme] = useState('materialOceanic')

    const codeThemes = {
        'a11yDark': a11yDark,
        'atomDark': atomDark,
        'base16AteliersulphurpoolLight': base16AteliersulphurpoolLight,
        'cb': cb,
        'coldarkCold': coldarkCold,
        'coldarkDark': coldarkDark,
        'coy': coy,
        'darcula': darcula,
        'dark': dark,
        'dracula': dracula,
        'duotoneDark': duotoneDark,
        'duotoneEarth': duotoneEarth,
        'duotoneForest': duotoneForest,
        'duotoneLight': duotoneLight,
        'duotoneSea': duotoneSea,
        'duotoneSpace': duotoneSpace,
        'funky': funky,
        'ghcolors': ghcolors,
        'gruvboxDark': gruvboxDark,
        'gruvboxLight': gruvboxLight,
        'hopscotch': hopscotch,
        'materialDark': materialDark,
        'materialLight': materialLight,
        'materialOceanic': materialOceanic,
        'nord': nord,
        'okaidia': okaidia,
        'oneDark': oneDark,
        'oneLight': oneLight,
        'pojoaque': pojoaque,
        'prism': prism,
        'shadesOfPurple': shadesOfPurple,
        'solarizedlight': solarizedlight,
        'synthwave84': synthwave84,
        'tomorrow': tomorrow,
        'twilight': twilight,
        'vs': vs,
        'vscDarkPlus': vscDarkPlus,
        'xonokai': xonokai,
    }


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

                setIsLoading(false);
                setThisArticle(this_article);
                setThisArticleThumbsUp(this_article.thumbs_up);
                setThisArticleCommentsCount(this_article.comments);
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
        document.body.classList.add(styles.page_body);
        let theme = Cookies.get('currentCodeTheme');
        if (theme !== undefined && codeThemes[theme] !== undefined) {
            setCurrentCodeTheme(theme);
        }
    }

    const thumbsUp = () => {
        request({
            method: 'post',
            url: 'submit_like/',
            data: {
                'condition': 'article',
                'article_id': queryParams.get('article_id'),
                'state': 'add'
            },
        }).then((response) => {
            if (response.data.code === 0 && response.data.msg === 'success') {
                setThisArticleThumbsUp(thisArticleThumbsUp + 1);
                message.success(['点赞成功! ', <HeartTwoTone twoToneColor="#eb2f96" />])
            } else {
                message.error('点赞失败(1):' + response.data.msg, 3);
            }
        }).catch((error) => {
            message.error('点赞失败(2):' + error, 3);
            console.log('点赞失败(2):', error);
        });
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

    const handleCodeThemeChange = (value) => {
        if (codeThemes[value] !== undefined) {
            Cookies.set('currentCodeTheme', value);
            setCurrentCodeTheme(value);
        }
    };

    return (
        <div className={styles.page_body}>
            <Helmet>
                <meta charSet="utf-8" />
                <title>YTMartian | 董家佚💕丁梦洁</title>
                <link rel="icon" href="../static/imgs/label.ico" type="image/x-icon"></link>
            </Helmet>

            <div style={{ margin: 'auto' }}>
                <div className="col-md-8 col-md-offset-2 text-center" style={{ marginTop: '10px', marginBottom: '5em' }}>
                    <div className={styles.page_large_header} style={{ height: '720px' }}>
                        <h1 className={styles.page_main_title} style={{ fontWeight: 'bold' }}>{thisArticle.title}</h1>
                        <div className={styles.page_artitle_info}>
                            <span>{[<CalendarOutlined />, thisArticle.publish_time]} </span>
                            <span>{[<EyeOutlined />, thisArticle.readings]} </span>
                            <span>{[<LikeOutlined />, thisArticleThumbsUp]} </span>
                            <span>{[<CommentOutlined />, thisArticleCommentsCount]} </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.page_card}>
                <br />
                <div style={{ fontSize: '1.2em', fontFamily: 'Microsoft YaHei UI' }}>
                    <Spin spinning={isLoading} size={'large'} tip={'加载中...'} style={{ marginLeft: '50%' }}></Spin>
                    <ReactMarkdown className={styles.table_hljs}
                        children={thisArticle.content}
                        components={{
                            code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '')
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        children={String(children).replace(/\n$/, '')}
                                        style={codeThemes[currentCodeTheme]}
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
                            },
                            img: ({ node, ...props }) => {
                                return (
                                    <Image
                                        src={node.properties.src}
                                        width={768}
                                        alt={node.properties.alt}
                                        fallback={'https://www.dongjiayi.com/static/files/image_fallback.png'}
                                    />
                                )
                            }
                        }}
                        remarkPlugins={[remarkMath, remarkGfm]}
                        rehypePlugins={[rehypeMathjax]}
                    />

                </div>
                <br />
            </div>




            <nav className={styles.thumb_up_navigation}>
                <button style={{ position: 'fixed', top: '6%', right: '8%' }} className="button button-glow button-circle button-caution button-jumbo" onClick={thumbsUp}>
                    <LikeFilled />
                </button>
            </nav>

            <FloatButton.Group
                trigger="hover"
                type="primary"
                style={{
                    bottom: 60,
                }}
                icon={<SettingFilled />}
            >
                <FloatButton icon={
                    <Tooltip title="代码高亮设置" placement='left' mouseEnterDelay={0.2}>
                        <CodeOutlined onClick={showCodeSettingsModal} />
                    </Tooltip>
                } />
            </FloatButton.Group>

            <Tooltip title="回到顶部" placement='left' mouseEnterDelay={0.5}>
                <FloatButton.BackTop duration={800} type='default' style={{ bottom: 10, }} />
            </Tooltip>

            <Modal
                title="代码高亮设置"
                open={isCodeSettingsModalOpen}
                onOk={handleCodeSettingsOk}
                onCancel={handleCodeSettingsCancel}
                footer={null}
                centered={true}
            >
                <span>主题: </span>
                <Select
                    defaultValue={currentCodeTheme}
                    style={{
                        width: 250,
                    }}
                    onChange={handleCodeThemeChange}
                    options={(() => {
                        let keys = Object.keys(codeThemes);
                        let data = [];
                        for (let i = 0; i < keys.length; i++) {
                            data.push({ value: keys[i], label: keys[i] });
                        }
                        return data;
                    })()}
                />
            </Modal>
        </div>
    );
}

export default Page;
