import { CreateCategoryXSupplySrv } from "../services/CreateCategoryXSupply.service.js";
import { GetAllSuppliesByCategorySrv } from "../services/GetAllSuppliesByCategory.service.js";
import { UpdateCategoryXSupplyQuantitySrv } from "../services/UpdateCategoryXSupplyQuantity.service.js";
import { RemoveCategoryXSupplySrv } from "../services/RemoveCategoryXSupply.service.js";

export class CategoryXSupplyCtr {

  constructor() {
    this.CreateCategoryXSupplySrv = new CreateCategoryXSupplySrv();
    this.GetAllSuppliesByCategorySrv = new GetAllSuppliesByCategorySrv();
    this.UpdateCategoryXSupplyQuantitySrv = new UpdateCategoryXSupplyQuantitySrv();
    this.RemoveCategoryXSupplySrv = new RemoveCategoryXSupplySrv();
  }

  create = async (req, res) => {
    try {
      const { cat_id, sup_id, cxs_quantity } = req.body;
      const dto = { cat_id, sup_id, cxs_quantity };
      await this.CreateCategoryXSupplySrv.exe(dto);
      res.status(201).json({ message: "Relation created successfully" });
    } catch (err) {
      res.status(err.statusCode || 500).json({message: err.message || "Error al crear relación",success: false,code: "",});
    }
  };


  getAllByCategory = async (req, res) => {
    try {
      const { cat_id } = req.params;
      const dto = { cat_id };
      const data = await this.GetAllSuppliesByCategorySrv.exe(dto);
      res.status(200).json({message: `Supplies for category ${cat_id} obtained successfully`, data});
    } catch (err) {
      res.status(err.statusCode || 500).json({message: err.message || "Error al obtener insumos de la categoría",success: false,code: "",});
    }
  };


  updateQuantity = async (req, res) => {
    try {
      const { cxs_id } = req.params;
      const { cxs_quantity } = req.body;
      const dto = { cxs_id, cxs_quantity };
      await this.UpdateCategoryXSupplyQuantitySrv.exe(dto);
      res.status(200).json({ message: `Quantity updated successfully` });
    } catch (err) {
      res.status(err.statusCode || 500).json({ message: err.message || "Error al actualizar cantidad", success: false, code: "", });
    }
  };

  remove = async (req, res) => {
    try {
      const { cxs_id } = req.params;
      const dto = { cxs_id };
      await this.RemoveCategoryXSupplySrv.exe(dto);
      res.status(200).json({ message: `Supply removed from Category` });
    } catch (err) {
      res.status(err.statusCode || 500).json({message: err.message || "Error al remover",success: false,code: "",});
    }
  };
}
