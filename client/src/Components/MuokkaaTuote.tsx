import React, { Dispatch, SetStateAction, useRef, useState, useEffect } from "react";
import { Alert, Dialog, Paper, DialogContent, Button, Stack, Typography, Backdrop, CircularProgress, Box, TextField, Divider, Grid } from "@mui/material";
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

interface Data {
    tuotteet : Tuote[],
    virhe : string
    haettu : boolean
}

interface Props {
    token : string
}

const MuokkaaTuote : React.FC<Props> = (props : Props) : React.ReactElement => {
    
    const lomakeRef : any = useRef<HTMLFormElement>();
    const navigate : NavigateFunction = useNavigate();

    const [apiData, setApiData] = useState<Data>({
                                                    tuotteet : [],
                                                    virhe : "",
                                                    haettu : false
    });


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

    const muokkaa = (e : React.FormEvent) : void => {
        e.preventDefault()

            apiKutsu("PUT", {
                id : Number(localStorage.getItem("id")),
                tuoteNimi : String(lomakeRef.current?.tuotenimi.value),
                kuvaus : String(lomakeRef.current?.kuvaus.value),
                myyja : "",
                hinta : Number(lomakeRef.current?.hinta.value),
                aikaleima : new Date(),
                muokattu : new Date()
            }, Number(localStorage.getItem("id")))
        
        navigate("/omatMyynnit");
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
                'Authorization' : `Bearer ${localStorage.getItem("token")}`
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

    const apiKutsu = async (metodi? : string, tuote? : Tuote, id? : number) : Promise<void> => {
       
        setApiData({
            ...apiData,
            haettu : false
        });

        let url : string = (id) ? `/api/omatTuotteet/${id}` : `/api/omatTuotteet`;

        let asetukset : fetchAsetukset = {
            method : metodi || "GET",
            headers : {
                'Authorization' : `Bearer ${props.token}`
            }
        };


        if (metodi === "PUT") {
            asetukset = {
                ...asetukset,
                headers : {
                    ...asetukset.headers,
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(tuote)
            }
        }

        try {
            const yhteys = await fetch(url, asetukset);
            if (yhteys.ok) {
                setApiData({
                    ...apiData,
                    tuotteet : await yhteys.json(),
                    haettu : true
                });
            } else {
                let virheteksti : string = "";

                switch (yhteys.status) {
                    case 400 : virheteksti = "Virhe pyynnön tiedoissa"; break;
                    case 401 : virheteksti = "Ei oikeuksia"; break;
                    default : virheteksti = "Palvelimella tapahtui odottamaton virhe"; break;
                }

                setApiData({
                    ...apiData,
                    virhe : virheteksti,
                    haettu: true
                });
            }
        } catch(e : any) {
            setApiData({
                ...apiData,
                virhe: "Palvelimeen ei saada yhteyttä",
                haettu : true
            });
        }
        
    }

    
    useEffect(() => {
        haeTiedot();
      }, []);


    return (
        <Dialog
            maxWidth="lg"
            open={true}
            onClose={() => navigate(-1)}            
            >
                <DialogContent>
                <Grid
                    container
                    spacing={2}
                    sx={{width:600}}>
                        <Grid
                            item
                            xs={5}>
                {(Boolean(tiedot.virhe))
                    ? <Alert severity='error'>{tiedot.virhe}</Alert>
                    : (tiedot.haettu)
                        ?  <Box >
                                <Stack>
                                    
                                    <Typography
                                        variant="h5"
                                        sx={{marginBottom:2}}>
                                        {tiedot.tuote.tuoteNimi}
                                    </Typography>
                                    
                                    <Typography
                                        variant="h6"
                                        sx={{fontWeight:"bold"}}>
                                        {tiedot.tuote.hinta}€
                                    </Typography>
                                    <Typography></Typography>
                                    
                                    <Typography
                                        variant="body2">
                                        {(format(parseJSON(tiedot.tuote.aikaleima), "dd.MM.yyyy H:mm"))} ({tiedot.tuote.myyja})
                                    </Typography>
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
                              </Box> 
                        
                        : <Backdrop open={true}>
                            <CircularProgress color='inherit'/>
                        </Backdrop>
                        }
                    </Grid>
                    <Grid
                        item
                        xs={6}>
                            <Box>
                                <Stack
                                    component="form"
                                    onSubmit={muokkaa}
                                    spacing={2}
                                    ref={lomakeRef}
                                >
                                    <Typography
                                        variant="h6"
                                        align="center">
                                        Muokkaa ilmoitusta:
                                    </Typography>
                                    <TextField
                                        name="tuotenimi"
                                        label="Tuotteen nimi"
                                        variant="outlined"/>
                                    <TextField
                                        name="kuvaus"
                                        label="Tuotekuvaus"
                                        variant="outlined"
                                        multiline/>
                                    <TextField
                                        name="hinta"
                                        label="Hinta"
                                        variant="outlined"/>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        >Tallenna
                                    </Button>
                                </Stack>
                            </Box>
                            
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
);
}
export default MuokkaaTuote;