--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-09-16 16:02:53

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

--
-- TOC entry 224 (class 1255 OID 24626)
-- Name: insertar_perfil_funcionario(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.insertar_perfil_funcionario() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO public.perfilFuncionario (
        idporteroPerfil,
        documentoPerfil,
        nombresPerfil,
        telefonoPerfil,
        correoPerfil
    ) VALUES (
        NEW.idportero,
        NEW.documento,
        NEW.nombres,
        NEW.telefono,
        NEW.correopersonal
    );

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.insertar_perfil_funcionario() OWNER TO postgres;

--
-- TOC entry 223 (class 1255 OID 24624)
-- Name: insertar_perfil_invitado(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.insertar_perfil_invitado() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO public.perfilInvitado (
        idinvitadoPerfil,
        documentoPerfil,
        nombresPerfil,
        telefonoPerfil,
        correoPerfil
    ) VALUES (
        NEW.idinvitado,
        NEW.documento,
        NEW.nombres,
        NEW.telefono,
        NEW.correopersonal
    );

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.insertar_perfil_invitado() OWNER TO postgres;

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
-- TOC entry 4937 (class 0 OID 0)
-- Dependencies: 218
-- Name: invitado_idinvitado_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invitado_idinvitado_seq OWNED BY public.invitado.idinvitado;


--
-- TOC entry 222 (class 1259 OID 24617)
-- Name: perfilfuncionario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.perfilfuncionario (
    idporteroperfil integer NOT NULL,
    documentoperfil character varying(10) NOT NULL,
    nombresperfil character varying(100) NOT NULL,
    telefonoperfil character varying(10) NOT NULL,
    correoperfil character varying(200) NOT NULL,
    preguntauno character varying(250),
    preguntados character varying(250),
    preguntatres character varying(250),
    respuestauno character varying(250),
    respuestados character varying(250),
    respuestatres character varying(250)
);


ALTER TABLE public.perfilfuncionario OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 24610)
-- Name: perfilinvitado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.perfilinvitado (
    idinvitadoperfil integer NOT NULL,
    documentoperfil character varying(10) NOT NULL,
    nombresperfil character varying(100) NOT NULL,
    telefonoperfil character varying(10) NOT NULL,
    correoperfil character varying(250) NOT NULL,
    preguntauno character varying(250),
    preguntados character varying(250),
    preguntatres character varying(250),
    respuestauno character varying(250),
    respuestados character varying(250),
    respuestatres character varying(250)
);


ALTER TABLE public.perfilinvitado OWNER TO postgres;

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
-- TOC entry 4938 (class 0 OID 0)
-- Dependencies: 220
-- Name: porteria_idfuncionario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.porteria_idfuncionario_seq OWNED BY public.funcionarios.idportero;


--
-- TOC entry 4760 (class 2604 OID 24607)
-- Name: funcionarios idportero; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funcionarios ALTER COLUMN idportero SET DEFAULT nextval('public.porteria_idfuncionario_seq'::regclass);


--
-- TOC entry 4757 (class 2604 OID 24588)
-- Name: invitado idinvitado; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitado ALTER COLUMN idinvitado SET DEFAULT nextval('public.invitado_idinvitado_seq'::regclass);


--
-- TOC entry 4928 (class 0 OID 24597)
-- Dependencies: 219
-- Data for Name: funcionarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.funcionarios (idportero, documento, nombres, telefono, correopersonal, contrasena, rol, estado, intentosfallidos, fechacreacion, creadopor) FROM stdin;
1	1038868735	Johan Perez	3117393212	jstiven600@gmail.com	1235789Mm@	Super_Portero	Activo	0	2025-09-16 14:44:11.40179-05	Default
6	1000412788	Diego Garcia	3332580018	diego.garcia144@hotmail.com	diegoG	SuperPortero	Activo	0	2025-09-16 15:56:03.40137-05	Default
\.


--
-- TOC entry 4926 (class 0 OID 24582)
-- Dependencies: 217
-- Data for Name: invitado; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invitado (idinvitado, documento, nombres, telefono, correopersonal, rol, intentosfallidos, estado) FROM stdin;
2	1038868735	Johan Stiven	3117393212	jstiven600gmail.com	Invitado	0	Activo
\.


--
-- TOC entry 4931 (class 0 OID 24617)
-- Dependencies: 222
-- Data for Name: perfilfuncionario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.perfilfuncionario (idporteroperfil, documentoperfil, nombresperfil, telefonoperfil, correoperfil, preguntauno, preguntados, preguntatres, respuestauno, respuestados, respuestatres) FROM stdin;
6	1000412788	Diego Garcia	3332580018	diego.garcia144@hotmail.com	\N	\N	\N	\N	\N	\N
\.


--
-- TOC entry 4930 (class 0 OID 24610)
-- Dependencies: 221
-- Data for Name: perfilinvitado; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.perfilinvitado (idinvitadoperfil, documentoperfil, nombresperfil, telefonoperfil, correoperfil, preguntauno, preguntados, preguntatres, respuestauno, respuestados, respuestatres) FROM stdin;
2	1038868735	Johan Stiven	3117393212	jstiven600gmail.com	\N	\N	\N	\N	\N	\N
\.


--
-- TOC entry 4939 (class 0 OID 0)
-- Dependencies: 218
-- Name: invitado_idinvitado_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invitado_idinvitado_seq', 2, true);


--
-- TOC entry 4940 (class 0 OID 0)
-- Dependencies: 220
-- Name: porteria_idfuncionario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.porteria_idfuncionario_seq', 6, true);


--
-- TOC entry 4766 (class 2606 OID 24590)
-- Name: invitado invitado_correopersonal_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitado
    ADD CONSTRAINT invitado_correopersonal_key UNIQUE (correopersonal);


--
-- TOC entry 4768 (class 2606 OID 24592)
-- Name: invitado invitado_documento_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitado
    ADD CONSTRAINT invitado_documento_key UNIQUE (documento);


--
-- TOC entry 4770 (class 2606 OID 24596)
-- Name: invitado invitado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitado
    ADD CONSTRAINT invitado_pkey PRIMARY KEY (idinvitado);


--
-- TOC entry 4772 (class 2606 OID 24594)
-- Name: invitado invitado_telefono_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitado
    ADD CONSTRAINT invitado_telefono_key UNIQUE (telefono);


--
-- TOC entry 4778 (class 2606 OID 24623)
-- Name: perfilfuncionario perfilfuncionario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfilfuncionario
    ADD CONSTRAINT perfilfuncionario_pkey PRIMARY KEY (idporteroperfil);


--
-- TOC entry 4776 (class 2606 OID 24616)
-- Name: perfilinvitado perfilinvitado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfilinvitado
    ADD CONSTRAINT perfilinvitado_pkey PRIMARY KEY (idinvitadoperfil);


--
-- TOC entry 4774 (class 2606 OID 24609)
-- Name: funcionarios porteria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funcionarios
    ADD CONSTRAINT porteria_pkey PRIMARY KEY (idportero);


--
-- TOC entry 4780 (class 2620 OID 24627)
-- Name: funcionarios trg_insertar_perfil_funcionario; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_insertar_perfil_funcionario AFTER INSERT ON public.funcionarios FOR EACH ROW EXECUTE FUNCTION public.insertar_perfil_funcionario();


--
-- TOC entry 4779 (class 2620 OID 24625)
-- Name: invitado trg_insertar_perfil_invitado; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_insertar_perfil_invitado AFTER INSERT ON public.invitado FOR EACH ROW EXECUTE FUNCTION public.insertar_perfil_invitado();


-- Completed on 2025-09-16 16:02:53

--
-- PostgreSQL database dump complete
--

