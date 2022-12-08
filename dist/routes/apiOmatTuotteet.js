"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const Virhekasittelija_1 = require("../errors/Virhekasittelija");
const prisma = new client_1.PrismaClient();
const apiOmatTuotteetRouter = express_1.default.Router();
apiOmatTuotteetRouter.use(express_1.default.json());
apiOmatTuotteetRouter.put("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let nimi = req.body.tuoteNimi;
    let hinta = req.body.hinta;
    let kuvaus = req.body.kuvaus;
    if (yield prisma.tuote.count({
        where: {
            id: Number(req.params.id)
        }
    })) {
        try {
            if (req.body.tuoteNimi.length > 0 && hinta && req.body.kuvaus.length > 0) {
                yield prisma.tuote.update({
                    where: {
                        id: Number(req.params.id)
                    },
                    data: {
                        tuoteNimi: nimi,
                        kuvaus: kuvaus,
                        hinta: hinta,
                        muokattu: req.body.muokattu
                    }
                });
            }
            else if (nimi.length > 0 && kuvaus.length > 0 && !hinta) {
                yield prisma.tuote.update({
                    where: {
                        id: Number(req.params.id)
                    },
                    data: {
                        tuoteNimi: nimi,
                        kuvaus: kuvaus,
                        muokattu: req.body.muokattu
                    }
                });
            }
            else if (nimi.length <= 0 && hinta && kuvaus.length > 0) {
                yield prisma.tuote.update({
                    where: {
                        id: Number(req.params.id)
                    },
                    data: {
                        kuvaus: kuvaus,
                        hinta: hinta,
                        muokattu: req.body.muokattu
                    }
                });
            }
            else if (nimi.length > 0 && kuvaus.length <= 0 && hinta) {
                yield prisma.tuote.update({
                    where: {
                        id: Number(req.params.id)
                    },
                    data: {
                        tuoteNimi: nimi,
                        hinta: hinta,
                        muokattu: req.body.muokattu
                    }
                });
            }
            else if (nimi.length > 0 && kuvaus.length <= 0 && !hinta) {
                yield prisma.tuote.update({
                    where: {
                        id: Number(req.params.id)
                    },
                    data: {
                        tuoteNimi: nimi,
                        muokattu: req.body.muokattu
                    }
                });
            }
            else if (nimi.length <= 0 && kuvaus.length > 0 && !hinta) {
                yield prisma.tuote.update({
                    where: {
                        id: Number(req.params.id)
                    },
                    data: {
                        kuvaus: kuvaus,
                        muokattu: req.body.muokattu
                    }
                });
            }
            else if (nimi.length <= 0 && kuvaus.length <= 0 && hinta) {
                yield prisma.tuote.update({
                    where: {
                        id: Number(req.params.id)
                    },
                    data: {
                        hinta: hinta,
                        muokattu: req.body.muokattu
                    }
                });
            }
            else {
                next(new Virhekasittelija_1.Virhe());
            }
            res.json(yield prisma.tuote.findMany({
                where: {
                    myyja: String(res.locals.kayttaja.kayttajatunnus)
                }
            }));
        }
        catch (e) {
            next(new Virhekasittelija_1.Virhe(400, "Virheellinen pyynnön body"));
        }
    }
    else {
        next(new Virhekasittelija_1.Virhe(400, "Virheellinen id"));
    }
}));
apiOmatTuotteetRouter.delete("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield prisma.tuote.count({
        where: {
            id: Number(req.params.id)
        }
    })) {
        try {
            yield prisma.tuote.delete({
                where: {
                    id: Number(req.params.id)
                }
            });
            res.json(yield prisma.tuote.findMany({
                where: {
                    myyja: String(res.locals.kayttaja.kayttajatunnus)
                }
            }));
        }
        catch (e) {
            next(new Virhekasittelija_1.Virhe());
        }
    }
    else {
        next(new Virhekasittelija_1.Virhe(400, "Virheellinen id"));
    }
}));
apiOmatTuotteetRouter.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.tuoteNimi.length > 0) {
        try {
            yield prisma.tuote.create({
                data: {
                    tuoteNimi: req.body.tuoteNimi,
                    kuvaus: req.body.kuvaus,
                    myyja: String(res.locals.kayttaja.kayttajatunnus),
                    hinta: req.body.hinta
                }
            });
            res.json(yield prisma.tuote.findMany({
                where: {
                    myyja: String(res.locals.kayttaja.kayttajatunnus)
                }
            }));
        }
        catch (e) {
            next(new Virhekasittelija_1.Virhe());
        }
    }
    else {
        next(new Virhekasittelija_1.Virhe(400, "Virheellinen pyynnön body"));
    }
}));
apiOmatTuotteetRouter.get("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if ((yield prisma.tuote.count({
            where: {
                id: Number(req.params.id)
            }
        })) === 1) {
            res.json(yield prisma.tuote.findUnique({
                where: {
                    id: Number(req.params.id)
                }
            }));
        }
        else {
            next(new Virhekasittelija_1.Virhe(400, "Virheellinen id"));
        }
    }
    catch (e) {
        next(new Virhekasittelija_1.Virhe());
    }
}));
apiOmatTuotteetRouter.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json(yield prisma.tuote.findMany({
            where: {
                myyja: String(res.locals.kayttaja.kayttajatunnus)
            }
        }));
    }
    catch (e) {
        next(new Virhekasittelija_1.Virhe());
    }
}));
exports.default = apiOmatTuotteetRouter;
