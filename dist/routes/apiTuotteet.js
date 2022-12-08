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
const apiTuotteetRouter = express_1.default.Router();
apiTuotteetRouter.use(express_1.default.json());
apiTuotteetRouter.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
            res.json(yield prisma.tuote.findMany());
        }
        catch (e) {
            next(new Virhekasittelija_1.Virhe());
        }
    }
    else {
        next(new Virhekasittelija_1.Virhe(400, "Virheellinen pyynnön body"));
    }
}));
apiTuotteetRouter.get("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
apiTuotteetRouter.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json(yield prisma.tuote.findMany());
    }
    catch (e) {
        next(new Virhekasittelija_1.Virhe());
    }
}));
exports.default = apiTuotteetRouter;
