import { QueryTypes } from "sequelize";
import { Database } from "../config/db.js";

export class SaleHistoryRep {

    constructor() {

    }; 

    get models() { return Database.models }
    get sequelize() { return Database.sequelize }

    create = async (data, transaction = null) => {
        return await this.models.SaleHistory.create({
            usu_id: data.usu_id,
            sal_name: data.sal_name,
            sal_quantity: data.sal_quantity,
            sal_date: new Date(),
            sal_type: data.sal_type,
            sal_local: data.sal_local
        }, { transaction });
    };

monthlySales = async (month, year) => {
        // Lógica para definir la fecha base (Target Date)
        // Si vienen datos, armamos 'YYYY-MM-01'. Si no, usamos CURDATE().
        let targetDateSQL = 'CURDATE()';
        const replacements = {};

        if (month && year) {
            targetDateSQL = ':targetDate';
            replacements.targetDate = `${year}-${month}-01`;
        }

        // Usamos esa fecha base en el SQL
        return await this.sequelize.query(`
            SELECT sal_id, sal_name, sal_date, sal_quantity, sal_type, sal_local
            FROM saleHistories
            WHERE sal_date >= MAKEDATE(YEAR(${targetDateSQL}), 1) + INTERVAL (MONTH(${targetDateSQL}) - 1) MONTH
            AND sal_date < MAKEDATE(YEAR(${targetDateSQL}), 1) + INTERVAL MONTH(${targetDateSQL}) MONTH;
            `, 
            { 
                replacements: replacements,
                type: QueryTypes.SELECT 
            },
        );
    }

    totals = async (sal_local = null, month, year) => {
        
        // 1. Definir fecha base
        // Si no hay filtro, targetDateSQL será CURDATE().
        // Si hay filtro, será una fecha fija (ej: '2025-09-01').
        let targetDateSQL = 'CURDATE()';
        const replacements = {};

        if (month && year) {
            targetDateSQL = ':targetDate';
            replacements.targetDate = `${year}-${month}-01`;
        }

        // 2. Query con las 6 columnas calculadas
        let query = `
            SELECT 
            -- 1. TOTAL GENERAL
            SUM(CASE 
                WHEN sal_type = 1 THEN sal_quantity
                WHEN sal_type = 2 THEN -sal_quantity
                ELSE 0
            END) AS total_general,
        
            -- 2. TOTAL MENSUAL
            SUM(CASE 
                    WHEN sal_type = 1 AND sal_date >= DATE_SUB(${targetDateSQL}, INTERVAL DAYOFMONTH(${targetDateSQL}) - 1 DAY) 
                                      AND sal_date < DATE_ADD(DATE_SUB(${targetDateSQL}, INTERVAL DAYOFMONTH(${targetDateSQL}) - 1 DAY), INTERVAL 1 MONTH)
                    THEN sal_quantity
                    WHEN sal_type = 2 AND sal_date >= DATE_SUB(${targetDateSQL}, INTERVAL DAYOFMONTH(${targetDateSQL}) - 1 DAY) 
                                      AND sal_date < DATE_ADD(DATE_SUB(${targetDateSQL}, INTERVAL DAYOFMONTH(${targetDateSQL}) - 1 DAY), INTERVAL 1 MONTH)
                    THEN -sal_quantity
                    ELSE 0
                END) AS total_mensual,
        
            -- 3. TOTAL SEMANAL
            SUM(CASE 
                    WHEN sal_type = 1 AND sal_date >= DATE_SUB(${targetDateSQL}, INTERVAL (WEEKDAY(${targetDateSQL}) + 4) % 7 DAY) THEN sal_quantity
                    WHEN sal_type = 2 AND sal_date >= DATE_SUB(${targetDateSQL}, INTERVAL (WEEKDAY(${targetDateSQL}) + 4) % 7 DAY) THEN -sal_quantity
                    ELSE 0
                END) AS total_semanal,

            -- 4. PROMEDIO DIARIO GENERAL
            SUM(CASE 
                    WHEN sal_type = 1 THEN sal_quantity WHEN sal_type = 2 THEN -sal_quantity ELSE 0
                END) / NULLIF(DATEDIFF(MAX(sal_date), MIN(sal_date)) + 1, 0) AS promedio_diario_general,

            -- 5. PROMEDIO DIARIO MENSUAL (RESTAURADO)
            -- Toma el total mensual calculado arriba y lo divide por:
            -- Si es HOY: los días que van del mes.
            -- Si es HISTORIAL: la cantidad de días total de ese mes (ej. 30 o 31).
            SUM(CASE 
                    WHEN sal_type = 1 AND sal_date >= DATE_SUB(${targetDateSQL}, INTERVAL DAYOFMONTH(${targetDateSQL}) - 1 DAY) 
                                      AND sal_date < DATE_ADD(DATE_SUB(${targetDateSQL}, INTERVAL DAYOFMONTH(${targetDateSQL}) - 1 DAY), INTERVAL 1 MONTH)
                    THEN sal_quantity
                    WHEN sal_type = 2 AND sal_date >= DATE_SUB(${targetDateSQL}, INTERVAL DAYOFMONTH(${targetDateSQL}) - 1 DAY) 
                                      AND sal_date < DATE_ADD(DATE_SUB(${targetDateSQL}, INTERVAL DAYOFMONTH(${targetDateSQL}) - 1 DAY), INTERVAL 1 MONTH)
                    THEN -sal_quantity
                    ELSE 0
                END) / 
                CASE 
                    WHEN ${targetDateSQL} = CURDATE() THEN GREATEST(DAYOFMONTH(CURDATE()), 1)
                    ELSE DAYOFMONTH(LAST_DAY(${targetDateSQL}))
                END
            AS promedio_diario_mensual,

            -- 6. PROMEDIO DIARIO SEMANAL (RESTAURADO)
            -- Toma el total semanal y lo divide por los días transcurridos de esa semana
            SUM(CASE 
                    WHEN sal_type = 1 AND sal_date >= DATE_SUB(${targetDateSQL}, INTERVAL (WEEKDAY(${targetDateSQL}) + 4) % 7 DAY) THEN sal_quantity
                    WHEN sal_type = 2 AND sal_date >= DATE_SUB(${targetDateSQL}, INTERVAL (WEEKDAY(${targetDateSQL}) + 4) % 7 DAY) THEN -sal_quantity
                    ELSE 0
                END) / 
                -- Divisor aproximado: Si es historial usamos 7 días por defecto, si es hoy usamos los días que van de la semana
                CASE 
                    WHEN ${targetDateSQL} = CURDATE() THEN GREATEST((WEEKDAY(CURDATE()) + 1), 1)
                    ELSE 7 
                END
            AS promedio_diario_semanal
        
        FROM saleHistories
        `;

        // 3. Filtro de Local
        if (sal_local) {
            query += ` WHERE sal_local = :sal_local`;
            replacements.sal_local = sal_local;
        }

        const [results] = await this.sequelize.query(query, {
            replacements: replacements, 
            type: QueryTypes.SELECT
        });

        return results ? [results] : []; 
    };
}
