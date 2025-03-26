create table personas (
    id_persona serial primary key,
    nombre varchar(100) not null,
    paterno varchar(100) not null,
    materno varchar(100) not null,
    ci varchar(20) not null,
    fecha_nacimiento varchar(100) not null,
    img varchar(255),
    correo_electronico varchar(100) unique not null,
    sexo varchar(2),
    estado boolean,
    created_at timestamp,
    updated_at timestamp
);

create table usuarios (
    id_usuario serial primary key,
    nombre_usuario varchar(255) not null,
    contrasenia varchar(255) not null,
    id_persona int unique references personas(id_persona),
    estado boolean,
    created_at timestamp,
    updated_at timestamp
);

create table roles (
    id_rol serial primary key,
    nombre_rol varchar(255) not null,
    estado boolean,
    created_at timestamp,
    updated_at timestamp
);

create table usuario_rol (
    id_usuario int references usuarios(id_usuario),
    id_rol int references roles(id_rol),
    estado boolean,
    created_at timestamp,
    updated_at timestamp,
    primary key (id_usuario, id_rol)
);


INSERT INTO public.roles(nombre_rol, estado, created_at, updated_at)
VALUES('superadmin', true, now(), now());
INSERT INTO public.roles(nombre_rol, estado, created_at, updated_at)
VALUES('agente', true, now(), now());


INSERT INTO public.personas
(nombre, paterno, materno, ci, fecha_nacimiento, correo_electronico, sexo, estado, created_at, updated_at)
VALUES('jhonatan', 'flores', 'lopez', '9959006', '22-02-1996', 'b.lizzars.jf@gmail.com', 'm', true, now(), now());