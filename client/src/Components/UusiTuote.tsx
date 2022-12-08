import React, { Dispatch, SetStateAction, useRef } from "react";
import { Button, Dialog, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";

interface Props {
    dialogiAuki : boolean
    setDialogiAuki : Dispatch<SetStateAction<boolean>>
    apiKutsu : (arg0 : string, arg1? : any) => void
  }

const UusiTuote : React.FC<Props> = (props: Props) : React.ReactElement => {
    const lomakeRef : any = useRef<HTMLFormElement>();

    const tallenna = (e : React.FormEvent) : void => {
        e.preventDefault();

        props.apiKutsu("POST", {
            id : 0,
            tuoteNimi : String(lomakeRef.current?.tuotenimi.value),
            kuvaus : String(lomakeRef.current?.kuvaus.value),
            aikaleima : 0,
            hinta : Number(lomakeRef.current?.hinta.value)
        })
        props.setDialogiAuki(false);
    }

    const peruuta = () : void => {
        props.setDialogiAuki(false);
    }

    return (
        <Dialog
            maxWidth="lg"
            fullWidth={true}
            open={props.dialogiAuki}
            onClose={peruuta}>
                <DialogTitle>Lisää uusi myynti-ilmoitus</DialogTitle>
                <DialogContent style={{paddingTop : 10}}>
                    <Stack
                        spacing={1}
                        component="form"
                        onSubmit={tallenna}
                        ref={lomakeRef}>
                            <TextField
                                name="tuotenimi"
                                label="Myytävä tuote"
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
                            >Lisää ilmoitus</Button>
                        </Stack>
                </DialogContent>
            </Dialog>
);
}
export default UusiTuote;