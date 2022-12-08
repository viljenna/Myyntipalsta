import React, { useRef, useState, useEffect } from "react";
import { Alert, Dialog, DialogContent, Button, Stack, Typography, Backdrop, CircularProgress, Box, TextField, Divider } from "@mui/material";
import { format, parseJSON } from "date-fns";
import { NavigateFunction, useNavigate } from "react-router-dom";

interface Tuote {
    id : number
    tuoteNimi : string
    kuvaus : string
    myyja : string
    aikaleima : Date
    hinta : number
    muokattu : Date
}

interface Viesti {
    id? : number
    sisalto? : string
    kirjoittaja? : string
    aikaleima : Date
    tuoteId? : number
}

interface fetchAsetukset {
    method : string
    headers? : any
    body? : string
}

interface ApiData {
    tuote : Tuote
    virhe : string
    haettu : boolean
}

interface ViestiData {
    viestit : Viesti[]
    virhe : string
    haettu : boolean
}
        
interface Props {
    token : string
}

const Tuotetiedot : React.FC<Props> = (props : Props) : React.ReactElement => {
    
    const lomakeRef = useRef<HTMLFormElement>();
    const navigate : NavigateFunction = useNavigate();
    const [viestiData, setViestiData] = useState<ViestiData>({
                                                                viestit : [],
                                                                virhe : "",
                                                                haettu : false
    })

    const [tiedot, setTiedot] = useState<ApiData>({
                                                tuote : {id : Number(localStorage.getItem("id")),
                                                        tuoteNimi : "",
                                                        kuvaus : "",
                                                        myyja : "",
                                                        hinta : 0,
                                                        aikaleima : new Date(),
                                                        muokattu : new Date()
                                                        },
                                                virhe : "",
                                                haettu : false
});

    const lisaaViesti = (e : React.FormEvent) => {
        e.preventDefault();

        viestiTiedot("POST", {
            sisalto : lomakeRef.current?.viesti.value,
            tuoteId : Number(localStorage.getItem("id")),
            aikaleima : new Date()
        })
    }
    
    const viestiTiedot = async (metodi? : string, viesti? : Viesti) : Promise<void> => {
        setViestiData({
                ...viestiData,
                haettu : false
        })

        let url : string = (viesti) ? `/api/viestit` : `/api/viestit/${localStorage.getItem("id")}`;

        
        let asetukset : fetchAsetukset = {
            method : metodi || "GET",
            headers : {
                'Authorization' : `Bearer ${String(localStorage.getItem("token"))}`
            }
        }
        if (metodi === "POST") {
            asetukset = {
                ...asetukset,
                method : "POST",
                headers : {
                    ...asetukset.headers,
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(viesti)}
        }
        try {
            const yhteys = await fetch(url, asetukset);
            if (yhteys.ok) {
                setViestiData({
                    ...viestiData,
                    viestit : await yhteys.json(),
                    haettu : true
                });
            } else {
                let virheteksti : string = "";

                switch (yhteys.status) {
                    case 400 : virheteksti = "Virhe pyynnön tiedoissa"; break;
                    case 401 : virheteksti = "Ei oikeuksia"; break;
                    default : virheteksti = "Palvelimella tapahtui odottamaton virhe"; break;
                }

                setViestiData({
                    ...viestiData,
                    virhe : virheteksti,
                    haettu : true
                })
            }
        } catch (e : any) {
            setViestiData({
                ...viestiData,
                virhe : "Palvelimeen ei saada yhteyttä",
                haettu : true
            });
        }
    }

    const haeTiedot = async () : Promise<void> => {

        setTiedot({
            ...tiedot,
            haettu : false
        });

        let url : string = `/api/tuotteet/${localStorage.getItem("id")}`;

        let asetukset : fetchAsetukset = {
            method : "GET",
            headers : {
                'Authorization' : `Bearer ${props.token}`
            }
        }
    
        try {
            const yhteys = await fetch(url, asetukset);
            if (yhteys.ok) {
                setTiedot({
                    ...tiedot,
                    tuote : await yhteys.json(),
                    haettu : true
                });
            } else {
                let virheteksti : string = "";

                switch (yhteys.status) {
                    case 400 : virheteksti = "Virhe pyynnön tiedoissa"; break;
                    case 401 : virheteksti = "Ei oikeuksia"; break;
                    default : virheteksti = "Palvelimella tapahtui odottamaton virhe"; break;
                }

                setTiedot({
                    ...tiedot,
                    virhe : virheteksti,
                    haettu : true
                })
            }
        } catch (e : any) {
            setTiedot({
                ...tiedot,
                virhe : "Palvelimeen ei saada yhteyttä",
                haettu : true
            });
        }
    }

    const peruuta = () => {
        navigate(-1);
    }
    
    useEffect(() => {
        haeTiedot();
        viestiTiedot();
      }, []);


    return (
        <Dialog
            maxWidth="lg"
            open={true}
            onClose={peruuta}
            sx={{paddingLeft:6}}
            >
                
                {(Boolean(tiedot.virhe))
                    ? <Alert severity='error'>{tiedot.virhe}</Alert>
                    : (tiedot.haettu)
                        ?  <DialogContent style={{padding : 20, width:500}}>
                        <Stack>
                            
                            <Typography
                                variant="h5"
                                align="center"
                                sx={{marginBottom:2}}>
                                {tiedot.tuote.tuoteNimi}
                            </Typography>
                            
                            <Typography
                                variant="h6"
                                sx={{fontWeight:"bold"}}>
                                {tiedot.tuote.hinta}€
                            </Typography>
                            {Boolean(tiedot.tuote.aikaleima === tiedot.tuote.muokattu)
                                ? <Typography
                                variant="body2">
                                {(format(parseJSON(tiedot.tuote.aikaleima), "dd.MM.yyyy H:mm"))} ({tiedot.tuote.myyja})
                            </Typography>
                            : <Typography
                            variant="body2">
                            {(format(parseJSON(tiedot.tuote.aikaleima), "dd.MM.yyyy H:mm"))} ({tiedot.tuote.myyja})
                            (Muokattu: {(format(parseJSON(tiedot.tuote.muokattu), "dd.MM.yyyy H:mm"))})
                                 </Typography>
                                }
                            <Typography
                                variant="h6"
                                sx={{marginTop : 3}}>Kuvaus:</Typography>
                            <Typography
                                variant="body1"
                                sx={{marginBottom:3}}
                                >
                                {tiedot.tuote.kuvaus}
                            </Typography>
                            </Stack>

                            <Divider sx={{marginTop : 2,
                                        marginBottom : 2}}>
                                            <Typography variant="h6">Viestit</Typography>
                                            
                                        </Divider>
                            
                            {Boolean(viestiData.virhe)
                                ? <Alert severity="error">{viestiData.virhe}</Alert>
                                : (viestiData.haettu)
                                    ? <>
                                    
                                    {viestiData.viestit
                                    .map((viesti : Viesti, idx : number) => {
                                        return <Stack
                                                key={idx}
                                                sx={{marginBottom:2}}
                                                >
                                                
                                                            <Typography
                                                                variant="body1">
                                                                {viesti.sisalto}
                                                            </Typography>
                                                            
                                                            <Typography
                                                                variant="body2">
                                                                {(format(parseJSON(viesti.aikaleima), "dd.MM.yyyy H:mm"))} ({viesti.kirjoittaja})
                                                                
                                                            </Typography>
                                                    <Divider sx={{marginTop : 1.5}}/>
                                                </Stack>
                                                
                                    })}
                                    </>
                                    : <Backdrop open={true}>
                                        <CircularProgress color='inherit'/>
                                    </Backdrop>}
                                <Box
                                    component="form"
                                    onSubmit={lisaaViesti}
                                    ref={lomakeRef}
                                    sx={{marginTop:4}}>
                                    <TextField
                                        label="Viesti"
                                        name="viesti"
                                        sx={{width:300}}/>
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        size="large"
                                        sx={{marginLeft:4,
                                            marginTop:1}}>
                                        Lähetä viesti
                                    </Button>
                                </Box>
                                
                        </DialogContent>
                        : <Backdrop open={true}>
                            <CircularProgress color='inherit'/>
                        </Backdrop>
                        }
                
        </Dialog>
);
}
export default Tuotetiedot;