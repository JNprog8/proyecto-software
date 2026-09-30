# Reglas de Proyecto para Agentes de IA (AGENTS.md)

Este repositorio utiliza una **Arquitectura Híbrida Spec-Harness** para garantizar la máxima precisión y cero regresiones en modelos como **Gemini 3.8 Flash (High)**.

---

## 1. Especificaciones de Dominio (SDD)
Antes de planificar o realizar cambios de código, consulta obligatoriamente los documentos en `harness/specs/`:
- [01_domain_entities.md](file:///home/joaco/Documentos/UNRN/Proyecto%20Software/practicas/ABMC/harness/specs/01_domain_entities.md): Entidades, tipos, relaciones y restricciones de MariaDB.
- [02_api_contracts.md](file:///home/joaco/Documentos/UNRN/Proyecto%20Software/practicas/ABMC/harness/specs/02_api_contracts.md): Contratos de entrada y salida JSON para los endpoints REST.
- [03_business_rules.md](file:///home/joaco/Documentos/UNRN/Proyecto%20Software/practicas/ABMC/harness/specs/03_business_rules.md): Reglas de negocio (unicidad de correo, formato de nickname, validaciones).
- [04_ui_ux_guidelines.md](file:///home/joaco/Documentos/UNRN/Proyecto%20Software/practicas/ABMC/harness/specs/04_ui_ux_guidelines.md): Directivas de diseño UI/UX, CSS3, Design Tokens, BEM y accesibilidad (a11y).
- [05_backend_guidelines.md](file:///home/joaco/Documentos/UNRN/Proyecto%20Software/practicas/ABMC/harness/specs/05_backend_guidelines.md): Aspectos de tipado estricto, seguridad y arquitectura en PHP 8.2.
- [06_frontend_guidelines.md](file:///home/joaco/Documentos/UNRN/Proyecto%20Software/practicas/ABMC/harness/specs/06_frontend_guidelines.md): Aspectos de arquitectura JavaScript Vanilla, desacoplamiento del DOM y cliente API.

---

## 2. Herramientas del Arnés (Harness Tools)
Antes de finalizar cualquier tarea de desarrollo o refactorización:
1. **Auditoría de Quality Gate y Checklists:**
   - Consultar [acceptance_checklists.md](file:///home/joaco/Documentos/UNRN/Proyecto%20Software/practicas/ABMC/harness/harness_tools/acceptance_checklists.md) para verificar arquitectura, seguridad y calidad (Backend y Frontend).

2. **Verificación de API:**
   ```bash
   bash harness/harness_tools/test_api.sh
   ```
3. **Restauración de Base de Datos:**
   ```bash
   bash harness/harness_tools/reset_db.sh
   ```


---

## 3. Restricciones Técnicas Inviolables
- **Vanilla PHP 8.2:** Sin frameworks ni Composer.
- **Vanilla JS & CSS:** Sin Bootstrap, Tailwind, jQuery ni librerías frontend.
- **Patrón Repository:** Toda interacción con la base de datos se realiza a través de `src/repositories/` usando PDO con sentencias preparadas.

---

## 4. Skills del Repositorio (`.agents/skills/`)
Cuando se requiera ejecutar flujos de trabajo específicos, consulta las guías operativas:
- [abmc-entity-generator](file:///home/joaco/Documentos/UNRN/Proyecto%20Software/practicas/ABMC/.agents/skills/abmc-entity-generator/SKILL.md): Secuencia en 6 pasos para crear, modelar y registrar nuevas entidades.
- [database-ops](file:///home/joaco/Documentos/UNRN/Proyecto%20Software/practicas/ABMC/.agents/skills/database-ops/SKILL.md): Comandos operativos de MariaDB, restauración y diagnóstico en Podman.
