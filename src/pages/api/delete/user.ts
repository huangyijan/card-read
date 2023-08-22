import { NextApiRequest, NextApiResponse } from "next";
import { AppDataSource, withDatabase } from '../database';
import { DataSource } from "typeorm/browser";
import { Card } from '@/entity/card'

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = (<any>req).db as DataSource
    console.log(req.query);
    if (req.query.id) {
        await db.createQueryBuilder().delete().from(Card).where("id= :id", { id: req.query.id }).execute()
    }

    const list = await db.getRepository(Card).find()
    res.status(200).json({ msg: '保存成功', list });

}

export default withDatabase(handler)