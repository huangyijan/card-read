import { NextApiRequest, NextApiResponse } from "next";
import { withDatabase } from '../database';
import { DataSource } from "typeorm/browser";
import { Card } from '@/entity/card'

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = (<any>req).db as DataSource
    const list = await db.getRepository(Card).find()
    res.status(200).json({ msg: '保存成功', list });

}

export default withDatabase(handler)