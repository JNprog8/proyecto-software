# Reglas de Proyecto para Agentes de IA (AGENTS.md)

Este repositorio utiliza una **Arquitectura Híbrida Spec-Harness** para garantizar la máxima precisión y cero regresiones en modelos como **Gemini 3.8 Flash (High)**.

---

## 1. Especificaciones de Dominio (SDD)
Antes de planificar o realizar cambios de código, consulta obligatoriamente los documentos en `harness/specs/`:
- [01_domain_entities.md](file:///home/joaco/Documentos/UNRN/Proyecto%20Software/practicas/ABMC/harness/specs/01_domain_entities.md): Entidades, tipos, relaciones y restricciones de MariaDB.
- [02_api_contracts.md](file:///home/joaco/Documentos/UNRN/Proyecto%20Software/practicas/ABMC/harness/specs/02_api_contracts.md): Contratos de entrada y salida JSON para los endpoints REST.
- [03_business_rules.md](file:///home/joaco/Documentos/UNRN/Proyecto%20Software/practicas/ABMC/harness/specs/03_business_rules.md): Reglas de negocio (unicidad de correo, formato de nickname, validaciones).
- [04_ui_ux_guidelines.md](file:///home/joaco/Documentos/UNRN/Proyecto%20Software/practicas/ABMC/harness/specs/04_ui_ux_guidelines.md): Directivas de accesibilidad, diseño KISS y modales `<dialog>`.

---

## 2. Herramientas del Arnés (Harness Tools)
Antes de finalizar cualquier tarea de desarrollo o refactorización:
1. **Verificación de API:**
   ```bash
   bash harness/harness_tools/test_api.sh
   ```
2. **Restauración de Base de Datos:**
   ```bash
   bash harness/harness_tools/reset_db.sh
   ```

---

## 3. Restricciones Técnicas Inviolables
- **Vanilla PHP 8.2:** Sin frameworks ni Composer.
- **Vanilla JS & CSS:** Sin Bootstrap, Tailwind, jQuery ni librerías frontend.
- **Patrón Repository:** Toda interacción con la base de datos se realiza a través de `src/repositories/` usando PDO con sentencias preparadas.
