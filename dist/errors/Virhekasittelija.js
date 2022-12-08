"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Virhe = void 0;
class Virhe extends Error {
    constructor(status, viesti) {
        super();
        this.status = status || 500;
        this.viesti = viesti || "Palvelimella tapahtui odottamaton virhe.";
    }
}
exports.Virhe = Virhe;
const virhekasittelija = (err, req, res, next) => {
    res.status(err.status).json({ virhe: err.viesti });
    next();
};
exports.default = virhekasittelija;
