--
-- PostgreSQL database dump
--

\restrict xb3E26iaM5NLJFgTxkFPc5s06PHrWKzP898U0uieKbzVIBuMBrByaOz5mOEMScS

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2025-12-01 22:41:39

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 16732)
-- Name: administrador; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.administrador (
    idadmin integer NOT NULL,
    documento character varying(10) NOT NULL,
    nombres character varying(100) NOT NULL,
    telefono character varying(10) NOT NULL,
    correopersonal character varying(200) NOT NULL,
    contrasena character varying(255) NOT NULL,
    rol character varying(255) DEFAULT 'Administrador'::character varying NOT NULL,
    estado character varying(30) DEFAULT 'Activo'::character varying NOT NULL,
    intentosfallidos integer DEFAULT 0 NOT NULL,
    fechacreacion timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.administrador OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16731)
-- Name: administrador_idadmin_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.administrador_idadmin_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.administrador_idadmin_seq OWNER TO postgres;

--
-- TOC entry 4975 (class 0 OID 0)
-- Dependencies: 223
-- Name: administrador_idadmin_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.administrador_idadmin_seq OWNED BY public.administrador.idadmin;


--
-- TOC entry 226 (class 1259 OID 16761)
-- Name: equipos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.equipos (
    idequipo integer NOT NULL,
    modelo character varying(100) NOT NULL,
    numerodeserie character varying(50) NOT NULL,
    fecha_ingreso timestamp without time zone DEFAULT now() NOT NULL,
    fecha_salida timestamp without time zone,
    idinvitado integer NOT NULL
);


ALTER TABLE public.equipos OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16760)
-- Name: equipos_idequipo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.equipos_idequipo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.equipos_idequipo_seq OWNER TO postgres;

--
-- TOC entry 4976 (class 0 OID 0)
-- Dependencies: 225
-- Name: equipos_idequipo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.equipos_idequipo_seq OWNED BY public.equipos.idequipo;


--
-- TOC entry 220 (class 1259 OID 16674)
-- Name: invitado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invitado (
    idinvitado integer NOT NULL,
    documento character varying(10) NOT NULL,
    nombres character varying(100) NOT NULL,
    telefono character varying(10) NOT NULL,
    correopersonal character varying(250) NOT NULL,
    rol character varying(20) DEFAULT 'Invitado'::character varying NOT NULL,
    intentosfallidos integer DEFAULT 0 NOT NULL,
    estado character varying(30) DEFAULT 'Activo'::character varying NOT NULL,
    contrasena character varying(250) NOT NULL
);


ALTER TABLE public.invitado OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16673)
-- Name: invitado_idinvitado_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invitado_idinvitado_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invitado_idinvitado_seq OWNER TO postgres;

--
-- TOC entry 4977 (class 0 OID 0)
-- Dependencies: 219
-- Name: invitado_idinvitado_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invitado_idinvitado_seq OWNED BY public.invitado.idinvitado;


--
-- TOC entry 222 (class 1259 OID 16701)
-- Name: portero; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.portero (
    idportero integer NOT NULL,
    documento character varying(10) NOT NULL,
    nombres character varying(100) NOT NULL,
    telefono character varying(10) NOT NULL,
    correopersonal character varying(200) NOT NULL,
    contrasena character varying(255) NOT NULL,
    rol character varying(255) DEFAULT 'Portero'::character varying NOT NULL,
    estado character varying(30) DEFAULT 'Activo'::character varying NOT NULL,
    intentosfallidos integer DEFAULT 0 NOT NULL,
    fechacreacion timestamp without time zone DEFAULT now() NOT NULL,
    creadopor character varying(100) DEFAULT 'Admin'::character varying NOT NULL
);


ALTER TABLE public.portero OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16700)
-- Name: portero_idportero_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.portero_idportero_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.portero_idportero_seq OWNER TO postgres;

--
-- TOC entry 4978 (class 0 OID 0)
-- Dependencies: 221
-- Name: portero_idportero_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.portero_idportero_seq OWNED BY public.portero.idportero;


--
-- TOC entry 4780 (class 2604 OID 16735)
-- Name: administrador idadmin; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrador ALTER COLUMN idadmin SET DEFAULT nextval('public.administrador_idadmin_seq'::regclass);


--
-- TOC entry 4785 (class 2604 OID 16764)
-- Name: equipos idequipo; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipos ALTER COLUMN idequipo SET DEFAULT nextval('public.equipos_idequipo_seq'::regclass);


--
-- TOC entry 4770 (class 2604 OID 16677)
-- Name: invitado idinvitado; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitado ALTER COLUMN idinvitado SET DEFAULT nextval('public.invitado_idinvitado_seq'::regclass);


--
-- TOC entry 4774 (class 2604 OID 16704)
-- Name: portero idportero; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portero ALTER COLUMN idportero SET DEFAULT nextval('public.portero_idportero_seq'::regclass);


--
-- TOC entry 4967 (class 0 OID 16732)
-- Dependencies: 224
-- Data for Name: administrador; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.administrador (idadmin, documento, nombres, telefono, correopersonal, contrasena, rol, estado, intentosfallidos, fechacreacion) FROM stdin;
2	1547896321	Justin	3548793621	Justin@gmail.com	$2b$10$MZkuLAIP.8CLNU2gilqKXuFzpfIqsqlopgo6hclpq179l56OV4El2	Administrador	Activo	0	2025-12-01 13:26:47.089242
\.


--
-- TOC entry 4969 (class 0 OID 16761)
-- Dependencies: 226
-- Data for Name: equipos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.equipos (idequipo, modelo, numerodeserie, fecha_ingreso, fecha_salida, idinvitado) FROM stdin;
5	Asus Vivobook	ASPF-RTF-PWH	2025-12-01 21:54:41.486437	\N	6
\.


--
-- TOC entry 4963 (class 0 OID 16674)
-- Dependencies: 220
-- Data for Name: invitado; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invitado (idinvitado, documento, nombres, telefono, correopersonal, rol, intentosfallidos, estado, contrasena) FROM stdin;
5	1547896355	Johan	3548793655	Johan@gmail.com	Invitado	0	Activo	$2b$10$EHAGatdzEhKSt2JdU97MoenDSHMnEwNNFFWgSixf/5nPqtCYib8lG
6	1547968251	Valentina	6452871469	Valentina@gmail.com	Invitado	0	Activo	$2b$10$dL/0stnjhlusXzqUMZnHuO2wBoqUUh4IWJpcqXkXI5D0GsUBKwoXG
\.


--
-- TOC entry 4965 (class 0 OID 16701)
-- Dependencies: 222
-- Data for Name: portero; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.portero (idportero, documento, nombres, telefono, correopersonal, contrasena, rol, estado, intentosfallidos, fechacreacion, creadopor) FROM stdin;
3	1547896311	Diego	3548793611	Diego@gmail.com	$2b$10$GuR.GWopVTuBU8NhTGnxh.v6aqe2rI0pZpfCuTtZ/n/mGXxdSLKFW	Portero	Activo	0	2025-12-01 13:43:40.594953	Admin
4	1548962547	Susana	2548796524	Susana@gmail.com	$2b$10$D8RbDB6HFojQbPVxwXbBuOzjuG9ov956e3AH6MJS5p2Vetk9nAAem	Portero	Activo	0	2025-12-01 20:14:23.079297	Admin
\.


--
-- TOC entry 4979 (class 0 OID 0)
-- Dependencies: 223
-- Name: administrador_idadmin_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.administrador_idadmin_seq', 2, true);


--
-- TOC entry 4980 (class 0 OID 0)
-- Dependencies: 225
-- Name: equipos_idequipo_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.equipos_idequipo_seq', 5, true);


--
-- TOC entry 4981 (class 0 OID 0)
-- Dependencies: 219
-- Name: invitado_idinvitado_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invitado_idinvitado_seq', 6, true);


--
-- TOC entry 4982 (class 0 OID 0)
-- Dependencies: 221
-- Name: portero_idportero_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.portero_idportero_seq', 4, true);


--
-- TOC entry 4804 (class 2606 OID 16759)
-- Name: administrador administrador_correopersonal_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrador
    ADD CONSTRAINT administrador_correopersonal_key UNIQUE (correopersonal);


--
-- TOC entry 4806 (class 2606 OID 16755)
-- Name: administrador administrador_documento_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrador
    ADD CONSTRAINT administrador_documento_key UNIQUE (documento);


--
-- TOC entry 4808 (class 2606 OID 16753)
-- Name: administrador administrador_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrador
    ADD CONSTRAINT administrador_pkey PRIMARY KEY (idadmin);


--
-- TOC entry 4810 (class 2606 OID 16757)
-- Name: administrador administrador_telefono_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrador
    ADD CONSTRAINT administrador_telefono_key UNIQUE (telefono);


--
-- TOC entry 4812 (class 2606 OID 16774)
-- Name: equipos equipos_numerodeserie_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipos
    ADD CONSTRAINT equipos_numerodeserie_key UNIQUE (numerodeserie);


--
-- TOC entry 4814 (class 2606 OID 16772)
-- Name: equipos equipos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipos
    ADD CONSTRAINT equipos_pkey PRIMARY KEY (idequipo);


--
-- TOC entry 4788 (class 2606 OID 16699)
-- Name: invitado invitado_correopersonal_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitado
    ADD CONSTRAINT invitado_correopersonal_key UNIQUE (correopersonal);


--
-- TOC entry 4790 (class 2606 OID 16695)
-- Name: invitado invitado_documento_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitado
    ADD CONSTRAINT invitado_documento_key UNIQUE (documento);


--
-- TOC entry 4792 (class 2606 OID 16693)
-- Name: invitado invitado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitado
    ADD CONSTRAINT invitado_pkey PRIMARY KEY (idinvitado);


--
-- TOC entry 4794 (class 2606 OID 16697)
-- Name: invitado invitado_telefono_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitado
    ADD CONSTRAINT invitado_telefono_key UNIQUE (telefono);


--
-- TOC entry 4796 (class 2606 OID 16730)
-- Name: portero portero_correopersonal_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portero
    ADD CONSTRAINT portero_correopersonal_key UNIQUE (correopersonal);


--
-- TOC entry 4798 (class 2606 OID 16726)
-- Name: portero portero_documento_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portero
    ADD CONSTRAINT portero_documento_key UNIQUE (documento);


--
-- TOC entry 4800 (class 2606 OID 16724)
-- Name: portero portero_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portero
    ADD CONSTRAINT portero_pkey PRIMARY KEY (idportero);


--
-- TOC entry 4802 (class 2606 OID 16728)
-- Name: portero portero_telefono_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portero
    ADD CONSTRAINT portero_telefono_key UNIQUE (telefono);


-- Completed on 2025-12-01 22:41:39

--
-- PostgreSQL database dump complete
--

\unrestrict xb3E26iaM5NLJFgTxkFPc5s06PHrWKzP898U0uieKbzVIBuMBrByaOz5mOEMScS

