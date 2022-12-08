import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Virhe } from '../errors/Virhekasittelija';

const prisma : PrismaClient = new PrismaClient();

const apiTuotteetRouter : express.Router = express.Router();

apiTuotteetRouter.use(express.json());


apiTuotteetRouter.post("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    if (req.body.tuoteNimi.length > 0) {
        try {
            await prisma.tuote.create({
                data : {
                    tuoteNimi : req.body.tuoteNimi,
                    kuvaus : req.body.kuvaus,
                    myyja : String(res.locals.kayttaja.kayttajatunnus),
                    hinta : req.body.hinta
                }
            });
            res.json(await prisma.tuote.findMany());

        } catch (e: any) {
            next(new Virhe())
        }
    } else {
        next(new Virhe(400, "Virheellinen pyynnön body"));
    }
});

apiTuotteetRouter.get("/:id", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try {
        if (await prisma.tuote.count({
            where : {
                id : Number(req.params.id)
            }
        }) === 1) {
            res.json(await prisma.tuote.findUnique({
                where : {
                    id : Number(req.params.id)
                }
            }))
        } else {
            next(new Virhe(400, "Virheellinen id"));
        }
    } catch (e : any) {
        next(new Virhe());
    }

});

apiTuotteetRouter.get("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

   
    try {
        res.json(await prisma.tuote.findMany());
    } catch (e : any) {
        next(new Virhe());
    }

});

export default apiTuotteetRouter;