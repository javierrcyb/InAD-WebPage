export const FORM_DICTIONARIES = {
    // PARTE 1 - PERFIL PERSONAL
    sexo: [
        { value: 1, name: 'hombre', label: 'Hombre' },
        { value: 2, name: 'mujer', label: 'Mujer' },
    ],
    edadGrupo: [
        { value: 1, name: 'infante', label: '6 – 11' },
        { value: 2, name: 'adolescente', label: '12 – 18' },
        { value: 3, name: 'adulto_joven', label: '19 – 26' },
        { value: 4, name: 'adultez', label: '27 – 59' },
        { value: 5, name: 'adulto_mayor', label: '60+' },
    ],
    lenguaMaterna: [
    // Lenguas nativas peruanas
    { value: 1,  name: 'quechua',                label: 'Quechua' },
    { value: 2,  name: 'aimara',                 label: 'Aimara' },
    { value: 10, name: 'ashaninka',              label: 'Ashaninka' },
    { value: 11, name: 'awajun_aguaruna',        label: 'Awajun/Aguaruna' },
    { value: 12, name: 'shipibo_konibo',         label: 'Shipibo-Konibo' },
    { value: 13, name: 'shawi_chayahuita',       label: 'Shawi/Chayahuita' },
    { value: 14, name: 'matsigenka_machiguenga', label: 'Matsigenka/Machiguenga' },
    { value: 15, name: 'achuar',                 label: 'Achuar' },
    { value: 3,  name: 'otra_lengua_nativa',     label: 'Otra lengua nativa' },
    { value: 4,  name: 'castellano',             label: 'Castellano' },
    { value: 16, name: 'ingles',                 label: 'Inglés' },
    { value: 6,  name: 'portugues',              label: 'Portugués' },
    { value: 17, name: 'frances',                label: 'Francés' },
    { value: 18, name: 'aleman',                 label: 'Alemán' },
    { value: 19, name: 'chino_mandarin',         label: 'Chino/Mandarín' },
    { value: 7,  name: 'otra_lengua_extranjera', label: 'Otra lengua extranjera' },
    { value: 9,  name: 'lengua_de_senas_peruanas', label: 'Lengua de señas peruanas' },
    { value: 8,  name: 'no_escucha_no_habla',    label: 'No escucha/no habla' },
],

    //PARTE 2 - EDUCACIÓN E INGRESOS
    nivelEducacion: [
        { value: 1, name: 'Sin Nivel', label: 'Sin Nivel' },
        { value: 2, name: 'Educacion inicial', label: 'Educación inicial' },
        { value: 3, name: 'Primaria incompleta', label: 'Primaria incompleta' },
        { value: 4, name: 'Primaria completa', label: 'Primaria completa' },
        { value: 5, name: 'Secundaria incompleta', label: 'Secundaria incompleta' },
        { value: 6, name: 'Secundaria completa', label: 'Secundaria completa' },
        { value: 7, name: 'Superior no universitaria incompleta', label: 'Superior no universitaria incompleta' },
        { value: 8, name: 'Superior no Universitaria completa', label: 'Superior no universitaria completa' },
        { value: 9, name: 'Superior Universitaria Incompleta', label: 'Superior Universitaria Incompleta' },
        { value: 10, name: 'Superior Universitaria Completa', label: 'Superior Universitaria Completa' },
        { value: 11, name: 'Maestría/doctorado', label: 'Maestría/doctorado' },
        { value: 12, name: 'Básica especial', label: 'Básica especial' },

    ],
    dominioLectura: [
        { value: 1, name: 'sabe leer', label: 'Sé leer' },
        { value: 2, name: 'no sabe leer', label: 'No sé leer' },
    ],
    ingresoDelHogar:[
        { value: 1, name: 'Nivel 1', label: 'Menos de S/1,242' },
        { value: 2, name: 'Nivel 2', label: 'Entre S/1,242 y S/2,038' },
        { value: 3, name: 'Nivel 3', label: 'Entre S/2,038 y S/2,717' },
        { value: 4, name: 'Nivel 4', label: 'Entre S/ 2,717 y S/ 3,553' },
        { value: 5, name: 'Nivel 5', label: 'Entre S/ 3,553 y S/ 6,818' },
        { value: 6, name: 'Nivel 6', label: 'Más de S/ 6,818' },
    ]
} as const