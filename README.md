# 키득퀴즈(Kquiz)

개인 프로젝트로 개발한 **React + Spring Boot** 기반 블로그 웹 애플리케이션 입니다.
실시간으로 여러 사용자가 함께 참여하여 퀴즈를 풀 수 있도록한 웹 기반 퀴즈 게임 플랫폼 입니다.
"Kahoot"을 벤치마킹 하여 개발 하였습니다.

## 주요 기능 
- **실시간 퀴즈 진행(WebSocket 기반)**
- **퀴즈 생성 및 수정 기능 (이미지 포함)**
- **실시간 참가자 입장 및 퇴장 관리**
- **게임 종료 후 순위 확인**
- **사용자 인증 / 인가 (JWT 기반)** 로그인 / 회원가입 / 권한 관리
- **REST API 설계 및 구현**

## 기술 스택
- **Frontend**: React, React Router, Axios
- **Backend**: Spring Boot, Spring Data JPA, Spring Security, JWT WebSocket, MariaDB, Redis
- **Version Control**: Git, GitHub

## 프로젝트 후기
처음으로 프론트엔드와 백엔드 전반을 혼자서 개발한 프로젝트입니다.
백엔드는 Spring Boot 기반으로 직접 REST API 및 WebSocket 기반 채팅 기능을 설계하고 구현하였고,
CSS는 많이 어려움을 겪어 AI를 활용하여 개발 하였습니다.

## 프로젝트 후기
개인 역량을 키우고 부족했던 부분을 보완하기 위해 졸업작품을 혼자서 다시 프로젝트를 설계하고 개발하게 되었습니다. 혼자서 모든 과정을 책임지며 시행착오도 많았지만, 덕분에 많은 것을 배우고 성장할 수 있었던 것 같습니다.
다만 서술형 문제 구현은 아직 기술과 지식이 부족한 탓에 앞으로 더 개선해 나가야 할 것 같았습니다.

## ERD다이어그램
<img width="1161" height="543" alt="ER 다이어그램" src="https://github.com/user-attachments/assets/ac2fe872-1db4-4844-b0c4-628bdd4929e2" />


## 흐름도
<table>
  <tr>
    <td><img width="448" height="663" alt="퀴즈 생성" src="https://github.com/user-attachments/assets/8c7419fa-5dbd-47d0-ab3d-8bd0cf377674" /></td>
    <td><img width="335" height="585" alt="스크린샷 2025-07-23 13 29 40" src="https://github.com/user-attachments/assets/c4b038e0-1cfb-4676-a365-07e188ed3832" /></td>
  </tr>
  <tr>
    <td align="center">Quiz 생성</td>
    <td align="center">Quiz 수정(아직 반영 안함)</td>
  </tr>

  <tr>
    <td><img width="392" height="629" alt="스크린샷 2025-07-23 13 25 31" src="https://github.com/user-attachments/assets/67dfd1ad-45aa-4f4a-b3d0-50c81f991320" /></td>
    <td><img width="448" height="712" alt="게임 생성" src="https://github.com/user-attachments/assets/74633bfd-fd83-44bf-b8af-fdda7b99bdbe" /></td>
  </tr>
  <tr>
    <td align="center">Quiz 삭제(아직 반영 안함)</td>
    <td align="center">게임 생성</td>
  </tr>

</table>

## 프로젝트 결과물
<img width="1404" height="807" alt="메인화면" src="https://github.com/user-attachments/assets/4bbca513-707c-49dc-adac-1ffd46ecd0b4" />

- **메인화면**
---
  
<img width="1404" height="807" alt="로그인" src="https://github.com/user-attachments/assets/c66a5589-c96d-4a51-a7c4-89f37e2c3f6b" />

- **회원가입 화면**
---

<img width="1404" height="807" alt="로그인" src="https://github.com/user-attachments/assets/90a24e79-355f-4b8b-b9c3-70c92f3467bb" />

- **로그인 화면**
---

<img width="1404" height="807" alt="퀴즈 생성 화면" src="https://github.com/user-attachments/assets/e8f849de-144a-4f84-9b3d-f261c5834d6b" />

- **퀴즈 생성 화면**
---

<img width="1404" height="807" alt="퀴즈 제작 화면" src="https://github.com/user-attachments/assets/b3b78e4f-b32f-4cd1-a79b-80c166396a5b" />

- **퀴즈 제작 화면(AI 힌트 사용)**
---

<img width="1404" height="807" alt="퀴즈 제작 화면2" src="https://github.com/user-attachments/assets/3ca110a4-7614-4c4f-bbb3-e49277e8ea46" />

- **퀴즈 제작 화면**
---

<img width="1404" height="807" alt="퀴즈 생성 후 메인 화면" src="https://github.com/user-attachments/assets/5544d4f4-127c-43f2-96cc-a87535ca1a94" />

- **개인 채팅 화면**
---

<img width="1404" height="807" alt="게임 생성 화면" src="https://github.com/user-attachments/assets/3aba3557-e23c-41bd-b184-7799363c2abf" />

- **게임 생성 화면**
---

<img width="1404" height="807" alt="로비 화면" src="https://github.com/user-attachments/assets/491a9122-2f0a-494b-b128-0ff42ac689cb" />

- **호스트 로비 화면**
---

<img width="1404" height="807" alt="참여자 게임 참여 화면" src="https://github.com/user-attachments/assets/491a9122-2f0a-494b-b128-0ff42ac689cb" />

- **참여자 게임 참여 화면**
---

<img width="1404" height="807" alt="참여자/호스트 로비 화면" src="https://github.com/user-attachments/assets/09ac8ff7-4513-48fa-b98d-8e7362203774" />

- **참여자/호스트 로비 화면**
---



