# Archivo temporal en trabajo para el diseño de la bd
#CREATE DATABASE calculadora_medica;
USE calculadora_medica;

CREATE TABLE IF NOT EXISTS calculadora (
	id INT NOT NULL PRIMARY KEY,
	nombre VARCHAR(60) NOT NULL,
    descripción VARCHAR(360),
    instrucciones VARCHAR(360) NOT NULL,
    formula VARCHAR(360) NOT NULL,
    respaldo VARCHAR(150),
    fecha_creacion DATETIME NOT NULL,
    fecha_actualizacion DATETIME
    
    #parametros FOREIGN KEY
);

CREATE TABLE IF NOT EXISTS parametros (
	id INT NOT NULL PRIMARY KEY,
	id_calculadora INT NOT NULL,
    id_parametro INT NOT NULL,
    CONSTRAINT FK_id_calculadora FOREIGN KEY (id_calculadora) REFERENCES calculadora(id),
    CONSTRAINT FK_id_parametro FOREIGN KEY (id_parametro) REFERENCES parametro(id)
);

CREATE TABLE IF NOT EXISTS parametro (
	id INT PRIMARY KEY AUTO_INCREMENT,
	nombre VARCHAR(32) NOT NULL,
    unidad_metrica VARCHAR(16) NOT NULL,
    tipo_campo ENUM('text', 'number', 'select', 'radio') NOT NULL,
    #valores FOREIGN KEY (null)
)
