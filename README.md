# naca2

### nac-admin의 고도화(?) 프로젝트입니다.
### https://nac-admin2.firebaseapp.com 에서 실제 운영중입니다. (미완성)

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
- 덕분에 any의 사용빈도가 외부 모듈 사용과 비례해서 올라갔고, 소스 또한 타입을 맞춰주느라 지저분해짐.
- 예를 들어 vuetify의 datepicker가 Date타입을 리턴해 줬으면 좋겠는데 문자열('YYYY-MM-DD')을 리턴해줌.
- 하지만 firebase realtime database는 데이터가 number값이어야 정확한 색인이 가능.
- 또 사용자는 YYYY.DD.MM 형식이 보기 이쁘니.... 내부 코드에서 데이터가지고 문자열로 바꿨다 인트로 바꿨다 아주 난리 -_-...
- vuex에서 데이터 관리 비중이 높다보니 어플리케이션 덩치가 커질때 메모리관리가 걱정됨.
