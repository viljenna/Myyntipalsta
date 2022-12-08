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
const crypto_1 = __importDefault(require("crypto"));
const prisma = new client_1.PrismaClient();
const apiKayttajatRouter = express_1.default.Router();
apiKayttajatRouter.use(express_1.default.json());
apiKayttajatRouter.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.kayttajatunnus.length > 4) {
        if (req.body.salasana.length > 4) {
            if (yield prisma.kayttaja.count({
                where: {
                    kayttajatunnus: req.body.kayttajatunnus
                }
            })) {
                next(new Virhekasittelija_1.Virhe(401, "Käyttäjätunnus käytössä"));
            }
            else {
                try {
                    let hash = crypto_1.default.createHash("SHA256").update(req.body.salasana).digest("hex");
                    yield prisma.kayttaja.create({
                        data: {
                            kayttajatunnus: req.body.kayttajatunnus,
                            salasana: hash
                        }
                    });
                    res.json();
                }
                catch (e) {
                    next(new Virhekasittelija_1.Virhe());
                }
            }
        }
        else {
            next(new Virhekasittelija_1.Virhe(400, "Virheellinen pyynnön body"));
        }
    }
    else {
        next(new Virhekasittelija_1.Virhe(400, "Virheellinen pyynnön body"));
    }
}));
exports.default = apiKayttajatRouter;
