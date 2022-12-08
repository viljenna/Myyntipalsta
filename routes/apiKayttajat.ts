import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Virhe } from '../errors/Virhekasittelija';
import crypto from 'crypto';

const prisma : PrismaClient = new PrismaClient();

const apiKayttajatRouter : express.Router = express.Router();

apiKayttajatRouter.use(express.json());


apiKayttajatRouter.post("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    if (req.body.kayttajatunnus.length > 4) {
        if (req.body.salasana.length > 4) {
            if (await prisma.kayttaja.count({
                where : {
                    kayttajatunnus : req.body.kayttajatunnus
                }
            })) {
                next(new Virhe(401, "Käyttäjätunnus käytössä"))
            } else {
                try {
                    let hash = crypto.createHash("SHA256").update(req.body.salasana).digest("hex");
    
                    await prisma.kayttaja.create({
                        data : {
                            kayttajatunnus : req.body.kayttajatunnus,
                            salasana : hash
                        }
                    });
                    res.json()
                }catch (e: any) {
                    next(new Virhe())
                } 
            }
            
        } else {
            next(new Virhe(400, "Virheellinen pyynnön body"))
        }
    } else {
        next(new Virhe(400, "Virheellinen pyynnön body"));
    }
});


export default apiKayttajatRouter;