import { SaleHistoryService } from "../services/SaleHistory.service.js";


export class SaleHistoryController {

  constructor() {
    this.SaleHistorySrv = new SaleHistoryService();
  }

  create = async (req, res) => {
    // 1. Agregamos sal_local aquí
    const { usu_id, sal_name, sal_quantity, sal_type, sal_local } = req.body; 
    
    try {
      // 2. Y lo agregamos al objeto que enviamos al servicio
      const data = { usu_id, sal_name, sal_quantity, sal_type, sal_local }; 
      
      await this.SaleHistorySrv.create(data);
      res.status(200).json({ message: 'Venta creada exitosamente.', success: true, code: ''});
    } catch (err) {
      res.status(err.statusCode || 500).json({ message: err.message || 'Error al crear la venta.', success: false, code: err.code || ''}); 
    }
  };

  monthlySales = async (req, res) => {
    const { usu_id, month, year } = req.query;

    try {
      const result = await this.SaleHistorySrv.monthlySales(usu_id, month, year); 
      res.status(200).json({ message: 'Ventas mensuales obtenidas correctamente.', success: true, code: '', sales: result});
    } catch (err) {
      res.status(err.statusCode || 500).json({ message: err.message || 'Error al obtener las ventas mensuales.', success: false, code: err.code || ''}); 
    }
  }


  totals = async (req, res) => { 
    const { usu_id, sal_local, month, year } = req.query;

    try {
      // 1. Limpieza de datos: Angular envía el texto "null", hay que convertirlo a null real
      let localID = null;
      if (sal_local && sal_local !== 'null' && sal_local !== 'undefined') {
          localID = Number(sal_local);
      }

      // 2. Enviamos ambos datos al servicio
      const result = await this.SaleHistorySrv.getTotals(usu_id, localID, month, year);
      
      res.status(200).json({ message: 'Totales obtenidos exitosamente.', success: true, code: '', totals: result});
    } catch (err) {
      res.status(err.statusCode || 500).json({ message: err.message || 'Error al obtener los totales.', success: false, code: err.code || ''}); 
    }
  }
}
