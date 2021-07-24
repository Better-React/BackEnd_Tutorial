# BackEnd_Tutorial
1. login_api
```bash
/config/dev.ts
export const dev={
    mongoURI: `mongodb+srv://${process.env.DB_URL_ID}:${process.env.DB_URL_PWD}@test.axhqa.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
}
/* @ mongoURI는 mongodb Atlas 생성 후 Id, Password, DB name은 .env 파일에 작성
```
