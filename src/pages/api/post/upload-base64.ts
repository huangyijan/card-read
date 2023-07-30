import { NextApiRequest, NextApiResponse } from "next";
import client from "@/venders"


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  client.BusinessCardOCR({ImageBase64: req.body}).then(
      (data: any) => {
          console.log(data);
          res.status(200).json(data);

      },
      (err: Error) => {
          console.error("error", err);
      }
  );


}
