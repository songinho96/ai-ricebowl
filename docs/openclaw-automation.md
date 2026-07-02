# OpenClaw Daily RSS Automation

이 프로젝트는 OpenClaw cron job으로 매일 오전 9시에 RSS 수집과 로컬 요약 생성을 실행할 수 있다.

## 설치

OpenClaw는 Node.js 22.19 이상이 필요하다.

```bash
source ~/.nvm/nvm.sh
nvm install 22.19.0
nvm use 22.19.0
npm install -g openclaw@latest
```

## Gateway 설정

```bash
source ~/.nvm/nvm.sh
nvm use 22.19.0
openclaw setup --non-interactive --accept-risk --workspace "$(pwd)"
openclaw gateway install
openclaw gateway start
openclaw gateway status
```

## 매일 오전 9시 작업 등록

```bash
bash scripts/register_openclaw_cron.sh
```

등록되는 작업:

- 이름: `ai-ricebowl-daily-rss`
- 스케줄: 매일 09:00, `Asia/Seoul`
- 명령: `bash run_crawler.sh`
- 작업 디렉터리: 프로젝트 루트
- 동작: RSS 수집 후 `crawled_data.js` 갱신
- 알림: 기본 없음. `DISCORD_NOTIFY_TO`를 지정하면 Discord 완료/실패 알림 전송
- Python: 기본값 `/usr/bin/python3`, 필요하면 `PYTHON_BIN` 환경 변수로 변경 가능

Discord 알림을 함께 등록하려면 OpenClaw Discord 채널을 먼저 설정한 뒤 다음처럼 실행한다.

```bash
DISCORD_NOTIFY_TO="channel:<discord-channel-id>" bash scripts/register_openclaw_cron.sh
```

## 수동 실행 및 확인

```bash
openclaw cron list
openclaw cron show ai-ricebowl-daily-rss
openclaw cron run <job-id>
openclaw cron runs --id <job-id>
tail -80 crawler.log
```

## 현재 로컬 설정

현재 로컬에는 다음 OpenClaw cron job이 등록되어 있다.

- job id: `68c1a4e2-6039-4205-8e02-97082672c3d4`
- next run: 매일 오전 9시, `Asia/Seoul`
- delivery: `discord:channel:1522113030924664934`

이 값은 로컬 OpenClaw 상태에 저장되므로 다른 환경에서는 `scripts/register_openclaw_cron.sh`로 다시 등록하면 된다.

## 참고

일부 RSS 서버는 실행 환경의 접근 정책에 따라 403을 반환할 수 있다. 현재 `Woowahan Tech` 피드는 로컬 확인 시 403을 반환하지만, 크롤러는 실패한 피드를 건너뛰고 나머지 피드로 `crawled_data.js`를 계속 갱신한다.
