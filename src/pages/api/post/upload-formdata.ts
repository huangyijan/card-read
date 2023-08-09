import { NextApiRequest, NextApiResponse } from "next";
import client from "@/venders"
import { withDatabase } from '../database';
import { CardDataMap } from '@/utils/constants'
import { DataSource } from "typeorm/browser";
import { Card } from '@/entity/card'
import formidable, { errors as formidableErrors } from 'formidable';
const fs = require('fs');


/** 名片识别 */
function handleQRCard(ImageBase64: string) {
  return new Promise(resolve => {
    client.BusinessCardOCR({ ImageBase64 }).then(
      (data: any) => {
        const obj = data.BusinessCardInfos.reduce((pre, cur, index) => {
          const key = CardDataMap.get(cur.Name)
          if (key) pre[key] = (pre[key] ? `${pre[key]}、` : '') + cur.Value
          return pre
        }, new Card())
        resolve(obj)
      },
      (err: Error) => {
        console.error("error", err);
      }
    );
  })
}

/** 文件保存 */
function handleSaveLocalFile(filepath: string, savePath: string) {
  return new Promise(resolve => {
    fs.writeFile(savePath, fs.readFileSync(filepath), (err) => {
      fs.readFile(filepath, (err, data) => {
        if (err) {
          console.error('读取文件时出错：', err);
        } else {
          // 将读取的数据转换为Base64字符串
          const base64String = data.toString('base64');
          resolve(base64String)
        }
      });
    })
  })
  
}

/** 处理文件识别程序 */
function main(file, db) {
  return new Promise<void>(resolve => {
    const savePath = `public/uploads/${file.newFilename}.${file.mimetype.split('/')[1] || 'png'}`
    handleSaveLocalFile(file.filepath, savePath).then((base64String: string) => {
      handleQRCard(base64String).then((obj: any) => {
        obj.url = savePath
        db.manager.save(obj).then(res => {
          resolve()
        })
      })
    })
  })
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = (<any>req).db as DataSource

  const form = formidable({});
  try {
    const [_fields, files] = await form.parse(req);
    Promise.all(files.files.map(file => main(file, db))).then(() => {
      res.status(200).json({ msg: '保存成功' });
    })
  } catch (err) {
    if (err.code === formidableErrors.maxFieldsExceeded) {
      console.log('属性越界');
    }
    console.error(err);
    return;
  }

}

export const config = {
  api: {
    bodyParser: false
  }
}

export default withDatabase(handler)