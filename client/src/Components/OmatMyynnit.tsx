import React, { useState, useEffect } from "react";
import { Typography, Box, Container, Card, Button, Alert, Stack, CircularProgress, Backdrop, List, IconButton, CardActionArea, CardContent } from "@mui/material";
import { format, parseJSON } from "date-fns";
import DeleteIcon from '@mui/icons-material/Delete';
import { NavigateFunction, useNavigate } from "react-router-dom";
import UusiTuote from './UusiTuote';
import CreateIcon from '@mui/icons-material/Create';
import MuokkaaTuote from "./MuokkaaTuote";

interface Tuote {
    id : number
    tuoteNimi : string
    kuvaus : string
    myyja : string
    aikaleima : Date
    hinta : number
}

interface ApiData {
    tuotteet : Tuote[]
    virhe : string
    haettu : boolean
}

interface fetchAsetukset {
    method : string
    headers? : any
    body? : string
}

interface Props {
    token : string
}

const OmatMyynnit : React.FC<Props> = (props : Props) : React.ReactElement => {
    
    const navigate : NavigateFunction = useNavigate();
    const [dialogiAuki, setDialogiAuki] = useState<boolean>(false);
    
    const [apiData, setApiData] = useState<ApiData>({
                                                    tuotteet : [],
                                                    virhe : "",
                                                    haettu : false
                                                });

    const avaaTiedot = (id : number) => {
        localStorage.setItem("id", String(id));
        navigate("/tuotetiedot");
    }

    const muokkaaTiedot = (id : number) => {
        localStorage.setItem("id", String(id));
        navigate("/muokkaa");
    }

    const poistaTuote = (tuote : Tuote) => {
        apiKutsu("DELETE", undefined, tuote.id);
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

        if (metodi === "POST") {
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
        apiKutsu();
      }, []);

    return(
        <Container
            sx={{width:600}}>
            <Box
                display="flex"
                justifyContent="space-between">
                <Button
                    variant="outlined"
                    onClick={() => {navigate("/")}}
                    >Kaikki myynti-ilmoitukset
                </Button>
                <Button
                    onClick={() => {setDialogiAuki(true)}}
                    variant="contained">
                    Lisää myynti-ilmoitus
                </Button>
            </Box>
        {(Boolean(apiData.virhe))
            ? <Alert severity='error'>{apiData.virhe}</Alert>
            : (apiData.haettu)
                ?<Stack spacing={3}>
                        <Typography 
                            variant="h5"
                            align="center"
                            sx={{marginTop:3}}>Omat myynti-ilmoitukset:</Typography>
                        <List>
                            {apiData.tuotteet
                            .sort((a,b) => a.aikaleima < b.aikaleima ? 1:-1)
                            .map((tuote : Tuote, idx : number) => {
                                return <Card
                                        sx={{marginBottom:2}}
                                        key={idx}
                                        >
                                             <CardContent>
                                                 <Box
                                                    display="flex"
                                                    justifyContent="space-between"
                                                    sx={{margin:0}}
                                                    >
                                                    <CardActionArea
                                                        disableRipple
                                                        onClick={() => {avaaTiedot(tuote.id)}}
                                                        >
                                                    
                                                    <Typography
                                                        variant="h6"
                                                        align="center">
                                                        {tuote.tuoteNimi}
                                                    </Typography>
                                                    <Typography
                                                        variant="h6"
                                                        align="center">
                                                        {tuote.hinta}€
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        align="center">
                                                        {(format(parseJSON(tuote.aikaleima), "dd.MM.yyyy H:mm"))}
                                                    </Typography>
                                                        
                                                    </CardActionArea>
                                                    <IconButton
                                                        onClick={() => {poistaTuote(tuote)}}
                                                        >
                                                        <DeleteIcon
                                                            sx={{width:80}}/>
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => {muokkaaTiedot(tuote.id)}}
                                                        >
                                                        <CreateIcon
                                                            sx={{width:80}}/>
                                                    </IconButton>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                        
                            })}
                        </List>
                </Stack>
                : <Backdrop open={true}>
                        <CircularProgress color='inherit'/>
                    </Backdrop>
              }
              <UusiTuote dialogiAuki={dialogiAuki} setDialogiAuki={setDialogiAuki} apiKutsu={apiKutsu}/>
              
        </Container>
    )
}

export default OmatMyynnit;