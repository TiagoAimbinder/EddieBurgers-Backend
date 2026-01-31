import { CreateSupplySrv } from "../services/CreateSupply.service.js";
import { GetAllSuppliesSrv } from "../services/GetAllSupplies.service.js";
import { GetSupplyByIDSrv } from "../services/GetSupplyByID.service.js";
import { RemoveSupplySrv } from "../services/RemoveSupply.service.js";
import { UpdateSupplySrv } from "../services/UpdateSupply.service.js"; // <--- IMPORTAR

export class SupplyCtr {

  constructor() {
    this.CreateSupplySrv = new CreateSupplySrv();
    this.GetAllSuppliesSrv = new GetAllSuppliesSrv();
    this.GetSupplyByIDSrv = new GetSupplyByIDSrv();
    this.RemoveSupplySrv = new RemoveSupplySrv();
    this.UpdateSupplySrv = new UpdateSupplySrv();
  }

  create = async (req, res) => {
    try {
      const { sup_name, sup_price } = req.body;
      const dto = { sup_name, sup_price };
      await this.CreateSupplySrv.exe(dto);
      res.status(201).json({ message: 'Supply successfully created' });
    } catch (err) {
      res.status(err.statusCode || 500).json({ message: err.message || 'Error al crear insumo', success: false, code: '' })
    }
  }

  getAll = async (req, res) => {
    try {
      const data = await this.GetAllSuppliesSrv.exe();
      res.status(200).json({ message: 'Supplies obtained successfully', data });
    } catch (err) {
      res.status(err.statusCode || 500).json({ message: err.message || 'Error al buscar insumos', success: false, code: '' })
    }
  }

  getByID = async (req, res) => {
    try {
      const { sup_id } = req.params; 
      const dto = { sup_id }; 
      const data = await this.GetSupplyByIDSrv.exe(dto);
      res.status(200).json({ message: `Supply w/ ID ${sup_id} obtained successfully`, data });
    } catch (err) {
      res.status(err.statusCode || 500).json({ message: err.message || 'Error al buscar insumo', success: false, code: '' })
    }
  }

  update = async (req, res) => {
    try {
      const { sup_id } = req.params;
      const { sup_name, sup_price } = req.body;
      // Unimos ID de la URL con datos del Body
      const dto = { sup_id, sup_name, sup_price };
      
      await this.UpdateSupplySrv.exe(dto);
      res.status(200).json({ message: 'Insumo actualizado correctamente', success: true });
    } catch (err) {
      res.status(err.statusCode || 500).json({ message: err.message || 'Error al actualizar', success: false });
    }
  }

  remove = async (req, res) => {
    try {
      const { sup_id } = req.params; 
      const dto = { sup_id }; 
      await this.RemoveSupplySrv.exe(dto);
      res.status(200).json({ message: `Supply w/ ID ${sup_id} removed successfully` });
    } catch (err) {
      res.status(err.statusCode || 500).json({ message: err.message || 'Error al remover insumo', success: false, code: '' })
    }
  }

}