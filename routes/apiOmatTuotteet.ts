import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Virhe } from '../errors/Virhekasittelija';

const prisma : PrismaClient = new PrismaClient();

const apiOmatTuotteetRouter : express.Router = express.Router();

apiOmatTuotteetRouter.use(express.json());

apiOmatTuotteetRouter.put("/:id", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    let nimi : string = req.body.tuoteNimi;
    let hinta : number = req.body.hinta;
    let kuvaus : string = req.body.kuvaus;

    if (await prisma.tuote.count({
          where : {
               id : Number(req.params.id)
           }
       }))  {
       try {
            if (req.body.tuoteNimi.length > 0 && hinta && req.body.kuvaus.length> 0) {
                
                await prisma.tuote.update({
                    where : {
                        id : Number(req.params.id)
                    },
                    data : {
                        tuoteNimi : nimi,
                        kuvaus : kuvaus,
                        hinta : hinta,
                        muokattu : req.body.muokattu
                    }
                }
                )
            } else if (nimi.length>0 && kuvaus.length > 0 && !hinta) {
                await prisma.tuote.update({
                    where : {
                        id : Number(req.params.id)
                    },
                    data : {
                        tuoteNimi : nimi,
                        kuvaus : kuvaus,
                        muokattu : req.body.muokattu
                    }
                }
                )
            } else if (nimi.length <= 0 && hinta && kuvaus.length> 0) {
                await prisma.tuote.update({
                    where : {
                        id : Number(req.params.id)
                    },
                    data : {
                        kuvaus : kuvaus,
                        hinta : hinta,
                        muokattu : req.body.muokattu
                    }
                }
                )
            } else if (nimi.length >0 && kuvaus.length <= 0 && hinta) {
                await prisma.tuote.update({
                    where : {
                        id : Number(req.params.id)
                    },
                    data : {
                        tuoteNimi : nimi,
                        hinta : hinta,
                        muokattu : req.body.muokattu
                    }
                }
                )
            } else if (nimi.length >0 && kuvaus.length <= 0 && !hinta) {
                await prisma.tuote.update({
                    where : {
                        id : Number(req.params.id)
                    },
                    data : {
                        tuoteNimi : nimi,
                        muokattu : req.body.muokattu
                    }
                }
                )
            } else if (nimi.length <= 0 && kuvaus.length >0 && !hinta) {
                await prisma.tuote.update({
                    where : {
                        id : Number(req.params.id)
                    },
                    data : {
                        kuvaus : kuvaus,
                        muokattu : req.body.muokattu
                    }
                }
                )
            } else if (nimi.length <= 0 && kuvaus.length <= 0 && hinta) {
                await prisma.tuote.update({
                    where : {
                        id : Number(req.params.id)
                    },
                    data : {
                        hinta : hinta,
                        muokattu : req.body.muokattu
                    }
                }
                )
            } else {
                next(new Virhe())
            }

           res.json(await prisma.tuote.findMany({
               where : {
                   myyja : String(res.locals.kayttaja.kayttajatunnus)
               }
           }));

       } catch (e : any) {
           next(new Virhe(400, "Virheellinen pyynnön body"))
       }
   } else {
       next(new Virhe(400, "Virheellinen id"));
   }

});

apiOmatTuotteetRouter.delete("/:id", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    if (await prisma.tuote.count({
          where : {
               id : Number(req.params.id)
           }
       }))  {
       try {

           await prisma.tuote.delete({
               where : {
                   id : Number(req.params.id)
               }
           });

           res.json(await prisma.tuote.findMany({
               where : {
                   myyja : String(res.locals.kayttaja.kayttajatunnus)
               }
           }));

       } catch (e : any) {
           next(new Virhe())
       }
   } else {
       next(new Virhe(400, "Virheellinen id"));
   }

});

apiOmatTuotteetRouter.post("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {
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
            res.json(await prisma.tuote.findMany({
                where : {
                    myyja : String(res.locals.kayttaja.kayttajatunnus)
                }
            }));

        } catch (e: any) {
            next(new Virhe())
        }
    } else {
        next(new Virhe(400, "Virheellinen pyynnön body"));
    }
});

apiOmatTuotteetRouter.get("/:id", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

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

apiOmatTuotteetRouter.get("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

   
    try {
        res.json(await prisma.tuote.findMany({
            where : {
                myyja : String(res.locals.kayttaja.kayttajatunnus)
            }
        }));
    } catch (e : any) {
        next(new Virhe());
    }

});

export default apiOmatTuotteetRouter;