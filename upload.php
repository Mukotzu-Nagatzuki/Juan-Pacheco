<?php
// Ruta de la carpeta para almacenar archivos
$uploadDir = 'archivos/';

// Nombre del archivo JSON donde guardaremos las actividades
$jsonFile = 'activities.json';

// Obtener las actividades existentes
$activities = [];
if(file_exists($jsonFile)) {
    $activities = json_decode(file_get_contents($jsonFile), true);
}

// Manejo de POST para agregar nueva actividad
if($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'] ?? '';
    $description = $_POST['description'] ?? '';
    $fileName = null;
    $fileContent = null;

    // Subir archivo si existe
    if(isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
        $fileTmp = $_FILES['file']['tmp_name'];
        $fileName = basename($_FILES['file']['name']);
        $filePath = $uploadDir . $fileName;

        if(!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        move_uploaded_file($fileTmp, $filePath);
        $fileContent = $filePath; // Guardamos la ruta del archivo
    }

    // Crear nueva actividad
    $newActivity = [
        'title' => $title,
        'description' => $description,
        'file' => $fileName,
        'fileContent' => $fileContent,
        'date' => date('d-m-Y H:i')
    ];

    $activities[] = $newActivity;

    // Guardar todo en el JSON
    file_put_contents($jsonFile, json_encode($activities, JSON_PRETTY_PRINT));

    // Devolver JSON actualizado
    header('Content-Type: application/json');
    echo json_encode($activities);
    exit;
}

// Si es GET, devolver todas las actividades
header('Content-Type: application/json');
echo json_encode($activities);
