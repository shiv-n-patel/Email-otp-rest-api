//library
import { v4 as uuid } from 'uuid';
import path from 'path';
import fs, {promises as fsPromises} from 'fs';
import { Request, Response, NextFunction } from 'express';
import { format } from 'date-fns';

const logEvents = async (msg : string, filename : string) => {
    const dateTime = `${format(new Date(), 'dd-MM-yyyy\tHH:mm:ss')}`
    const logItem = `${dateTime}\t${uuid()}\t${msg}\n`

    try {
        const directory = path.join(__dirname, '..', '..', 'logs');
        if (!fs.existsSync(directory)){
            await fsPromises.mkdir(directory);
        }

        fsPromises.appendFile(path.join(directory, filename), logItem);

    } catch (error) {
        console.log("logEvents-",error);
        
    }

}

const logger = (req : Request, res : Response, next : NextFunction) : void =>{
    console.log("logger-",`${req.method}\t${req.url}`);
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`,'reqLog.txt');
    next();
    
}

export default {logEvents, logger};