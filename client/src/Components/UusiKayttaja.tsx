import React, { useRef, useState } from "react";
import { Typography, Alert, Dialog, Paper, Box, Stack, TextField, Button } from "@mui/material";
import { NavigateFunction, useNavigate } from "react-router-dom";

interface fetchAsetukset {
    method : string
    headers? : any
    body? : string
}

const UusiKayttaja : React.FC = () : React.ReactElement => {
    
    const lomakeRef = useRef<HTMLFormElement>();
    const navigate : NavigateFunction = useNavigate();

    const [virhe, setVirhe] = useState("");

    
    const rekisteroidy = async (e : React.FormEvent) : Promise<void> => {
        e.preventDefault();
        setVirhe("");

        let url = '/api/kayttajat';

        let asetukset : fetchAsetukset = {
            method : "POST",
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(
                {id : 0,
                kayttajatunnus : lomakeRef.current?.kayttajatunnus.value,
                salasana : lomakeRef.current?.salasana.value}
            )
        }

        try {
            const yhteys = await fetch(url,asetukset);
            if (yhteys.ok) {
                navigate('/login');

            } else {
                let virheteksti : string = "";
      
                switch (yhteys.status) {
                case 400 : virheteksti = "Virheellinen käyttäjätunnus tai salasana."; break;
                case 401 : virheteksti = "Käyttäjätunnus ei vapaana."; break;
                default : virheteksti = "Palvelimella tapahtui odottamaton virhe."; break;
                }
                setVirhe(virheteksti)
                   
            }
        } catch (e: any){
           setVirhe("Palvelimeen ei saada yhteyttä");
        }
    }

    return(
        <Dialog open={true}>
        <Paper sx={{padding : 2}}>
            <Box
                component="form"
                onSubmit={rekisteroidy}
                ref={lomakeRef}
                style={{
                    width: 400,
                    padding : 20
                }}
            >
                <Stack spacing={2}>
                    <Typography 
                        variant="h6"
                        align="center">
                            Rekisteröidy
                    </Typography>
                    <Typography variant="body2">Käyttäjätunnuksen ja salasanan oltava vähintään 5 merkkiä</Typography>
                    <TextField 
                        label="Käyttäjätunnus" 
                        name="kayttajatunnus"
                    />
                    <TextField 
                        label="Salasana"
                        name="salasana"
                        type="password"
                    />
                    <Button 
                        type="submit" 
                        variant="contained" 
                        size="large"
                    >
                        Rekisteröidy
                    </Button>
                    <Button  
                        variant="outlined" 
                        size="large"
                        onClick={() => {navigate("/login")}}
                    >
                        Takaisin
                    </Button>
                    {Boolean(virhe)
                        ? <Alert severity="error">{virhe}</Alert>
                        : <></>}
                    
                </Stack>
                
            </Box>
        </Paper>
        
    </Dialog>
    )
}

export default UusiKayttaja;