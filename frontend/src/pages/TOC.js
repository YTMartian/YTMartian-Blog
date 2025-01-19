// frontend/src/components/TOC.js
import React, { useCallback, useState } from 'react';
import Draggable from 'react-draggable';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import styles from '../static/css/Page.module.css';

const TOC = React.memo(({ tableOfContents, scrollToHeading }) => {
    const [tocPosition, setTocPosition] = useState({ x: 20, y: 240 });
    const [dockSide, setDockSide] = useState('left');
    const [tocCollapsed, setTocCollapsed] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const onTocStart = useCallback(() => {
        setIsDragging(true);
    }, []);

    const onTocStop = useCallback((e, data) => {
        setIsDragging(false);
        setTocPosition({ x: data.x, y: data.y });
    }, []);

    const toggleCollapse = () => {
        setTocCollapsed(!tocCollapsed);
        
        if (!tocCollapsed) {
            // 折叠时，移动到最左侧
            setTocPosition({
                x: 0,
                y: tocPosition.y
            });
            setDockSide('left');
        } else {
            // 展开时，从左侧展开
            setTocPosition({
                x: 0,
                y: tocPosition.y
            });
        }
    };

    return (
        <Draggable
            handle=".toc-handle"
            position={tocPosition}
            onStart={onTocStart}
            onStop={onTocStop}
            bounds="parent"
            scale={1}
            defaultClassName={styles.smooth_drag}
        >
            <div
                className={`${styles.toc_navigation} ${styles[dockSide]} ${tocCollapsed ? styles.collapsed : ''} ${isDragging ? styles.dragging : ''}`}
                style={{
                    position: 'fixed',
                    pointerEvents: 'auto',
                    zIndex: 1000,
                    width: tocCollapsed ? '40px' : '15vw',
                    transition: 'width 0.3s ease',
                    overflow: 'hidden',
                    willChange: 'transform',
                    transform: 'translate3d(0,0,0)',
                    backfaceVisibility: 'hidden',
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
                                className={styles.toc_item}
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
    );
});

export default TOC;