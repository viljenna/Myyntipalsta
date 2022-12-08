"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Virhekasittelija_1 = __importDefault(require("./errors/Virhekasittelija"));
const apiAuth_1 = __importDefault(require("./routes/apiAuth"));
const apiTuotteet_1 = __importDefault(require("./routes/apiTuotteet"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const apiOmatTuotteet_1 = __importDefault(require("./routes/apiOmatTuotteet"));
const apiKayttajat_1 = __importDefault(require("./routes/apiKayttajat"));
const apiViestit_1 = __importDefault(require("./routes/apiViestit"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const portti = Number(process.env.PORT);
const checkToken = (req, res, next) => {
    try {
        let token = req.headers.authorization.split(" ")[1];
        res.locals.kayttaja = jsonwebtoken_1.default.verify(token, String(process.env.ACCESS_TOKEN_KEY));
        next();
    }
    catch (e) {
        res.status(401).json({});
    }
};
app.use(express_1.default.static(path_1.default.resolve(__dirname, "public")));
app.use("/api/auth", apiAuth_1.default);
app.use("/api/kayttajat", apiKayttajat_1.default);
app.use("/api/tuotteet", checkToken, apiTuotteet_1.default);
app.use("/api/omatTuotteet", checkToken, apiOmatTuotteet_1.default);
app.use("/api/viestit", checkToken, apiViestit_1.default);
app.use(Virhekasittelija_1.default);
app.use((req, res, next) => {
    if (!res.headersSent) {
        res.status(404).json({ viesti: "virheellinen reitti" });
    }
    next();
});
app.listen(portti, () => {
    console.log(`Palvelin käynnistyi porttiin : ${portti}`);
});
