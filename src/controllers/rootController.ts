import { Request, Response } from 'express';
import path from 'path';

const home = (req: Request, res: Response) => {
  
  try {
    const indexFilePath = path.join(__dirname, '..','views','index.html');
    res.sendFile(indexFilePath);
  } catch (error) {
    return res.status(500).json("Internal Server Error");
  }
}

const data = (req: Request, res: Response) => {
  try {
    const dataFilePath = path.join(__dirname, '..','assets','data','data.json');
    res.sendFile(dataFilePath);
  } catch (error) {
    return res.status(500).json("Internal Server Error");
  }
}

const error404 = (req: Request, res: Response) => {
  
  res.status(404);
  if (req.accepts('html')) {
    const dataFilePath = path.join(__dirname, '..','views','404.html');
    res.sendFile(dataFilePath);
  }else if (req.accepts('json')) {
    res.json({ "error": "404 Not Found" });
  } else {
    res.type('txt').send("404 Not Found");
  }
}

export default {
  home,
  data,
  error404,
}