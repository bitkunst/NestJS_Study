import { Router } from 'express';
import { createCat, deleteCat, readAllCat, readCat, updateCat, updatePartialCat } from './cats.services';
const catsRouter = Router();

//* READ 고양이 전체 데이터 조회 api
catsRouter.get('/cats', readAllCat);

//* READ 특정 고양이 데이터 조회 api
catsRouter.get('/cats/:id', readCat);

//* CREATE 새로운 고양이 추가 api
catsRouter.post('/cats', createCat);

//* UPDATE 고양이 데이터 업데이트 api -> PUT (덮어쓰기)
catsRouter.put('/cats/:id', updateCat);

//* UPDATE 고양이 데이터 부분적으로 업데이트 api -> PATCH
catsRouter.patch('/cats/:id', updatePartialCat);

//* DELETE 고양이 데이터 삭제 api -> DELETE
catsRouter.delete('/cats/:id', deleteCat);

export default catsRouter;
