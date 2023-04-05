/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect, useRef } from 'react';
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
    Space,
    Button,
    Input,
    Form,
    Card,
    Avatar
} from 'antd';
import {
    LikeFilled,
    HeartTwoTone,
    SettingFilled,
    CodeOutlined,
    CalendarOutlined,
    CommentOutlined,
    LikeOutlined,
    DislikeOutlined,
    EyeOutlined,
    QuestionCircleOutlined,
    SmileTwoTone,
    UserOutlined,
    MessageOutlined,
} from '@ant-design/icons'
import ReactCanvasNest from 'react-canvas-nest'
import EmojiMartData from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import ReactPlayer from 'react-player'
import Draggable from 'react-draggable'


const { TextArea } = Input;
const { Meta } = Card;

message.config({
    top: 0
});


const Page = () => {

    const location = useLocation();//获取前一页面history传递的参数
    const queryParams = new URLSearchParams(location.search);
    const [thisArticle, setThisArticle] = useState({});
    const [thisArticleThumbsUp, setThisArticleThumbsUp] = useState(0);
    const [thisArticleCommentsCount, setThisArticleCommentsCount] = useState(0);
    const [thisArticleComments, setThisArticleComments] = useState(undefined);
    const [isCodeSettingsModalOpen, setIsCodeSettingsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentCodeTheme, setCurrentCodeTheme] = useState('materialOceanic')
    const [form1] = Form.useForm();//对表单数据域进行交互

    //----------------------------拖动Emoji组件(START)-------------------------------------//
    const [openEmojiModal, setOpenEmojiModal] = useState(false);
    const [disabledEmojiModalDrag, setDisabledEmojiModalDrag] = useState(false);
    const [bounds, setBounds] = useState({
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
    });
    const draggleRef = useRef(null);
    const showEmojiModal = () => {
        setOpenEmojiModal(true);
    };
    const handleEmojiModalOk = (e) => {
        console.log(e);
        setOpenEmojiModal(false);
    };
    const handleEmojiModalCancel = (e) => {
        console.log(e);
        setOpenEmojiModal(false);
    };
    const onEmojiModalStart = (_event, uiData) => {
        const { clientWidth, clientHeight } = window.document.documentElement;
        const targetRect = draggleRef.current?.getBoundingClientRect();
        if (!targetRect) {
            return;
        }
        setBounds({
            left: -targetRect.left + uiData.x,
            right: clientWidth - (targetRect.right - uiData.x),
            top: -targetRect.top + uiData.y,
            bottom: clientHeight - (targetRect.bottom - uiData.y),
        });
    };
    //----------------------------拖动Emoji组件(END)-------------------------------------//

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

    //获取article
    const getArticles = () => {
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
                    window.open(`${window.location.origin}${window.location.pathname}#/404`, '_self')
                } else {
                    message.error('获取article失败(1):' + response.data.msg, 3);
                }

            }
        }).catch((error) => {
            message.error('获取article失败(2):' + error, 3);
            console.log('获取article失败(2):', error);
        });
    }

    //获取comments
    const getComments = () => {

        const dfs = (G, list, vis, index, depth) => {
            vis[index] = true;
            let innerCard = [];//当前评论card的子评论card
            let type = depth <= 1 ? '' : 'inner';
            for (let i = 0; i < G[index].length; i++) {
                if (!vis[G[index][i]]) {
                    innerCard.push(dfs(G, list, vis, G[index][i], depth + 1));
                }
            }
            return <Card
                style={{
                    width: '100%',
                }}
                extra={
                    <div className={styles.comment_operator}>
                        <a onClick={() => commentComment(list[index]['pk'])}>{[<MessageOutlined />, '回复']}</a>
                        <a onClick={() => commentThumbsUp(list[index]['pk'])}>{[<LikeOutlined />, thisArticleThumbsUp]}</a>
                        <a onClick={() => commentThumbsDown(list[index]['pk'])}>{[<DislikeOutlined />, thisArticleThumbsUp]}</a>
                    </div>
                }
                title={
                    <Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title="匿名"
                        description={list[index]['fields']['submit_date'].substring(0, 19).replace('T', ' ')}
                        style={{ paddingTop: '10px', paddingBottom: '2px', fontSize: '0.8em', background: '#ffffff' }}
                    />
                }
                type={type}
            >
                <p className={styles.comment_content}>{list[index]['fields']['content']}</p>
                {innerCard}
            </Card>;
        }

        //将评论转换为层级关系
        const convertCommentsToLevel = (list) => {
            let len = list.length;
            let G = [];//邻接表
            let idToIndex = {};//按顺序映射评论id
            for (let i = 0; i < len; i++) {
                G.push([]);
                idToIndex[list[i]['pk']] = i;
            }
            for (let i = 0; i < len; i++) {
                if (list[i]['fields']['parent']) {
                    G[idToIndex[list[i]['fields']['parent']]].push(i);
                }
            }
            const vis = new Array(len).fill(false);
            let res = [];
            for (let i = 0; i < len; i++) {
                if (!vis[i]) {
                    res.push(dfs(G, list, vis, i, 1));
                }
            }
            return res;
        }

        request({
            method: 'post',
            url: 'get_comment/',
            data: {
                'condition': 'article',
                'article_id': queryParams.get('article_id'),
            },
        }).then((response) => {
            if (response.data.code === 0) {
                console.log(response.data);
                setThisArticleComments(convertCommentsToLevel(response.data.list));
            } else {
                message.error('获取comment失败(1):' + response.data.msg, 3);

            }
        }).catch((error) => {
            message.error('获取comment失败(2):' + error, 3);
            console.log('获取comment失败(2):', error);
        });
    }

    //相当于componentDidMount，componentDidUpdate 和 componentWillUnmount
    useEffect(() => {
        // create
        getArticles();
        getComments();
        document.body.classList.add(styles.page_body);
        let theme = Cookies.get('currentCodeTheme');
        if (theme !== undefined && codeThemes[theme] !== undefined) {
            setCurrentCodeTheme(theme);
        }
        return () => {
            // destroy

        }
        // deps
    }, []);

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
                message.success(['点赞成功! ', <HeartTwoTone twoToneColor="#eb2f96" />], 3)
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

    const selectEmoji = (value) => {
        let curText = form1.getFieldValue('comment');
        if (!curText) {
            curText = '';
        }
        let element = document.getElementById('commentTextArea1');
        let start = element.selectionStart;
        let end = element.selectionEnd;
        form1.setFieldsValue({
            comment: curText.slice(0, start) + value.native + curText.slice(end)
        });
        //如果插入之后立即设置光标位置，就会失败，因为这时还未渲染完成
        setTimeout(() => {
            element.focus();
            element.selectionStart = start + value.native.length;
            element.selectionEnd = start + value.native.length;
        }, 1);
    }

    const onCommentArticle = () => {
        let value = form1.getFieldValue('comment');
        if (!value || value.length === 0) {
            message.info('评论为空！')
        }
        request({
            method: 'post',
            url: 'submit_comment/',
            data: {
                'condition': 'article',
                'article_id': queryParams.get('article_id'),
                'state': 'add',
                'content': value,
            },
        }).then((response) => {
            if (response.data.code === 0 && response.data.msg === 'success') {
                message.success('评论成功! ', 3);
                setThisArticleCommentsCount(thisArticleCommentsCount + 1);
                form1.setFieldsValue({
                    comment: ''
                });
                getComments();
            } else if (response.data.code === 1 && response.data.msg === 'invalid') {
                message.error('评论失败(1):疑似含有违禁词', 3);
            } else if (response.data.code === 1 && response.data.msg === 'error') {
                message.error('评论失败(2):errcode!=0', 3);
            } else {
                message.error('评论失败(3)', 3);
                console.log('评论失败(3):', response.data);
            }
        }).catch((error) => {
            message.error('评论失败(4):' + error, 3);
            console.log('评论失败(4):', error);
        });
    }

    const commentThumbsUp = (commentId) => {
        message.success('点赞成功！' + commentId)
    }

    const commentThumbsDown = (commentId) => {
        message.success('点踩成功！' + commentId)
    }

    const commentComment = (commentId) => {
        message.success('评论成功！' + commentId)
    }


    return (
        <div className={styles.page_body}>
            <Helmet>
                <meta charSet="utf-8" />
                <title>YTMartian | 董家佚💕丁梦洁</title>
                <link rel="icon" href="../static/imgs/label.ico" type="image/x-icon"></link>
            </Helmet>

            <ReactCanvasNest
                className='canvasNest'
                config={{
                    pointColor: ' 255, 255, 255 ',
                    lineColor: '255,255,255',
                    pointOpacity: 0.5,
                    pointR: 2,
                    count: 100,
                    follow: false
                }}
                style={{ zIndex: 1, position: 'fixed', top: 0, left: 0 }}
            />

            <div style={{ margin: 'auto' }}>
                <div className="col-md-8 col-md-offset-2 text-center" style={{ marginTop: '10px', marginBottom: '5em' }}>
                    <div className={styles.page_large_header} style={{ height: '720px' }}>
                        <h1 className={styles.page_main_title} style={{ fontWeight: 'bold', zIndex: 3 }}>{thisArticle.title}</h1>
                        <div className={styles.page_artitle_info} style={{ zIndex: 2 }}>
                            <span>{[<CalendarOutlined />, thisArticle.publish_time]} </span>
                            <span>{[<EyeOutlined />, thisArticle.readings]} </span>
                            <span>{[<LikeOutlined />, thisArticleThumbsUp]} </span>
                            <span>{[<CommentOutlined />, thisArticleCommentsCount]} </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.page_card} style={{ zIndex: 2 }}>
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
                            },
                            blockquote: ({ node, ...props }) => {
                                //原来的渲染有点问题，不能识别换行
                                let data = [];
                                for (let child in node.children) {
                                    let type = node.children[child].type;
                                    if (type === 'text') {
                                        data.push(node.children[child].value);
                                    } else if (type === 'element') {
                                        for (let i in node.children[child].children) {
                                            let s1 = node.children[child].children[i].value;
                                            let s2 = '\n';
                                            let index = s1.indexOf(s2);
                                            let start = 0;
                                            while (index !== -1) {
                                                data.push(s1.substring(start, index));
                                                data.push(<br />)
                                                start = index + s2.length;
                                                index = s1.indexOf(s2, start);
                                            }
                                            data.push(s1.substring(start, s1.length));
                                        }
                                    }
                                }
                                return <blockquote>{data}</blockquote>
                            }
                        }}
                        remarkPlugins={[remarkMath, remarkGfm]}
                        rehypePlugins={[rehypeMathjax]}
                    />

                </div>
                <br />
            </div>

            <div className={styles.page_card} style={{ zIndex: 2 }}>
                <br />
                <div style={{ fontSize: '1.2em', fontFamily: 'Microsoft YaHei UI' }}>
                    <Form
                        form={form1}
                        scrollToFirstError
                        size='default'
                    >
                        <Form.Item name="comment">
                            <TextArea
                                showCount
                                allowClear
                                size='large'
                                placeholder="说出你大胆的想法..."
                                maxLength={256}
                                autoSize={{ minRows: 1 }}
                                id='commentTextArea1'
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                shape='circle'
                                ghost={true}
                                size='large'
                                icon={<SmileTwoTone twoToneColor="#52c41a" />}
                                onClick={() => {
                                    document.getElementById('commentTextArea1').focus();//防止textarea失焦
                                    showEmojiModal();
                                }}
                            />
                            <Space style={{ float: 'right' }}>
                                <Button type="primary" onClick={onCommentArticle}>
                                    评论
                                </Button>
                                <Tooltip title="匿名评论|Markdown格式">
                                    <Button type="link" shape='circle' icon={<QuestionCircleOutlined />} />
                                </Tooltip>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
                <hr />
                <h2>{thisArticleCommentsCount}条评论</h2>
                <div>
                    {thisArticleComments}
                </div>
            </div>

            <Modal
                title={
                    <div
                        style={{
                            cursor: 'move',
                        }}
                        onMouseOver={() => {
                            if (disabledEmojiModalDrag) {
                                setDisabledEmojiModalDrag(false);
                            }
                        }}
                        onMouseOut={() => {
                            setDisabledEmojiModalDrag(true);
                        }}
                        onFocus={() => { }}
                        onBlur={() => { }}
                    >
                        Emoji
                    </div>
                }
                footer={null}
                open={openEmojiModal}
                onOk={handleEmojiModalOk}
                onCancel={handleEmojiModalCancel}
                maskClosable={true}
                mask={true}
                width={400}
                keyboard={true}
                modalRender={(modal) => (
                    <Draggable
                        disabled={disabledEmojiModalDrag}
                        bounds={bounds}
                        onStart={(event, uiData) => onEmojiModalStart(event, uiData)}
                    >
                        <div ref={draggleRef}>{modal}</div>
                    </Draggable>
                )}
            >
                <Picker
                    data={EmojiMartData}
                    onEmojiSelect={selectEmoji}
                    theme={'light'}
                    locale={'zh'}
                />
            </Modal>


            <nav className={styles.thumb_up_navigation}>
                <button style={{ position: 'fixed', top: '6%', right: '8%', zIndex: 2 }} className="button button-glow button-circle button-caution button-jumbo" onClick={thumbsUp}>
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
                style={{
                    top: -100,
                }}
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
        </div >
    );
}

export default Page;
