import express from 'express';
import virhekasittelija from './errors/Virhekasittelija';
import apiAuthRouter from './routes/apiAuth';
import apiTuotteetRouter from './routes/apiTuotteet';
import jwt from 'jsonwebtoken';
import apiOmatTuotteetRouter from './routes/apiOmatTuotteet';
import apiKayttajatRouter from './routes/apiKayttajat';
import apiViestitRouter from './routes/apiViestit';
import dotenv from "dotenv";
import path from 'path';

dotenv.config();

const app : express.Application = express();
const portti : number = Number(process.env.PORT);

const checkToken = (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try {
        let token : string = req.headers.authorization!.split(" ")[1];
        res.locals.kayttaja = jwt.verify(token, String(process.env.ACCESS_TOKEN_KEY));
        next();

    } catch (e: any) {
        res.status(401).json({});
    }
}
app.use(express.static(path.resolve(__dirname, "public")));
app.use("/api/auth", apiAuthRouter);
app.use("/api/kayttajat", apiKayttajatRouter);
app.use("/api/tuotteet", checkToken, apiTuotteetRouter);
app.use("/api/omatTuotteet", checkToken, apiOmatTuotteetRouter);
app.use("/api/viestit", checkToken,  apiViestitRouter);
app.use(virhekasittelija);

app.use((req : express.Request, res : express.Response, next : express.NextFunction) => {
    if (!res.headersSent) {
        res.status(404).json({ viesti : "virheellinen reitti"});
    }
    next();
})

app.listen(portti, () => {
    console.log(`Palvelin käynnistyi porttiin : ${portti}`);
})