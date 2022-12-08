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
const apiViestitRouter = express_1.default.Router();
apiViestitRouter.use(express_1.default.json());
apiViestitRouter.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.sisalto.length > 0) {
        try {
            yield prisma.viesti.create({
                data: {
                    sisalto: req.body.sisalto,
                    kirjoittaja: String(res.locals.kayttaja.kayttajatunnus),
                    tuoteId: req.body.tuoteId
                }
            });
            res.json(yield prisma.viesti.findMany({
                where: {
                    tuoteId: req.body.tuoteId
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
apiViestitRouter.get("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json(yield prisma.viesti.findMany({
            where: {
                tuoteId: Number(req.params.id)
            }
        }));
    }
    catch (e) {
        next(new Virhekasittelija_1.Virhe());
    }
}));
apiViestitRouter.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json(yield prisma.viesti.findMany());
    }
    catch (e) {
        next(new Virhekasittelija_1.Virhe());
    }
}));
exports.default = apiViestitRouter;
