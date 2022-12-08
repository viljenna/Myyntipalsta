import { Container, Box, Typography, Button, Alert, Card, CardContent, Stack, CircularProgress, Backdrop, List, CardActionArea } from "@mui/material";
import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import UusiTuote from './UusiTuote';
import { format, parseJSON } from "date-fns";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';



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
    setToken : Dispatch<SetStateAction<string>>
}
  
const Tuotteet : React.FC<Props> = (props : Props) : React.ReactElement => {

    const navigate : NavigateFunction = useNavigate();
    const [dialogiAuki, setDialogiAuki] = useState<boolean>(false);
    

    const kirjauduUlos = () => {
        localStorage.removeItem("token");
        props.setToken("");
        window.location.reload();
    }

    const avaaTiedot = (id : number) => {
        localStorage.setItem("id", String(id));
        navigate("tuotetiedot");
    }

    const [apiData, setApiData] = useState<ApiData>({
                                                    tuotteet : [],
                                                    virhe : "",
                                                    haettu : false
                                                });

    const apiKutsu = async (metodi? : string, tuote? : Tuote, id? : number) : Promise<void> => {
       
            setApiData({
                ...apiData,
                haettu : false
            });

            let url : string = (id) ? `/api/tuotteet/${id}` : `/api/tuotteet`;

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
                        case 401 : navigate("/login"); break;
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
        sx={{width : 600}}>
        <Box
            display="flex"
            justifyContent="space-between">
            <Button
                variant="outlined"
                
                onClick={ () => {navigate("/omatMyynnit")}}
                startIcon={<AccountCircleIcon/>}>
                    Omat ilmoitukset
            </Button>
            <Button
                onClick={() => {setDialogiAuki(true)}}
                
                variant="contained"
                >
                Lisää myynti-ilmoitus
            </Button>
            
        </Box>
        <Button
                onClick={kirjauduUlos}
                variant="outlined"
                sx={{marginTop:1, marginBottom:2}}
                >
                Kirjaudu Ulos
            </Button>
        <Box
            justifyContent="end"
            display="flex">
            
        </Box>
        {(Boolean(apiData.virhe))
            ? <Alert severity='error'>{apiData.virhe}</Alert>
            : (apiData.haettu)
                ?<Stack spacing={3}>
                        <Typography 
                            variant="h5"
                            align="center">
                                Ilmoitukset:</Typography>
                        <List>
                            {apiData.tuotteet
                            .sort((a,b) => a.aikaleima < b.aikaleima ? 1:-1)
                            .map((tuote : Tuote, idx : number) => {
                                return <Card
                                        key={idx}
                                        sx={{marginBottom: 3}}>
                                            <CardActionArea
                                                onClick={() => {avaaTiedot(tuote.id)}}>
                                                <CardContent>
                                                
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
                                                    
                                                    
                                                </CardContent>
                                            </CardActionArea>
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
    );
}

export default Tuotteet;