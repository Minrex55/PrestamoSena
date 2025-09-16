--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-09-16 14:46:54

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
-- TOC entry 219 (class 1259 OID 24597)
-- Name: funcionarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.funcionarios (
    idportero integer NOT NULL,
    documento character varying(10) NOT NULL,
    nombres character varying(100) NOT NULL,
    telefono character varying(10) NOT NULL,
    correopersonal character varying(200) NOT NULL,
    contrasena character varying(255) NOT NULL,
    rol character varying(255) NOT NULL,
    estado character varying(30) DEFAULT 'Activo'::character varying NOT NULL,
    intentosfallidos integer DEFAULT 0 NOT NULL,
    fechacreacion character varying(50) DEFAULT (now())::text NOT NULL,
    creadopor character varying(100) DEFAULT 'Default'::character varying NOT NULL
);


ALTER TABLE public.funcionarios OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 24582)
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
    estado character varying(30) NOT NULL
);


ALTER TABLE public.invitado OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 24587)
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
-- TOC entry 4919 (class 0 OID 0)
-- Dependencies: 218
-- Name: invitado_idinvitado_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invitado_idinvitado_seq OWNED BY public.invitado.idinvitado;


--
-- TOC entry 220 (class 1259 OID 24606)
-- Name: porteria_idfuncionario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.porteria_idfuncionario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.porteria_idfuncionario_seq OWNER TO postgres;

--
-- TOC entry 4920 (class 0 OID 0)
-- Dependencies: 220
-- Name: porteria_idfuncionario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.porteria_idfuncionario_seq OWNED BY public.funcionarios.idportero;


--
-- TOC entry 4750 (class 2604 OID 24607)
-- Name: funcionarios idportero; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funcionarios ALTER COLUMN idportero SET DEFAULT nextval('public.porteria_idfuncionario_seq'::regclass);


--
-- TOC entry 4747 (class 2604 OID 24588)
-- Name: invitado idinvitado; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitado ALTER COLUMN idinvitado SET DEFAULT nextval('public.invitado_idinvitado_seq'::regclass);


--
-- TOC entry 4912 (class 0 OID 24597)
-- Dependencies: 219
-- Data for Name: funcionarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.funcionarios (idportero, documento, nombres, telefono, correopersonal, contrasena, rol, estado, intentosfallidos, fechacreacion, creadopor) FROM stdin;
1	1038868735	Johan Perez	3117393212	jstiven600@gmail.com	1235789Mm@	Super_Portero	Activo	0	2025-09-16 14:44:11.40179-05	Default
\.


--
-- TOC entry 4910 (class 0 OID 24582)
-- Dependencies: 217
-- Data for Name: invitado; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invitado (idinvitado, documento, nombres, telefono, correopersonal, rol, intentosfallidos, estado) FROM stdin;
\.


--
-- TOC entry 4921 (class 0 OID 0)
-- Dependencies: 218
-- Name: invitado_idinvitado_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invitado_idinvitado_seq', 1, false);


--
-- TOC entry 4922 (class 0 OID 0)
-- Dependencies: 220
-- Name: porteria_idfuncionario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.porteria_idfuncionario_seq', 5, true);


--
-- TOC entry 4756 (class 2606 OID 24590)
-- Name: invitado invitado_correopersonal_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitado
    ADD CONSTRAINT invitado_correopersonal_key UNIQUE (correopersonal);


--
-- TOC entry 4758 (class 2606 OID 24592)
-- Name: invitado invitado_documento_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitado
    ADD CONSTRAINT invitado_documento_key UNIQUE (documento);


--
-- TOC entry 4760 (class 2606 OID 24596)
-- Name: invitado invitado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitado
    ADD CONSTRAINT invitado_pkey PRIMARY KEY (idinvitado);


--
-- TOC entry 4762 (class 2606 OID 24594)
-- Name: invitado invitado_telefono_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitado
    ADD CONSTRAINT invitado_telefono_key UNIQUE (telefono);


--
-- TOC entry 4764 (class 2606 OID 24609)
-- Name: funcionarios porteria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funcionarios
    ADD CONSTRAINT porteria_pkey PRIMARY KEY (idportero);


-- Completed on 2025-09-16 14:46:54

--
-- PostgreSQL database dump complete
--

