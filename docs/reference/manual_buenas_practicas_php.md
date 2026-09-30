# Buenas prácticas para desarrollo profesional con PHP 8.2 Vanilla

> **Versión:** PHP 8.2+
> **Entorno:** PHP Vanilla / sin frameworks
> **Paradigma:** Programación Orientada a Objetos
> **Objetivo:** Código seguro, mantenible, testeable, extensible y preparado para aplicaciones web del lado del servidor.

---

# 1. Principios fundamentales

Todo proyecto PHP debería construirse teniendo como objetivos principales:

* Legibilidad.
* Simplicidad.
* Separación de responsabilidades.
* Bajo acoplamiento.
* Alta cohesión.
* Testabilidad.
* Seguridad.
* Extensibilidad.
* Mantenibilidad.
* Portabilidad.
* Observabilidad.

Las decisiones de diseño deberían favorecer:

```text
Código simple
    ↓
Responsabilidades claras
    ↓
Bajo acoplamiento
    ↓
Facilidad de pruebas
    ↓
Facilidad de mantenimiento
    ↓
Facilidad de evolución
```

No se debe escribir código pensando únicamente en que "funcione".

Debe funcionar **correctamente, de forma segura y con una estructura que permita modificarlo posteriormente**.

---

# 2. Utilizar PHP 8.2 como lenguaje moderno

Evitar escribir PHP utilizando prácticas heredadas de versiones antiguas.

Preferir:

* Tipado estricto.
* Type hints.
* Return types.
* Constructor Property Promotion.
* Readonly properties cuando corresponda.
* Enumerations cuando sean apropiadas.
* Match expressions.
* Null coalescing.
* Nullsafe operator.
* Attributes cuando aporten valor.
* Excepciones.
* Clases e interfaces.
* Namespaces.
* Autoloading mediante Composer.

Ejemplo:

```php
<?php

declare(strict_types=1);

namespace App\Domain\User;

final class User
{
    public function __construct(
        private readonly int $id,
        private string $name,
        private string $email
    ) {}

    public function id(): int
    {
        return $this->id;
    }

    public function email(): string
    {
        return $this->email;
    }
}
```

Evitar:

```php
function createUser($name, $email)
{
    // ...
}
```

Preferir:

```php
function createUser(string $name, string $email): User
{
    // ...
}
```

---

# 3. Declarar `strict_types`

Los archivos PHP deberían utilizar:

```php
declare(strict_types=1);
```

al comienzo del archivo.

Ejemplo:

```php
<?php

declare(strict_types=1);
```

Esto ayuda a detectar errores de tipos y evita conversiones implícitas inesperadas.

---

# 4. Utilizar tipado fuerte

Siempre que sea posible, especificar:

* Parámetros.
* Retornos.
* Propiedades.
* Interfaces.
* Excepciones específicas.

Ejemplo:

```php
public function calculateTotal(float $price, int $quantity): float
{
    return $price * $quantity;
}
```

Evitar:

```php
public function calculateTotal($price, $quantity)
{
    return $price * $quantity;
}
```

---

# 5. Evitar `mixed`

`mixed` debería utilizarse únicamente cuando realmente sea necesario.

Evitar:

```php
public function process(mixed $data): mixed
```

Preferir un contrato explícito:

```php
public function process(UserData $data): ProcessResult
```

Si una función acepta diferentes tipos, evaluar si existe una abstracción que represente mejor el concepto.

---

# 6. Evitar valores mágicos

No utilizar números o strings cuyo significado no sea evidente.

Evitar:

```php
if ($status === 2) {
    // ...
}
```

Preferir una abstracción:

```php
if ($status === UserStatus::ACTIVE) {
    // ...
}
```

En PHP 8.2, `enum` puede utilizarse cuando representa un conjunto cerrado de estados.

---

# 7. Utilizar constantes correctamente

Cuando un valor es realmente constante:

```php
final class SecurityConfig
{
    public const MAX_LOGIN_ATTEMPTS = 5;
}
```

Sin embargo, no convertir todas las variables en constantes.

Una constante debe representar un valor conceptualmente inmutable.

---

# 8. Convenciones de nombres

Utilizar nombres descriptivos.

### Clases

PascalCase:

```php
UserService
OrderRepository
AuthenticationController
```

### Métodos y funciones

camelCase:

```php
createUser()
findByEmail()
calculateTotal()
```

### Variables

camelCase:

```php
$userRepository
$totalAmount
$authenticatedUser
```

### Constantes

UPPER_SNAKE_CASE:

```php
MAX_ATTEMPTS
DEFAULT_TIMEOUT
```

---

# 9. Una clase debe representar una responsabilidad

Aplicar el principio **SRP — Single Responsibility Principle**.

Evitar:

```php
class User
{
    public function saveToDatabase(): void {}
    public function sendEmail(): void {}
    public function generatePdf(): void {}
    public function authenticate(): void {}
}
```

La clase está acumulando responsabilidades.

Preferir:

```text
User
UserRepository
EmailService
PdfGenerator
AuthenticationService
```

---

# 10. Principios SOLID

El código debería diseñarse considerando:

## S — Single Responsibility

Una clase debe tener una responsabilidad principal.

## O — Open/Closed

El sistema debería poder extenderse sin modificar constantemente código existente.

## L — Liskov Substitution

Las implementaciones deben respetar los contratos de sus abstracciones.

## I — Interface Segregation

Evitar interfaces gigantes.

Preferir:

```php
interface UserReader
{
    public function findById(int $id): ?User;
}
```

y:

```php
interface UserWriter
{
    public function save(User $user): void;
}
```

en lugar de una interfaz con decenas de operaciones.

## D — Dependency Inversion

Las clases de alto nivel deben depender de abstracciones.

Preferir:

```php
final class UserService
{
    public function __construct(
        private UserRepository $repository
    ) {}
}
```

donde `UserRepository` sea una abstracción.

---

# 11. Programar contra interfaces

Cuando exista una dependencia reemplazable:

```php
interface UserRepository
{
    public function findById(int $id): ?User;
}
```

Implementación:

```php
final class PdoUserRepository implements UserRepository
{
    // ...
}
```

Esto permite posteriormente utilizar:

```text
PdoUserRepository
InMemoryUserRepository
MockUserRepository
```

sin modificar el servicio que consume la abstracción.

---

# 12. Preferir composición sobre herencia

No utilizar herencia simplemente para reutilizar código.

Preferir composición:

```php
final class OrderService
{
    public function __construct(
        private PaymentService $paymentService,
        private OrderRepository $repository
    ) {}
}
```

La herencia debería utilizarse cuando exista realmente una relación conceptual de sustitución.

---

# 13. Utilizar `final` cuando corresponda

Si una clase no está diseñada para ser heredada:

```php
final class UserRepository
{
}
```

Esto comunica explícitamente la intención del diseño.

No utilizar herencia como mecanismo accidental de extensión.

---

# 14. Encapsular el estado

Las propiedades deberían tener el menor nivel de exposición posible.

Evitar:

```php
class User
{
    public string $email;
}
```

Preferir:

```php
class User
{
    public function __construct(
        private string $email
    ) {}

    public function email(): string
    {
        return $this->email;
    }
}
```

Si el valor puede ser modificado, hacerlo mediante una operación que represente una acción válida del dominio.

---

# 15. Utilizar objetos de dominio

Evitar transportar información compleja mediante arrays genéricos.

Evitar:

```php
$user = [
    'name' => 'Juan',
    'email' => 'juan@example.com'
];
```

Preferir:

```php
$user = new User(
    name: 'Juan',
    email: 'juan@example.com'
);
```

Esto permite incorporar:

* Validaciones.
* Invariantes.
* Comportamiento.
* Tipado.
* Encapsulamiento.

---

# 16. Evitar arrays asociativos como objetos improvisados

Un array:

```php
[
    'id' => 10,
    'name' => 'Juan',
    'email' => 'juan@example.com'
]
```

no expresa qué estructura debe tener.

Cuando una estructura tiene significado dentro del dominio, utilizar:

* Clase.
* DTO.
* Value Object.
* Enum.
* Collection especializada.

---

# 17. Utilizar Value Objects

Cuando un concepto tiene reglas propias, puede convertirse en un objeto.

Por ejemplo:

```php
final class Email
{
    public function __construct(
        private readonly string $value
    ) {
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException(
                'Invalid email address.'
            );
        }
    }

    public function value(): string
    {
        return $this->value;
    }
}
```

Esto evita distribuir validaciones por todo el sistema.

---

# 18. Mantener invariantes dentro del dominio

Una entidad no debería poder quedar en un estado inválido.

Evitar:

```php
$user->age = -500;
```

Si el estado es inválido, la operación debería ser rechazada.

---

# 19. Métodos pequeños y cohesionados

Evitar métodos gigantes.

Mala práctica:

```php
public function processOrder(): void
{
    // 300 líneas
}
```

Dividir responsabilidades:

```php
validateOrder();
calculateTotal();
reserveProducts();
processPayment();
confirmOrder();
sendNotification();
```

Cada método debería tener un propósito claro.

---

# 20. Evitar métodos con demasiados parámetros

Evitar:

```php
createUser(
    string $name,
    string $email,
    string $phone,
    string $address,
    string $city,
    string $country
);
```

Si representan una estructura conceptual, utilizar un DTO:

```php
final class CreateUserData
{
    public function __construct(
        public readonly string $name,
        public readonly string $email,
        public readonly string $phone,
        public readonly string $address
    ) {}
}
```

---

# 21. Arquitectura recomendada

Aunque no se utilice un framework, se recomienda separar responsabilidades.

Una estructura posible:

```text
project/
│
├── public/
│   └── index.php
│
├── src/
│   ├── Domain/
│   │   ├── User/
│   │   ├── Order/
│   │   └── ...
│   │
│   ├── Application/
│   │   ├── User/
│   │   └── ...
│   │
│   ├── Infrastructure/
│   │   ├── Persistence/
│   │   ├── Mail/
│   │   └── ...
│   │
│   └── Presentation/
│       ├── Http/
│       └── ...
│
├── config/
│
├── database/
│
├── tests/
│
├── storage/
│
├── vendor/
│
├── composer.json
├── .env
├── .env.example
└── README.md
```

---

# 22. Separar dominio, aplicación e infraestructura

Una separación útil es:

```text
Domain
    ↓
Reglas del negocio

Application
    ↓
Casos de uso

Infrastructure
    ↓
Base de datos, archivos, email, APIs externas

Presentation
    ↓
HTTP, formularios, respuestas
```

Esto evita que las reglas de negocio dependan directamente de PHP superglobales, PDO o HTTP.

---

# 23. Mantener `public/` como único punto público

El servidor web debería apuntar a:

```text
/project/public
```

y no:

```text
/project
```

Así:

```text
public/
    index.php
```

es accesible desde Internet, mientras que:

```text
src/
config/
.env
composer.json
```

no quedan expuestos directamente.

---

# 24. Utilizar Front Controller

Para una aplicación web:

```text
HTTP Request
     ↓
public/index.php
     ↓
Router
     ↓
Controller
     ↓
Application Service
     ↓
Domain
     ↓
Infrastructure
     ↓
HTTP Response
```

Esto centraliza la entrada de la aplicación.

---

# 25. No colocar lógica de negocio en `index.php`

Evitar:

```php
if ($_POST['action'] === 'create') {
    // 100 líneas de lógica
}
```

`index.php` debería encargarse principalmente de inicializar la aplicación y delegar.

---

# 26. Utilizar un router

Aunque sea Vanilla, separar:

```text
Método HTTP
+
URI
```

de la lógica de negocio.

Ejemplo conceptual:

```php
$router->get('/users', $userController->index(...));

$router->post('/users', $userController->store(...));
```

No es necesario utilizar un framework para tener routing organizado.

---

# 27. Controladores delgados

El controlador debería coordinar HTTP.

Ejemplo:

```php
final class UserController
{
    public function store(Request $request): Response
    {
        $data = CreateUserData::fromRequest($request);

        $this->createUser->execute($data);

        return Response::created();
    }
}
```

Evitar poner en el controlador:

* SQL.
* Reglas de negocio complejas.
* Envío de emails directamente.
* Cálculos complejos.
* Manipulación de múltiples sistemas.

---

# 28. Servicios de aplicación

Los casos de uso pueden representarse mediante servicios:

```php
final class CreateUser
{
    public function __construct(
        private UserRepository $users
    ) {}

    public function execute(CreateUserData $data): User
    {
        // Caso de uso.
    }
}
```

Esto facilita las pruebas.

---

# 29. Repository Pattern

La persistencia debería abstraerse cuando exista una necesidad real de desacoplamiento.

```php
interface UserRepository
{
    public function findById(int $id): ?User;

    public function save(User $user): void;
}
```

Implementación:

```php
final class PdoUserRepository implements UserRepository
{
}
```

El dominio no necesita conocer PDO.

---

# 30. PDO para bases de datos

Utilizar PDO en lugar de construir conexiones manualmente.

Configurar excepciones:

```php
$pdo = new PDO(
    $dsn,
    $username,
    $password,
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]
);
```

---

# 31. Nunca concatenar datos del usuario en SQL

Nunca:

```php
$sql = "SELECT * FROM users WHERE email = '$email'";
```

Utilizar consultas preparadas:

```php
$stmt = $pdo->prepare(
    'SELECT * FROM users WHERE email = :email'
);

$stmt->execute([
    'email' => $email
]);
```

Esto es fundamental para prevenir SQL Injection.

---

# 32. No utilizar la base de datos como sustituto del dominio

No colocar toda la lógica en SQL.

La base de datos debe encargarse principalmente de:

* Persistencia.
* Integridad.
* Constraints.
* Índices.
* Relaciones.

Las reglas de negocio deben permanecer en la aplicación cuando corresponda.

---

# 33. Utilizar transacciones

Cuando varias operaciones deben completarse juntas:

```php
$pdo->beginTransaction();

try {
    // Operación 1
    // Operación 2
    // Operación 3

    $pdo->commit();
} catch (Throwable $exception) {
    $pdo->rollBack();

    throw $exception;
}
```

Una transacción debe representar una unidad lógica de trabajo.

---

# 34. Validar entradas

Toda entrada externa debe considerarse no confiable.

Fuentes:

```text
$_GET
$_POST
$_COOKIE
$_FILES
HTTP Headers
JSON
APIs externas
Base de datos
```

Validar antes de utilizar.

---

# 35. Validación ≠ Sanitización

La validación determina:

> ¿El dato cumple las reglas esperadas?

La sanitización intenta transformar un dato.

Preferir validar explícitamente:

```php
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    throw new InvalidArgumentException(
        'Invalid email.'
    );
}
```

No confiar únicamente en sanitización.

---

# 36. No confiar en `$_POST`

Nunca asumir:

```php
$_POST['email']
```

existe.

Utilizar:

```php
$email = $_POST['email'] ?? null;
```

y posteriormente validar el valor.

---

# 37. Validar tipos y límites

No basta con verificar que exista.

Validar:

```text
tipo
longitud
formato
rango
obligatoriedad
relaciones
reglas de negocio
```

Por ejemplo:

```php
if ($age < 18 || $age > 120) {
    throw new InvalidArgumentException(
        'Invalid age.'
    );
}
```

---

# 38. Escapar correctamente la salida HTML

Para evitar XSS:

```php
echo htmlspecialchars(
    $name,
    ENT_QUOTES | ENT_SUBSTITUTE,
    'UTF-8'
);
```

Nunca asumir que una variable es segura porque proviene de la base de datos.

---

# 39. Separar contexto de salida

No utilizar siempre `htmlspecialchars()` indiscriminadamente.

Cada contexto requiere su mecanismo:

```text
HTML → htmlspecialchars()
SQL  → prepared statements
URL  → URL encoding
JavaScript → JSON encoding
CSS → evitar interpolación insegura
```

---

# 40. Protección CSRF

Las operaciones que modifican estado mediante formularios web deberían utilizar tokens CSRF.

Flujo:

```text
Servidor genera token
        ↓
Formulario incluye token
        ↓
Cliente envía formulario
        ↓
Servidor valida token
        ↓
Procesa operación
```

No depender únicamente de:

```text
SameSite cookies
```

para todas las arquitecturas.

---

# 41. Cookies seguras

Configurar cookies con atributos adecuados:

```text
Secure
HttpOnly
SameSite
```

Por ejemplo:

```php
setcookie(
    'session',
    $value,
    [
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Lax',
    ]
);
```

---

# 42. Sesiones seguras

Después de autenticar un usuario:

```php
session_regenerate_id(true);
```

No almacenar información sensible innecesaria en la sesión.

Configurar correctamente:

```text
session.cookie_secure
session.cookie_httponly
session.cookie_samesite
```

---

# 43. Contraseñas

Nunca almacenar contraseñas directamente.

Utilizar:

```php
password_hash(
    $password,
    PASSWORD_DEFAULT
);
```

Para verificar:

```php
password_verify(
    $password,
    $hash
);
```

Nunca:

```php
md5($password);
sha1($password);
```

para almacenamiento de contraseñas.

---

# 44. Control de autorización

Autenticación:

> ¿Quién eres?

Autorización:

> ¿Puedes realizar esta operación?

No confundir ambas.

Ejemplo:

```text
Usuario autenticado
        ↓
¿Tiene permiso?
        ↓
Sí → ejecutar
No → 403 Forbidden
```

---

# 45. No confiar en identificadores enviados por el cliente

No asumir que:

```text
POST /users/5/delete
```

significa que el usuario puede eliminar el usuario 5.

Debe verificarse autorización en el servidor.

---

# 46. Subida de archivos segura

Nunca confiar en:

```php
$_FILES['file']['name']
```

Validar:

* Tamaño.
* MIME.
* Extensión.
* Contenido.
* Nombre.
* Directorio destino.

Nunca utilizar directamente el nombre proporcionado por el usuario.

Generar nombres internos:

```php
$filename = bin2hex(random_bytes(16));
```

---

# 47. No almacenar archivos subidos directamente en una carpeta pública

Preferir:

```text
storage/uploads/
```

y servirlos mediante una operación controlada cuando sea necesario.

---

# 48. Protección contra Path Traversal

Nunca hacer:

```php
$file = $_GET['file'];

readfile("storage/$file");
```

Un atacante podría intentar:

```text
../../.env
```

Utilizar identificadores controlados y validar rutas.

---

# 49. Variables de entorno

No almacenar secretos en el código.

Evitar:

```php
$password = 'SuperSecret123';
```

Preferir:

```text
DB_HOST=
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=
APP_KEY=
```

mediante variables de entorno.

---

# 50. Nunca subir `.env` al repositorio

Utilizar:

```text
.env
```

en `.gitignore`.

Proporcionar:

```text
.env.example
```

sin secretos reales.

---

# 51. Separar configuración de lógica

Por ejemplo:

```text
config/
    database.php
    app.php
    security.php
```

La configuración debería poder modificarse sin alterar la lógica del dominio.

---

# 52. Manejo correcto de errores

No mostrar errores internos al usuario.

En producción:

```text
display_errors = Off
log_errors = On
```

El usuario debería recibir:

```text
500 Internal Server Error
```

mientras el detalle queda registrado internamente.

---

# 53. Utilizar excepciones

Preferir:

```php
throw new UserNotFoundException();
```

en lugar de:

```php
return false;
```

cuando existe una condición excepcional.

---

# 54. Excepciones específicas

Evitar:

```php
throw new Exception('Something went wrong.');
```

cuando puede existir una excepción específica:

```php
throw new UserNotFoundException();
```

o:

```php
throw new InvalidUserDataException();
```

Esto facilita el manejo posterior.

---

# 55. No capturar `Throwable` indiscriminadamente

Evitar:

```php
try {
    // ...
} catch (Throwable $e) {
    // ignorar
}
```

Nunca ocultar errores silenciosamente.

Si se captura una excepción, debe existir una razón.

---

# 56. Logging

Registrar eventos importantes:

```text
Errores
Autenticaciones fallidas
Eventos de seguridad
Operaciones críticas
Fallos de infraestructura
```

No registrar:

```text
Contraseñas
Tokens
Cookies
Datos sensibles innecesarios
```

---

# 57. HTTP correctamente

Una aplicación web debe respetar los métodos HTTP.

```text
GET
    Obtener

POST
    Crear/procesar

PUT
    Reemplazar

PATCH
    Modificar parcialmente

DELETE
    Eliminar
```

No utilizar:

```text
GET /delete-user?id=10
```

para operaciones destructivas.

---

# 58. Utilizar códigos HTTP apropiados

Ejemplos:

```text
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Content
500 Internal Server Error
```

No responder siempre:

```text
200 OK
```

aunque haya ocurrido un error.

---

# 59. Separar Request y Response

Es conveniente abstraer la interacción HTTP:

```php
$request
$response
```

Esto evita que toda la aplicación dependa directamente de:

```php
$_GET
$_POST
$_SERVER
```

---

# 60. API JSON

Si la aplicación expone una API:

```php
header('Content-Type: application/json; charset=utf-8');

echo json_encode(
    $data,
    JSON_THROW_ON_ERROR
);
```

Utilizar:

```php
JSON_THROW_ON_ERROR
```

cuando corresponda para evitar errores silenciosos.

---

# 61. Estructura consistente de respuestas

Una API debería mantener una estructura predecible.

Éxito:

```json
{
    "data": {
        "id": 10,
        "name": "Juan"
    }
}
```

Error:

```json
{
    "error": {
        "code": "USER_NOT_FOUND",
        "message": "User not found."
    }
}
```

---

# 62. Content-Type correcto

No devolver HTML cuando se espera JSON.

Por ejemplo:

```text
Content-Type: application/json
```

para APIs.

---

# 63. Utilizar Composer aunque no haya framework

Vanilla PHP no significa "sin herramientas".

Composer permite:

* Autoloading.
* Dependencias.
* PSR-4.
* Herramientas de testing.
* Análisis estático.
* Linters.

Ejemplo:

```json
{
    "autoload": {
        "psr-4": {
            "App\\": "src/"
        }
    }
}
```

Después:

```bash
composer dump-autoload
```

---

# 64. Utilizar PSR-4

Una estructura:

```text
src/
└── User/
    └── User.php
```

con:

```php
namespace App\User;
```

permite un autoloading predecible.

---

# 65. Seguir PSR

Como referencia:

* PSR-1 — Basic Coding Standard.
* PSR-3 — Logger Interface.
* PSR-4 — Autoloader.
* PSR-7 — HTTP Message Interfaces.
* PSR-11 — Container Interface.
* PSR-12 — Extended Coding Style.
* PSR-18 — HTTP Client.

No es obligatorio implementar todos los estándares, pero conocerlos ayuda a producir código interoperable.

---

# 66. No crear un framework accidental

Un error común en proyectos Vanilla es intentar recrear un framework completo:

```text
Custom ORM
Custom DI Container
Custom Template Engine
Custom Router
Custom Event System
Custom HTTP Client
Custom Cache
...
```

Construir infraestructura únicamente cuando el proyecto realmente la necesita.

---

# 67. Dependency Injection

Preferir inyección de dependencias mediante constructor:

```php
final class OrderService
{
    public function __construct(
        private OrderRepository $repository,
        private PaymentGateway $payment
    ) {}
}
```

Evitar:

```php
class OrderService
{
    public function __construct()
    {
        $this->repository = new PdoOrderRepository();
    }
}
```

La primera versión es mucho más testeable.

---

# 68. Evitar Service Locator

Evitar:

```php
$container->get(UserService::class);
```

dentro de cada clase.

Es preferible declarar explícitamente las dependencias:

```php
public function __construct(
    private UserService $userService
) {}
```

---

# 69. Composition Root

La creación de dependencias debería concentrarse en un punto de la aplicación.

Por ejemplo:

```text
public/index.php
        ↓
bootstrap/
        ↓
crear dependencias
        ↓
crear servicios
        ↓
crear controladores
        ↓
ejecutar aplicación
```

El resto del código recibe sus dependencias.

---

# 70. Evitar estado global

Evitar:

```php
$GLOBALS
```

y variables globales.

También evitar utilizar `$_SESSION`, `$_POST` y similares directamente en todas las clases.

Centralizar el acceso.

---

# 71. Evitar Singleton

No utilizar Singleton como solución general para compartir dependencias.

En lugar de:

```php
Database::getInstance();
```

preferir:

```php
final class UserRepository
{
    public function __construct(
        private PDO $connection
    ) {}
}
```

---

# 72. Separar lectura y escritura cuando ayude

Para aplicaciones complejas puede resultar útil separar:

```text
Commands
Queries
```

No es obligatorio implementar CQRS completo.

La idea importante es que las operaciones de lectura y modificación tengan responsabilidades claras.

---

# 73. No sobreingenierizar

No aplicar patrones simplemente porque existen.

Un patrón debe resolver un problema real.

Por ejemplo:

```text
Factory
Strategy
Adapter
Decorator
Command
Repository
Builder
```

son herramientas, no objetivos.

---

# 74. DRY

**Don't Repeat Yourself.**

No duplicar lógica.

Evitar:

```php
validateEmail($email);
```

implementado de cinco maneras diferentes.

Centralizar reglas compartidas cuando tengan realmente el mismo significado.

Pero tampoco abstraer código prematuramente.

---

# 75. KISS

**Keep It Simple.**

Si:

```php
if ($user->isActive()) {
    // ...
}
```

resuelve correctamente el problema, no crear cinco clases para reemplazarlo.

---

# 76. YAGNI

**You Aren't Gonna Need It.**

No implementar funcionalidades hipotéticas.

Evitar:

```text
sistema de plugins
multi-tenancy
event sourcing
microservicios
CQRS
```

si el proyecto todavía no necesita esas características.

---

# 77. Consultas eficientes

Evitar:

```text
N+1 queries
```

Ejemplo problemático:

```text
obtener 100 usuarios
        ↓
hacer una query por cada usuario
```

Preferir consultas adecuadas y relaciones eficientes.

---

# 78. Evitar `SELECT *`

Preferir:

```sql
SELECT id, name, email
FROM users
```

en lugar de:

```sql
SELECT *
FROM users
```

Esto hace explícitos los datos requeridos.

---

# 79. Índices

Las columnas utilizadas frecuentemente en:

```text
WHERE
JOIN
ORDER BY
```

pueden necesitar índices.

Pero no indexar indiscriminadamente.

Los índices también tienen costo de almacenamiento y escritura.

---

# 80. Paginación

Nunca devolver miles de registros innecesariamente.

Preferir:

```text
?page=1&limit=20
```

y aplicar límites en la base de datos.

---

# 81. Fechas y horas

No manipular fechas manualmente mediante strings.

Utilizar:

```php
DateTimeImmutable
```

preferentemente sobre:

```php
DateTime
```

cuando no sea necesaria la mutabilidad.

Ejemplo:

```php
$now = new DateTimeImmutable();
```

---

# 82. Trabajar con UTC internamente

Para aplicaciones distribuidas, almacenar timestamps en UTC y convertir a la zona horaria del usuario en la presentación.

Evitar mezclar indiscriminadamente:

```text
UTC
Argentina
Servidor
Base de datos
Browser
```

---

# 83. Internacionalización

No hardcodear textos por toda la aplicación si se necesita soporte multidioma.

Evitar:

```php
echo "Usuario creado correctamente";
```

en cada controlador.

Centralizar los mensajes cuando la aplicación requiera internacionalización.

---

# 84. Separar presentación

No mezclar excesivamente:

```php
SQL
HTML
reglas de negocio
```

en el mismo archivo.

Mala práctica:

```php
$query = $pdo->query(...);

foreach ($query as $user) {
    if (...) {
        echo "<div>...</div>";
    }
}
```

Separar responsabilidades.

---

# 85. Plantillas

Si se necesita renderizar HTML del servidor, utilizar un sistema de templates simple o una capa de presentación propia bien delimitada.

No permitir que la lógica de negocio termine dentro de las vistas.

---

# 86. Seguridad de salida

Todo contenido dinámico renderizado debe evaluarse según su contexto.

Ejemplo:

```php
<?= htmlspecialchars(
    $user->name(),
    ENT_QUOTES | ENT_SUBSTITUTE,
    'UTF-8'
) ?>
```

---

# 87. Headers de seguridad

Una aplicación web debería evaluar headers como:

```text
Content-Security-Policy
X-Content-Type-Options
Referrer-Policy
Permissions-Policy
Strict-Transport-Security
```

La configuración exacta depende de la aplicación.

---

# 88. HTTPS

Nunca transmitir credenciales o sesiones sensibles mediante HTTP sin cifrado.

Producción:

```text
HTTPS
```

y cookies:

```text
Secure
```

---

# 89. Protección contra fuerza bruta

Las operaciones sensibles como login deberían contemplar:

```text
rate limiting
bloqueos temporales
registro de intentos
protecciones adicionales
```

No depender únicamente de la contraseña.

---

# 90. Rate limiting

Aplicarlo a endpoints sensibles:

```text
/login
/password-reset
/register
/api/*
```

Puede implementarse inicialmente utilizando almacenamiento simple y posteriormente Redis u otra infraestructura si el proyecto crece.

---

# 91. Password reset

Nunca enviar una contraseña existente por email.

El proceso correcto debería utilizar:

```text
Token aleatorio
+
expiración
+
uso único
```

El token debería almacenarse de forma segura.

---

# 92. Generación de valores aleatorios

Para tokens de seguridad utilizar:

```php
random_bytes()
```

o:

```php
random_int()
```

No:

```php
rand()
```

para información relacionada con seguridad.

---

# 93. Dependencias externas

Mantener las dependencias actualizadas.

Revisar:

```bash
composer outdated
```

y utilizar herramientas de auditoría cuando corresponda.

No agregar paquetes innecesarios.

---

# 94. Git

Utilizar control de versiones.

Commits pequeños y coherentes:

```text
feat: add user registration
fix: validate email format
refactor: extract user repository
test: add authentication tests
docs: update API documentation
```

Evitar:

```text
cosas
cambios
final
final2
ahora si
```

---

# 95. `.gitignore`

Debe incluir como mínimo elementos sensibles o generados:

```text
/vendor/
/.env
/storage/logs/
/storage/cache/
.phpunit.result.cache
```

según el proyecto.

---

# 96. Documentación

Todo proyecto profesional debería documentar:

```text
README.md
Arquitectura
Instalación
Configuración
Variables de entorno
Base de datos
API
Testing
Convenciones
Deployment
```

---

# 97. PHPDoc cuando aporte información

Con tipos modernos muchas anotaciones son innecesarias.

Pero pueden utilizarse para información adicional:

```php
/**
 * @return list<User>
 */
public function findAll(): array
{
}
```

No documentar lo obvio.

---

# 98. Análisis estático

Utilizar herramientas como:

```text
PHPStan
Psalm
```

para detectar:

* Errores de tipos.
* Código inaccesible.
* Problemas potenciales.
* Contratos inconsistentes.

---

# 99. Formateo automático

Utilizar herramientas como:

```text
PHP_CodeSniffer
PHP-CS-Fixer
```

para mantener un estilo consistente.

El formato no debería depender de decisiones manuales de cada desarrollador.

---

# 100. Testing

El código importante debe ser testeable.

Tipos:

```text
Unit Tests
Integration Tests
Feature Tests
End-to-End Tests
```

No todo necesita el mismo nivel de prueba.

---

# 101. Tests unitarios

Una prueba unitaria debería centrarse en una unidad de comportamiento.

Ejemplo:

```php
public function testCalculatesOrderTotal(): void
{
    $order = new Order(...);

    self::assertSame(
        1500.0,
        $order->total()
    );
}
```

---

# 102. Tests de integración

Utilizarlos para verificar integración entre:

```text
Repository ↔ Database
Service ↔ Repository
API ↔ Application
```

---

# 103. No testear implementación innecesariamente

Preferir:

```text
¿El comportamiento es correcto?
```

en lugar de:

```text
¿La implementación interna utiliza exactamente este método?
```

Esto hace los tests menos frágiles.

---

# 104. Testear casos límite

No probar únicamente:

```text
caso correcto
```

También:

```text
entrada vacía
entrada inválida
valores extremos
duplicados
usuario inexistente
permisos insuficientes
errores de infraestructura
```

---

# 105. Estructura de tests

Una estructura:

```text
tests/
├── Unit/
├── Integration/
└── Feature/
```

puede ayudar a mantener las pruebas organizadas.

---

# 106. Calidad del código

Herramientas recomendadas:

```text
Composer
PHPUnit
PHPStan
PHP-CS-Fixer
PHP_CodeSniffer
```

No necesariamente todas son obligatorias, pero forman un ecosistema profesional útil.

---

# 107. Separar código de producción y desarrollo

No ejecutar herramientas de desarrollo innecesarias en producción.

Ejemplo:

```text
phpunit
phpstan
debug tools
profilers
```

deberían pertenecer al entorno de desarrollo.

---

# 108. Configuración de producción

Producción debería utilizar:

```ini
display_errors = Off
log_errors = On
expose_php = Off
```

y configuración adecuada de:

```text
upload limits
memory limits
execution limits
session security
```

según las necesidades de la aplicación.

---

# 109. Cache

No implementar cache prematuramente.

Primero:

```text
medir
↓
identificar cuello de botella
↓
optimizar
↓
medir nuevamente
↓
cachear si corresponde
```

---

# 110. Observabilidad

Una aplicación real debería permitir conocer:

```text
qué ocurrió
cuándo ocurrió
dónde ocurrió
por qué ocurrió
```

mediante:

```text
logs
métricas
trazas
```

cuando el tamaño del sistema lo justifique.

---

# 111. No filtrar información sensible

Nunca devolver:

```php
echo $exception->getTraceAsString();
```

al usuario.

No revelar:

```text
SQL
rutas internas
credenciales
tokens
stack traces
estructura del servidor
```

---

# 112. Mensajes de error seguros

Usuario:

```text
No se pudo completar la operación.
```

Log interno:

```text
Database connection failed:
...
```

La información técnica debe permanecer en el entorno correspondiente.

---

# 113. Evitar lógica duplicada entre frontend y backend

La validación del frontend mejora UX.

Pero:

> **El backend siempre debe validar nuevamente.**

Nunca confiar en:

```text
JavaScript
HTML validation
cliente
```

como mecanismo de seguridad.

---

# 114. Estado HTTP como fuente de verdad

El servidor debe determinar:

```text
autenticación
autorización
validación
estado
permisos
```

El cliente simplemente solicita operaciones.

---

# 115. Idempotencia

Las operaciones críticas pueden necesitar mecanismos de idempotencia.

Por ejemplo:

```text
POST /payments
```

Si el cliente reintenta la petición debido a una falla de red, no debería cobrarse dos veces.

Utilizar identificadores de idempotencia cuando corresponda.

---

# 116. Transacciones + concurrencia

No asumir que dos peticiones nunca ocurrirán simultáneamente.

Ejemplo:

```text
Petición A → reserva recurso
Petición B → reserva recurso
```

El sistema debe proteger invariantes mediante:

```text
transacciones
constraints
locks
unique indexes
```

cuando corresponda.

---

# 117. Constraints en la base de datos

Las reglas críticas también deberían estar protegidas por la base de datos.

Ejemplo:

```sql
UNIQUE(email)
```

No confiar únicamente en:

```php
if (!$repository->existsByEmail($email)) {
    // insertar
}
```

porque dos peticiones simultáneas podrían pasar la comprobación.

---

# 118. Integridad referencial

Utilizar:

```text
PRIMARY KEY
FOREIGN KEY
UNIQUE
NOT NULL
CHECK
```

cuando corresponda.

La aplicación y la base de datos deben complementarse.

---

# 119. Arquitectura recomendada completa

Una aplicación PHP Vanilla profesional podría organizarse así:

```text
                    HTTP
                     │
                     ▼
              ┌─────────────┐
              │ public/     │
              │ index.php   │
              └──────┬──────┘
                     │
                     ▼
                ┌─────────┐
                │ Router  │
                └────┬────┘
                     │
                     ▼
              ┌─────────────┐
              │ Controller  │
              └──────┬──────┘
                     │
                     ▼
             ┌────────────────┐
             │ Application     │
             │ Use Cases       │
             └───────┬────────┘
                     │
                     ▼
             ┌────────────────┐
             │ Domain          │
             │ Entities        │
             │ Value Objects   │
             │ Policies        │
             └───────┬────────┘
                     │
                     ▼
             ┌────────────────┐
             │ Infrastructure │
             │ PDO             │
             │ Files           │
             │ Mail            │
             │ APIs            │
             └────────────────┘
```

---

# 120. Flujo recomendado de una petición

Una petición debería seguir aproximadamente:

```text
HTTP Request
     │
     ▼
Router
     │
     ▼
Controller
     │
     ├── Validación de entrada
     │
     ▼
DTO / Command
     │
     ▼
Application Service
     │
     ▼
Domain
     │
     ▼
Repository / Gateway
     │
     ▼
Infrastructure
     │
     ▼
Resultado
     │
     ▼
Response
     │
     ▼
HTTP Response
```

---

# 121. Qué NO debería hacer cada capa

## Controller

No debería:

```text
hacer SQL
contener reglas de negocio complejas
gestionar transacciones directamente
enviar emails directamente
```

## Application

No debería:

```text
depender directamente de HTTP
leer $_POST
generar HTML
```

## Domain

No debería depender de:

```text
$_POST
$_GET
PDO
HTTP
framework
base de datos
```

## Infrastructure

Debe encargarse de:

```text
DB
filesystem
APIs externas
email
cache
```

---

# 122. Regla de dependencia

Una buena regla conceptual:

```text
Presentation
      ↓
Application
      ↓
Domain
      ↑
Infrastructure
```

Las reglas centrales del negocio no deberían quedar acopladas a detalles externos.

---

# 123. Principio de mínimo conocimiento

Evitar que una clase conozca toda la aplicación.

Mala práctica:

```php
$order
    ->getUser()
    ->getAccount()
    ->getBank()
    ->getConfiguration()
    ->getSomething();
```

Preferir operaciones que expresen comportamiento.

Esto se relaciona con **Law of Demeter**.

---

# 124. Tell, Don't Ask

Preferir:

```php
$order->cancel();
```

sobre:

```php
if ($order->getStatus() === 'pending') {
    $order->setStatus('cancelled');
}
```

La entidad debería controlar su propio estado cuando la regla pertenece al dominio.

---

# 125. Evitar setters indiscriminados

No convertir todas las propiedades en:

```php
getX()
setX()
```

porque eso puede destruir el encapsulamiento.

Preferir operaciones semánticas:

```php
$order->cancel();
$user->changeEmail($email);
$reservation->confirm();
```

---

# 126. Diseñar por comportamiento

No pensar solamente:

```text
¿Qué datos tiene User?
```

sino:

```text
¿Qué puede hacer User?
¿Qué reglas debe respetar?
¿Qué estados puede tener?
```

Esto produce modelos de dominio más útiles.

---

# 127. Estados explícitos

Cuando existen estados finitos:

```php
enum OrderStatus: string
{
    case PENDING = 'pending';
    case PAID = 'paid';
    case CANCELLED = 'cancelled';
}
```

Esto es preferible a strings arbitrarios:

```php
$status = 'paid';
```

---

# 128. Comparaciones estrictas

Preferir:

```php
$value === 10
```

sobre:

```php
$value == 10
```

y:

```php
$value !== null
```

sobre:

```php
$value != null
```

Siempre que corresponda.

---

# 129. Evitar operadores peligrosos

Tener especial cuidado con:

```text
==
!=
@
extract()
eval()
unserialize()
```

`eval()` debería evitarse prácticamente por completo.

`extract()` puede producir colisiones y pérdida de claridad.

---

# 130. Cuidado con deserialización

No utilizar:

```php
unserialize($untrustedData);
```

con datos controlados por usuarios.

Preferir formatos seguros como JSON cuando sean apropiados.

---

# 131. JSON con errores explícitos

Preferir:

```php
json_encode(
    $data,
    JSON_THROW_ON_ERROR
);
```

y:

```php
json_decode(
    $json,
    true,
    512,
    JSON_THROW_ON_ERROR
);
```

cuando el contexto lo permita.

---

# 132. Evitar `die()` y `exit()` como manejo de errores

No construir aplicaciones mediante:

```php
if (!$user) {
    die('User not found');
}
```

Utilizar el flujo de excepciones y respuestas HTTP.

---

# 133. No mezclar debugging con producción

Evitar:

```php
var_dump($data);
print_r($data);
dd($data);
```

en código productivo.

Utilizar logging y herramientas de debugging apropiadas.

---

# 134. Automatización

Definir comandos mediante Composer:

```json
{
    "scripts": {
        "test": "phpunit",
        "analyse": "phpstan analyse",
        "format": "php-cs-fixer fix",
        "check": [
            "@analyse",
            "@test"
        ]
    }
}
```

Esto permite estandarizar el flujo de desarrollo.

---

# 135. Quality Gate

Antes de considerar una funcionalidad terminada:

```text
✓ Código formateado
✓ Tests ejecutados
✓ Análisis estático
✓ Sin errores conocidos
✓ Validación de seguridad
✓ Documentación actualizada
✓ Sin secretos
✓ Sin debugging residual
```

---

# 136. Checklist de seguridad

Antes de desplegar:

```text
[ ] HTTPS
[ ] Cookies Secure
[ ] Cookies HttpOnly
[ ] SameSite configurado
[ ] CSRF protegido
[ ] SQL preparado
[ ] Contraseñas con password_hash()
[ ] Autorización validada
[ ] Inputs validados
[ ] Outputs escapados
[ ] Uploads restringidos
[ ] .env fuera del repositorio
[ ] Errores no expuestos
[ ] Logs configurados
[ ] Headers de seguridad
[ ] Rate limiting donde corresponda
[ ] Dependencias actualizadas
```

---

# 137. Checklist de arquitectura

```text
[ ] public/ como document root
[ ] Front Controller
[ ] Routing separado
[ ] Controllers delgados
[ ] Casos de uso separados
[ ] Dominio independiente
[ ] Repositorios abstraídos cuando corresponda
[ ] Infrastructure aislada
[ ] Dependency Injection
[ ] Sin estado global
[ ] Sin Singleton innecesario
[ ] Sin lógica de negocio en vistas
```

---

# 138. Checklist de calidad

```text
[ ] strict_types
[ ] Tipado explícito
[ ] Nombres descriptivos
[ ] Clases cohesivas
[ ] Métodos pequeños
[ ] SOLID aplicado con criterio
[ ] DRY
[ ] KISS
[ ] YAGNI
[ ] Bajo acoplamiento
[ ] Alta cohesión
[ ] Tests
[ ] Análisis estático
[ ] Formateo automático
[ ] Documentación
```

---

# 139. Principio general

Una buena aplicación PHP Vanilla no debería parecer:

```text
PHP + muchos archivos + SQL + HTML
```

Debería parecer:

```text
                Aplicación
                     │
        ┌────────────┴────────────┐
        │                         │
     HTTP/API                  Dominio
        │                         │
   Controllers              Entidades
        │                  Value Objects
   Application             Reglas negocio
        │                         │
        └────────────┬────────────┘
                     │
              Infrastructure
                     │
          ┌──────────┼──────────┐
          │          │          │
         PDO       Files       APIs
```

La idea central es que **PHP sea el lenguaje utilizado para implementar el sistema, no la arquitectura del sistema**.

---

# 140. Regla de oro

Ante cualquier nueva funcionalidad, preguntarse:

```text
1. ¿Qué responsabilidad estoy agregando?

2. ¿A qué capa pertenece?

3. ¿Estoy mezclando responsabilidades?

4. ¿Esta clase depende de detalles innecesarios?

5. ¿Puedo probar esta funcionalidad aisladamente?

6. ¿Estoy validando la entrada?

7. ¿Estoy protegiendo la salida?

8. ¿Estoy tratando los datos externos como no confiables?

9. ¿Estoy usando consultas preparadas?

10. ¿Qué ocurre si falla?

11. ¿Qué ocurre si dos peticiones ocurren simultáneamente?

12. ¿Estoy exponiendo información sensible?

13. ¿Necesito realmente este patrón o abstracción?

14. ¿El código será comprensible dentro de seis meses?
```

---

# 141. Stack técnico recomendado

Para un proyecto PHP 8.2 Vanilla moderno:

```text
PHP 8.2+
│
├── Composer
│   └── PSR-4
│
├── Arquitectura por capas
│   ├── Domain
│   ├── Application
│   ├── Infrastructure
│   └── Presentation
│
├── PDO
│
├── PHPUnit
│
├── PHPStan
│
├── PHP-CS-Fixer
│
├── Git
│
└── Variables de entorno
```

Opcionalmente:

```text
Redis
Docker
Nginx / Apache
CI/CD
OpenTelemetry
```

según el tamaño y necesidades del sistema.

---

# 142. Principios que deberían guiar el proyecto

La prioridad debería ser:

```text
1. Seguridad
2. Correctitud
3. Claridad
4. Mantenibilidad
5. Testabilidad
6. Extensibilidad
7. Rendimiento
```

El rendimiento no debería utilizarse como excusa para producir código innecesariamente complejo sin evidencia de que exista un problema real.

---

# Conclusión

Desarrollar PHP Vanilla profesionalmente **no significa escribir PHP sin frameworks de manera improvisada**.

Significa construir una aplicación donde:

```text
HTTP
 ↓
Presentation
 ↓
Application
 ↓
Domain
 ↓
Infrastructure
```

tenga responsabilidades claramente separadas.

PHP 8.2 proporciona suficientes características para construir aplicaciones robustas utilizando:

```text
POO
Interfaces
Enums
Value Objects
DTOs
Dependency Injection
Exceptions
PDO
Composer
PSR
Testing
Static Analysis
```

sin necesidad de depender de un framework.

El objetivo final no es tener la mayor cantidad posible de abstracciones, patrones o clases.

El objetivo es producir un sistema:

> **simple de entender, seguro de ejecutar, fácil de probar y capaz de evolucionar sin romperse.**
