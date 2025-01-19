import React, { useState, useEffect } from 'react';
import { Button, Tooltip, Space } from 'antd';
import { 
    EyeOutlined, 
    EyeInvisibleOutlined, 
    ColumnWidthOutlined, 
    ColumnHeightOutlined, 
    CopyOutlined 
} from '@ant-design/icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import mermaid from 'mermaid';
import { message } from 'antd';
import ReactMarkdown from 'react-markdown';

import styles from '../static/css/Page.module.css';

const copyToClipboard = (text) => {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(
            () => message.success('复制成功'),
            () => fallbackCopyToClipboard(text)
        );
    } else {
        fallbackCopyToClipboard(text);
    }
};

const fallbackCopyToClipboard = (text) => {
    try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
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

const CodeBlock = React.memo(({ codeString, language, codeThemes, currentCodeTheme }) => {
    const [localWrapLongLines, setLocalWrapLongLines] = useState(false);
    const [showMermaidCode, setShowMermaidCode] = useState(false);

    useEffect(() => {
        if (language === 'mermaid') {
            try {
                mermaid.initialize({
                    startOnLoad: true,
                    theme: 'default',
                    securityLevel: 'loose',
                });
                mermaid.contentLoaded();
            } catch (error) {
                console.error('Mermaid initialization error:', error);
            }
        }
    }, [language, codeString]);

    const handleMermaidCodeToggle = () => {
        setShowMermaidCode(!showMermaidCode);
        setTimeout(() => {
            mermaid.contentLoaded();
        }, 100);
    };

    if (language === 'mermaid') {
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
                    flexDirection: showMermaidCode ? 'row' : 'column',
                    gap: '20px',
                    alignItems: 'flex-start'
                }}>
                    <div style={{
                        border: '1px solid #eee',
                        padding: '20px',
                        borderRadius: '4px',
                        backgroundColor: '#fff',
                        flex: showMermaidCode ? 1 : 'auto',
                        width: showMermaidCode ? '50%' : '100%'
                    }}>
                        <div className="mermaid">
                            {codeString}
                        </div>
                    </div>
                    {showMermaidCode && (
                        <div style={{ flex: 1, width: '50%' }}>
                            <SyntaxHighlighter
                                children={codeString}
                                style={codeThemes[currentCodeTheme]}
                                language="mermaid"
                                showLineNumbers
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }

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
                        onClick={() => {
                            setLocalWrapLongLines(!localWrapLongLines);
                            setTimeout(() => {
                                mermaid.contentLoaded();
                            }, 200);
                        }}
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
                showLineNumbers
                wrapLines
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
});

export default CodeBlock;
