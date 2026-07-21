# OpenClaw Daily RSS Automation

이 프로젝트는 Codex Automation을 주 실행 경로로 사용하고, 필요하면 OpenClaw cron 또는 macOS `launchd`를 보조 실행 경로로 사용할 수 있다.

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

## Codex Automation

현재 기본 방향은 Codex Automation이 매일 오전 9시에 `$ai-rss-analyst` 스킬을 실행하는 것이다. 이 방식은 RSS 수집뿐 아니라 `daily_trends.js`, `daily_survival_guides.js`, `reports/rss/YYYY-MM-DD-ai-rss-report.md`까지 Codex가 분석해 갱신할 수 있다.

주의: 로컬 Codex Automation은 맥북이 잠자기 상태이면 실행되지 않을 수 있다. 화면 꺼짐은 괜찮을 수 있지만, 시스템 sleep 상태에서는 트리거를 놓칠 수 있다.

## macOS launchd fallback

Codex Automation이 09:00 트리거를 놓치는 경우를 줄이려면 launchd fallback을 설치한다.

```bash
bash scripts/install_launchd_daily_rss.sh
```

이 fallback은 `scripts/run_daily_rss_with_retry.sh`를 매일 09:00에 실행한다.

- `caffeinate`로 실행 중 잠자기를 방지한다.
- RSS 크롤러를 최대 3회 재시도한다.
- `RUN_CODEX_ANALYSIS=1`이면 Codex CLI로 오늘자 분석 파일까지 갱신한다.
- `SYNC_CLOUDFLARE=1`이면 분석 완료 후 `scripts/deploy_cloudflare_dynamic.sh`로 D1 seed와 Pages 배포를 실행해 `https://ai-ricebowl.pages.dev/`를 갱신한다.
- `SEND_DISCORD_DIGEST=1`이면 `scripts/send_discord_digest.sh`로 오늘 리포트의 짧은 digest를 OpenClaw Discord 채널에 전송한다.
- runner가 중간 실패하면 `scripts/send_discord_failure_alert.sh`가 최근 로그와 exit code를 Discord로 보낸다. OpenClaw cron에도 `failureAlert.after=1`이 설정되어 있어 command 자체가 실패해도 Discord 실패 알림을 받는다.
- 로그는 `logs/` 아래에 남긴다.

## OpenClaw cron 등록

```bash
bash scripts/register_openclaw_cron.sh
```

등록되는 작업:

- 이름: `ai-ricebowl-daily-rss`
- 스케줄: 매일 09:00, `Asia/Seoul`
- 명령: `RUN_CODEX_ANALYSIS=1 SYNC_CLOUDFLARE=1 SEND_DISCORD_DIGEST=1 bash scripts/run_daily_rss_with_retry.sh`
- 작업 디렉터리: 프로젝트 루트
- 동작: RSS 수집 후 Codex 분석 파일 갱신, D1 seed 반영, Cloudflare Pages 배포
- 알림: 기본 Discord 채널 `channel:1522113030924664934`로 runner 완료 메시지, digest, 실패 알림 전송. 다른 채널을 쓰려면 `DISCORD_NOTIFY_TO`를 지정
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

## OpenClaw Skills

프로젝트 로컬 `skills/` 디렉터리에 다음 보조 스킬을 설치했다.

- `agents-skill-security-audit`: 커뮤니티 skill 파일의 공급망 위험 점검
- `clawgears-security-audit`: OpenClaw 환경 보안 점검
- `freshrss-reader`: 향후 FreshRSS 기반 RSS 백엔드 전환 후보

자세한 판단 기준은 [openclaw-skill-roadmap.md](openclaw-skill-roadmap.md)를 참고한다.

## 현재 로컬 설정

이전 로컬에는 다음 OpenClaw cron job이 등록되어 있었다. 현재는 Codex Automation 중심 운영으로 전환했으므로, 중복 실행을 피하기 위해 OpenClaw cron을 켜기 전 `openclaw cron list`로 상태를 먼저 확인한다.

- job id: `68c1a4e2-6039-4205-8e02-97082672c3d4`
- next run: 매일 오전 9시, `Asia/Seoul`
- delivery: `discord:channel:1522113030924664934`

이 값은 로컬 OpenClaw 상태에 저장되므로 다른 환경에서는 `scripts/register_openclaw_cron.sh`로 다시 등록하면 된다.

## 참고

일부 RSS 서버는 실행 환경의 접근 정책에 따라 403을 반환할 수 있다. 현재 `Woowahan Tech` 피드는 로컬 확인 시 403을 반환하지만, 크롤러는 실패한 피드를 건너뛰고 나머지 피드로 `crawled_data.js`를 계속 갱신한다.
