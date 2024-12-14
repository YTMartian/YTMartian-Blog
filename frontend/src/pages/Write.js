import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import MDEditor from '@uiw/react-md-editor';
import request from '../request';
import '../static/css/Write.css';
import { useNavigate } from 'react-router-dom';

import {
    Form,
    Input,
    message,
    Card,
    Button,
    Space,
    Select,
    Modal,
    Tooltip,
    FloatButton
} from 'antd';

import {
    SendOutlined,
    ClearOutlined,
    SaveOutlined,
    VerticalAlignTopOutlined,
    VerticalAlignBottomOutlined,
} from '@ant-design/icons'

const Write = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [headerScrollClass, setHeaderScrollClass] = useState('');
    const [hasChanges, setHasChanges] = useState(false);
    const [showTopButton, setShowTopButton] = useState(false);
    const [showBottomButton, setShowBottomButton] = useState(true);

    // 监听滚动事件，设置header动画
    const handleScroll = () => {
        let scroll = window.scrollY;
        if (scroll >= 50) {
            setHeaderScrollClass('fixed');
        } else {
            setHeaderScrollClass('');
        }
    }

    // 组件挂载时添加滚动监听
    React.useEffect(() => {
        window.addEventListener('scroll', handleScroll, true);
        return () => {
            window.removeEventListener('scroll', handleScroll, true);
        }
    }, []);

    // 添加 beforeunload 事件监听
    React.useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasChanges) {
                e.preventDefault();
                e.returnValue = '您有未保存的更改，确定要离开吗？';
                return e.returnValue;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [hasChanges]);

    // 已有的处理返回上一级的代码保持不变
    React.useEffect(() => {
        const handleRouteChange = () => {
            if (hasChanges) {
                Modal.confirm({
                    title: '提示',
                    content: '您有未保存的更改，确定要离开吗？',
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                        setHasChanges(false);
                        navigate(-1);
                    }
                });
                return false;
            }
            return true;
        };

        window.onpopstate = handleRouteChange;

        return () => {
            window.onpopstate = null;
        };
    }, [hasChanges, navigate]);

    // 修改 Input 的 onChange 处理
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        setHasChanges(true);
    };

    // 修改 MDEditor 的 onChange 处理
    const handleContentChange = (value) => {
        setContent(value);
        setHasChanges(true);
    };

    // 发布文章
    const handlePublish = () => {
        if (!title.trim()) {
            message.error('请输入文章标题');
            return;
        }
        if (!content.trim()) {
            message.error('请输入文章内容');
            return;
        }

        request({
            method: 'post',
            url: 'publish_article/',
            data: {
                title: title,
                content: content
            }
        }).then(response => {
            if (response.data.code === 0) {
                message.success('发布成功');
                setTitle('');
                setContent('');
                setHasChanges(false);  // 重置更改状态
            } else {
                message.error('发布失败: ' + response.data.msg);
            }
        }).catch(error => {
            message.error('发布失败: ' + error);
            console.error('发布失败:', error);
        });
    }

    // 修改滚动监听函数
    const handleEditorScroll = (e) => {
        const editor = document.querySelector('.w-md-editor-text-input');
        const preview = document.querySelector('.w-md-editor-preview');

        // 使用实际触发滚动的元素
        const element = e.target;
        const scrollTop = element.scrollTop;
        const scrollHeight = element.scrollHeight;
        const clientHeight = element.clientHeight;

        // 当滚动超过100px时显示回到顶部按钮
        setShowTopButton(scrollTop > 100);

        // 当距离底部100px以内时隐藏回到底部按钮
        setShowBottomButton(scrollHeight - scrollTop - clientHeight > 100);

        // 同步另一个面板的滚动位置
        if (element.classList.contains('w-md-editor-text-input') && preview) {
            preview.scrollTop = scrollTop;
        } else if (element.classList.contains('w-md-editor-preview') && editor) {
            editor.scrollTop = scrollTop;
        }
    };

    // 修改回到顶部函数
    const scrollToTop = () => {
        const editor = document.querySelector('.w-md-editor-text-input');
        const preview = document.querySelector('.w-md-editor-preview');

        if (editor) {
            editor.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        if (preview) {
            preview.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    // 修改回到底部函数
    const scrollToBottom = () => {
        const editor = document.querySelector('.w-md-editor-text-input');
        const preview = document.querySelector('.w-md-editor-preview');

        if (editor) {
            editor.scrollTo({
                top: editor.scrollHeight,
                behavior: 'smooth'
            });
        }

        if (preview) {
            preview.scrollTo({
                top: preview.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className='write_body'>
            <Helmet>
                <meta charSet="utf-8" />
                <title>写文章 | YTMartian</title>
                <link rel="icon" href="../static/imgs/label.ico" type="image/x-icon"></link>
            </Helmet>

            <div className="write_container" style={{ padding: '20px' }}>
                <Card
                    className="write_card"
                    bordered={false}
                    style={{
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                    }}
                >
                    <Form layout="vertical">
                        <Form.Item>
                            <Input
                                placeholder="请输入标题（最多100个字）"
                                value={title}
                                onChange={handleTitleChange}
                                className="title_input"
                                maxLength={100}
                                size="large"
                                bordered={false}
                                style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    padding: '16px 0',
                                    borderBottom: '1px solid #f0f0f0',
                                    marginBottom: '20px'
                                }}
                            />
                        </Form.Item>

                        <Form.Item>
                            <div style={{
                                background: '#f9f9f9',
                                padding: '15px',
                                borderRadius: '6px',
                                marginBottom: '20px'
                            }}>
                                <Space size="large">
                                    <Select
                                        mode="multiple"
                                        placeholder="选择文章分类"
                                        style={{ width: '200px' }}
                                        size="middle"
                                        options={[
                                            { value: 'tech', label: '技术' },
                                            { value: 'life', label: '生活' },
                                            { value: 'thoughts', label: '随想' }
                                        ]}
                                    />
                                    <Select
                                        mode="tags"
                                        placeholder="添加标签"
                                        style={{ width: '300px' }}
                                        size="middle"
                                    />
                                </Space>
                            </div>
                        </Form.Item>

                        <Form.Item>
                            <div style={{
                                border: '1px solid #e8e8e8',
                                borderRadius: '6px',
                                background: '#fff',
                                minHeight: '300px',
                            }}>
                                <MDEditor
                                    value={content}
                                    onChange={handleContentChange}
                                    height="100%"
                                    className="md_editor"
                                    preview="live"
                                    fullscreen={false}
                                    highlightEnable={true}
                                    placeholder="请输入正文（支持 Markdown 格式）"
                                    style={{
                                        boxShadow: 'none',
                                        height: '100%',
                                    }}
                                    visibleDragbar={false}
                                    previewOptions={{
                                        style: {
                                            height: '100%',
                                            overflow: 'auto'
                                        }
                                    }}
                                    textareaProps={{
                                        onScroll: handleEditorScroll
                                    }}
                                />
                            </div>
                        </Form.Item>

                        <Form.Item>
                            <div style={{
                                position: 'fixed',
                                right: '40px',
                                bottom: '40px',
                                zIndex: 100,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px'
                            }}>
                                <Tooltip
                                    title="保存草稿"
                                    placement="left"
                                    mouseEnterDelay={0}
                                    mouseLeaveDelay={0}
                                >
                                    <Button
                                        type="default"
                                        icon={<SaveOutlined />}
                                        size="large"
                                        title="保存草稿"
                                        style={{
                                            transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                            borderRadius: '50%',
                                            width: '50px',
                                            height: '50px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                                            border: 'none',
                                            backgroundColor: '#fff'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                        }}
                                    />
                                </Tooltip>
                                <Tooltip
                                    title="清空"
                                    placement="left"
                                    mouseEnterDelay={0}
                                    mouseLeaveDelay={0}
                                >
                                    <Button
                                        type="default"
                                        icon={<ClearOutlined />}
                                        size="large"
                                        title="清空"
                                        danger
                                        style={{
                                            transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                            borderRadius: '50%',
                                            width: '50px',
                                            height: '50px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                                            border: 'none',
                                            backgroundColor: '#fff'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                        }}
                                    />
                                </Tooltip>
                                <Tooltip
                                    title="发布"
                                    placement="left"
                                    mouseEnterDelay={0}
                                    mouseLeaveDelay={0}
                                >
                                    <Button
                                        type="primary"
                                        onClick={handlePublish}
                                        icon={<SendOutlined />}
                                        size="large"
                                        title="发布"
                                        style={{
                                            transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                            borderRadius: '50%',
                                            width: '50px',
                                            height: '50px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                                            border: 'none'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                        }}
                                    />
                                </Tooltip>
                                <Tooltip title="回到顶部" placement='left' mouseEnterDelay={0.5}>
                                    <FloatButton.BackTop duration={800} type='default'
                                        style={{
                                            transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                            borderRadius: '50%',
                                            width: '50px',
                                            height: '50px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                                            border: 'none',
                                            backgroundColor: '#fff',
                                        }} />
                                </Tooltip>
                            </div>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
}

export default Write;
