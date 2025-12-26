-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3309
-- Tiempo de generación: 29-11-2025 a las 02:30:24
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sibe`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actividades_realizadas`
--

CREATE TABLE `actividades_realizadas` (
  `id` int(11) NOT NULL,
  `paciente_id` int(11) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actividad_carrera`
--

CREATE TABLE `actividad_carrera` (
  `id` int(11) NOT NULL,
  `id_actividad` int(11) NOT NULL,
  `id_carrera` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `areas`
--

CREATE TABLE `areas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `areas`
--

INSERT INTO `areas` (`id`, `nombre`) VALUES
(1, 'Tópico'),
(2, 'Psicología'),
(3, 'Consejería'),
(4, 'Jefatura'),
(5, 'Administrador');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrera`
--

CREATE TABLE `carrera` (
  `id_carrera` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carrera`
--

INSERT INTO `carrera` (`id_carrera`, `nombre`) VALUES
(1, 'Diseño y Programación Web'),
(2, 'Asistencia Administrativa'),
(3, 'Electricidad Industrial'),
(4, 'Mecánica de Producción Industrial'),
(5, 'Mecatrónica Automotriz'),
(6, 'Mantenimiento de Maquinaria Pesada'),
(7, 'Metalurgia'),
(8, 'Electrónica Industrial'),
(9, 'Tecnología de Análisis Químico');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entregas`
--

CREATE TABLE `entregas` (
  `id` int(11) NOT NULL,
  `id_tutor` int(11) NOT NULL,
  `tema` varchar(255) NOT NULL,
  `fecha_entrega` date NOT NULL,
  `evidencia` varchar(255) DEFAULT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp(),
  `estado` enum('activo','papelera') DEFAULT 'activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gestion_citas`
--

CREATE TABLE `gestion_citas` (
  `id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `paciente_id` int(11) NOT NULL,
  `psicologo_id` int(11) NOT NULL,
  `estado` enum('Programada','Cancelada','Completada') NOT NULL DEFAULT 'Programada'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario_medicamentos`
--

CREATE TABLE `inventario_medicamentos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orientacion_vocacional`
--

CREATE TABLE `orientacion_vocacional` (
  `id` int(11) NOT NULL,
  `apellidos_nombres` varchar(50) NOT NULL,
  `celular` varchar(15) DEFAULT NULL,
  `id_carrera` int(11) DEFAULT NULL,
  `colegio` varchar(150) DEFAULT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `estado` enum('activo','papelera') DEFAULT 'activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `realizacion_psicologia`
--

CREATE TABLE `realizacion_psicologia` (
  `id` int(11) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `duracion` int(11) DEFAULT NULL,
  `cantidad_participantes` int(11) DEFAULT NULL,
  `lugar` varchar(100) DEFAULT NULL,
  `responsables` varchar(200) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `ultima_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registros_medicamentos`
--

CREATE TABLE `registros_medicamentos` (
  `id` int(11) NOT NULL,
  `id_registro_topico` int(11) NOT NULL,
  `id_medicamento` int(11) NOT NULL,
  `cantidad_utilizada` int(11) NOT NULL,
  `fecha_asignacion` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registros_psicologia`
--

CREATE TABLE `registros_psicologia` (
  `id` int(11) NOT NULL,
  `dni` char(8) NOT NULL,
  `apellidos_nombres` varchar(50) NOT NULL,
  `id_carrera` int(11) NOT NULL,
  `id_turno` int(11) NOT NULL,
  `edad` int(11) DEFAULT NULL,
  `id_semestre` int(11) NOT NULL,
  `direccion` varchar(100) DEFAULT NULL,
  `telefono` char(9) DEFAULT NULL,
  `correo_estudiantil` varchar(100) DEFAULT NULL,
  `sesiones` int(11) NOT NULL DEFAULT 1,
  `tratamiento` text DEFAULT NULL,
  `foto_evidencia` varchar(255) DEFAULT NULL,
  `vive_con` varchar(100) DEFAULT NULL,
  `motivo_consulta` varchar(100) DEFAULT NULL,
  `antecedentes` text DEFAULT NULL,
  `fecha` datetime NOT NULL,
  `ultima_actualizacion` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `estado` enum('activo','papelera') DEFAULT 'activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registros_topico`
--

CREATE TABLE `registros_topico` (
  `id` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `dni` varchar(8) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `edad` int(11) NOT NULL,
  `id_carrera` int(11) NOT NULL,
  `id_semestre` int(11) NOT NULL,
  `id_turno` int(11) NOT NULL,
  `sintomas` text NOT NULL,
  `estado` enum('activo','papelera') DEFAULT 'activo',
  `ultima_actualizacion` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `semestres`
--

CREATE TABLE `semestres` (
  `id_semestre` int(11) NOT NULL,
  `nombre` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `semestres`
--

INSERT INTO `semestres` (`id_semestre`, `nombre`) VALUES
(1, '1er Semestre'),
(2, '2do Semestre'),
(3, '3er Semestre'),
(4, '4to Semestre'),
(5, '5to Semestre'),
(6, '6to Semestre');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turnos`
--

CREATE TABLE `turnos` (
  `id_turno` int(11) NOT NULL,
  `nombre` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `turnos`
--

INSERT INTO `turnos` (`id_turno`, `nombre`) VALUES
(1, 'Diurno'),
(2, 'Vespertino');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tutores`
--

CREATE TABLE `tutores` (
  `id_tutor` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `dni` char(8) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `telefono` char(9) DEFAULT NULL,
  `id_carrera` int(11) DEFAULT NULL,
  `id_semestre` int(11) DEFAULT NULL,
  `id_turno` int(11) DEFAULT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `estado` enum('activo','papelera') DEFAULT 'activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `area_id` int(11) NOT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  `fecha_ingreso` datetime NOT NULL DEFAULT current_timestamp(),
  `ultima_conexion` datetime DEFAULT NULL,
  `intentos_fallidos` int(11) DEFAULT 0,
  `bloqueado` enum('si','no') DEFAULT 'no',
  `fecha_bloqueo` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `usuario`, `contrasena`, `correo`, `area_id`, `estado`, `fecha_ingreso`, `ultima_conexion`, `intentos_fallidos`, `bloqueado`, `fecha_bloqueo`) VALUES
(1, 'jube792', '$2y$10$vsxsSWstYgp72ak.b8Ti2ejjY2J9bCYQoTbpC0rklt.uzLjwKlTvK', 'luminid@gmail.com', 5, 'activo', '2025-10-14 23:50:23', '2025-10-21 18:28:23', 0, 'no', NULL),
(2, 'admin', '$2y$10$x00m6w5rYllbY5Bs9jcVy.LoDY/YASK5ov.rc2OzNQpanc1.Sjl2i', 'admin@gmail.com', 5, 'activo', '2025-10-14 23:55:36', NULL, 1, 'no', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `actividades_realizadas`
--
ALTER TABLE `actividades_realizadas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `paciente_id` (`paciente_id`);

--
-- Indices de la tabla `actividad_carrera`
--
ALTER TABLE `actividad_carrera`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_actividad` (`id_actividad`),
  ADD KEY `id_carrera` (`id_carrera`);

--
-- Indices de la tabla `areas`
--
ALTER TABLE `areas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `carrera`
--
ALTER TABLE `carrera`
  ADD PRIMARY KEY (`id_carrera`);

--
-- Indices de la tabla `entregas`
--
ALTER TABLE `entregas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_tutor` (`id_tutor`);

--
-- Indices de la tabla `gestion_citas`
--
ALTER TABLE `gestion_citas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `paciente_id` (`paciente_id`),
  ADD KEY `psicologo_id` (`psicologo_id`);

--
-- Indices de la tabla `inventario_medicamentos`
--
ALTER TABLE `inventario_medicamentos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `orientacion_vocacional`
--
ALTER TABLE `orientacion_vocacional`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_carrera` (`id_carrera`);

--
-- Indices de la tabla `realizacion_psicologia`
--
ALTER TABLE `realizacion_psicologia`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `registros_medicamentos`
--
ALTER TABLE `registros_medicamentos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_registro_topico` (`id_registro_topico`),
  ADD KEY `id_medicamento` (`id_medicamento`);

--
-- Indices de la tabla `registros_psicologia`
--
ALTER TABLE `registros_psicologia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_carrera` (`id_carrera`),
  ADD KEY `id_turno` (`id_turno`),
  ADD KEY `id_semestre` (`id_semestre`);

--
-- Indices de la tabla `registros_topico`
--
ALTER TABLE `registros_topico`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_carrera` (`id_carrera`),
  ADD KEY `id_semestre` (`id_semestre`),
  ADD KEY `id_turno` (`id_turno`);

--
-- Indices de la tabla `semestres`
--
ALTER TABLE `semestres`
  ADD PRIMARY KEY (`id_semestre`);

--
-- Indices de la tabla `turnos`
--
ALTER TABLE `turnos`
  ADD PRIMARY KEY (`id_turno`);

--
-- Indices de la tabla `tutores`
--
ALTER TABLE `tutores`
  ADD PRIMARY KEY (`id_tutor`),
  ADD UNIQUE KEY `dni` (`dni`),
  ADD KEY `id_carrera` (`id_carrera`),
  ADD KEY `id_semestre` (`id_semestre`),
  ADD KEY `id_turno` (`id_turno`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario` (`usuario`),
  ADD UNIQUE KEY `correo` (`correo`),
  ADD KEY `area_id` (`area_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `actividades_realizadas`
--
ALTER TABLE `actividades_realizadas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `actividad_carrera`
--
ALTER TABLE `actividad_carrera`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `areas`
--
ALTER TABLE `areas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `carrera`
--
ALTER TABLE `carrera`
  MODIFY `id_carrera` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `entregas`
--
ALTER TABLE `entregas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `gestion_citas`
--
ALTER TABLE `gestion_citas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `inventario_medicamentos`
--
ALTER TABLE `inventario_medicamentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `orientacion_vocacional`
--
ALTER TABLE `orientacion_vocacional`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `realizacion_psicologia`
--
ALTER TABLE `realizacion_psicologia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `registros_medicamentos`
--
ALTER TABLE `registros_medicamentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `registros_psicologia`
--
ALTER TABLE `registros_psicologia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `registros_topico`
--
ALTER TABLE `registros_topico`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `semestres`
--
ALTER TABLE `semestres`
  MODIFY `id_semestre` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `turnos`
--
ALTER TABLE `turnos`
  MODIFY `id_turno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tutores`
--
ALTER TABLE `tutores`
  MODIFY `id_tutor` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `actividades_realizadas`
--
ALTER TABLE `actividades_realizadas`
  ADD CONSTRAINT `actividades_realizadas_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `registros_psicologia` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `actividad_carrera`
--
ALTER TABLE `actividad_carrera`
  ADD CONSTRAINT `actividad_carrera_ibfk_1` FOREIGN KEY (`id_actividad`) REFERENCES `realizacion_psicologia` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `actividad_carrera_ibfk_2` FOREIGN KEY (`id_carrera`) REFERENCES `carrera` (`id_carrera`) ON DELETE CASCADE;

--
-- Filtros para la tabla `entregas`
--
ALTER TABLE `entregas`
  ADD CONSTRAINT `entregas_ibfk_1` FOREIGN KEY (`id_tutor`) REFERENCES `tutores` (`id_tutor`) ON DELETE CASCADE;

--
-- Filtros para la tabla `gestion_citas`
--
ALTER TABLE `gestion_citas`
  ADD CONSTRAINT `gestion_citas_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `registros_psicologia` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `gestion_citas_ibfk_2` FOREIGN KEY (`psicologo_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `orientacion_vocacional`
--
ALTER TABLE `orientacion_vocacional`
  ADD CONSTRAINT `orientacion_vocacional_ibfk_1` FOREIGN KEY (`id_carrera`) REFERENCES `carrera` (`id_carrera`);

--
-- Filtros para la tabla `registros_medicamentos`
--
ALTER TABLE `registros_medicamentos`
  ADD CONSTRAINT `registros_medicamentos_ibfk_1` FOREIGN KEY (`id_registro_topico`) REFERENCES `registros_topico` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `registros_medicamentos_ibfk_2` FOREIGN KEY (`id_medicamento`) REFERENCES `inventario_medicamentos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `registros_psicologia`
--
ALTER TABLE `registros_psicologia`
  ADD CONSTRAINT `registros_psicologia_ibfk_1` FOREIGN KEY (`id_carrera`) REFERENCES `carrera` (`id_carrera`),
  ADD CONSTRAINT `registros_psicologia_ibfk_2` FOREIGN KEY (`id_turno`) REFERENCES `turnos` (`id_turno`),
  ADD CONSTRAINT `registros_psicologia_ibfk_3` FOREIGN KEY (`id_semestre`) REFERENCES `semestres` (`id_semestre`);

--
-- Filtros para la tabla `registros_topico`
--
ALTER TABLE `registros_topico`
  ADD CONSTRAINT `registros_topico_ibfk_1` FOREIGN KEY (`id_carrera`) REFERENCES `carrera` (`id_carrera`),
  ADD CONSTRAINT `registros_topico_ibfk_2` FOREIGN KEY (`id_semestre`) REFERENCES `semestres` (`id_semestre`),
  ADD CONSTRAINT `registros_topico_ibfk_3` FOREIGN KEY (`id_turno`) REFERENCES `turnos` (`id_turno`);

--
-- Filtros para la tabla `tutores`
--
ALTER TABLE `tutores`
  ADD CONSTRAINT `tutores_ibfk_1` FOREIGN KEY (`id_carrera`) REFERENCES `carrera` (`id_carrera`) ON DELETE SET NULL,
  ADD CONSTRAINT `tutores_ibfk_2` FOREIGN KEY (`id_semestre`) REFERENCES `semestres` (`id_semestre`) ON DELETE SET NULL,
  ADD CONSTRAINT `tutores_ibfk_3` FOREIGN KEY (`id_turno`) REFERENCES `turnos` (`id_turno`) ON DELETE SET NULL;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`area_id`) REFERENCES `areas` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
