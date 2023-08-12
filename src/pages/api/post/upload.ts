import { NextApiRequest, NextApiResponse } from "next";
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(222);
        
        cb(null, 'public/uploads/') // 文件将保存在 uploads/ 目录下
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext) // 使用时间戳作为文件名，确保唯一性
    }
});

const upload = multer({ storage: storage });

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    upload.single('file')(req, res, function(err: any) {
        if (err) {
          return res.status(400).json({ message: '文件上传失败', err: String(err) });
        }
    
        const { filename } = (<any>req).file;
        // 在这里可以进行一些其他的操作，例如将文件信息存储到数据库等
    
        return res.json({ message: '文件上传成功', filename });
      });

}

export const config = {
    api: {
      bodyParser: false,
    },
  }