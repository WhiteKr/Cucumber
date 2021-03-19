# Cucumber Bot on Discord

TypeScript로 개발된 Discord 전용 챗봇입니다.
TypeScript를 한번 사용해보고 싶어서 디스코드 봇에서 JavaScript 대신 사용해봤습니다.

기본적으로 친구들과의 그룹 채팅방에서 사용하기 위해 개발한 봇이라 완성된 기능은 얼마 없습니다.


## 작동 방식

봇 구동 시 `src/index.ts` 파일이 우선으로 실행됩니다.

해당 파일이 `src/commands/` 안쪽의 파일을 자동으로 읽어와 명령어를 실시간으로 동기화합니다.

이 방법으로 `src/commands/` 안쪽에 새 기능을 수정, 추가, 제거하더라도 봇을 재구동 할 필요가 없습니다.
