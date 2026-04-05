import './index.css';
import { useEffect } from 'react';

declare global {
  interface Window {
    navigateTo: (pageId: string) => void;
  }
}
function App() {
  // 页面切换框架（完全保留你原来的逻辑，用React useEffect包裹）
  useEffect(() => {
    // 扩展 Window 接口以支持 navigateTo 函数

    // 简单的页面切换框架
    window.navigateTo = function(pageId: string) {
      const pages = document.querySelectorAll('.page');
      pages.forEach(page => {
        page.classList.remove('active');
      });

      const targetPage = document.getElementById(pageId);
      if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo(0, 0);
      } else {
        console.warn(`Page with ID "${pageId}" not found.`);
      }
    };

    // 初始化逻辑
    console.log('Diary Framework Initialized');
  }, []);

  return (
    <div id="app-background">
      <div id="app-container">
        {/* Tally图片按钮（完全兼容，无报错） */}
        <button 
          id="diary-btn"
          data-tally-open="yPxLG8"
          data-tally-layout="modal"
          data-tally-width="400"
          aria-label="打开日记表单"
        >
          <img src="./图片素材/anniu.png" alt="进入日记" />
        </button>
      </div>
    </div>
  );
}

export default App;/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// 扩展 Window 接口以支持 navigateTo 函数
declare global {
  interface Window {
    navigateTo: (pageId: string) => void;
    openModal: (modalId: string) => void;
    closeModal: (modalId: string) => void;
    openDraggableModal: (modalId: string) => void;
    closeDraggableModal: (modalId: string) => void;
  }
}

// 简单的页面切换框架
window.navigateTo = function(pageId: string) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    page.classList.remove('active');
  });

  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
    window.scrollTo(0, 0);
  }
};

// 弹窗控制逻辑
window.openModal = function(modalId: string) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeModal = function(modalId: string) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// --- 可挪动弹窗逻辑 ---
window.openDraggableModal = function(modalId: string) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    // 初始位置
    if (!modal.style.top) {
      modal.style.top = '100px';
      modal.style.left = '100px';
    }
    // 置于顶层
    bringToFront(modal);
  }
};

window.closeDraggableModal = function(modalId: string) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
};

function bringToFront(element: HTMLElement) {
  const allDraggables = document.querySelectorAll('.draggable-modal');
  allDraggables.forEach(el => {
    (el as HTMLElement).style.zIndex = '10001';
  });
  element.style.zIndex = '10002';
}

// 拖拽实现
document.addEventListener('mousedown', (e) => {
  const header = (e.target as HTMLElement).closest('.draggable-header');
  if (!header) return;

  const modal = header.parentElement as HTMLElement;
  bringToFront(modal);

  let startX = e.clientX;
  let startY = e.clientY;
  let modalX = modal.offsetLeft;
  let modalY = modal.offsetTop;

  function onMouseMove(moveEvent: MouseEvent) {
    const deltaX = moveEvent.clientX - startX;
    const deltaY = moveEvent.clientY - startY;
    modal.style.left = modalX + deltaX + 'px';
    modal.style.top = modalY + deltaY + 'px';
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

// 点击弹窗背景关闭 (仅限普通弹窗)
document.addEventListener('click', (e) => {
  if ((e.target as HTMLElement).classList.contains('modal')) {
    const modalId = (e.target as HTMLElement).id;
    window.closeModal(modalId);
  }
});

// 初始化逻辑
document.addEventListener('DOMContentLoaded', () => {
  console.log('Diary Framework Initialized');
  
  // 示例：如果需要通过 URL Hash 切换页面
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    window.navigateTo(`page-${hash}`);
  }
});

// 扩展：如果需要处理浏览器前进后退
window.addEventListener('popstate', () => {
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    window.navigateTo(`page-${hash}`);
  }
});

// 导出为空，因为我们直接操作 DOM
export {};
