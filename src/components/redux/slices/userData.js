import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  uid: '',
  PuntosporValor: 0,
  password: '',
  nombreEmpresa: '',
  nit: '',
  naceptado: '',
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
  password:''
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      const { uid, PuntosporValor, password,nombreEmpresa, nit, naceptado, telefono, direccion, role, nentregado, nombre, ndistribucion, idBot, valorMinimo, identificador, correo } = action.payload;
      state.uid = uid;
      state.PuntosporValor = PuntosporValor;
      state.nombreEmpresa = nombreEmpresa;
      state.nit = nit;
      state.naceptado = naceptado;
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
      state.password = password; 
    },
    clearUserData: (state) => {
      state.uid = null;
      state.PuntosporValor = 0;
      state.password = null;
      state.nombreEmpresa = null;
      state.nit = null;
      state.naceptado = null;
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
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;

export default userSlice.reducer;