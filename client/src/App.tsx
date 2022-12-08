import { Container, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Tuotteet from './Components/Tuotteet';
import Kirjautuminen from './Components/Kirjautuminen';
import OmatMyynnit from './Components/OmatMyynnit';
import UusiKayttaja from './Components/UusiKayttaja';
import Tuotetiedot from './Components/Tuotetiedot';
import MuokkaaTuote from './Components/MuokkaaTuote';

const App : React.FC = () : React.ReactElement => {

  const [token, setToken] = useState<string>(String(localStorage.getItem("token")));

  return(
    <Container>
      <Typography variant='h4' sx={{marginBottom:5}} align="center">Myyntipalsta</Typography>
      <Routes>
        <Route path='/' element={<Tuotteet token={token} setToken={setToken}/>}/>
        <Route path='/login' element={<Kirjautuminen setToken={setToken}/>}/>
        <Route path='/uusiKayttaja' element={<UusiKayttaja/>}/>
        <Route path='/omatMyynnit' element={<OmatMyynnit token={token}/>}/>
        <Route path="/tuotetiedot" element={<Tuotetiedot token={token}/>}/>
        <Route path="/muokkaa" element={<MuokkaaTuote token={token}/>}/>

      </Routes>
    </Container>
  )
}

export default App;
