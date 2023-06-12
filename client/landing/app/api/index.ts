import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';

interface MyCorsOptions {
  origin: string;
  credentials: boolean;
  optionSuccessStatus?: number;
}

const corsOptions: MyCorsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200,
};

const cors = Cors(corsOptions);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>((resolve, reject) => {
    cors(req, res, (err) => {
      if (err) {
        return reject(err);
      }

      // Your API route logic here
      // Handle incoming requests and send responses

      // Example response
      res.status(200).json({ message: 'Hello from the API route' });

      return resolve();
    });
  });
}
