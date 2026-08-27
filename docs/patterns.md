# Landing Page Design Patterns

## 1. Objetivo

Los patrones de esta documentación son herramientas de UX.

No deben implementarse simplemente para aumentar la cantidad de secciones.

Cada patrón debe resolver una necesidad concreta de:

* comprensión;
* confianza;
* demostración;
* navegación;
* conversión.

---

# 2. Modelo narrativo

La landing debe intentar seguir:

```text
Atención
↓
Comprensión
↓
Demostración
↓
Confianza
↓
Deseo
↓
Conversión
```

La estructura final depende del producto.

---

# 3. Hero + CTA

### Propósito

Explicar rápidamente:

* qué es el producto;
* para quién es;
* qué valor proporciona.

### Debe contener

* propuesta de valor;
* supporting text;
* CTA principal;
* visual relevante cuando corresponda.

### Evitar

* slogans genéricos;
* exceso de texto;
* múltiples CTAs compitiendo.

---

# 4. Product Preview

Mostrar:

* dashboard;
* aplicación;
* interfaz;
* producto;
* resultado.

Debe demostrar el valor del producto, no ser una imagen decorativa.

---

# 5. Problem → Solution

Estructura:

```text
Problema
↓
Consecuencia
↓
Solución
↓
Beneficio
```

Preferir beneficios concretos sobre listas de funcionalidades.

---

# 6. Social Proof

Puede incluir:

* testimonios;
* métricas;
* logos;
* ratings;
* resultados.

La información debe ser real.

No inventar testimonios, clientes, métricas o logos.

---

# 7. Feature Grid

Utilizar cuando existan varias capacidades claramente diferenciadas.

Cada feature debería comunicar:

```text
Característica
↓
Beneficio
↓
Resultado
```

No utilizar seis tarjetas idénticas si el contenido no necesita esa estructura.

---

# 8. Bento Grid

Utilizar para presentar capacidades relacionadas con diferentes niveles de importancia visual.

Debe existir jerarquía.

No utilizar Bento Grid únicamente por tendencia estética.

---

# 9. Feature + Visual

Alternar:

```text
Texto → Visual
Visual → Texto
```

Útil para explicar productos complejos.

Cada bloque debe contar una pequeña historia.

---

# 10. How It Works

Reducir el funcionamiento a aproximadamente 3–4 pasos cuando sea posible.

Ejemplo:

```text
01 Registrarse
02 Configurar
03 Utilizar
04 Obtener resultado
```

---

# 11. Before / After

Mostrar transformación.

```text
Antes
↓
Problemas
↓
Después
↓
Resultado
```

Utilizar únicamente cuando exista una transformación real.

---

# 12. Interactive Demo

Permitir al usuario experimentar el producto.

Ejemplos:

* calculadora;
* configuración;
* tabs;
* demo de dashboard;
* búsqueda;
* flujo reducido.

La demo debe ser representativa y no convertirse en una aplicación innecesariamente compleja.

---

# 13. Sticky Navigation

Útil para páginas largas.

Debe:

* facilitar orientación;
* mantener acceso a CTA;
* funcionar en mobile;
* no ocupar espacio excesivo.

---

# 14. Scroll Storytelling

Utilizar progresión visual durante el scroll.

La animación debe apoyar la narrativa.

Evitar efectos que:

* dificulten la lectura;
* perjudiquen performance;
* impidan navegación;
* causen mareos.

---

# 15. Testimonials

Un testimonio efectivo puede incluir:

* persona;
* rol;
* organización;
* contexto;
* resultado.

Nunca inventar información presentada como evidencia real.

---

# 16. Pricing

Cuando el producto tenga planes:

* destacar diferencias relevantes;
* facilitar comparación;
* mostrar plan recomendado si existe;
* evitar complejidad innecesaria.

---

# 17. FAQ

Utilizar para eliminar objeciones.

Preguntas recomendadas:

* precio;
* funcionamiento;
* compatibilidad;
* seguridad;
* cancelación;
* soporte.

El contenido debe responder preguntas reales.

---

# 18. Repeated CTA

Repetir el CTA puede ser útil en páginas largas.

Cada CTA debe conducir a la misma acción principal o a una acción claramente relacionada.

No saturar al usuario.

---

# 19. Final CTA

Debe resumir:

* valor;
* acción;
* reducción de fricción.

Ejemplo conceptual:

```text
Propuesta de valor
+
beneficio principal
+
CTA
```

---

# 20. Selección de patrones

Antes de implementar un patrón, responder:

1. ¿Qué problema de UX resuelve?
2. ¿Qué información comunica?
3. ¿Por qué esta estructura es mejor que una alternativa más simple?
4. ¿Qué impacto tiene en responsive?
5. ¿Qué comportamiento necesita?
6. ¿Cómo se verificará?
7. ¿Qué complejidad añade?

Si no existe una respuesta clara, no implementar el patrón.

---

# 21. Regla principal

> Un patrón de diseño debe justificar su existencia mediante una necesidad del usuario, no mediante una tendencia visual.

---

# 22. Patrones activos en ZonaZero

La landing actual utiliza un conjunto reducido de patrones:

* **Hero + CTA**: comunica que ZonaZero es una tienda gamer demo y dirige al catálogo o al registro demo.
* **Product Preview**: muestra una representación visual del flujo catálogo → carrito sin presentarla como una captura real.
* **Feature Grid**: resume beneficios concretos del flujo disponible y separa el armador de PC como evolución futura.
* **FAQ**: aclara que el checkout no procesa pagos reales, que el registro habilita el carrito y que el armador todavía no está disponible.
* **Final CTA**: repite la acción principal de crear una cuenta demo.

No se utilizan testimonios ni métricas porque el proyecto no cuenta con evidencia real para respaldarlos.
