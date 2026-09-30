<?php
// Detección dinámica del path base para compatibilidad con Apache nativo (subcarpetas) y contenedores
$scriptDir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));
$basePath = ($scriptDir === '/' || $scriptDir === '.') ? '' : rtrim($scriptDir, '/');
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UNRN - Hackaton 2026 - Plataforma con Vistas por Rol y ABMC</title>
    <meta name="description" content="Plataforma de organización y ABMC de participantes para la Hackatón UNRN 2026. Control de acceso RBAC por rol en PHP Vanilla y Bootstrap 5.">

    <script>
        // Configuración de URL base para JavaScript (garantiza funcionamiento en cualquier subdirectorio de Apache)
        window.APP_BASE_URL = <?php echo json_encode($basePath, JSON_UNESCAPED_SLASHES); ?>;
    </script>

    <!-- Tipografía Google Montserrat -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">

    <!-- Bootstrap 5.3 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

    <!-- Estilos personalizados complementarios -->
    <link rel="stylesheet" href="<?php echo htmlspecialchars($basePath, ENT_QUOTES, 'UTF-8'); ?>/frontend/public/css/styles.css?v=<?php echo time(); ?>">
</head>
<body class="bg-light text-dark">

    
    <?php require __DIR__ . '/partials/navbar.php'; ?>
    <?php require __DIR__ . '/partials/hero.php'; ?>
    <?php require __DIR__ . '/partials/panel.php'; ?>
    <?php require __DIR__ . '/partials/desafios.php'; ?>
    <?php require __DIR__ . '/partials/roles.php'; ?>
    <?php require __DIR__ . '/partials/footer.php'; ?>
    <?php require __DIR__ . '/partials/modals.php'; ?>

    <!-- Bootstrap 5 JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmxc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <script type="module" src="<?php echo htmlspecialchars($basePath, ENT_QUOTES, 'UTF-8'); ?>/frontend/public/js/app.js?v=<?php echo time(); ?>"></script>
</body>
</html>
