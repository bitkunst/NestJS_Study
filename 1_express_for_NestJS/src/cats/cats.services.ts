import { Request, Response } from 'express';
import { Cat, CatType } from './cats.model';

//* READ 고양이 전체 데이터 조회 api
export const readAllCat = (req: Request, res: Response) => {
    try {
        // ToDo : DB 조회
        const cats = Cat;

        res.status(200).json({
            success: true,
            data: cats,
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
};

//* READ 특정 고양이 데이터 조회 api
export const readCat = (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Todo : DB 조회
        const cats = Cat.find((v) => {
            return v.id === id;
        });

        res.status(200).json({
            success: true,
            data: cats,
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
};

//* CREATE 새로운 고양이 추가 api
export const createCat = (req: Request, res: Response) => {
    const data = req.body;
    try {
        // Todo: DB 저장
        Cat.push(data);

        res.status(201).json({
            success: true,
            data,
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
};

//* UPDATE 고양이 데이터 업데이트 api -> PUT (덮어쓰기)
export const updateCat = (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    let result;

    try {
        // Todo: DB 조회 후 업데이트
        Cat.forEach((v) => {
            if (v.id === id) {
                v = data;
                result = v;
            }
        });

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
};

//* UPDATE 고양이 데이터 부분적으로 업데이트 api -> PATCH
export const updatePartialCat = (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    let result;

    try {
        // Todo: DB 조회 후 업데이트
        Cat.forEach((v) => {
            if (v.id === id) {
                v = { ...v, ...data }; // 구조분해 할당으로 중복 key 값 교체
                result = v;
            }
        });

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
};

//* DELETE 고양이 데이터 삭제 api -> DELETE
export const deleteCat = (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Todo: DB 조회 후 삭제
        const newCat = Cat.filter((v) => v.id !== id);

        res.status(200).json({
            success: true,
            data: newCat,
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
};
