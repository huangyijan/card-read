import { NextApiRequest, NextApiResponse } from "next";
import { withDatabase } from '../database';
import { DataSource } from "typeorm/browser";
import { Card } from '@/entity/card'
import { CardDataMap } from "@/utils/constants";
import xlsx from 'node-xlsx';
const columns = Array.from(CardDataMap).map(item => ({ key: item[1], label: item[0] })).filter(item => !item.key.startsWith('en_') && item.key !== 'mobile')

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = (<any>req).db as DataSource
    const dbCard = await db.getRepository(Card).find()

    const list = dbCard.map(item => {
        if (item.en_apartment) item.apartment += ` ${item.en_apartment}`
        if (item.en_compony) item.compony += ` ${item.en_compony}`
        if (item.en_position) item.position += ` ${item.en_position}`
        if (item.en_name) item.name += ` ${item.en_name}`
        if (item.mobile) item.phone += ` ${item.mobile}`
        if(item.url) item.url = 'http://47.106.107.179:3001/' + item.url
        return { ...item }
      }).map(cardItem => {
        let obj = [] as any
        columns.forEach(item => {
            obj.push(cardItem[item.key] || '无')
        })
        return obj
      })
    const data = [columns.map(item => item.label), ...list ]
    const sheetOptions = {'!cols': [{wch: 6}, {wch: 7}, {wch: 10}, {wch: 20}]};

    const buffer = xlsx.build([{ name: '名片识别表格', data } as any], {sheetOptions}); // Returns a buffer
    

    res.status(200).send(Buffer.from(buffer));

}

export default withDatabase(handler)