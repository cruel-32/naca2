# naca2

### nac-admin의 고도화(?) 프로젝트입니다.
### https://nac-admin2.firebaseapp.com 에서 실제 운영중입니다. (미완성)

# v1 -> v2 변경점
- 로그인하지 않아도 모든 정보 열람 가능
- 디자인 UI 개선
- 명칭 변경 : 벙->이벤트, 신입회원(미참여)->준회원
- 통계를 단순 텍스트에서 그래프로 변경 및 통계정보 추가
- 같은 날짜에 여러 이벤트등록 가능
- 나오지 않은 기간 계산


기존 프로젝트는 <br/>
- vue
- typescript
- firebase <br/>
를 맛보기 식으로 마구잡이로 개발했다고 치면 이번 프로젝트는 <br/>

- vue + vuex
- typescript + 추상화 + 어노테이션 활용
- firebase + 기본기능 활용 및 mongodb와의 차이 체감 <br/>
에 중점을 두고 더욱 코드를 간결하고 견고하게 짜는데 집중했습니다. (+ ui/ux 개선은 덤)

### 아쉬웠던것
- firebase realtime database가 색인에 있어서 아쉬운 성능을 가졌기에 firestore를 사용했어야 했다.
- 하지만 DB의 데이터를 옮기기에는 힘들어서 포기.
- typescript를 사용하다 외부 모듈(moment,Apexchart등등)을 끌어 쓸일이 있었는데 타입을 일일이 선언해주기 귀찮아지는 경우가 발생.
- 덕분에 any의 사용빈도가 외부 모듈 사용과 비례해서 올라갔다. 또한 (외부 모듈 <-> 다른 모듈) 간에 타입을 맞춰주느라 소스가 지저분해짐.
- 예를 들어 vuetify의 datepicker가 Date타입을 리턴해 줬으면 깔끔해질 일이 문자열('YYYY-MM-DD')을 리턴해줌.
- 문자열을 가지고 Date를 생성하고 다시 포맷을 바꾼 값을 사용해야 하는 경우가 발생.
- firebase realtime database는 데이터가 number값이어야 정확한 색인이 가능. 또 사용자는 YYYY.DD.MM 형식이 보기 이쁘니...
- 비즈니스로직에서 Date 데이터 하나가지고 문자열로 바꿨다 인트로 바꿨다 아주 난리 -_-...
- vuex에서 데이터 관리 비중이 높다보니 어플리케이션 덩치가 커질때 메모리관리가 걱정됨.
- 다른 컴포넌트로 이동시 기존 store의 데이터를 비워주는 처리에 대해 조금더 고민이 필요함.
- 기존의 데이터를 재활용하는 방식으로 리팩토링하면 성능상 이점이 있을것 같으나 지금 방식을 바꾸기에는 비용이 많이 든다 판단하여 그만둠 (+귀차니즘)
