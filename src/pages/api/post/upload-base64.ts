import { NextApiRequest, NextApiResponse } from "next";
import client from "@/venders"
import { withDatabase } from '../database';
import { CardDataMap } from '@/utils/constants'
import { DataSource } from "typeorm/browser";
import {Card} from '@/entity/card'

function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = (<any>req).db as DataSource

    client.BusinessCardOCR({ ImageBase64: req.body }).then(
        (data: any) => {
            const obj = data.BusinessCardInfos.reduce((pre, cur, index) => {
                const key = CardDataMap.get(cur.Name)
                if (key) pre[key] = (pre[key] ? `${pre[key]}、` : '') + cur.Value
                return pre
            }, new Card())
            console.log(obj);
            
            db.manager.save(obj).then(res => {
                console.log('保存成功');
            })
            res.status(200).json({msg: '保存成功'});

        },
        (err: Error) => {
            console.error("error", err);
        }
    );


}

export default withDatabase(handler)