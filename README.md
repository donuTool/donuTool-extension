# donuTool

<br>
<br>

![donuTool](/public/donuTool-main-picture.png)

<br>

<div align="center">

donuTool은 가벼우면서도 강력한 플로팅 툴바로, 커서를 자동으로 따라다니며,사용자가 원하는 순간에<br>바로 도구에 접근할 수 있도록 설계되었기에 화면을 옮겨 다니거나 메뉴를 찾느라 시간을 낭비할 필요가 없습니다.<br>필요한 도구를 ‘찾아가는’ 것이 아니라, 도구가 ‘사용자에게 찾아오는’ 경험을 제공합니다.<br>donuTool로 작업 흐름을 방해받지 않고, 필요한 도구를 바로 꺼내 쓸 수 있는 새로운 방식을 경험해 보세요.

<a href="https://github.com/donuTool/donuTool-extension">확장프로그램 레포지토리</a>
<span> | </span>
<a href="https://github.com/donuTool/donuTool-frontend">프론트엔드 레포지토리</a>
<span> | </span>
<a href="https://github.com/donuTool/donuTool-backend">백엔드 레포지토리</a>

</div>

<br>
<br>

# 목차

- [🔥 동기](#-동기)
- [📖 프리뷰](#-프리뷰)
- [📚 기술 스택](#-기술-스택)
- [🎯 기능](#-기능)
- [💻 개발](#-개발)
- [👌 사용자 경험](#-사용자-경험)
- [🗓️ 기간](#️-기간)
- [📝 소감](#-소감)

<br>
<br>

# 🔥 동기

이 프로젝트를 시작한 계기는 웹 브라우징을 하면서 늘 느꼈던 단순하지만 근본적인 질문에서 출발했습니다.

**_“화면을 가리지 않되 툴바를 대체할 수 있는 방법이 없을까?”_**

현대인의 일상에서 웹 브라우저는 필수적인 도구지만, 여전히 해결되지 않은 불편함이 있습니다. 브라우저 상단의 툴바는 뒤로가기, 새로고침, 탭 전환 등 핵심적인 기능을 제공하지만, 동시에 귀중한 화면 공간을 차지해 콘텐츠 영역을 제한합니다. 그러다 보니 사용자는 항상 **“넓은 화면에서 콘텐츠를 보고 싶다”** 는 욕구와 **“브라우저 기능은 반드시 필요하다”** 는 현실 사이에서 느끼게 되는 답답함이 불가피하다고 생각했습니다. 특히 작은 화면에서 작업하거나 장시간 웹서핑을 할 때 이 불편함은 더욱 크게 다가옵니다.
이 문제를 해결하기 위해 저는 몇 가지 가설을 세웠습니다.

- 화면 공간을 차지하지 않으면서도 필요한 기능에 즉시 접근할 수 있을까?
- 기존 툴바의 장점은 유지하면서도, 더 자연스럽게 쓸 수 있는 방법은 없을까?
- 사용자의 작업 흐름을 방해하지 않고 브라우저 기능을 제공할 수 있을까?
- 브라우징 중 ‘마우스 커서’라는 이미 움직이고 있는 요소를 활용할 수는 없을까?

이 질문들을 따라가며, 한 가지 흥미로운 가능성에 도달했습니다.

**_“마우스 커서를 따라다니면서 소형 툴바는 어떨까?”_**

커서야말로 사용자가 웹페이지를 탐색하는 동안 자연스럽게 움직이는 요소이며, 평상시에는 보이지 않다가 필요한 순간에만 커서 주변에 나타날 수 있다는 장점이 있다고 생각했습니다. 플로팅 툴바를 활용하면, 화면 공간을 전혀 차지하지 않으면서도 뒤로가기나 탭 전환 같은 핵심 기능들을 손 닿는 곳에서 바로 사용할 수 있겠다는 확신이 들었습니다.
그러던 중 웹 기술만으로도 마우스 커서의 위치를 실시간으로 추적하고, 이에 반응하는 인터페이스를 구현할 수 있다는 가능성을 확인했습니다. 이 기술을 접목한다면, 누구나 웹 브라우저에서 바로 사용할 수 있는 플로팅 툴바를 만들 수 있겠다는 아이디어로 발전하게 되었습니다.

<br>
<br>

# 📖 프리뷰

### 브라우저에 주입된 툴바 UI를 조작하는 영상

![donuTool-preview](/public/donuTool-preview.gif)

### 웹 대시보드 스크린샷

![donuTool-screenshot](/public/donuTool-screenshot-1.png)

### 확장프로그램 팝업 페이지 스크린샷

![donuTool-screenshot](/public/donuTool-screenshot-2.png)

### ⚠️ 현재 아래 기능은 개발 중이며, 향후 업데이트에서 제공될 예정입니다:

- 대시보드: 주요 데이터 및 상태를 종합적으로 확인할 수 있는 화면
- 도움말: 사용자 가이드 및 자주 묻는 질문(FAQ) 등 지원 문서
- 계정: 사용자 계정에 저장되어 있는 정보 관리 및 초기화 기능을 제공하는 화면

<br>
<br>

# 📚 기술 스택

## Web & Extension

[![JavaScript](https://img.shields.io/badge/javascript-ECDC5A?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![TypeScript](https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![ManifestV3](https://img.shields.io/badge/manifest%20V3-EA4335?style=for-the-badge&logoColor=black)](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3?hl=ko)
[![React](https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=Tailwind%20CSS&logoColor=white)](https://tailwindcss.com/)
[![Chart.js](https://img.shields.io/badge/chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)](https://www.chartjs.org/)
[![i18next](https://img.shields.io/badge/i18next-26A69A?style=for-the-badge&logo=i18next&logoColor=white)](https://www.i18next.com/)
[![Zustand](https://img.shields.io/badge/Zustand-FF7B00?style=for-the-badge&logoColor=white)](https://zustand-demo.pmnd.rs/)
[![Dnd-kit](https://img.shields.io/badge/dndkit-596CFF?style=for-the-badge&logoColor=white)](https://dndkit.com/)

## Server

[![Axios](https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/kr/docs/intro)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white)](https://www.mongodb.com/)

<br>
<br>

# 🎯 기능

## 🧩 확장프로그램

### 팝업 페이지

Chrome 웹스토어에서 설치한 뒤 실행하면 표시되는 확장프로그램 팝업 페이지입니다.

- 테마 토글 버튼
- 브라우저에 설정된 사용자 언어를 인식해 해당 언어에 맞는 텍스트 제공
- 로그인 페이지
  - 구글 OAuth를 활용한 로그인 기능
  - 해당 유저 정보에 저장된 데이터 불러오기 및 저장
  - 게스트 모드
- 메인 페이지
  - 전체화면(상단 도구막대 가리기) 토글 기능
  - 툴바 UI 실행 및 종료 기능
  - 로그아웃 기능
- 설정 페이지
  - 툴바 UI 내 버튼 세팅 드래그 앤 드롭 기능
  - 툴바 UI 내 사용할 수 있는 각종 기능 버튼 목록 제공
  - 새 탭 생성 버튼의 주소 커스텀 기능

### 툴바 UI

팝업 메인 페이지에서 실행 버튼을 클릭 시 페이지 DOM에 주입되는 UI입니다.

- 커서를 실시간으로 따라다니는 UI
- 페이지 DOM 내 요소를 감지하여 자동 UI 활성화/비활성화 기능
- 활성화 후 클릭 시에만 UI 위치 고정 및 드래그하여 버튼 인터랙션 기능
- 버튼 인터랙션 목록
  - 뒤로 / 앞으로 가기
  - 이전 / 다음 탭으로 가기
  - 새로고침
  - 새 탭 생성
  - 탭 닫기
  - 번역
  - 탭 북마크
  - 탭 내 모든 이미지 다운로드
  - 탭 인쇄
  - 탭 스크린샷
  - 탭 주소 복사

## 🌐 웹

확장프로그램 팝업 페이지에서 로그인하면, 해당 사용자 ID를 기반으로 열리는 개인화된 웹 페이지입니다.

- 대시보드 페이지
  - 사용자 설정, 활동 현황 등을 한눈에 확인할 수 있는 메인 화면
- 도움말 페이지
  - 서비스 이용 가이드, 자주 묻는 질문(FAQ), 사용 팁 제공
- 계정 페이지
  - 사용자 계정 정보 확인, 비밀번호 변경, 초기화 등 계정 관리 기능
- 통계 페이지
  - 도구 사용 기록, 클릭 횟수, 사용 시간 등의 데이터를 시각화하여 제공
- 설정 페이지
  - 도구의 레이아웃, 버튼 구성, 사용자 테마 설정 등 개인화 기능

<br>
<br>

# 💻 개발

## 1. 확장프로그램 manifest V3 구성

이 프로젝트는 Chrome 확장프로그램의 최신 스펙인 `Manifest V3`를 기반으로 개발되었습니다.
`Manifest V3`는 기존의 `background page` 대신 `service worker`를 사용하여 백그라운드 작업을 처리하고, 보안성과 성능을 개선합니다.

주요 구성 요소는 다음과 같습니다:

- `content_scripts`: 브라우저 웹 페이지에 donuTool의 오버레이 UI를 주입
- `background (service worker)`: 사용자 설정 데이터 관리, storage 접근, 웹 요청 처리 등 중앙 역할 수행
- `permissions` 및 `host_permissions`: 필요한 API 접근 권한과 사이트 도메인 지정
- `action` 및 `options_page`: 확장 아이콘 클릭 시 표시되는 팝업 UI와 설정 페이지 관리

### 1.1 브라우저 DOM에 주입된 오버레이 UI와 React의 연결

donuTool의 툴바 UI는 React 컴포넌트를 `content script`로 직접 주입하지 않고, 팝업 페이지 내에서 관리하는 버튼 세팅(배열) 정보를 `content script`에 메시지로 전달합니다.
`content script`는 전달받은 배열 정보를 바탕으로 DOM에 직접 UI 요소를 생성·수정하며, 버튼 인터페이스를 업데이트합니다.
이 방식은 React와 `content script`를 분리하면서도 사용자 설정을 실시간으로 반영할 수 있도록 설계되었습니다.

### 1.2 툴바 UI 생성 로직 (toolBarElement.js)

팝업 페이지에서 전달받은 버튼 세팅(배열) 정보를 기반으로, `content script`가 DOM에 직접 툴바 UI와 버튼들을 생성합니다.

```javascript
// overlay/toolBarElement.js
export async function createToolBarElement() {
  const toolBarElement = document.createElement("div");
  toolBarElement.id = "donuTool-toolBar";

  const buttonsSetting = await new Promise((resolve) => {
    chrome.storage.local.get("buttonsSetting", (data) => {
      resolve((data.buttonsSetting || []).slice(0, 5));
    });
  });

  for (let i = 0; i < buttonsSetting.length; i++) {
    const btn = await createToolBarButton(
      `donuTool-button${i+1}`,
      /* top, left 좌표 */,
      buttonsSetting[i].image,
      buttonsSetting[i].id
    );
    toolBarElement.appendChild(btn);
  }

  return toolBarElement;
}
```

### 1.3 페이지에 툴바 UI 주입 & 메세지 처리 코드

`content script`가 페이지에 툴바 UI를 주입하고, 팝업 페이지에서 전달받은 설정 변경 메시지를 처리합니다.

```javascript
// overlay/injectToolBarUI.js
(async () => {
  const { createToolBarElement } = await import(
    chrome.runtime.getURL("overlay/toolBarElement.js")
  );

  // 초기 툴바 UI 생성 및 주입
  let toolBarUI = await createToolBarElement();
  document.body.appendChild(toolBarUI);

  // 팝업 페이지에서 버튼 세팅 변경 시 content script에 메시지 전송
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "updateToolBar") {
      toolBarUI.remove();
      createToolBarElement().then((newToolBarUI) => {
        toolBarUI = newToolBarUI;
        document.body.appendChild(toolBarUI);
      });
    }
  });
})();
```

### 1.4 Service worker 주요 로직 (background.js)

`background.js`에서는 `content script`나 팝업 페이지에서 전달받은 메시지를 처리하고,<br>
탭 제어, 북마크, 이미지 다운로드, 스크린샷 등 다양한 기능을 수행합니다.

```javascript
// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const handler = messageHandlers[message.action];
  if (handler) {
    handler(message, sender, sendResponse);
    return true; // 비동기 응답 처리
  }
});

// 예: 현재 탭 닫기 기능
function handleCloseTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.remove(tabs[0].id);
    }
  });
}

// 예: 탭 북마크 기능
function handleBookmarkTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    chrome.bookmarks.create({
      title: tab.title,
      url: tab.url,
    });
    chrome.tabs.sendMessage(tab.id, {
      action: "showBookmarkAlert",
      title: tab.title,
    });
  });
}
```

### 1.5 Service worker와 content script 간 메시지 흐름

- `content script`는 사용자 인터랙션(예: 버튼 클릭, 설정 변경)을 감지하면,<br>`chrome.runtime.sendMessage`를 사용해 `service worker`로 전달
- `service worker`는 이 메시지를 받아 `local storage`에 데이터를 저장하거나, 백엔드 API 호출 등 추가 작업 수행
- 작업 결과나 최신 설정 값은 다시 `content script`에 메시지로 반환되어 UI를 실시간으로 업데이트
- React 컴포넌트에서는 이를 `zustand` 등 전역 상태 관리로 받아 사용자 화면에 반영

이 구조를 통해 donuTool은 웹 페이지에 독립적이면서도 React와 Chrome API를 유기적으로 연결하여
사용자 설정 변경, 버튼 인터랙션, 데이터 동기화 등 복잡한 동작을 안정적으로 구현하고 있습니다.

## 2. 플로팅 툴바 비간섭성 확보

웹페이지 내 요소와 툴바 UI가 겹치면서 클릭/드래그 이벤트를 방해할 가능성이 있었습니다.
항상 pointer-events를 none으로 두면 툴바 자체를 클릭할 수 없고, 항상 활성화하면 페이지와 충돌이 발생하는 문제를 확인했습니다.

해결 방법으로 elementFromPoint와 getComputedStyle을 활용하여 커서 하위 요소를 실시간 감지하고,
툴바 hover 시에만 pointer-events: auto로 전환하도록 구현했습니다.

```TypeScript
function updatePointerEvents(toolbar: HTMLElement, x: number, y: number) {
  const elem = document.elementFromPoint(x, y);
  if (!elem || elem.closest('.toolbar')) {
    toolbar.style.pointerEvents = 'auto';
  } else {
    toolbar.style.pointerEvents = 'none';
  }
}

// hover시만 활성화
toolbar.addEventListener('mouseenter', () => toolbar.style.pointerEvents = 'auto');
toolbar.addEventListener('mouseleave', () => toolbar.style.pointerEvents = 'none');
```

이로써 웹페이지 조작 방해를 최소화하면서도, 툴바 사용 시 직관적인 피드백을 제공할 수 있었습니다.

## 3. 커서 추적 및 스크롤 보정

툴바가 마우스 커서를 따라다니도록 구현할 때, 스크롤 이벤트 발생 시 툴바가 튀거나 지연되어 자연스러운 따라오기가 어려웠습니다.
단순히 mousemove 좌표만 반영하면 스크롤 변화가 무시되어 동기화가 불가했습니다.

이를 해결하기 위해 mousemove와 scroll 이벤트를 동시에 감지하고, 스크롤 delta를 반영해 툴바 좌표를 보정했습니다.

```TypeScript
let cursor = { x: 0, y: 0 };

document.addEventListener('mousemove', e => {
  cursor.x = e.clientX;
  cursor.y = e.clientY;
  updateToolbarPosition();
});

document.addEventListener('scroll', () => {
  updateToolbarPosition();
});

function updateToolbarPosition() {
  const toolbar = document.querySelector('.toolbar') as HTMLElement;
  toolbar.style.left = `${cursor.x + window.scrollX}px`;
  toolbar.style.top = `${cursor.y + window.scrollY}px`;
}
```

이로써 스크롤 중에도 툴바와 커서의 일체감을 유지하며, 안정적이고 직관적인 UX를 제공할 수 있었습니다.

## 4. 경량 주입 전략 (MV3 기반)

모든 웹 페이지에 무조건 content script를 주입하면 성능 저하와 호환성 문제가 발생할 수 있습니다.
특히 페이지 로딩 시 불필요한 스크립트가 실행되거나, 다른 확장 프로그램 및 사이트 자체 스크립트와 충돌하는 경우가 있었습니다.

이를 해결하기 위해, 다음과 같은 조건부 주입 전략을 적용했습니다:

- 확장 프로그램 활성화 상태를 체크
- 특정 도메인 화이트리스트에 포함된 사이트에서만 주입
- document.readyState를 활용해 DOM이 완전히 로드된 후 주입

```TypeScript
// 조건부 content script 주입 예시
function injectToolbarConditionally() {
  const whitelist = ['example.com', 'docs.google.com', 'notion.so'];

  if (!chrome.runtime.sendMessage({ action: 'isToolbarActive' })) return;
  if (!whitelist.some(domain => location.hostname.includes(domain))) return;
  if (document.readyState !== 'complete') return;

  injectToolbar(); // 실제 툴바 주입 함수
}

// MV3 service worker에서 탭 변화 감지 시 호출
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.scripting.executeScript({
      target: { tabId },
      function: injectToolbarConditionally,
    });
  }
});
```

이 전략을 통해 donuTool은 불필요한 리소스 낭비를 최소화하면서도, 사용자가 실제로 툴바를 필요로 하는 페이지에서만 안정적으로 동작할 수 있도록 구현되었습니다.
결과적으로 메모리 사용량을 줄이고 사이트 충돌 가능성을 낮추며, 성능을 최적화할 수 있었습니다.

<br>
<br>

# 👌 사용자 경험

## 1. 툴바 사용 경험을 향상시키는 웹 대시보드 개발

![donuTool-user-experience](/public/donuTool-user-experience.gif)

사용자 경험을 단순히 “툴바 UI를 주입해주는 도구” 수준에 머무르게 하지 않기 위해, 확장프로그램을 넘어 웹 대시보드를 추가 개발했습니다.
처음에는 단순히 화면 공간을 아끼고 편리함을 주자는 목적이었지만, 실제 사용 환경에서는 사용자가 자신의 사용 패턴과 데이터를 확인하고 직접 설정을 조정할 수 있을 때 훨씬 높은 만족도를 얻는다는 점을 발견했습니다.

특히 확장프로그램만으로는 구현하기 어려운 다음과 같은 요구를 해결하고자 했습니다:

- 사용자가 어떤 버튼을 얼마나 자주 썼는지, 어떤 시간대에 가장 많이 이용했는지 같은 데이터를 스스로 확인하고 관리하고 싶어함.
- 설정 변경, 테마, 버튼 구성 등을 단순히 ‘툴바 안’에서만 바꾸는 게 아니라, 큰 화면과 더 직관적인 UI에서 편집·시각화하고 싶어함.
- 사용자별 데이터와 설정을 서버에 저장해 여러 기기에서도 동일하게 사용하고 싶어함.

이러한 요구를 바탕으로, React와 Chart.js를 활용해 사용자 통계 시각화, 계정 관리, 설정 페이지, FAQ/도움말 등 여러 기능을 웹 대시보드로 구현했습니다.
그 결과, 단순히 툴바를 띄우는 도구를 넘어, 사용자가 자신의 데이터를 이해하고 스스로 서비스를 맞춤화하는 데이터 기반 UX 플랫폼으로 발전할 수 있었습니다.

또한 백엔드와 연동해 버튼 클릭 로그, 사용 빈도, 변경 이력 등을 실시간으로 수집·분석하여, 앞으로의 기능 개선과 맞춤형 추천 기능 등에도 활용할 수 있는 구조를 설계했습니다.
이렇게 확장성과 사용자 중심 디자인을 동시에 고려하면서, 서비스의 가치를 단순 편의성에서 데이터 기반의 개인화 경험으로 확장한 것이 donuTool만의 차별점이라고 할 수 있습니다.

## 2. 버튼 세팅 드래그 앤 드롭 기능

![donuTool-drag-and-drop](/public/donuTool-drag-and-drop.gif)

툴바 UI에 할당할 수 있는 버튼의 종류가 다양해지고 개수가 많아지면서, 사용자가 각 버튼을 원하는 위치에 직접 배치하거나 설정하는 과정이 점점 복잡해졌습니다.
단순히 버튼 목록에서 하나씩 선택해 배치하는 방식은 직관적이지 못할 뿐더러, 반복적인 작업이 많아져 사용자의 피로도를 높일 수밖에 없었습니다.

이에 따라, 보다 효율적이고 사용자 친화적인 인터페이스를 제공하기 위해, 드래그 앤 드롭(Drag and Drop) 방식의 UI 조작 기능을 도입하기로 결정했습니다.
이 기능은 사용자가 버튼을 직관적으로 끌어다 원하는 위치에 놓음으로써 배치 작업을 보다 쉽고 빠르게 수행할 수 있게 해줍니다.
또한, 칸반(Kanban) 보드나 TODO 리스트에서 흔히 볼 수 있는 드래그 앤 드롭 메커니즘을 활용함으로써, 익숙한 조작감을 제공하여 학습 곡선을 낮추는 효과도 기대할 수 있다고 판단했습니다.

기술적으로는 React 프레임워크와 드래그 앤 드롭 기능 구현에 특화됐으며 처음 적용하기에도 쉬운 라이브러리인 **Dnd-kit**을 활용하였습니다.
이 라이브러리는 가볍고 유연하며, 상태 관리와 DOM 이벤트 처리를 효율적으로 지원하여 복잡한 드래그 앤 드롭 UI를 간결한 코드로 구현할 수 있게 도와줍니다.
특히 `useDraggable`과 `useDroppable` 훅을 이용하여 각 버튼과 드롭 영역의 상호작용을 쉽게 정의하고, 이를 React 상태와 연동해 실시간 UI 변화를 반영할 수 있었습니다.

```tsx
// DraggableButton.tsx
import { useDraggable } from "@dnd-kit/core";

export default function DraggableButton({ button, scale }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: button.id });

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    top: button.status === "IN_TOOLBAR" ? `${(button.top ?? 0) * scale}px` : undefined,
    left: button.status === "IN_TOOLBAR" ? `${(button.left ?? 0) * scale}px` : undefined,
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      <img src={...} alt={button.image} />
    </div>
  );
}
```

- useDraggable 훅은 해당 버튼 요소가 드래그 가능한 상태가 되도록 초기화하며, 드래그 시 발생하는 좌표 이동 정보를 transform에 제공합니다.
- setNodeRef는 드래그 대상 DOM 요소를 Dnd-kit에 등록하는 역할을 하며, 필수로 설정해야 합니다.
- attributes와 listeners는 드래그 동작에 필요한 이벤트 핸들러와 접근성 속성들을 포함하며, 요소에 스프레드 연산자로 적용합니다.
- 스타일의 transform 속성은 드래그 중인 요소를 마우스 움직임에 맞게 이동시키고, top과 left는 초기 위치를 배치합니다. 여기서 scale을 곱해 좌표 조정이 가능합니다.

```tsx
// DroppableArea.tsx
import { useDroppable } from "@dnd-kit/core";

export default function DroppableArea({ id, children, style }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}
```

- useDroppable 훅은 이 컴포넌트가 드래그 가능한 아이템을 놓을 수 있는 대상 영역임을 Dnd-kit에 알려줍니다.
- setNodeRef를 드롭 영역의 DOM에 할당해 Dnd-kit이 해당 요소를 인식하고, 드래그 요소가 드롭될 때 발생하는 이벤트를 처리할 수 있도록 합니다.
- children으로 전달된 드래그 가능한 버튼 컴포넌트들이 이 영역 내에 렌더링됩니다.

이와 같이 DraggableButton과 DroppableArea 컴포넌트를 조합하여, 사용자가 버튼을 자유롭게 끌어다 놓고 위치를 조정할 수 있는 직관적인 UI를 완성했습니다.
이로 인해 복잡한 버튼 배치 작업도 손쉽게 처리할 수 있어 사용자 만족도를 높이고, 개발자 입장에서도 관리와 확장이 편리해졌습니다.

<br>
<br>

# 🗓️ 기간

- 프로젝트 기간: 2025년 6월 23일 ~ 7월 17일
- 1주차
  - 아이디어 수집 및 선정
  - 아이디어 POC
  - 칸반 작성
  - 기술 스택 선정
  - 프로젝트 (확장프로그램, 웹) 환경 설정
- 2주차
  - 확장프로그램 메인페이지 및 설정페이지 UI 구현
  - 브라우저 DOM에 주입할 툴바 UI 구현
  - 툴바 UI 활성화/비활성화 로직 구현
  - 툴바 내 버튼 및 인터랙션 구현
- 3주차
  - 확장프로그램 설정페이지 드래그 앤 드롭 구현
  - 설정페이지와 툴바UI 버튼 연동
  - 각 버튼 별 기능 구현
  - 사용자 설정 브라우저 스토리지 저장
  - 사용자 브라우저 테마 설정 인식 및 동기화
  - 앱 배포
- 4주차
  - 로그인 기능 구현
  - 게스트 모드 구현
  - 로그인 시 DB에 저장되어 있는 사용자 설정 불러오기 기능 구현
  - 사용자 설정 실시간 DB에 저장 기능 구현
  - 사용자 대시보드 웹 페이지 구현
    - 메인 페이지
    - 도움말 페이지
    - 계정 페이지
    - 통계 페이지
    - 설정 페이지
  - README.md 작성

<br>
<br>

# 📝 소감

donuTool을 만들면서 확장프로그램 아키텍처, 웹과 서비스 워커 간의 메시지 흐름, 실시간 UI 업데이트, 그리고 사용자 설정을 서버와 동기화하는 과정을 깊이 있게 다룰 수 있었습니다.
특히, 확장프로그램 내 팝업페이지 내 React와 브라우저에 주입되는 UI의 content script를 분리한 구조를 설계하면서 발생한 데이터 흐름 문제 등을 해결하면서 성장을 경험할 수 있었습니다.
또한 사용성 개선을 위해 도입한 드래그 앤 드롭 UI는 단순한 기능 구현을 넘어서, 사용자 경험을 설계하고 유지보수 가능한 컴포넌트 구조로 발전시키는 과정을 통해 프론트엔드 설계 역량을 한층 강화할 수 있었습니다.
단순한 편의 기능을 넘어 사용자 데이터를 수집·분석·시각화하고, 이를 기반으로 개인화 UX를 설계하며 실제 사용자 데이터 분석과 시각화를 구현해본 것 또한 뜻깊은 경험이었던 것 같습니다.
