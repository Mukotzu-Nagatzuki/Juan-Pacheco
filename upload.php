<?php
header('Content-Type: application/json');

// Ruta del JSON
$jsonFile = 'activities.json';
// Carpeta para guardar archivos
$uploadDir = 'archivos/';

// Crear carpeta si no existe
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Leer actividades actuales
$activities = [];
if (file_exists($jsonFile)) {
    $activities = json_decode(file_get_contents($jsonFile), true);
}

// Acciones según método
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'] ?? '';
    $description = $_POST['description'] ?? '';
    $filename = null;

    // Subir archivo si existe
    if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
        $originalName = basename($_FILES['file']['name']);
        $targetFile = $uploadDir . time() . '_' . $originalName;
        if (move_uploaded_file($_FILES['file']['tmp_name'], $targetFile)) {
            $filename = $targetFile;
        }
    }

    // Crear nueva actividad
    $newActivity = [
        'title' => $title,
        'description' => $description,
        'file' => $filename,
        'date' => date('d-m-Y H:i')
    ];

    $activities[] = $newActivity;

    // Guardar JSON
    file_put_contents($jsonFile, json_encode($activities, JSON_PRETTY_PRINT));

    echo json_encode(['status' => 'success', 'activity' => $newActivity]);
    exit;
}

// GET: devolver todas las actividades
echo json_encode($activities);
