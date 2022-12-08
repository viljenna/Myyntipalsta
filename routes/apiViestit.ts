import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Virhe } from '../errors/Virhekasittelija';

const prisma : PrismaClient = new PrismaClient();

const apiViestitRouter : express.Router = express.Router();

apiViestitRouter.use(express.json());

apiViestitRouter.post("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    if (req.body.sisalto.length > 0) {
        try {
            await prisma.viesti.create({
                data : {
                    sisalto : req.body.sisalto,
                    kirjoittaja : String(res.locals.kayttaja.kayttajatunnus),
                    tuoteId : req.body.tuoteId
                }
            });
            res.json(await prisma.viesti.findMany({
                where : {
                    tuoteId : req.body.tuoteId
                }
            }))

        } catch (e: any) {
            next(new Virhe())
        }
    } else {
        next(new Virhe(400, "Virheellinen pyynnön body"));
    }
});

apiViestitRouter.get("/:id", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try {
        
            res.json(await prisma.viesti.findMany({
                where : {
                    tuoteId : Number(req.params.id)
                }
            }))
        
    } catch (e : any) {
        next(new Virhe());
    }

});

apiViestitRouter.get("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

   
    try {
        res.json(await prisma.viesti.findMany(
            
        ));
    } catch (e : any) {
        next(new Virhe());
    }

});

export default apiViestitRouter;