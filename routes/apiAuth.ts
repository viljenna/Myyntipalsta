import express, { NextFunction } from 'express';
import { Virhe } from '../errors/Virhekasittelija';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const apiAuthRouter : express.Router = express.Router();

const prisma : PrismaClient = new PrismaClient();

apiAuthRouter.use(express.json());

apiAuthRouter.post("/login", async (req : express.Request, res : express.Response, next : NextFunction) : Promise<void> => {
    try {

        const kayttaja = await prisma.kayttaja.findFirst({
            where : {
                kayttajatunnus : req.body.kayttajatunnus
            }
        });

        if(req.body.kayttajatunnus === kayttaja?.kayttajatunnus) {
            let hash = crypto.createHash("SHA256").update(req.body.salasana).digest("hex");

            if (hash === kayttaja?.salasana) {
                let token = jwt.sign({ id : kayttaja.id, kayttajatunnus : kayttaja.kayttajatunnus}, String(process.env.ACCESS_TOKEN_KEY));
                res.json({ token : token })

            } else {
                next(new Virhe(401, "Virheellinen käyttäjätunnus tai salasana"));
            }
        } else {
            next(new Virhe(401, "Virheellinen käyttäjätunnus tai salasana"));
        }
    } catch {
        next(new Virhe());
    }
})

export default apiAuthRouter;
