import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  uid: '',
  PuntosporValor: 0,
  password: '',
  nombreEmpresa: '',
  nit: '',
  naceptado: '',
  nrechazado: '',
  telefono: '',
  direccion: '',
  role: '',
  nentregado: '',
  nombre: '',
  ndistribucion: '',
  idBot: '',
  valorMinimo: '',
  identificador: '',
  correo: '',
  password:'',
  webhook:'',
  npremioentregado:'',
  ncancelado: '',
  Rinstagram: '',
  Rfacebook: '',
  Rtiktok: '',
  linkwp1: '',
  linkwp2: '',
  logo:'',
  fondo:''

};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      const { uid, PuntosporValor, password,nombreEmpresa, nit, naceptado,nrechazado, telefono, direccion, role, nentregado, nombre, ndistribucion, idBot, valorMinimo, identificador, correo, webhook , npremioentregado,ncancelado,logo,Rinstagram,Rfacebook,Rtiktok,linkwp1,linkwp2,fondo} = action.payload;
      state.uid = uid;
      state.logo = logo;
      state.PuntosporValor = PuntosporValor;
      state.nombreEmpresa = nombreEmpresa;
      state.nit = nit;
      state.naceptado = naceptado;
      state.nrechazado = nrechazado;
      state.telefono = telefono;
      state.direccion = direccion;
      state.role = role;
      state.nentregado = nentregado;
      state.nombre = nombre;
      state.ndistribucion = ndistribucion;
      state.idBot = idBot;
      state.valorMinimo = valorMinimo;
      state.identificador = identificador;
      state.correo = correo;
      state.webhook= webhook;
      state.password = password; 
      state.npremioentregado=npremioentregado;
      state.ncancelado=ncancelado;
      state.Rfacebook=Rfacebook;
      state.Rinstagram=Rinstagram;
      state.Rtiktok=Rtiktok;
      state.linkwp1=linkwp1;
      state.linkwp2=linkwp2;
      state.logo=logo;
      state.fondo=fondo;

    },
    clearUserData: (state) => {
      state.uid = null;
      state.logo = null;
      state.PuntosporValor = 0;
      state.password = null;
      state.nombreEmpresa = null;
      state.nit = null;
      state.naceptado = null;
      state.nrechazado = null;
      state.telefono = null;
      state.direccion = null;
      state.role = null;
      state.nentregado = null;
      state.nombre = null;
      state.ndistribucion = null;
      state.idBot = null;
      state.valorMinimo = null;
      state.identificador = null;
      state.correo = null;
      state.webhook= null;
      state.npremioentregado=null;
      state.ncancelado=null;
      state.Rfacebook=null;
      state.Rinstagram=null;
      state.Rtiktok=null;
      state.linkwp1=null;
      state.linkwp2=null;
      state.logo=null;
      state.fondo=null;
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;

export default userSlice.reducer;