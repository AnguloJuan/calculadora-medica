# Archivo temporal en trabajo para el diseño de la bd
DROP DATABASE calculadora_medica;
CREATE DATABASE calculadora_medica;
USE calculadora_medica;

CREATE TABLE IF NOT EXISTS calculadora (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	nombre VARCHAR(60) NOT NULL,
    descripcion VARCHAR(360) NOT NULL,
    descripcion_corta VARCHAR(120),
    resultados_recomendaciones VARCHAR(360),
    formula VARCHAR(360) NOT NULL,
    area VARCHAR(60) NOT NULL,
    enlace VARCHAR(120) NOT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME
);

CREATE TABLE IF NOT EXISTS parametro (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	nombre VARCHAR(32),
    abreviatura VARCHAR(16) NOT NULL,
    tipo_campo ENUM('numerico', 'seleccion', 'radio') NOT NULL,
    valorMinimo FLOAT,
    valorMaximo FLOAT,
    opciones VARCHAR(360)
);

CREATE TABLE IF NOT EXISTS calculadora_parametros (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	id_calculadora INT NOT NULL,
    id_parametro INT NOT NULL,
    CONSTRAINT FK_id_parametros_calculadora FOREIGN KEY (id_calculadora) REFERENCES calculadora(id),
    CONSTRAINT FK_id_parametros_parametro FOREIGN KEY (id_parametro) REFERENCES parametro(id)
);

CREATE TABLE IF NOT EXISTS unidad (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    unidad VARCHAR(10) NOT NULL,
    conversion FLOAT,
    id_unidad_conversion INT,
    CONSTRAINT FK_id_unidades_conversion_unidad FOREIGN KEY (id_unidad_conversion) REFERENCES unidad(id)
);

CREATE TABLE IF NOT EXISTS parametros_unidades (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_unidad INT NOT NULL,
    id_parametro INT NOT NULL,
    CONSTRAINT FK_id_parametros_unidades_metricas_parametro FOREIGN KEY (id_parametro) REFERENCES parametro(id),
    CONSTRAINT FK_id_parametros_unidades_metricas_unidad FOREIGN KEY (id_unidad) REFERENCES unidad(id)
);

CREATE TABLE IF NOT EXISTS evidencia (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    cita VARCHAR(500) NOT NULL,
    id_calculadora INT NOT NULL,
    CONSTRAINT FK_id_evidencia_calculadora FOREIGN KEY (id_calculadora) REFERENCES calculadora(id)
);

CREATE TABLE IF NOT EXISTS usuario (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    usuario VARCHAR(30) NOT NULL,
    contrasena VARCHAR(120) NOT NULL,
    rol ENUM('admin', 'usuario') NOT NULL
);

INSERT INTO `usuario`(`id`, `usuario`, `contrasena`, `rol`) VALUES (1, 'admin','1234','admin')