import { CurrencySrv } from "../services/Currency.service.js"

export class CurrencyController {

  constructor() {
    this.CurrencySrv = new CurrencySrv();
  }

  /**
  * REFACTORIZED: 
  * - Get all ✅
  */

  getAll = async (req, res) => {
    try {
      const currencies = await this.CurrencySrv.getAll();
      res.status(200).json({ message: 'Tipos de moneda obtenidos correctamente', success: true, code: '', currency: currencies })
    } catch (err) {
      res.status(err.statusCode || 500).json({ message: err.message || 'Error al obtener todos los tipos de moneda', success: false, code: '' })
    }
  }
};