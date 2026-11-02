# 하루안부 사용 장면 영상

- 결과물: `out/haruanbu_demo.mp4` (1920x1080, 30fps, 122초, 무음)
- 원본: `index.html` 한 파일에 9개 장면과 자막이 모두 들어 있다. `seek(초)` 함수가 해당 시각의 화면을 그린다.
- 폰트: Noto Sans KR (SIL Open Font License), `fonts/` 폴더

## 자막·장면 수정 후 다시 만들기

브라우저에서 특정 시각 미리보기: `index.html?t=45` 처럼 열면 45초 화면이 보인다.

정지 화면 확인:
```
node render.js stills <출력폴더> 10,45,90
```

전체 영상 렌더링 (4개 구간 동시 렌더 후 합치기, 약 2분):
```
N=3660; for i in 0 1 2 3; do node render.js range $((i*N/4)) $(((i+1)*N/4)) seg$i.mp4 & done; wait
printf "file '%s'\n" seg0.mp4 seg1.mp4 seg2.mp4 seg3.mp4 > list.txt
ffmpeg -f concat -safe 0 -i list.txt -c copy -movflags +faststart out/haruanbu_demo.mp4
```
필요 도구: Node.js, Playwright(Chromium), ffmpeg

## 장면 구성
| 시간 | 장면 |
|---|---|
| 0:00 | 오프닝 로고 |
| 0:07 | 서울의 딸, 전주에 혼자 사시는 어머니 |
| 0:19 | 화장실 문틀에 센서 부착, 와이파이 연결, 테스트, 가족 코드 |
| 0:38 | 평범한 하루: 문이 열릴 때마다 딸 폰에 초록 신호 |
| 1:01 | 한 달 기록 |
| 1:10 | 외출 모드 |
| 1:19 | 경보: 8시간 무신호, 어머니 폰, 딸 폰, 옆집 이모 폰, 119 |
| 1:47 | 회복 |
| 1:54 | 엔딩 |
