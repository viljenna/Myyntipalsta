import { Typography, Backdrop, Paper, Box, Stack, TextField, Button, Alert } from "@mui/material";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

interface Props {
    setToken : Dispatch<SetStateAction<string>>
}

const Kirjautuminen : React.FC<Props> = (props : Props) : React.ReactElement => {

    const lomakeRef = useRef<HTMLFormElement>();
    const navigate : NavigateFunction = useNavigate();

    const [virhe, setVirhe] = useState("");

    const kirjaudu = async (e : React.FormEvent) : Promise<void> => {
        e.preventDefault();

        if (lomakeRef.current?.kayttajatunnus.value) {
            if (lomakeRef.current?.salasana.value) {
                const yhteys = await fetch("/api/auth/login", {
                    method : "POST",
                    headers : {
                        'Content-type' : 'application/json'
                    },
                    body : JSON.stringify({
                        kayttajatunnus : lomakeRef.current?.kayttajatunnus.value,
                        salasana : lomakeRef.current?.salasana.value
                    })
                });

                if (yhteys.ok) {
                    let {token} = await yhteys.json();
                    props.setToken(token);
                    localStorage.setItem("token", token);
                    navigate("/");
                } else {
                    setVirhe("Virheellinen käyttäjätunnus tai salasana")
                }
            } else {
                setVirhe("Virheellinen käyttäjätunnus tai salasana")
            }
        } else {
            setVirhe("Virheellinen käyttäjätunnus tai salasana")
        }
    }

    return (
        <Backdrop open={true}>
        <Paper sx={{padding : 2}}>
            <Box
                component="form"
                onSubmit={kirjaudu}
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
                            Kirjaudu sisään
                    </Typography>
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
                        Kirjaudu
                    </Button>
                    {Boolean(virhe)
                        ? <Alert severity="error">{virhe}</Alert>
                        : <></>
                    }
                    <Typography
                        variant="body1"
                        >Tai luo uusi käyttäjä:
                        </Typography>
                    <Button
                        onClick={() => {navigate("/uusiKayttaja")}}
                        variant="outlined"
                        size="large">
                        Rekisteröidy
                    </Button>
                </Stack>
                
            </Box>
        </Paper>
        
    </Backdrop>
);
}

export default Kirjautuminen;