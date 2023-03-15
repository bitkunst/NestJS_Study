import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

// 폴더 생성 함수
const createFolder = (folder: string) => {
    try {
        console.log('💾 Create a root uploads folder...');
        fs.mkdirSync(path.join(__dirname, '..', `uploads`)); // 폴더 생성 , __dirname : 현재 폴더
    } catch (error) {
        console.log('The folder already exists...');
    }
    try {
        console.log(`💾 Create a ${folder} uploads folder...`);
        fs.mkdirSync(path.join(__dirname, '..', `uploads/${folder}`));
    } catch (error) {
        console.log(`The ${folder} folder already exists...`);
    }
};

const storage = (folder: string): multer.StorageEngine => {
    createFolder(folder);
    return multer.diskStorage({
        destination(req, file, cb) {
            //* 어디에 저장할 지
            const folderName = path.join(__dirname, '..', `uploads/${folder}`);
            cb(null, folderName); // cb()의 두번째 인자값은 destination
        },
        filename(req, file, cb) {
            //* 어떤 이름으로 올릴 지
            const ext = path.extname(file.originalname); // 파일 확장자 추출
            const fileName = `${path.basename(file.originalname, ext)}${Date.now()}${ext}`;
            cb(null, fileName);
        },
    });
};

// 폴더명을 인자값으로 받아서 폴더별로 업로드 파일 관리
export const multerOptions = (folder: string) => {
    const result: MulterOptions = {
        storage: storage(folder),
    };
    return result;
};
