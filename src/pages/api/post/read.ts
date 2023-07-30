import { NextApiRequest, NextApiResponse } from "next";
import client from "@/venders"

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//     console.log(req.body);
//     const imageUrl = JSON.parse(req.body).imageUrl
//     if (!imageUrl) return res.status(400).json({ msg: '缺少图片地址' })

//     const params = { ImageUrl: imageUrl };
//     client.BusinessCardOCR(params).then(
//         (data: any) => {
//             console.log(data);
//         },
//         (err: Error) => {
//             console.error("error", err);
//         }
//     );

//     res.status(200).json({ foo: 'bar' });
// }


export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const imageUrl = JSON.parse(req.body).imageUrl
    if (!imageUrl) return res.status(400).json({ msg: '缺少图片地址' })

    const params = { ImageUrl: imageUrl };
    client.BusinessCardOCR(params).then(
        (data: any) => {
            console.log(data);
        },
        (err: Error) => {
            console.error("error", err);
        }
    );

    res.status(200).json({ foo: 'bar' });
}