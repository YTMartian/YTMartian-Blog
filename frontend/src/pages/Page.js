/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect, useRef, useCallback } from 'react';
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
    EyeInvisibleOutlined,
    CopyOutlined,
    ColumnWidthOutlined,
    ColumnHeightOutlined,
    LeftOutlined,
    RightOutlined,
} from '@ant-design/icons'
import ReactCanvasNest from 'react-canvas-nest'
import EmojiMartData from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
// import ReactPlayer from 'react-player'
import Draggable from 'react-draggable'
import mermaid from 'mermaid';
import { throttle } from 'lodash';


const { TextArea } = Input;
const { Meta } = Card;

message.config({
    top: 0
});

// Initialize mermaid
mermaid.initialize({
    startOnLoad: true,
    theme: 'default',
    securityLevel: 'loose',
});

// 将 copyToClipboard 移到组件外部
const copyToClipboard = (text) => {
    // 首先尝试使用 navigator.clipboard API
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(
            () => message.success('复制成功'),
            () => fallbackCopyToClipboard(text)
        );
    } else {
        // 如果 navigator.clipboard 不可用，使用后备方案
        fallbackCopyToClipboard(text);
    }
};

// 后备复制方案
const fallbackCopyToClipboard = (text) => {
    try {
        // 创建一个临时文本区域
        const textArea = document.createElement('textarea');
        textArea.value = text;

        // 防止滚动到底部
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        // 执行复制命令
        const successful = document.execCommand('copy');
        textArea.remove();

        if (successful) {
            message.success('复制成功');
        } else {
            message.error('复制失败');
        }
    } catch (err) {
        message.error('复制失败');
        console.error('复制失败:', err);
    }
};

// 创建独立的代码块组件
const CodeBlock = ({ match, codeString, language, codeThemes, currentCodeTheme }) => {
    const [localWrapLongLines, setLocalWrapLongLines] = useState(false);

    const handleLocalWrapLongLinesToggle = () => {
        setLocalWrapLongLines(!localWrapLongLines);
        // 给 DOM 一点时间更新，然后重新渲染 mermaid
        setTimeout(() => {
            mermaid.contentLoaded();
        }, 200);
    };

    return (
        <div style={{ position: 'relative' }}>
            <Space
                style={{
                    position: 'absolute',
                    right: '10px',
                    top: '10px',
                    zIndex: 1,
                }}
            >
                <Tooltip title={localWrapLongLines ? "禁用自动换行" : "启用自动换行"}>
                    <Button
                        type="text"
                        icon={localWrapLongLines ? <ColumnWidthOutlined /> : <ColumnHeightOutlined />}
                        onClick={handleLocalWrapLongLinesToggle}
                        style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: '#1890ff'
                        }}
                    />
                </Tooltip>
                <Tooltip title="复制代码">
                    <Button
                        type="text"
                        icon={<CopyOutlined style={{ color: '#1890ff' }} />}
                        onClick={() => copyToClipboard(codeString)}
                        style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: '#1890ff'
                        }}
                    />
                </Tooltip>
            </Space>
            <SyntaxHighlighter
                children={codeString}
                style={codeThemes[currentCodeTheme]}
                language={language}
                PreTag="div"
                showLineNumbers={true}
                wrapLines={true}
                wrapLongLines={localWrapLongLines}
                customStyle={{
                    margin: 0,
                    padding: '1em',
                    paddingTop: '2em'
                }}
                lineNumberStyle={lineNumber => ({
                    minWidth: '2.5em',
                    paddingRight: '1em',
                    textAlign: 'right',
                    userSelect: 'none',
                    borderRight: '1px solid rgba(128, 128, 128, 0.2)',
                    marginRight: '1em'
                })}
            />
        </div>
    );
};

const Page = () => {

    const location = useLocation();//获取前一页面history传递的参数
    const queryParams = new URLSearchParams(location.search);
    const [thisArticle, setThisArticle] = useState({});
    const [thisArticleThumbsUp, setThisArticleThumbsUp] = useState(0);
    const thisArticleCommentsCount = useRef(0);
    const [thisArticleComments, setThisArticleComments] = useState(undefined);
    const [isCodeSettingsModalOpen, setIsCodeSettingsModalOpen] = useState(false);
    const [isContentLoading, setIsContentLoading] = useState('');
    const [isCommentLoading, setIsCommentLoading] = useState('');
    const [currentCodeTheme, setCurrentCodeTheme] = useState('materialOceanic')
    const [form1] = Form.useForm();//对表单数据域进行交互
    const [form2] = Form.useForm();//用于回复评论
    const currentReplyCommentId = useRef(undefined);//记录当前回复的评论id,如果不使用hook，则无法传入selectEmoji，并且useState不是同步更新的
    const [showMermaidCode, setShowMermaidCode] = useState(false);
    const [tableOfContents, setTableOfContents] = useState([]);
    const [tocCollapsed, setTocCollapsed] = useState(false);
    const [tocPosition, setTocPosition] = useState({ x: 20, y: 240 }); // 修改这里的值来调整初始位置
    const [dockSide, setDockSide] = useState('left'); // 新增：记录停靠边
    const tocDraggleRef = useRef(null);
    const [activeId, setActiveId] = useState('');
    const headingObservers = useRef(new Map());
    const [isDragging, setIsDragging] = useState(false);
    const [articleBounds, setArticleBounds] = useState({ left: 0, right: 0 });
    const articleRef = useRef(null);

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
        setOpenEmojiModal(false);
    };
    const handleEmojiModalCancel = (e) => {
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

                setIsContentLoading('none');
                setThisArticle(this_article);
                setThisArticleThumbsUp(this_article.thumbs_up);
                thisArticleCommentsCount.current = this_article.comments;
                
                // 从内容生成目录
                generateTOC(this_article.content);
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

    // 添加处理显示/隐藏源码的函数
    const handleMermaidCodeToggle = () => {
        setShowMermaidCode(!showMermaidCode);
        // 给 DOM 一点时间更新，然后重新渲染 mermaid
        setTimeout(() => {
            mermaid.contentLoaded();
        }, 200);
    };

    const getMarkdown = (content) => {
        return <ReactMarkdown className={styles.table_hljs}
            children={content}
            components={{
                code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    const codeString = String(children).replace(/\n$/, '');

                    // Handle mermaid syntax
                    if (match && match[1] === 'mermaid') {
                        return (
                            <div>
                                <div style={{ marginBottom: '10px' }}>
                                    <Button
                                        type="link"
                                        onClick={handleMermaidCodeToggle}
                                        icon={showMermaidCode ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                    >
                                        {showMermaidCode ? '隐藏源码' : '显示源码'}
                                    </Button>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: '20px',
                                    alignItems: 'flex-start'
                                }}>
                                    {/* Source code */}
                                    {showMermaidCode && (
                                        <div style={{ flex: 1 }}>
                                            <SyntaxHighlighter
                                                children={String(children).replace(/\n$/, '')}
                                                style={codeThemes[currentCodeTheme]}
                                                language="mermaid"
                                                PreTag="div"
                                                showLineNumbers={true}
                                                {...props}
                                            />
                                        </div>
                                    )}
                                    {/* Render mermaid diagram */}
                                    <div style={{
                                        flex: showMermaidCode ? 1 : 'auto',
                                        border: '1px solid #eee',
                                        padding: '20px',
                                        borderRadius: '4px',
                                        backgroundColor: '#fff'
                                    }}>
                                        <div className="mermaid">
                                            {String(children).replace(/\n$/, '')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    // Handle other code blocks
                    return !inline && match ? (
                        <CodeBlock
                            match={match}
                            codeString={codeString}
                            language={match[1]}
                            codeThemes={codeThemes}
                            currentCodeTheme={currentCodeTheme}
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
                            fallback={'http://45.141.139.185//static/files/image_fallback.png'}
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
                },
                h1: ({node, ...props}) => <h1 id={props.children[0].toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')} {...props} />,
                h2: ({node, ...props}) => <h2 id={props.children[0].toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')} {...props} />,
                h3: ({node, ...props}) => <h3 id={props.children[0].toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')} {...props} />,
                h4: ({node, ...props}) => <h4 id={props.children[0].toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')} {...props} />,
                h5: ({node, ...props}) => <h5 id={props.children[0].toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')} {...props} />,
                h6: ({node, ...props}) => <h6 id={props.children[0].toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')} {...props} />,
            }}
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeMathjax]}
        />
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
                className={styles.comment_card}
                extra={
                    <div className={styles.comment_operator}>
                        <a onClick={() => commentComment(list[index]['pk'])}>{[<MessageOutlined />, '回复']}</a>
                        <a onClick={() => commentThumbsUp(list[index]['pk'])}>{[<LikeOutlined />, list[index]['fields']['thumbs_up']]}</a>
                        <a onClick={() => commentThumbsDown(list[index]['pk'])}>{[<DislikeOutlined />, list[index]['fields']['thumbs_down']]}</a>
                    </div>
                }
                title={
                    <Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={`匿名(id:${list[index]['pk']})`}
                        description={list[index]['fields']['submit_date'].substring(0, 19).replace('T', ' ')}
                        style={{ paddingTop: '10px', paddingBottom: '2px', fontSize: '0.8em', background: '#ffffff' }}
                    />
                }
                type={type}
            >
                <p className={styles.comment_content}>{getMarkdown(list[index]['fields']['content'])}</p>
                <div style={{ fontSize: '1.2em', fontFamily: 'Microsoft YaHei UI', display: 'none' }} id={`replyArea${list[index]['pk']}`}>
                    <Form
                        form={form2}
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
                                id={`replyTextArea${list[index]['pk']}`}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                shape='circle'
                                ghost={true}
                                size='large'
                                icon={<SmileTwoTone twoToneColor="#52c41a" />}
                                onClick={() => {
                                    document.getElementById(`replyTextArea${list[index]['pk']}`).focus();//防止textarea失焦
                                    showEmojiModal();
                                }}
                            />
                            <Space style={{ float: 'right' }}>
                                <Button type="primary" onClick={() => onCommentComment(list[index]['pk'])}>
                                    评论
                                </Button>
                                <Button type="primary" onClick={() => onCancelCommentComment(list[index]['pk'])} danger>
                                    取消
                                </Button>
                                <Tooltip title="匿名评论|Markdown格式">
                                    <Button type="link" shape='circle' icon={<QuestionCircleOutlined />} />
                                </Tooltip>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
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
                setThisArticleComments(convertCommentsToLevel(response.data.list));
                setIsCommentLoading('none');
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

    // Add useEffect to initialize mermaid after content renders
    useEffect(() => {
        // Initialize mermaid diagrams
        setTimeout(() => {
            mermaid.contentLoaded();
        }, 200);
    }, [thisArticle]); // Add thisArticle as dependency

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
                message.success(['点赞成功! ', <HeartTwoTone twoToneColor="#eb2f96" />], 3);
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
        let element = document.getElementById('commentTextArea1');
        if (currentReplyCommentId.current) {//此时是回复的评论而不是文章
            curText = form2.getFieldValue('comment');
            element = document.getElementById(`replyTextArea${currentReplyCommentId.current}`);
        }
        if (!curText) {
            curText = '';
        }
        let start = element.selectionStart;
        let end = element.selectionEnd;
        if (currentReplyCommentId.current) {//此时是回复的评论而不是文章
            form2.setFieldsValue({
                comment: curText.slice(0, start) + value.native + curText.slice(end)
            });
        } else {
            form1.setFieldsValue({
                comment: curText.slice(0, start) + value.native + curText.slice(end)
            });
        }

        //如果插入之后立即设置光标位置，就会失败，因为这时还未渲染完成
        setTimeout(() => {
            element.focus();
            element.selectionStart = start + value.native.length;
            element.selectionEnd = start + value.native.length;
        }, 1);
    }

    //评论文章
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
                thisArticleCommentsCount.current = thisArticleCommentsCount.current + 1;
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

    //评论评论
    const onCommentComment = (commentId) => {
        let value = form2.getFieldValue('comment');
        if (!value || value.length === 0) {
            message.info('评论为空！')
        }
        request({
            method: 'post',
            url: 'submit_comment/',
            data: {
                'condition': 'comment',
                'comment_id': commentId,
                'state': 'add',
                'content': value,
            },
        }).then((response) => {
            if (response.data.code === 0 && response.data.msg === 'success') {
                message.success('评论成功! ', 3);
                thisArticleCommentsCount.current = thisArticleCommentsCount.current + 1;
                form2.setFieldsValue({
                    comment: ''
                });
                getComments();
                document.getElementById(`replyArea${currentReplyCommentId.current}`).style.display = 'none';
                currentReplyCommentId.current = undefined;
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

    //取消评论评论
    const onCancelCommentComment = (commentId) => {
        document.getElementById(`replyArea${commentId}`).style.display = 'none';
        currentReplyCommentId.current = undefined;
        form2.setFieldsValue({
            comment: ''
        });
    }

    const commentThumbsUp = (commentId) => {
        request({
            method: 'post',
            url: 'submit_like/',
            data: {
                'condition': 'comment',
                'comment_id': commentId,
                'state': 'add'
            },
        }).then((response) => {
            if (response.data.code === 0 && response.data.msg === 'success') {
                getComments();
                message.success(['点赞成功! ', <HeartTwoTone twoToneColor="#eb2f96" />], 3);
            } else {
                message.error('点赞失败(1):' + response.data.msg, 3);
            }
        }).catch((error) => {
            message.error('点赞失败(2):' + error, 3);
            console.log('点赞失败(2):', error);
        });
    }

    const commentThumbsDown = (commentId) => {
        request({
            method: 'post',
            url: 'submit_like/',
            data: {
                'condition': 'comment',
                'comment_id': commentId,
                'state': 'minus'
            },
        }).then((response) => {
            if (response.data.code === 0 && response.data.msg === 'success') {
                getComments();
                message.success('点踩成功! ', 3);
            } else {
                message.error('点踩失败(1):' + response.data.msg, 3);
            }
        }).catch((error) => {
            message.error('点踩失败(2):' + error, 3);
            console.log('点踩失败(2):', error);
        });
    }


    const commentComment = (commentId) => {
        if (currentReplyCommentId.current) {
            document.getElementById(`replyArea${currentReplyCommentId.current}`).style.display = 'none';
            if (currentReplyCommentId.current !== commentId) {//已在回复一条评论时，又点击了回复另一条评论
                form2.setFieldsValue({
                    comment: ''
                });
            }
        }
        document.getElementById(`replyArea${commentId}`).style.display = '';
        currentReplyCommentId.current = commentId;
        document.getElementById(`replyTextArea${commentId}`).focus();
    }

    // 添加从markdown内容生成目录的函数
    const generateTOC = (content) => {
        const headingRegex = /^(#{1,6})\s+(.+)$/gm;
        const toc = [];
        let match;
        
        while ((match = headingRegex.exec(content)) !== null) {
            const level = match[1].length; // 标题级别(1-6)
            const text = match[2];         // 标题文本
            const id = text.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-'); // 生成标题ID
            
            toc.push({
                level,
                text,
                id
            });
        }
        
        setTableOfContents(toc);
    };

    // 添加滚动处理函数
    const scrollToHeading = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // 使用 useCallback 优化观察者回调
    const headingCallback = useCallback((entries) => {
        const visibleHeadings = entries.filter(entry => entry.isIntersecting);
        
        if (visibleHeadings.length > 0) {
            // 获取最靠近视口顶部的标题
            const mostVisibleHeading = visibleHeadings.reduce((prev, curr) => {
                const prevBound = prev.boundingClientRect;
                const currBound = curr.boundingClientRect;
                return Math.abs(prevBound.top) < Math.abs(currBound.top) ? prev : curr;
            });
            
            setActiveId(mostVisibleHeading.target.id);
        }
    }, []);

    // 设置标题观察者
    useEffect(() => {
        const observer = new IntersectionObserver(headingCallback, {
            rootMargin: '-80px 0px -80% 0px'
        });

        // 清理旧的观察者
        headingObservers.current.forEach(observer => observer.disconnect());
        headingObservers.current.clear();

        // 观察所有标题元素
        document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
            observer.observe(heading);
            headingObservers.current.set(heading, observer);
        });

        return () => {
            headingObservers.current.forEach(observer => observer.disconnect());
            headingObservers.current.clear();
        };
    }, [headingCallback, thisArticle]); // 当文章内容更新时重新设置观察者

    // 修改 onTocStart 函数，移除边界限制
    const onTocStart = useCallback((e, data) => {
        setIsDragging(true);
    }, []);

    // 修改 onTocStop 函数，简化逻辑
    const onTocStop = useCallback((e, data) => {
        setIsDragging(false);
        const { clientWidth } = window.document.documentElement;
        const newDockSide = data.x < clientWidth / 2 ? 'left' : 'right';
        setDockSide(newDockSide);
        setTocPosition({ x: data.x, y: data.y });
    }, []);

    // 处理折叠/展开
    const toggleCollapse = () => {
        const { clientWidth } = window.document.documentElement;
        setTocCollapsed(!tocCollapsed);
        
        if (!tocCollapsed) { // 要折叠
            setTocPosition({ 
                x: dockSide === 'left' ? 0 : clientWidth - 40,
                y: tocPosition.y 
            });
        } else { // 要展开
            setTocPosition({ 
                x: dockSide === 'left' ? 20 : clientWidth - 270,
                y: tocPosition.y 
            });
        }
    };

    // 添加一个函数来更新文章边界
    const updateArticleBounds = useCallback(() => {
        if (articleRef.current) {
            const rect = articleRef.current.getBoundingClientRect();
            setArticleBounds({
                left: rect.left,
                right: window.innerWidth - rect.right
            });
        }
    }, []);

    // 添加窗口大小变化监听
    useEffect(() => {
        updateArticleBounds();
        const handleResize = throttle(updateArticleBounds, 100);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [updateArticleBounds]);

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
                            <span>{[<CommentOutlined />, thisArticleCommentsCount.current]} </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.page_card} style={{ zIndex: 2 }} ref={articleRef}>
                <br />
                <div style={{ fontSize: '1.2em', fontFamily: 'Microsoft YaHei UI' }}>
                    <div className={styles.loading} style={{ display: isContentLoading }}>
                        <span /><span /><span /><span /><span />
                    </div>
                    {getMarkdown(thisArticle.content)}
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
                <h2>{thisArticleCommentsCount.current}条评论</h2>
                <div>
                    <div className={styles.loading2} style={{ display: isCommentLoading }}>
                        <div className={styles.loading2_dot1}></div>
                        <div className={styles.loading2_dot2}></div>
                        <div className={styles.loading2_dot3}></div>
                    </div>
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
                <button 
                    style={{ 
                        position: 'fixed', 
                        top: '6%', 
                        right: '8%', 
                        zIndex: 2,
                        borderRadius: '50%',  // 添加圆角
                        width: '60px',        // 设置固定宽度
                        height: '60px',       // 设置固定高度
                        display: 'flex',      // 使用flex布局
                        alignItems: 'center', // 垂直居中
                        justifyContent: 'center', // 水平居中
                        padding: 0            // 移除内边距
                    }} 
                    className="button button-glow button-caution button-jumbo" 
                    onClick={thumbsUp}
                >
                    <LikeFilled style={{ fontSize: '24px' }} />
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

            <Draggable
                handle=".toc-handle"
                position={tocPosition}
                onStart={onTocStart}
                onStop={onTocStop}
            >
                <div 
                    className={`${styles.toc_navigation} ${styles[dockSide]} ${tocCollapsed ? styles.collapsed : ''} ${isDragging ? styles.dragging : ''}`}
                    ref={tocDraggleRef}
                    style={{
                        position: 'fixed',
                        pointerEvents: 'auto',
                        zIndex: 1000,
                        width: tocCollapsed ? '40px' : '15vw',
                        transition: 'width 0.3s ease',
                        overflow: 'hidden'
                    }}
                >
                    <div className={styles.toc_container}>
                        <div className={`${styles.toc_header} toc-handle`}>
                            <h3>目录</h3>
                            <button
                                className={styles.collapse_btn}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleCollapse();
                                }}
                            >
                                {dockSide === 'left' ? 
                                    (tocCollapsed ? <RightOutlined /> : <LeftOutlined />) :
                                    (tocCollapsed ? <LeftOutlined /> : <RightOutlined />)
                                }
                            </button>
                        </div>
                        <div className={styles.toc_content}>
                            {tableOfContents.map((heading, index) => (
                                <div
                                    key={index}
                                    className={`${styles.toc_item} ${heading.id === activeId ? styles.active : ''}`}
                                    style={{ 
                                        paddingLeft: `${(heading.level) * 5}px`
                                    }}
                                    onClick={() => scrollToHeading(heading.id)}
                                >
                                    {heading.text}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Draggable>
        </div >
    );
}

export default Page;
